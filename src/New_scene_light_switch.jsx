import React, { useRef, useMemo, useState, useEffect } from "react";
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

// ✅ Animated knob that toggles light
function AnimatedKnob(props) {
  const { scene, animations } = useGLTF("/Lighthouse-model-switch_nob.glb");
  const group = useRef();
  const { actions } = useAnimations(animations, group);
  const [isOn, setIsOn] = useState(false);
  const lightRef = useRef();

  useEffect(() => {
    console.log("Available animations:", Object.keys(actions));
  }, [actions]);

  // ✅ Smooth fade for light
  useFrame(() => {
    if (!lightRef.current) return;
    const targetIntensity = isOn ? 2 : 0;
    lightRef.current.intensity = THREE.MathUtils.lerp(
      lightRef.current.intensity,
      targetIntensity,
      0.1
    );
  });

  const handleClick = (e) => {
    e.stopPropagation();

    setIsOn((prev) => {
      const next = !prev;
      const clipName = Object.keys(actions)[0]; // or your custom name
      const action = actions[clipName];

      if (action) {
        action.setLoop(THREE.LoopOnce);
        action.clampWhenFinished = true;
        action.paused = false;

        if (next) {
          // ▶️ Play forward
          action.timeScale = 1;
          action.reset();
          action.play();
        } else {
          // ⏪ Play backward
          action.timeScale = -1;
          action.time = action.getClip().duration;
          action.play();
        }
      }

      return next;
    });
  };

  return (
    <group ref={group} {...props} onClick={handleClick} cursor="pointer">
      <primitive object={scene} />
      <axesHelper args={[0.2]} />
      {/* ✅ The actual light toggled by the switch */}
      <pointLight
        ref={lightRef}
        intensity={0}
        position={[0, 0.2, 0.2]} // adjust local offset
        color="yellow"
      />
    </group>
  );
}

// ---------------- TEXTURED CONE ----------------
function TexturedCone(props) {
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
    if (ref.current) ref.current.rotation.z += 0.01;
  });

  return (
    <mesh
      ref={ref}
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
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Canvas>
        {/* 🌞 Lighting */}
        <directionalLight position={[2, 5, 3]} />
        <ambientLight intensity={1} />

        {/* 🏠 Scene Models */}
        <Model
          position={[4, -3, -20]}
          scale={1}
          rotation={[0, (3 * Math.PI) / 2, 0]}
        />
        <Model_2
          position={[-6.5, -5, -20]}
          scale={1}
          rotation={[0, (3 * Math.PI) / 2, 0]}
        />
        <Model_3
          position={[3.5, 8, -10]}
          scale={1}
          rotation={[0, (2.5 * Math.PI) / 2, -0.2]}
        />

        {/* 🔘 Interactive Knob */}
        <AnimatedKnob
          position={[3.5, 8, -10]}
          scale={1}
          rotation={[0, (2.5 * Math.PI) / 2, -0.2]}
        />

        {/* 💡 Animated Cone */}
        <TexturedCone position={[-6, 3.9, -22.3]} />

        {/* 🖥️ Rive screen */}
        <Screen
          position={[1.7, -0.17, -3.2]}
          scale={1.3}
          rotation={[0.1, -0.6, 0.23]}
        />

        <OrbitControls />
      </Canvas>
    </div>
  );
};

export default App;
