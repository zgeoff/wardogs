// oxlint-disable import/max-dependencies -- the registry imports every model, one file each
import { BarbedWireModel } from './barbed-wire-model';
import { BremerWallModel } from './bremer-wall-model';
import { BunkerModel } from './bunker-model';
import { DoorModel } from './door-model';
import { FireShelterModel } from './fire-shelter-model';
import { FOBModel } from './fob-model';
import { GateModel } from './gate-model';
import { HedgehogModel } from './hedgehog-model';
import { HescoBlock } from './hesco-block';
import { HescoWall } from './hesco-wall';
import { NetRoofModel } from './net-roof-model';
import { PlankFloorModel } from './plank-floor-model';
import { SandbagWallModel } from './sandbag-wall-model';
import type { PieceModel } from './types';

// the hand-built model for each catalog piece that has one, by piece id; a piece without one
// draws as its collision box
export const pieceModels: Readonly<Record<string, PieceModel>> = {
  fob: FOBModel,
  'hesco-small': HescoBlock,
  'hesco-large': HescoBlock,
  'hesco-wall': HescoWall,
  gate: GateModel,
  door: DoorModel,
  bunker: BunkerModel,
  'bunker-floor': PlankFloorModel,
  'bunker-roof': NetRoofModel,
  'indirect-fire-shelter': FireShelterModel,
  'sandbag-wall': SandbagWallModel,
  'bremer-wall': BremerWallModel,
  'barbed-wire': BarbedWireModel,
  hedgehog: HedgehogModel,
};
