import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const CyberBackground3D: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Check WebGL availability
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
      });
    } catch {
      return;
    }

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x04060f, 0.0018);

    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 30, 80);
    camera.lookAt(0, 0, 0);

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x04060f, 1);
    container.appendChild(renderer.domElement);

    // 1. Cyber Wireframe Ground Grid
    const gridHelper = new THREE.GridHelper(200, 40, 0x06b6d4, 0x1e293b);
    gridHelper.position.y = -20;
    scene.add(gridHelper);

    // 2. Neural Nodes (Particles) & Connections (Plexus style)
    const particleCount = 120;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities: THREE.Vector3[] = [];
    const colors = new Float32Array(particleCount * 3);

    const cyanColor = new THREE.Color(0x06b6d4);
    const blueColor = new THREE.Color(0x3b82f6);
    const purpleColor = new THREE.Color(0x8b5cf6);

    for (let i = 0; i < particleCount; i++) {
      const x = (Math.random() - 0.5) * 160;
      const y = (Math.random() - 0.5) * 60;
      const z = (Math.random() - 0.5) * 140;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      velocities.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * 0.04,
          (Math.random() - 0.5) * 0.04,
          (Math.random() - 0.5) * 0.04
        )
      );

      // Color variation
      const rand = Math.random();
      const chosenColor = rand > 0.6 ? cyanColor : rand > 0.3 ? blueColor : purpleColor;
      colors[i * 3] = chosenColor.r;
      colors[i * 3 + 1] = chosenColor.g;
      colors[i * 3 + 2] = chosenColor.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Particle sprite using procedural canvas texture
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
      grad.addColorStop(0.3, 'rgba(6, 182, 212, 0.8)');
      grad.addColorStop(1, 'rgba(6, 182, 212, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 32, 32);
    }
    const particleTexture = new THREE.CanvasTexture(canvas);

    const pointsMaterial = new THREE.PointsMaterial({
      size: 3.5,
      map: particleTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
      depthWrite: false
    });

    const particles = new THREE.Points(geometry, pointsMaterial);
    scene.add(particles);

    // 3. Dynamic Lines Connecting Neural Nodes
    const maxLineConnections = 300;
    const linePositions = new Float32Array(maxLineConnections * 6); // 2 vertices * 3 coords
    const lineColors = new Float32Array(maxLineConnections * 6);
    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    lineGeometry.setAttribute('color', new THREE.BufferAttribute(lineColors, 3));

    const lineMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const lineMesh = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lineMesh);

    // 4. Floating Holographic Cyber Rings
    const ringGeo = new THREE.TorusGeometry(35, 0.2, 16, 100);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      wireframe: true,
      transparent: true,
      opacity: 0.15
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2.3;
    ring.position.y = -5;
    scene.add(ring);

    // Mouse interaction for soft parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX - window.innerWidth / 2) * 0.05;
      mouseY = (event.clientY - window.innerHeight / 2) * 0.05;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Handle Window Resize
    const handleResize = () => {
      if (!renderer || !camera) return;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Soft mouse lerp
      targetX += (mouseX - targetX) * 0.03;
      targetY += (mouseY - targetY) * 0.03;

      camera.position.x = targetX * 0.3;
      camera.position.y = 25 - targetY * 0.2;
      camera.lookAt(0, 0, 0);

      // Rotate grid slowly
      gridHelper.rotation.y = elapsedTime * 0.02;
      ring.rotation.z = elapsedTime * 0.04;

      // Update neural particles
      const posAttr = geometry.getAttribute('position') as THREE.BufferAttribute;
      const posArray = posAttr.array as Float32Array;

      for (let i = 0; i < particleCount; i++) {
        const vel = velocities[i];
        posArray[i * 3] += vel.x;
        posArray[i * 3 + 1] += vel.y;
        posArray[i * 3 + 2] += vel.z;

        // Bounce within cyber cube bounds
        if (Math.abs(posArray[i * 3]) > 80) vel.x *= -1;
        if (Math.abs(posArray[i * 3 + 1]) > 30) vel.y *= -1;
        if (Math.abs(posArray[i * 3 + 2]) > 70) vel.z *= -1;
      }
      posAttr.needsUpdate = true;

      // Connect nearby nodes
      let lineIndex = 0;
      const connectionDist = 28;

      for (let i = 0; i < particleCount; i++) {
        for (let j = i + 1; j < particleCount; j++) {
          if (lineIndex >= maxLineConnections) break;

          const dx = posArray[i * 3] - posArray[j * 3];
          const dy = posArray[i * 3 + 1] - posArray[j * 3 + 1];
          const dz = posArray[i * 3 + 2] - posArray[j * 3 + 2];
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (dist < connectionDist) {
            const alpha = 1.0 - dist / connectionDist;

            // Start vertex
            linePositions[lineIndex * 6] = posArray[i * 3];
            linePositions[lineIndex * 6 + 1] = posArray[i * 3 + 1];
            linePositions[lineIndex * 6 + 2] = posArray[i * 3 + 2];

            // End vertex
            linePositions[lineIndex * 6 + 3] = posArray[j * 3];
            linePositions[lineIndex * 6 + 4] = posArray[j * 3 + 1];
            linePositions[lineIndex * 6 + 5] = posArray[j * 3 + 2];

            // Colors
            lineColors[lineIndex * 6] = 0.02 * alpha;
            lineColors[lineIndex * 6 + 1] = 0.7 * alpha;
            lineColors[lineIndex * 6 + 2] = 0.85 * alpha;

            lineColors[lineIndex * 6 + 3] = 0.2 * alpha;
            lineColors[lineIndex * 6 + 4] = 0.5 * alpha;
            lineColors[lineIndex * 6 + 5] = 0.95 * alpha;

            lineIndex++;
          }
        }
      }

      // Hide remaining lines
      for (let k = lineIndex * 6; k < maxLineConnections * 6; k++) {
        linePositions[k] = 0;
        lineColors[k] = 0;
      }

      lineGeometry.getAttribute('position').needsUpdate = true;
      lineGeometry.getAttribute('color').needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      pointsMaterial.dispose();
      particleTexture.dispose();
      lineGeometry.dispose();
      lineMaterial.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-75"
      aria-hidden="true"
    />
  );
};
