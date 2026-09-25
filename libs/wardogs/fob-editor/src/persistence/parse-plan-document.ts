import { PLAN_SCHEMA_VERSION, planSchema } from '@wardogs-love/fob';
import type { Plan } from '@wardogs-love/fob';
import type { StoredDocument } from '@wardogs-love/storage';

export const FOB_TOOL = 'fob';

// a stored document as a FOB plan; a document from another tool, a newer schema, or with a plan
// that fails validation reports why
export function parsePlanDocument(
  document: StoredDocument,
): { readonly ok: true; readonly plan: Plan } | { readonly ok: false; readonly reason: string } {
  if (document.tool !== FOB_TOOL) {
    return { ok: false, reason: `this is a ${document.tool} document, not a FOB plan` };
  }

  if (document.schemaVersion > PLAN_SCHEMA_VERSION) {
    return { ok: false, reason: 'this plan comes from a newer version of the planner' };
  }

  const result = planSchema.safeParse(document.data);

  return result.success
    ? { ok: true, plan: result.data }
    : { ok: false, reason: 'the plan data is damaged' };
}
