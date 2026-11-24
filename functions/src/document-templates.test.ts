import { describe, expect, it } from "vitest";
import { mapPublishedTemplateRow } from "./document-templates";

describe("mapPublishedTemplateRow", () => {
	it("maps a public_document_templates row to the API shape", () => {
		expect(
			mapPublishedTemplateRow({
				document_id: "carta-poder",
				version: 3,
				title: "P O D E R",
				body: "Comparece **{{otorgante.nombre}}**.",
				published_at: new Date("2026-11-23T12:00:00.000Z"),
			}),
		).toEqual({
			documentId: "carta-poder",
			version: 3,
			title: "P O D E R",
			body: "Comparece **{{otorgante.nombre}}**.",
			publishedAt: "2026-11-23T12:00:00.000Z",
		});
	});
});
