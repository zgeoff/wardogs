import type { Plan } from '@wardogs-love/fob';
import { parsePlanDocument } from './parse-plan-document';

type PlanFileResult =
  | { readonly ok: true; readonly name: string; readonly plan: Plan }
  | { readonly ok: false; readonly reason: string };

// a plan file the player picked, as a plan and its name; an unreadable file reports why
export async function readPlanFile(file: Blob): Promise<PlanFileResult> {
  const text = await file.text();

  const data = tryParseJSON(text);

  if (data === undefined) {
    return { ok: false, reason: 'the file is not JSON' };
  }

  if (!isDocumentShape(data)) {
    return { ok: false, reason: 'the file is not a saved plan' };
  }

  const parsed = parsePlanDocument({ ...data, id: 'import', updatedAt: '' });

  return parsed.ok ? { ok: true, name: data.name, plan: parsed.plan } : parsed;
}

function tryParseJSON(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return undefined;
  }
}

interface DocumentShape {
  readonly tool: string;
  readonly schemaVersion: number;
  readonly name: string;
  readonly data: unknown;
}

function isDocumentShape(value: unknown): value is DocumentShape {
  return (
    typeof value === 'object' &&
    value !== null &&
    'tool' in value &&
    typeof value.tool === 'string' &&
    'schemaVersion' in value &&
    typeof value.schemaVersion === 'number' &&
    'name' in value &&
    typeof value.name === 'string' &&
    'data' in value
  );
}
