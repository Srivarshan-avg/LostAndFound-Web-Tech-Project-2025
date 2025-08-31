import React, { useRef, useEffect } from "react";

const MagnetLinesBackground = ({
  color = "#4f46e5",
  speed = 0.2,
  intensity = 0.7,
}) => {
  const canvasRef = useRef(null);
  const animationFrameId = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const points = [];
    const POINT_COUNT = 30;
    const MAX_DISTANCE = 200 * intensity;

    // Create points with random positions
    for (let i = 0; i < POINT_COUNT; i++) {
      points.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * speed * 5,
        vy: (Math.random() - 0.5) * speed * 5,
      });
    }

    // Draw a single point
    function drawPoint(p) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
    }

    // Draw line with gradient
    function drawLine(p1, p2, alpha) {
      const grad = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
      grad.addColorStop(0, `${color}00`);
      grad.addColorStop(
        0.5,
        `${color}${Math.floor(alpha * 255)
          .toString(16)
          .padStart(2, "0")}`
      );
      grad.addColorStop(1, `${color}00`);

      ctx.strokeStyle = grad;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    }

    // Animation loop
    function animate() {
      ctx.clearRect(0, 0, width, height);
      // Update point positions
      points.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx = -p.vx;
        if (p.y < 0 || p.y > height) p.vy = -p.vy;
      });

      // Draw points and lines between nearby points
      for (let i = 0; i < POINT_COUNT; i++) {
        for (let j = i + 1; j < POINT_COUNT; j++) {
          const dx = points[i].x - points[j].x;
          const dy = points[i].y - points[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < MAX_DISTANCE) {
            const alpha = 1 - dist / MAX_DISTANCE;
            drawLine(points[i], points[j], alpha);
          }
        }
      }

      points.forEach(drawPoint);

      animationFrameId.current = requestAnimationFrame(animate);
    }

    animate();

    // Resize handler
    function handleResize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId.current);
      window.removeEventListener("resize", handleResize);
    };
  }, [color, speed, intensity]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: -1,
        pointerEvents: "none",
        backgroundColor: "#111827",
      }}
    />
  );
};

export default MagnetLinesBackground;
