// oxlint-disable import/max-dependencies -- the registry imports every model, one file each
import { BarbedWireModel } from './barbed-wire-model';
import { BremerWallModel } from './bremer-wall-model';
import { BunkerModel } from './bunker-model';
import { CIWSModel } from './ciws-model';
import { DoorModel } from './door-model';
import { DrillRigModel } from './drill-rig-model';
import { FireShelterModel } from './fire-shelter-model';
import { FOBModel } from './fob-model';
import { GateModel } from './gate-model';
import { HedgehogModel } from './hedgehog-model';
import { HescoBlock } from './hesco-block';
import { HescoWall } from './hesco-wall';
import { LoudspeakerModel } from './loudspeaker-model';
import { MortarModel } from './mortar-model';
import { RadioModel } from './radio-model';
import { ReconTentModel } from './recon-tent-model';
import { ReconTowerModel } from './recon-tower-model';
import { RefuelStationModel } from './refuel-station-model';
import { RepairStationModel } from './repair-station-model';
import { SandbagWallModel } from './sandbag-wall-model';
import { StingrayModel } from './stingray-model';
import { TalonModel } from './talon-model';
import type { PieceModel } from './types';

// the hand-built model for each catalog piece, by piece id; a piece without one draws as its
// collision box
export const pieceModels: Readonly<Record<string, PieceModel>> = {
  fob: FOBModel,
  'hesco-small': HescoBlock,
  'hesco-large': HescoBlock,
  'hesco-wall': HescoWall,
  gate: GateModel,
  door: DoorModel,
  bunker: BunkerModel,
  'indirect-fire-shelter': FireShelterModel,
  'sandbag-wall': SandbagWallModel,
  'bremer-wall': BremerWallModel,
  'barbed-wire': BarbedWireModel,
  hedgehog: HedgehogModel,
  'recon-tent': ReconTentModel,
  'recon-tower': ReconTowerModel,
  'l81-mortar': MortarModel,
  stingray: StingrayModel,
  'talon-sam': TalonModel,
  'vanguard-ciws': CIWSModel,
  'builders-radio': RadioModel,
  loudspeaker: LoudspeakerModel,
  'refuel-station': RefuelStationModel,
  'repair-station': RepairStationModel,
  'drill-rig': DrillRigModel,
};
