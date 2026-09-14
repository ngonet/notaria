import { site } from "@/content/site";
import { getAppCheckHeader } from "@/lib/firebase";
import "./styles/tailwind.css";

type Mount = (el: HTMLElement) => void;

export interface MountFailureDetail {
  mount: string | null;
  message: string;
}

/**
 * Browser-native event emitted when a section mount fails. Monitoring
 * integrations can observe it with window.addEventListener().
 */
export const MOUNT_FAILURE_EVENT = "notaria:mount-failed";

async function reportMountFailure(detail: MountFailureDetail): Promise<void> {
  const mount =
    typeof detail.mount === "string" &&
    /^[a-z][a-z0-9-]{0,63}$/.test(detail.mount)
      ? detail.mount
      : "unknown";

  try {
    const appCheckHeaders = await getAppCheckHeader();
    await fetch("/api/telemetry/mount-failure", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...appCheckHeaders },
      body: JSON.stringify({ mount }),
      signal: AbortSignal.timeout(3000),
      keepalive: true,
    });
  } catch {
    // Telemetry must never interfere with the visible mount fallback.
  }
}

window.addEventListener(MOUNT_FAILURE_EVENT, (event) => {
  const detail = (event as CustomEvent<MountFailureDetail>).detail;
  void reportMountFailure(detail ?? { mount: null, message: "unknown" });
});

const mounts: Record<string, () => Promise<Mount>> = {
  nav: () => import("@/components/nav").then((m) => m.mountNav),
  hero: () => import("@/components/hero").then((m) => m.mountHero),
  services: () => import("@/components/services").then((m) => m.mountServices),
  about: () => import("@/components/about").then((m) => m.mountAbout),
  documents: () =>
    import("@/components/documents").then((m) => m.mountDocuments),
  transparency: () =>
    import("@/components/transparency").then((m) => m.mountTransparency),
  contact: () => import("@/components/contact").then((m) => m.mountContact),
  footer: () => import("@/components/footer").then((m) => m.mountFooter),
};

function renderMountFallback(el: HTMLElement): void {
  const message = document.createElement("p");
  message.setAttribute("role", "alert");
  message.textContent = site.bootstrap.mountErrorMessage;
  el.replaceChildren(message);
}

async function mountElement(el: HTMLElement): Promise<void> {
  const key = el.dataset.mount;

  try {
    if (!key) {
      throw new Error("[notaria] mount target is missing its mount key");
    }

    const loader = mounts[key];
    if (!loader) {
      throw new Error(`[notaria] no mount registered for "${key}"`);
    }

    const mount = await loader();
    mount(el);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[notaria] mount failed${key ? ` for "${key}"` : ""}`, error);
    window.dispatchEvent(
      new CustomEvent<MountFailureDetail>(MOUNT_FAILURE_EVENT, {
        detail: { mount: key ?? null, message },
      }),
    );
    renderMountFallback(el);
  }
}

export async function bootstrap(): Promise<void> {
  const mountAttempts: Promise<void>[] = [];
  const nodes = document.querySelectorAll<HTMLElement>("[data-mount]");

  for (const el of nodes) {
    mountAttempts.push(mountElement(el));
  }

  await Promise.allSettled(mountAttempts);

  const hashTarget = window.location.hash
    ? document.getElementById(window.location.hash.slice(1))
    : null;
  hashTarget?.scrollIntoView();
}

bootstrap().catch((err) => {
  console.error("[notaria] bootstrap failed", err);
});
