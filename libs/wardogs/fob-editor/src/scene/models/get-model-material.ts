import { MeshStandardMaterial } from 'three';
import { modelColors } from './model-colors';
import type { ModelTone } from './model-colors';

const materials = new Map<string, MeshStandardMaterial>();

// one shared material per tone and opacity, so a plan of hundreds of pieces compiles a handful of
// materials; a dimmed piece (an earlier stage) draws see-through
export function getModelMaterial(tone: ModelTone, opacity: number): MeshStandardMaterial {
  const key = `${tone}:${opacity}`;
  const cached = materials.get(key);

  if (cached !== undefined) {
    return cached;
  }

  const isOpaque = opacity >= 1;

  const material = new MeshStandardMaterial({
    color: modelColors[tone],
    roughness: tone === 'steel' ? 0.55 : 0.9,
    metalness: tone === 'steel' ? 0.4 : 0,
    opacity,
    transparent: !isOpaque,
    depthWrite: isOpaque,
  });

  materials.set(key, material);

  return material;
}
