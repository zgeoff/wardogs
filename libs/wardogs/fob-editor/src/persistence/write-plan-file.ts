import type { StoredDocument } from '@wardogs-love/storage';

// hands the browser a JSON copy of the document to save; the file name follows the plan's name
export function writePlanFile(document: StoredDocument): void {
  const blob = new Blob([JSON.stringify(document, null, 2)], { type: 'application/json' });

  const url = URL.createObjectURL(blob);
  const link = globalThis.document.createElement('a');

  const slug = document.name
    .toLowerCase()
    .replaceAll(/[^a-z0-9]+/gu, '-')
    .replaceAll(/^-|-$/gu, '');

  link.href = url;
  link.download = `${slug === '' ? 'fob-plan' : slug}.fob.json`;

  link.click();
  URL.revokeObjectURL(url);
}
