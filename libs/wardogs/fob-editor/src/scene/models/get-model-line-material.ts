import { LineBasicMaterial } from 'three';
import { modelColors } from './model-colors';
import type { ModelTone } from './model-colors';

const materials = new Map<string, LineBasicMaterial>();

// one shared line material per tone and opacity, for the lattice parts of a piece model
export function getModelLineMaterial(tone: ModelTone, opacity: number): LineBasicMaterial {
  const key = `${tone}:${opacity}`;
  const cached = materials.get(key);

  if (cached !== undefined) {
    return cached;
  }

  const material = new LineBasicMaterial({
    color: modelColors[tone],
    opacity,
    transparent: opacity < 1,
  });

  materials.set(key, material);

  return material;
}
