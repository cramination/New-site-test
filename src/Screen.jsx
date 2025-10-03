import { Html } from "@react-three/drei";
import { useRive } from "@rive-app/react-canvas";

export default function Screen({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
}) {
  const { RiveComponent } = useRive({
    src: "./assets/Resume_button.riv",
    autoplay: true,
    stateMachines: "State Machine 1",
    fit: "contain",
  });

  // Maintain 16:9 aspect ratio
  const aspect = 16 / 9;
  const height = 6 * scale; // base world height
  const width = height * aspect;

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Invisible placeholder plane */}
      <mesh>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* Rive overlay */}
      <Html
        transform
        center
        occlude={false}
        distanceFactor={1}
        style={{
          width: `${width * 50}px`,
          height: `${height * 50}px`,
          pointerEvents: "auto",
          background: "transparent", // transparent HTML background
          overflow: "hidden",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* Make Rive canvas transparent */}
        <div
          style={{
            width: "100%",
            height: "100%",
            background: "transparent",
          }}
        >
          <RiveComponent
            style={{
              width: "100%",
              height: "100%",
              background: "transparent",
            }}
          />
        </div>
      </Html>
    </group>
  );
}
