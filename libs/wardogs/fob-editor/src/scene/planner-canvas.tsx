import { Grid, MapControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import type { ComponentRef } from 'react';
import { useRef, useState } from 'react';
import { MOUSE } from 'three';
import { useEditorStore } from '../state/editor-store';
import { BoxSelectRect } from './box-select-rect';
import { CameraRig } from './camera-rig';
import { sceneColors } from './category-colors';
import { FOBAreas } from './fob-areas';
import { GhostPiece } from './ghost-piece';
import { Ground } from './ground';
import { PlacedPieces } from './placed-pieces';

// the left button belongs to the tools, so the camera pans with the right or middle button and
// orbits (in the orbit view) with the right one
const TOP_BUTTONS = { MIDDLE: MOUSE.PAN, RIGHT: MOUSE.PAN };
const ORBIT_BUTTONS = { MIDDLE: MOUSE.PAN, RIGHT: MOUSE.ROTATE };
const RIGHT_BUTTON = 2;

// how far, in pixels, a right press may travel and still count as a click rather than a pan
const CLICK_SLOP = 5;

export function PlannerCanvas() {
  const cameraMode = useEditorStore((state) => state.cameraMode);
  const controls = useRef<ComponentRef<typeof MapControls>>(null);
  const rightPress = useRef<{ x: number; y: number } | null>(null);

  // tells automation (and anyone curious) when the scene takes pointer input
  const [isReady, setIsReady] = useState(false);

  return (
    <Canvas
      camera={{ far: 2000, near: 0.1, position: [0, 400, 0.001], zoom: 6 }}
      data-ready={isReady}
      data-testid="planner-canvas"
      onCreated={() => {
        setIsReady(true);
      }}
      onContextMenu={(event) => {
        event.preventDefault();
      }}
      onPointerDown={(event) => {
        if (event.button === RIGHT_BUTTON) {
          rightPress.current = { x: event.clientX, y: event.clientY };
        }
      }}
      onPointerUp={(event) => {
        const press = rightPress.current;

        if (event.button !== RIGHT_BUTTON || press === null) {
          return;
        }

        rightPress.current = null;

        // a right drag pans or orbits the camera; a right click stops placing or deselects
        if (Math.hypot(event.clientX - press.x, event.clientY - press.y) <= CLICK_SLOP) {
          useEditorStore.getState().resetTool();
        }
      }}
      orthographic
    >
      <color args={[sceneColors.background]} attach="background" />
      <ambientLight intensity={1.2} />
      <directionalLight intensity={1.6} position={[40, 100, 20]} />
      <MapControls
        enableDamping={false}
        enableRotate={cameraMode === 'orbit'}
        makeDefault
        maxPolarAngle={Math.PI / 2 - 0.05}
        maxZoom={80}
        minZoom={1.5}
        mouseButtons={cameraMode === 'orbit' ? ORBIT_BUTTONS : TOP_BUTTONS}
        ref={controls}
        screenSpacePanning={false}
      />
      <CameraRig controls={controls} />
      <Grid
        args={[400, 400]}
        cellColor={sceneColors.gridCell}
        cellSize={0.75}
        cellThickness={0.6}
        fadeDistance={1500}
        infiniteGrid
        position={[0, 0.001, 0]}
        sectionColor={sceneColors.gridSection}
        sectionSize={1.5}
        sectionThickness={1}
      />
      <Ground />
      <FOBAreas />
      <PlacedPieces />
      <GhostPiece />
      <BoxSelectRect />
    </Canvas>
  );
}
