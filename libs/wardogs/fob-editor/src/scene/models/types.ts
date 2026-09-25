import type { Piece } from '@wardogs-love/game-data';
import type { ComponentType } from 'react';

// a model draws in the piece's unturned frame: x across its width, z along its depth, y up from
// its base at 0, centred on x and z
export interface PieceModelProps {
  readonly size: Piece['size'];
  readonly opacity: number;
}

export type PieceModel = ComponentType<PieceModelProps>;

export type Vector3Tuple = readonly [number, number, number];
