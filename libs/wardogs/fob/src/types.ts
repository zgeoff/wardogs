// quarter turns clockwise, seen from above
export type Rotation = 0 | 1 | 2 | 3;

// x and z are the cell of the footprint's corner nearest the origin; elevation is the base's height
// in metres
export interface PlacedPiece {
  readonly id: string;
  readonly pieceID: string;
  readonly x: number;
  readonly z: number;
  readonly elevation: number;
  readonly rotation: Rotation;
  readonly stage: number;
}

export interface Plan {
  readonly stageCount: number;
  readonly pieces: readonly PlacedPiece[];
}

export interface Footprint {
  readonly width: number;
  readonly depth: number;
}

export interface Vector3 {
  readonly x: number;
  readonly y: number;
  readonly z: number;
}

export interface Box {
  readonly min: Vector3;
  readonly max: Vector3;
}

export interface StageTotal {
  readonly stage: number;
  readonly pieceCount: number;
  readonly supplies: number;
  readonly cumulativeSupplies: number;
}
