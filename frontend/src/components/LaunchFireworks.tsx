import React, { useEffect, useRef, useState } from 'react';

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  alpha: number;
  color: string;
  size: number;
}

interface Rocket {
  x: number; y: number;
  vx: number; vy: number;
  trail: { x: number; y: number }[];
  exploded: boolean;
  color: string;
  targetY: number;
}

interface ShootingStar {
  id: number;
  x: number;
  y: number;
  duration: number;
  tx: number;
  ty: number;
}

const COLORS = [
  '#60a5fa', '#22d3ee', '#a78bfa', '#fbbf24',
  '#34d399', '#f472b6', '#ffffff', '#fb923c',
  '#c084fc', '#93c5fd',
];

interface Props {
  onDone: () => void;
}

const LaunchFireworks: React.FC<Props> = ({ onDone }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number>(0);
  const rocketsRef = useRef<Rocket[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const lastShotRef = useRef(0);
  const startTimeRef = useRef(Date.now());
  const doneCalledRef = useRef(false);
  const wrapperFadedRef = useRef(false);

  const [stars, setStars] = useState<ShootingStar[]>([]);
  const starIdRef = useRef(0);

  useEffect(() => {
    const spawn = () => {
      if (Date.now() - startTimeRef.current > 28500) return;
      const id = ++starIdRef.current;
      const edge = Math.floor(Math.random() * 4); // 0=rechts, 1=oben, 2=links, 3=unten
      let x: number, y: number, tx: number, ty: number;
      const rnd = (a: number, b: number) => a + Math.random() * (b - a);
      if (edge === 0) { // von rechts → nach links-unten
        x = 102 + rnd(0, 10); y = rnd(5, 80);
        tx = rnd(-500, -350); ty = rnd(150, 320);
      } else if (edge === 1) { // von oben → nach unten
        x = rnd(10, 90); y = -rnd(3, 10);
        tx = rnd(-200, 200); ty = rnd(420, 600);
      } else if (edge === 2) { // von links → nach rechts-unten
        x = -rnd(2, 8); y = rnd(5, 80);
        tx = rnd(350, 520); ty = rnd(150, 320);
      } else { // von unten → nach oben
        x = rnd(10, 90); y = 102 + rnd(0, 8);
        tx = rnd(-150, 150); ty = rnd(-450, -320);
      }
      setStars(prev => [...prev, { id, x, y, tx, ty, duration: 3.5 + Math.random() * 3.0 }]);
      setTimeout(() => setStars(prev => prev.filter(s => s.id !== id)), 8000);
    };
    for (let i = 0; i < 6; i++) setTimeout(spawn, 500 + i * 1000);
    const iv = setInterval(spawn, 1400);
    const stop = setTimeout(() => clearInterval(iv), 20000);
    return () => { clearInterval(iv); clearTimeout(stop); };
  }, []);

  // Canvas fireworks loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.offsetWidth;
        canvas.height = parent.offsetHeight;
      }
    };
    resize();
    const ro = new ResizeObserver(resize);
    if (canvas.parentElement) ro.observe(canvas.parentElement);

    const shootRocket = () => {
      const { width: w, height: h } = canvas;
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      const startX = w * 0.15 + Math.random() * w * 0.7;
      const targetY = h * 0.08 + Math.random() * h * 0.48;
      const targetX = w * 0.05 + Math.random() * w * 0.9;
      const dx = targetX - startX;
      const dy = targetY - h;
      const dist = Math.hypot(dx, dy);
      const speed = 9 + Math.random() * 5;
      rocketsRef.current.push({
        x: startX, y: h,
        vx: (dx / dist) * speed,
        vy: (dy / dist) * speed,
        trail: [], exploded: false, color, targetY,
      });
    };

    const burst = (rocket: Rocket) => {
      const count = 55 + Math.floor(Math.random() * 30);
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.35;
        const speed = 1.5 + Math.random() * 5.5;
        particlesRef.current.push({
          x: rocket.x, y: rocket.y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          color: rocket.color,
          size: 1.5 + Math.random() * 2.5,
        });
      }
    };

    const loop = (now: number) => {
      const elapsed = Date.now() - startTimeRef.current;
      // Ausblenden ab Sekunde 20, über 10 Sekunden bis Ende
      const fadeFactor = elapsed > 20000 ? Math.max(0, (30000 - elapsed) / 10000) : 1;

      // Canvas-Overlay: bei Ausblenden zunehmnend dunkler
      ctx.fillStyle = `rgba(2, 6, 23, ${0.18 + (1 - fadeFactor) * 0.72})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const shootInterval = Math.max(350, 2500 - (Math.min(elapsed, 18000) / 18000) * 2150);
      if (elapsed < 28500 && now - lastShotRef.current > shootInterval) {
        lastShotRef.current = now;
        shootRocket();
        if (elapsed > 10000 && Math.random() > 0.5) setTimeout(shootRocket, shootInterval * 0.35);
      }

      rocketsRef.current = rocketsRef.current.filter(rocket => {
        if (rocket.exploded) return false;
        rocket.trail.unshift({ x: rocket.x, y: rocket.y });
        if (rocket.trail.length > 10) rocket.trail.pop();
        rocket.trail.forEach((t, i) => {
          ctx.globalAlpha = (1 - i / rocket.trail.length) * 0.65 * fadeFactor;
          ctx.fillStyle = rocket.color;
          ctx.beginPath();
          ctx.arc(t.x, t.y, 1.5, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.globalAlpha = fadeFactor;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(rocket.x, rocket.y, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
        rocket.x += rocket.vx;
        rocket.y += rocket.vy;
        if (rocket.y <= rocket.targetY) {
          burst(rocket);
          rocket.exploded = true;
          return false;
        }
        return true;
      });

      particlesRef.current = particlesRef.current.filter(p => {
        p.vy += 0.055;
        p.vx *= 0.984;
        p.vy *= 0.984;
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.015;
        if (p.alpha <= 0) return false;
        ctx.globalAlpha = p.alpha * fadeFactor;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        return true;
      });

      ctx.globalAlpha = 1;

      // CSS-Fade des gesamten Wrappers ab 27s über 3s — kein abrupter Schnitt
      if (elapsed >= 27000 && !wrapperFadedRef.current) {
        wrapperFadedRef.current = true;
        if (wrapperRef.current) {
          wrapperRef.current.style.transition = 'opacity 3s ease-out';
          wrapperRef.current.style.opacity = '0';
        }
      }

      if (elapsed >= 30000 && !doneCalledRef.current) {
        doneCalledRef.current = true;
        onDone();
        return;
      }

      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(animRef.current);
      ro.disconnect();
    };
  }, [onDone]);

  return (
    <div
      ref={wrapperRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 2 }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />
      {stars.map(star => (
        <div
          key={star.id}
          className="absolute pointer-events-none"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: '3px',
            height: '3px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.9)',
            boxShadow: '0 0 6px 2px rgba(147,197,253,0.7)',
            animation: `launchShootingStar ${star.duration}s ease-in forwards`,
            ['--star-tx' as any]: `${star.tx}px`,
            ['--star-ty' as any]: `${star.ty}px`,
          }}
        />
      ))}
    </div>
  );
};

export default LaunchFireworks;

