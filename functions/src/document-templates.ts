// Published document wording for the public forms at /documentos/ of the site.
// Rows come from notIA's read-only view public_document_templates (see notia's
// docs/deploy.md): only the version an admin published, no notes or authors.

export interface PublishedTemplateRow {
	document_id: string;
	version: number;
	title: string;
	body: string;
	published_at: Date;
}

export interface PublishedTemplate {
	documentId: string;
	version: number;
	title: string;
	body: string;
	publishedAt: string;
}

export function mapPublishedTemplateRow(
	row: PublishedTemplateRow,
): PublishedTemplate {
	return {
		documentId: row.document_id,
		version: row.version,
		title: row.title,
		body: row.body,
		publishedAt: row.published_at.toISOString(),
	};
}
