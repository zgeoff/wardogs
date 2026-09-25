import type { MapControls } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import type { ComponentRef, RefObject } from 'react';
import { useEffect } from 'react';
import { useEditorStore } from '../state/editor-store';
import { findFrameTarget } from './find-frame-target';

// how much ground, in metres, fits across the shorter side of the view when framing: the FOB's
// 120 m square with a margin
const FRAMED_METRES = 135;
const ORBIT_OFFSET = 150;

interface Props {
  readonly controls: RefObject<ComponentRef<typeof MapControls> | null>;
}

// points the camera at the base: straight down in the top view, from the south-east corner in
// the 3D view; runs on a view change, a frame request, and a plan load
export function CameraRig(props: Props) {
  const camera = useThree((state) => state.camera);
  const size = useThree((state) => state.size);
  const cameraMode = useEditorStore((state) => state.cameraMode);
  const frameRequest = useEditorStore((state) => state.frameRequest);

  useEffect(() => {
    const controls = props.controls.current;
    const target = findFrameTarget(useEditorStore.getState().plan);

    if (cameraMode === 'top') {
      camera.position.set(target.x, 400, target.z + 0.001);
    } else {
      camera.position.set(target.x + ORBIT_OFFSET, ORBIT_OFFSET, target.z + ORBIT_OFFSET);
    }

    camera.zoom = Math.min(size.width, size.height) / FRAMED_METRES;

    camera.updateProjectionMatrix();
    controls?.target.set(target.x, 0, target.z);
    controls?.update();
  }, [camera, cameraMode, frameRequest, props.controls, size.width, size.height]);

  return null;
}
