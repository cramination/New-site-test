import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Rive } from "@rive-app/canvas";


export function useRiveTexture(src) {
  const containerRef = useRef(null);
  const [texture, setTexture] = useState(null);

  useEffect(() => {
    // Create visible canvas, but hide it
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    canvas.style.display = "none"; // hidden but rendered
    document.body.appendChild(canvas);

    const rive = new Rive({
      src,
      canvas,
      autoplay: true,
      fit: "contain",
    });

    const threeTexture = new THREE.CanvasTexture(canvas);
    setTexture(threeTexture);

    return () => {
      rive.stop();
      document.body.removeChild(canvas);
    };
  }, [src]);

  return { texture };
}
