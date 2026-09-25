import { PLAN_SCHEMA_VERSION } from '@wardogs-love/fob';
import type { Plan } from '@wardogs-love/fob';
import type { StoredDocument } from '@wardogs-love/storage';
import { FOB_TOOL } from './parse-plan-document';

interface PlanDocumentInput {
  readonly id: string;
  readonly name: string;
  readonly plan: Plan;
  readonly updatedAt: Date;
}

export function buildPlanDocument(input: PlanDocumentInput): StoredDocument {
  return {
    id: input.id,
    tool: FOB_TOOL,
    schemaVersion: PLAN_SCHEMA_VERSION,
    name: input.name,
    updatedAt: input.updatedAt.toISOString(),
    data: input.plan,
  };
}
