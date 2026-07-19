import { beforeEach, describe, expect, it, vi } from "vitest";

const verifyToken = vi.hoisted(() => vi.fn());
const logger = vi.hoisted(() => ({ warn: vi.fn(), error: vi.fn() }));
const sendMail = vi.hoisted(() => vi.fn());
const createTransport = vi.hoisted(() => vi.fn());
const secrets = vi.hoisted(() => ({
  GMAIL_USER: "notaria@example.cl",
  GMAIL_APP_PASSWORD: "app-password",
}));

vi.mock("firebase-functions/v2/https", () => ({
  onRequest: (_options: unknown, handler: unknown) => handler,
}));
vi.mock("firebase-functions/params", () => ({
  defineSecret: (name: string) => ({
    value: () => secrets[name as keyof typeof secrets] ?? "",
  }),
}));
vi.mock("firebase-functions/v2", () => ({
  setGlobalOptions: vi.fn(),
  logger,
}));
vi.mock("firebase-admin/app", () => ({
  getApps: () => ["app"],
  initializeApp: vi.fn(),
}));
vi.mock("firebase-admin/app-check", () => ({
  getAppCheck: () => ({ verifyToken }),
}));
vi.mock("nodemailer", () => ({ createTransport }));

import { contactForm } from "../src/index";

const VALID_BODY = {
  name: "Ana Pérez",
  email: "ana@example.cl",
  phone: "+56912345678",
  subject: "Retraso en escritura",
  message: "Primera línea\nSegunda línea",
};

function request(overrides: Record<string, unknown> = {}) {
  const headers = new Map<string, string>([
    ["origin", "https://notariamelipilla.cl"],
    ["x-firebase-appcheck", "valid-token"],
  ]);
  return {
    method: "POST",
    body: { ...VALID_BODY },
    get: (name: string) => headers.get(name.toLowerCase()),
    ...overrides,
  };
}

function response() {
  const res = { set: vi.fn(), status: vi.fn(), json: vi.fn(), send: vi.fn() };
  res.status.mockReturnValue(res);
  return res;
}

async function call(overrides: Record<string, unknown> = {}) {
  const res = response();
  await (contactForm as unknown as CallableFunction)(request(overrides), res);
  return res;
}

describe("contact form API", () => {
  beforeEach(() => {
    verifyToken.mockReset();
    verifyToken.mockResolvedValue({ alreadyConsumed: false });
    sendMail.mockReset();
    sendMail.mockResolvedValue({ messageId: "sent" });
    createTransport.mockReset();
    createTransport.mockReturnValue({ sendMail });
    logger.error.mockReset();
    secrets.GMAIL_USER = "notaria@example.cl";
    secrets.GMAIL_APP_PASSWORD = "app-password";
  });

  it("delivers a valid submission and confirms success to the sender", async () => {
    const res = await call();

    expect(verifyToken).toHaveBeenCalledWith("valid-token", { consume: true });
    expect(sendMail).toHaveBeenCalledOnce();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ success: true });
  });

  it("escapes submitted HTML so a visitor cannot inject markup into the notice", async () => {
    await call({
      body: { ...VALID_BODY, name: "<script>alert(1)</script>" },
    });

    const { html } = sendMail.mock.calls[0][0];
    expect(html).not.toContain("<script>");
    expect(html).toContain("&lt;script&gt;");
  });

  it("strips CRLF from the subject and reply name so headers cannot be forged", async () => {
    await call({
      body: {
        ...VALID_BODY,
        name: 'Ana"\r\nBcc: victim@example.cl',
        subject: "Reclamo\r\nBcc: victim@example.cl",
      },
    });

    const { subject, replyTo } = sendMail.mock.calls[0][0];
    expect(subject).not.toMatch(/[\r\n]/);
    expect(replyTo).not.toMatch(/[\r\n]/);
    expect(replyTo).not.toContain('"');
  });

  it("rejects an untrusted origin before App Check verification or mail delivery", async () => {
    const res = await call({ get: () => "https://attacker.example" });

    expect(verifyToken).not.toHaveBeenCalled();
    expect(sendMail).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: "origin_not_allowed" });
  });

  it("rejects a request that carries no Origin header at all", async () => {
    const res = await call({ get: () => undefined });

    expect(sendMail).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: "origin_not_allowed" });
  });

  it("answers the CORS preflight without sending mail", async () => {
    const res = await call({ method: "OPTIONS" });

    expect(sendMail).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(204);
  });

  it.each([
    ["GET", VALID_BODY, 405, "method_not_allowed"],
    ["POST", { ...VALID_BODY, message: "  " }, 400, "missing_fields"],
    ["POST", { ...VALID_BODY, email: "not-an-email" }, 400, "invalid_email"],
  ])("rejects %s with an invalid payload", async (method, body, status, error) => {
    const res = await call({ method, body });

    expect(sendMail).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(status);
    expect(res.json).toHaveBeenCalledWith({ error });
  });

  it("rejects missing, invalid, and replayed App Check tokens before sending mail", async () => {
    const missing = await call({
      get: (name: string) =>
        name === "origin" ? "https://notariamelipilla.cl" : undefined,
    });
    expect(missing.status).toHaveBeenCalledWith(401);
    expect(missing.json).toHaveBeenCalledWith({ error: "app_check_required" });

    verifyToken.mockRejectedValueOnce(new Error("invalid token"));
    const invalid = await call();
    expect(invalid.status).toHaveBeenCalledWith(403);
    expect(invalid.json).toHaveBeenCalledWith({ error: "app_check_invalid" });

    verifyToken.mockResolvedValueOnce({ alreadyConsumed: true });
    const replayed = await call();
    expect(replayed.status).toHaveBeenCalledWith(403);
    expect(replayed.json).toHaveBeenCalledWith({ error: "app_check_replay" });

    expect(sendMail).not.toHaveBeenCalled();
  });

  it("fails closed when the Gmail credentials are not configured", async () => {
    secrets.GMAIL_APP_PASSWORD = "";

    const res = await call();

    expect(sendMail).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "missing_credentials" });
  });

  it("reports a bounded failure when Gmail delivery fails", async () => {
    sendMail.mockRejectedValueOnce(new Error("smtp unavailable"));

    const res = await call();

    expect(logger.error).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(502);
    expect(res.json).toHaveBeenCalledWith({ error: "email_send_failed" });
  });
});
