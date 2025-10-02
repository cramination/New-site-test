import React, {
  useRef,
  useMemo,
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle
} from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";
import "./App.css";
import Screen from "./Screen";

// ---------------- 3D MODELS ----------------
function Model(props) {
  const { scene } = useGLTF("/Lighthouse-model.glb");
  return <primitive object={scene} {...props} />;
}

function Model_2(props) {
  const { scene } = useGLTF("/Lighthouse-model-computer.glb");
  return <primitive object={scene} {...props} />;
}

function Model_3(props) {
  const { scene } = useGLTF("/Lighthouse-model-switch.glb");
  return <primitive object={scene} {...props} />;
}

// ✅ Animated knob component (forwardRef!)
const AnimatedKnob = forwardRef(({ isOn, setIsOn, ...props }, ref) => {
  const { scene, animations } = useGLTF("/Lighthouse-model-switch_nob.glb");
  const group = useRef();
  const { actions } = useAnimations(animations, group);

  useImperativeHandle(ref, () => ({
    playAnimation(forward = true) {
      if (!actions) return;
      const clipName = Object.keys(actions)[0];
      const action = actions[clipName];
      if (!action) return;

      action.setLoop(THREE.LoopOnce);
      action.clampWhenFinished = true;
      action.paused = false;

      if (forward) {
        action.timeScale = 1;
        action.reset();
        action.play();
      } else {
        action.timeScale = -1;
        action.time = action.getClip().duration;
        action.play();
      }
    }
  }));

  const handleClick = (e) => {
    e.stopPropagation();
    setIsOn((prev) => {
      const next = !prev;
      if (ref && ref.current) ref.current.playAnimation(next);
      return next;
    });
  };

  return (
    <group ref={group} {...props} onClick={handleClick} cursor="pointer">
      <primitive object={scene} />
    </group>
  );
});

// ---------------- TEXTURED CONE ----------------
function TexturedCone({ isVisible, ...props }) {
  const texture = useLoader(
    THREE.TextureLoader,
    "/Lighthouse_cone (0-00-00-00).png"
  );

  texture.center.set(0.5, 0.5);
  texture.rotation = (3 * Math.PI) / 2;

  const coneGeo = useMemo(() => {
    const geo = new THREE.ConeGeometry(1.5, 12, 64, 1, true);
    geo.translate(0, -6, 0);
    return geo;
  }, []);

  const ref = useRef();
  useFrame(() => {
    if (ref.current && isVisible) ref.current.rotation.z += 0.01;
  });

  return (
    <mesh
      ref={ref}
      visible={isVisible}
      geometry={coneGeo}
      rotation={[Math.PI / -1.9, 0, 0]}
      position={[-15.9, 1.9, -22.3]}
      {...props}
    >
      <meshStandardMaterial
        map={texture}
        transparent
        emissive="yellow"
        emissiveIntensity={1.5}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// ---------------- APP ----------------
const App = () => {
  const [isOn, setIsOn] = useState(true);

  // Ref to control knob animation from outside
  const knobRef = useRef();

  const handleSwitchClick = () => {
    setIsOn((prev) => {
      const next = !prev;
      if (knobRef.current) knobRef.current.playAnimation(next);
      return next;
    });
  };

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Canvas>
        <directionalLight position={[2, 5, 3]} />
        <ambientLight intensity={0.5} />

        <Model position={[4, -3, -20]} scale={1} rotation={[0, (3 * Math.PI) / 2, 0]} />
        <Model_2 position={[-6.5, -5, -20]} scale={1} rotation={[0, (3 * Math.PI) / 2, 0]} />

        {/* Make the base clickable too */}
        <Model_3
          position={[3.5, 8, -10]}
          scale={1}
          rotation={[0, (2.5 * Math.PI) / 2, -0.2]}
          onClick={(e) => {
            e.stopPropagation();
            handleSwitchClick();
          }}
          cursor="pointer"
        />

        <AnimatedKnob
          ref={knobRef}
          position={[3.5, 8, -10]}
          scale={1}
          rotation={[0, (2.5 * Math.PI) / 2, -0.2]}
          isOn={isOn}
          setIsOn={setIsOn}
        />

        <TexturedCone isVisible={isOn} position={[-6, 3.9, -22.3]} />

        <OrbitControls />
        <Screen position={[1.7, -0.17, -3.2]} scale={1.3} rotation={[0.1, -0.6, 0.23]} />
      </Canvas>
    </div>
  );
};

export default App;
