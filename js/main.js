/**
 * PRANNY — BRAND & CREATIVE PROJECTS
 * Cinematic Letter-Fall Intro, Hidden Graphic Canvas, Zig-Zag Break,
 * Checkerboard Curtain Transition & PRANNY Smoke/Ink Dissolve Effect
 */

(function () {
  'use strict';

  // Check Accessibility & Device Capabilities
  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

  const canvas = document.getElementById('sketch-canvas');
  const letterFallStage = document.getElementById('letter-fall-stage');
  const letterFallTrack = document.getElementById('letter-fall-track');
  const fallLetters = document.querySelectorAll('.fall-letter');
  const zigzagPath = document.getElementById('zigzag-path');

  const aboutScreen1 = document.getElementById('about');
  const aboutScreen2 = document.getElementById('about-info');
  const checkerWrapper = document.getElementById('checker-wrapper');
  const checkerCurtain = document.getElementById('checker-curtain');

  const prannyCanvas = document.getElementById('pranny-smoke-canvas');
  const mainTitle = document.getElementById('main-title');

  // =========================================================================
  // 1. CINEMATIC LETTER-FALL INTRO TIMELINE
  // =========================================================================
  let canvasInteractionActive = false;

  function runLetterFallSequence() {
    const hasWorkHash = window.location.hash === '#work';
    if (isReducedMotion || hasWorkHash) {
      if (letterFallStage) letterFallStage.style.display = 'none';
      document.body.classList.add('hero-revealed');
      canvasInteractionActive = true;
      if (hasWorkHash && workSection) {
        setTimeout(() => {
          const workTop = workSection.getBoundingClientRect().top + (window.pageYOffset || document.documentElement.scrollTop || 0);
          window.scrollTo(0, workTop);
          targetScrollY = workTop;
          currentScrollY = workTop;
        }, 60);
      }
      return;
    }

    // Drop timings (in seconds)
    const dropTimings = [0.7, 1.1, 1.5, 1.9, 2.3, 2.7, 3.1, 3.5, 3.9];

    fallLetters.forEach((el, index) => {
      const delay = (dropTimings[index] || 0.7 + index * 0.4) * 1000;
      setTimeout(() => {
        el.classList.add('falling');
      }, delay);
    });

    const pauseTime = 5700;

    setTimeout(() => {
      if (letterFallTrack) {
        letterFallTrack.classList.add('fade-out');
      }
    }, pauseTime);

    setTimeout(() => {
      document.body.classList.add('hero-revealed');
    }, pauseTime + 300);

    setTimeout(() => {
      canvasInteractionActive = true;
      if (letterFallStage) {
        letterFallStage.style.display = 'none';
      }
    }, pauseTime + 1100);
  }

  // =========================================================================
  // 2. PRANNY SMOKE / INK CURSOR DISSOLVE EFFECT
  // =========================================================================
  let renderPrannySmoke = () => {};

  if (prannyCanvas && mainTitle && !isReducedMotion) {
    const pCtx = prannyCanvas.getContext('2d');
    let pWidth = 0;
    let pHeight = 0;
    let pDpr = window.devicePixelRatio || 1;

    const smokeParticles = [];

    function resizePrannyCanvas() {
      pDpr = window.devicePixelRatio || 1;
      const rect = mainTitle.getBoundingClientRect();
      pWidth = Math.max(10, Math.floor(rect.width));
      pHeight = Math.max(10, Math.floor(rect.height));

      prannyCanvas.width = Math.floor(pWidth * pDpr);
      prannyCanvas.height = Math.floor(pHeight * pDpr);
      prannyCanvas.style.width = pWidth + 'px';
      prannyCanvas.style.height = pHeight + 'px';
    }

    function addSmokePuff(localX, localY, intensity = 1.0) {
      const count = Math.floor(2 + Math.random() * 3);
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.random() * 16;
        const baseRadius = Math.max(30, Math.min(80, pWidth * 0.095));
        const radius = (baseRadius * (0.8 + Math.random() * 0.45));
        
        smokeParticles.push({
          x: localX + Math.cos(angle) * dist,
          y: localY + Math.sin(angle) * dist,
          vx: (Math.random() - 0.5) * 0.4,
          vy: -0.12 - Math.random() * 0.3,
          radius: radius,
          maxRadius: radius * (1.25 + Math.random() * 0.3),
          alpha: Math.min(1.0, 0.98 * intensity),
          decay: 0.015 + Math.random() * 0.010, // ~0.7s to 1.1s smooth dissipating trail
          lobes: [
            { ox: (Math.random() - 0.5) * 14, oy: (Math.random() - 0.5) * 14, r: 0.75 + Math.random() * 0.3 },
            { ox: (Math.random() - 0.5) * 14, oy: (Math.random() - 0.5) * 14, r: 0.65 + Math.random() * 0.3 },
            { ox: (Math.random() - 0.5) * 14, oy: (Math.random() - 0.5) * 14, r: 0.55 + Math.random() * 0.3 },
          ]
        });
      }
    }

    window.addEventListener('mousemove', (e) => {
      if (!canvasInteractionActive) return;
      const rect = mainTitle.getBoundingClientRect();
      const margin = 45;

      if (
        e.clientX >= rect.left - margin &&
        e.clientX <= rect.right + margin &&
        e.clientY >= rect.top - margin &&
        e.clientY <= rect.bottom + margin
      ) {
        const localX = e.clientX - rect.left;
        const localY = e.clientY - rect.top;
        addSmokePuff(localX, localY, 1.0);
      }
    }, { passive: true });

    renderPrannySmoke = function () {
      if (!pCtx) return;

      if (smokeParticles.length === 0) {
        pCtx.clearRect(0, 0, prannyCanvas.width, prannyCanvas.height);
        return;
      }

      pCtx.setTransform(1, 0, 0, 1, 0, 0);
      pCtx.clearRect(0, 0, prannyCanvas.width, prannyCanvas.height);
      pCtx.scale(pDpr, pDpr);

      // 1. Draw crisp "PRANNY" text mask in pure white
      pCtx.globalCompositeOperation = 'source-over';
      const compStyle = window.getComputedStyle(mainTitle);
      pCtx.font = `${compStyle.fontWeight} ${compStyle.fontSize} ${compStyle.fontFamily}`;
      pCtx.textAlign = 'center';
      pCtx.textBaseline = 'middle';
      pCtx.fillStyle = '#FFFFFF';
      
      pCtx.fillText('PRANNY', pWidth / 2, pHeight / 2);

      // 2. Set blend mode to 'source-in' so black smoke is strictly clipped to PRANNY letters
      pCtx.globalCompositeOperation = 'source-in';

      // 3. Render organic black smoke clouds
      for (let i = smokeParticles.length - 1; i >= 0; i--) {
        const p = smokeParticles[i];

        p.x += p.vx;
        p.y += p.vy;
        if (p.radius < p.maxRadius) p.radius += 0.24;
        p.alpha -= p.decay;

        if (p.alpha <= 0.005) {
          smokeParticles.splice(i, 1);
          continue;
        }

        for (let j = 0; j < p.lobes.length; j++) {
          const lobe = p.lobes[j];
          const lx = p.x + lobe.ox;
          const ly = p.y + lobe.oy;
          const lr = Math.max(1, p.radius * lobe.r);

          const grad = pCtx.createRadialGradient(lx, ly, 0, lx, ly, lr);
          const a = Math.min(1.0, Math.max(0, p.alpha));
          grad.addColorStop(0, `rgba(0, 0, 0, ${a.toFixed(3)})`);
          grad.addColorStop(0.45, `rgba(0, 0, 0, ${(a * 0.88).toFixed(3)})`);
          grad.addColorStop(0.8, `rgba(0, 0, 0, ${(a * 0.35).toFixed(3)})`);
          grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

          pCtx.fillStyle = grad;
          pCtx.beginPath();
          pCtx.arc(lx, ly, lr, 0, Math.PI * 2);
          pCtx.fill();
        }
      }
    };

    window.addEventListener('resize', resizePrannyCanvas, { passive: true });
    if (document.fonts) {
      document.fonts.ready.then(resizePrannyCanvas);
    }
    setTimeout(resizePrannyCanvas, 400);
    setTimeout(resizePrannyCanvas, 1200);
  }

  // =========================================================================
  // 3. DYNAMIC ZIG-ZAG SCREEN BREAK TRANSITION
  // =========================================================================
  const baseZigZagPoints = [
    { x: 0, y: 40 },
    { x: 130, y: 195 },
    { x: 270, y: 35 },
    { x: 440, y: 215 },
    { x: 620, y: 45 },
    { x: 790, y: 210 },
    { x: 970, y: 30 },
    { x: 1150, y: 215 },
    { x: 1310, y: 55 },
    { x: 1440, y: 195 },
  ];

  let currentScrollY = 0;
  let targetScrollY = 0;
  let scrollVel = 0;

  function updateZigZagPath() {
    if (!zigzagPath) return;

    const heroHeight = window.innerHeight || 800;
    const progress = Math.min(1.2, Math.max(0, currentScrollY / (heroHeight * 0.75)));

    let d = 'M 0,0 ';

    for (let i = 0; i < baseZigZagPoints.length; i++) {
      const pt = baseZigZagPoints[i];
      let y = pt.y;

      if (!isReducedMotion) {
        const isValley = (pt.y > 100);
        const waveOffset = Math.sin(progress * Math.PI * 1.6 + i * 0.65) * 26;
        const velStretch = Math.min(30, Math.max(-30, scrollVel * 1.8));

        if (isValley) {
          y += waveOffset + velStretch;
        } else {
          y -= waveOffset * 0.4;
        }
      }

      d += `L ${pt.x},${y.toFixed(1)} `;
    }

    d += 'L 1440,0 Z';
    zigzagPath.setAttribute('d', d);
  }

  // =========================================================================
  // 4. CHECKERBOARD CURTAIN TRANSITION BETWEEN ABOUT 01 & ABOUT 02
  // =========================================================================
  function updateCheckerboardCurtain() {
    if (!checkerWrapper || !checkerCurtain || !aboutScreen1 || !aboutScreen2 || isReducedMotion) return;

    const winH = window.innerHeight || 800;
    const rect1 = aboutScreen1.getBoundingClientRect();
    const rect2 = aboutScreen2.getBoundingClientRect();

    // The transition window triggers as the user scrolls between About 01 and About 02
    const startY = rect1.top + rect1.height * 0.4;
    const endY = rect2.top + rect2.height * 0.3;
    const totalDist = Math.abs(endY - startY) || 1;

    // Progress from 0 (Screen 1 visible) to 1 (Screen 2 fully revealed)
    const rawProgress = (winH * 0.5 - startY) / totalDist;
    const progress = Math.min(1.15, Math.max(-0.15, rawProgress));

    if (progress > 0 && progress < 1.0) {
      checkerWrapper.style.display = 'block';

      if (progress <= 0.5) {
        // Curtain drops from above (-100% to 0%)
        const enterY = -100 + (progress / 0.5) * 100;
        checkerCurtain.style.transform = `translate3d(0, ${enterY.toFixed(2)}%, 0)`;
      } else {
        // Curtain retracts upward (0% to -100%) revealing Screen 02
        const exitY = -((progress - 0.5) / 0.5) * 100;
        checkerCurtain.style.transform = `translate3d(0, ${exitY.toFixed(2)}%, 0)`;
      }
    } else {
      checkerWrapper.style.display = 'none';
      checkerCurtain.style.transform = `translate3d(0, -100%, 0)`;
    }
  }

  window.addEventListener('scroll', () => {
    targetScrollY = window.scrollY || window.pageYOffset || 0;
  }, { passive: true });

  // =========================================================================
  // 5. HIDDEN GRAPHIC CANVAS REVEAL ENGINE
  // =========================================================================
  if (canvas) {
    const ctx = canvas.getContext('2d', { alpha: true });
    if (ctx) {
      const CONFIG = {
        baseRadius: 280,
        maxSpeedBonus: 65,
        lerpFactor: 0.32,
        enterSpeed: 0.38,
        decayRate: 0.962,
        pureWhite: 'rgba(255, 255, 255, ',
        brightOffWhite: 'rgba(248, 248, 250, ',
        crispLineColor: 'rgba(235, 235, 240, ',
        dimSpecimenColor: 'rgba(200, 200, 210, ',
      };

      let dpr = window.devicePixelRatio || 1;
      let width = 0;
      let height = 0;

      const mouse = {
        x: -1000,
        y: -1000,
        targetX: -1000,
        targetY: -1000,
        velX: 0,
        velY: 0,
        speed: 0,
        isActive: false,
      };

      const elements = [];

      function setupElements() {
        elements.length = 0;

        function add(relX, relY, drawFn, bounds = { w: 100, h: 40 }) {
          elements.push({
            relX,
            relY,
            x: relX * width,
            y: relY * height,
            w: bounds.w,
            h: bounds.h,
            alpha: 0,
            targetAlpha: 0,
            shiftX: 0,
            shiftY: 0,
            draw: drawFn,
          });
        }

        // Top-Left Region
        add(0.08, 0.12, (c, a, s) => {
          c.font = '700 11.5px "Space Mono", monospace';
          c.fillStyle = CONFIG.pureWhite + (a * 1.0) + ')';
          c.fillText('FIG. 01 — GRID SPECIMEN', s.x, s.y);
          
          c.strokeStyle = CONFIG.crispLineColor + (a * 0.75) + ')';
          c.lineWidth = 1;
          for (let i = 0; i <= 3; i++) {
            c.beginPath();
            c.moveTo(s.x, s.y + 12 + i * 14);
            c.lineTo(s.x + 130, s.y + 12 + i * 14);
            c.stroke();
          }
          for (let j = 0; j <= 4; j++) {
            c.beginPath();
            c.moveTo(s.x + j * 32.5, s.y + 12);
            c.lineTo(s.x + j * 32.5, s.y + 54);
            c.stroke();
          }
        });

        add(0.24, 0.10, (c, a, s) => {
          c.font = '800 17px "Syne", sans-serif';
          c.fillStyle = CONFIG.pureWhite + (a * 1.0) + ')';
          c.fillText('TYPE', s.x, s.y);
          c.font = '700 9.5px "Space Mono", monospace';
          c.fillStyle = CONFIG.brightOffWhite + (a * 0.88) + ')';
          c.fillText('TRACKING: +0.06em // OPTICAL', s.x, s.y + 15);
          c.font = '400 9px "Space Mono", monospace';
          c.fillStyle = CONFIG.dimSpecimenColor + (a * 0.78) + ')';
          c.fillText('WEIGHT: 800 EXTRA BOLD', s.x, s.y + 28);
        });

        add(0.12, 0.28, (c, a, s) => {
          c.font = 'italic 19px "Instrument Serif", Georgia, serif';
          c.fillStyle = CONFIG.pureWhite + (a * 0.98) + ')';
          c.fillText('Aa Bb Cc Dd Ee Ff Gg 01234', s.x, s.y);
          c.font = '700 9px "Space Mono", monospace';
          c.fillStyle = CONFIG.brightOffWhite + (a * 0.82) + ')';
          c.fillText('SWISS EDITORIAL SYSTEM · 1957', s.x, s.y + 18);
        });

        // Top-Right Region
        add(0.78, 0.11, (c, a, s) => {
          c.strokeStyle = CONFIG.crispLineColor + (a * 0.85) + ')';
          c.lineWidth = 1;
          c.beginPath();
          c.arc(s.x + 20, s.y + 20, 15, 0, Math.PI * 2);
          c.stroke();
          c.beginPath();
          c.moveTo(s.x + 20, s.y + 1);
          c.lineTo(s.x + 20, s.y + 39);
          c.moveTo(s.x + 1, s.y + 20);
          c.lineTo(s.x + 39, s.y + 20);
          c.stroke();
          
          c.font = '700 9.5px "Space Mono", monospace';
          c.fillStyle = CONFIG.pureWhite + (a * 0.95) + ')';
          c.fillText('REG. TARGET ⌖', s.x + 48, s.y + 16);
          c.font = '400 9px "Space Mono", monospace';
          c.fillStyle = CONFIG.dimSpecimenColor + (a * 0.8) + ')';
          c.fillText('PASS 01 // 300 DPI // CMYK', s.x + 48, s.y + 30);
        });

        add(0.88, 0.22, (c, a, s) => {
          c.font = '800 15px "Syne", sans-serif';
          c.fillStyle = CONFIG.pureWhite + (a * 1.0) + ')';
          c.fillText('SYSTEM', s.x, s.y);
          c.font = '700 9px "Space Mono", monospace';
          c.fillStyle = CONFIG.brightOffWhite + (a * 0.85) + ')';
          c.fillText('MODULAR MATRIX', s.x, s.y + 14);
          c.font = '400 8.5px "Space Mono", monospace';
          c.fillStyle = CONFIG.dimSpecimenColor + (a * 0.75) + ')';
          c.fillText('X: 890.4  Y: 112.8', s.x, s.y + 27);
        });

        add(0.68, 0.26, (c, a, s) => {
          c.font = '700 11.5px "Space Mono", monospace';
          c.fillStyle = CONFIG.pureWhite + (a * 0.95) + ')';
          c.fillText('φ = 1.6180339887', s.x, s.y);
          c.strokeStyle = CONFIG.crispLineColor + (a * 0.75) + ')';
          c.lineWidth = 1;
          c.beginPath();
          c.arc(s.x + 60, s.y + 30, 26, 0, Math.PI * 1.5);
          c.stroke();
          c.strokeRect(s.x + 34, s.y + 4, 52, 52);
        });

        // Mid-Left Region
        add(0.06, 0.48, (c, a, s) => {
          c.strokeStyle = CONFIG.crispLineColor + (a * 0.85) + ')';
          c.lineWidth = 1.2;
          c.beginPath();
          c.moveTo(s.x, s.y);
          c.lineTo(s.x, s.y + 44);
          c.moveTo(s.x - 5, s.y);
          c.lineTo(s.x + 5, s.y);
          c.moveTo(s.x - 5, s.y + 44);
          c.lineTo(s.x + 5, s.y + 44);
          c.stroke();

          c.font = '700 10px "Space Mono", monospace';
          c.fillStyle = CONFIG.pureWhite + (a * 0.98) + ')';
          c.fillText('↕ 120pt BASELINE', s.x + 14, s.y + 26);
        });

        add(0.18, 0.62, (c, a, s) => {
          c.font = '800 15px "Syne", sans-serif';
          c.fillStyle = CONFIG.pureWhite + (a * 1.0) + ')';
          c.fillText('FORM', s.x, s.y);
          c.font = '700 9px "Space Mono", monospace';
          c.fillStyle = CONFIG.brightOffWhite + (a * 0.88) + ')';
          c.fillText('TENSION & COUNTERFORM', s.x, s.y + 15);
          c.font = '400 8.5px "Space Mono", monospace';
          c.fillStyle = CONFIG.dimSpecimenColor + (a * 0.75) + ')';
          c.fillText('KERNING ADJUSTMENT: -12', s.x, s.y + 28);
        });

        add(0.10, 0.74, (c, a, s) => {
          c.font = 'italic 12px "Instrument Serif", Georgia, serif';
          c.fillStyle = CONFIG.pureWhite + (a * 0.95) + ')';
          c.fillText('* "Form follows concept with rigorous craft."', s.x, s.y);
          c.font = '700 8.5px "Space Mono", monospace';
          c.fillStyle = CONFIG.brightOffWhite + (a * 0.75) + ')';
          c.fillText('STUDIO PRINCIPLE NO. 04', s.x, s.y + 16);
        });

        // Mid-Right Region
        add(0.84, 0.46, (c, a, s) => {
          c.strokeStyle = CONFIG.crispLineColor + (a * 0.75) + ')';
          c.lineWidth = 1;
          c.strokeRect(s.x, s.y, 88, 54);
          c.beginPath();
          c.moveTo(s.x, s.y);
          c.lineTo(s.x + 88, s.y + 54);
          c.moveTo(s.x + 88, s.y);
          c.lineTo(s.x, s.y + 54);
          c.stroke();

          c.font = '700 9px "Space Mono", monospace';
          c.fillStyle = CONFIG.pureWhite + (a * 0.95) + ')';
          c.fillText('[ IMAGE 01: PLACEHOLDER ]', s.x, s.y + 70);
        });

        add(0.74, 0.64, (c, a, s) => {
          c.font = '800 15px "Syne", sans-serif';
          c.fillStyle = CONFIG.pureWhite + (a * 1.0) + ')';
          c.fillText('GRID', s.x, s.y);
          c.font = '700 9px "Space Mono", monospace';
          c.fillStyle = CONFIG.brightOffWhite + (a * 0.88) + ')';
          c.fillText('12-COL ASYMMETRIC', s.x, s.y + 15);
          c.font = '400 8.5px "Space Mono", monospace';
          c.fillStyle = CONFIG.dimSpecimenColor + (a * 0.75) + ')';
          c.fillText('GUTTER: 24px // MARGIN: 48px', s.x, s.y + 28);
        });

        add(0.86, 0.78, (c, a, s) => {
          c.font = '700 12px "Space Mono", monospace';
          c.fillStyle = CONFIG.pureWhite + (a * 0.98) + ')';
          c.fillText('✦ ✦ ✦', s.x, s.y);
          c.font = '700 9px "Space Mono", monospace';
          c.fillStyle = CONFIG.brightOffWhite + (a * 0.82) + ')';
          c.fillText('COLOR: CMYK 0/0/0/100', s.x, s.y + 15);
          c.font = '400 8.5px "Space Mono", monospace';
          c.fillStyle = CONFIG.dimSpecimenColor + (a * 0.72) + ')';
          c.fillText('HEX: #000000 // TRUE BLACK', s.x, s.y + 28);
        });

        // Bottom Region
        add(0.30, 0.88, (c, a, s) => {
          c.strokeStyle = CONFIG.crispLineColor + (a * 0.85) + ')';
          c.lineWidth = 1;
          c.beginPath();
          c.moveTo(s.x, s.y);
          c.lineTo(s.x + 220, s.y);
          for (let k = 0; k <= 220; k += 10) {
            const tickH = (k % 50 === 0) ? 12 : (k % 20 === 0 ? 7 : 3.5);
            c.moveTo(s.x + k, s.y);
            c.lineTo(s.x + k, s.y + tickH);
          }
          c.stroke();

          c.font = '700 8.5px "Space Mono", monospace';
          c.fillStyle = CONFIG.pureWhite + (a * 0.9) + ')';
          c.fillText('0mm', s.x, s.y + 22);
          c.fillText('50mm', s.x + 44, s.y + 22);
          c.fillText('100mm', s.x + 94, s.y + 22);
          c.fillText('200mm', s.x + 195, s.y + 22);
        });

        add(0.55, 0.89, (c, a, s) => {
          c.font = '800 15px "Syne", sans-serif';
          c.fillStyle = CONFIG.pureWhite + (a * 1.0) + ')';
          c.fillText('IDEA', s.x, s.y);
          c.font = '700 9px "Space Mono", monospace';
          c.fillStyle = CONFIG.brightOffWhite + (a * 0.88) + ')';
          c.fillText('CLARITY THROUGH REDUCTION', s.x, s.y + 14);
        });

        add(0.04, 0.92, (c, a, s) => {
          c.font = '700 8.5px "Space Mono", monospace';
          c.fillStyle = CONFIG.brightOffWhite + (a * 0.8) + ')';
          c.fillText('└ 00.00.00 — REF: 2026.ARCHIVE', s.x, s.y);
        });

        add(0.90, 0.92, (c, a, s) => {
          c.font = '700 8.5px "Space Mono", monospace';
          c.fillStyle = CONFIG.brightOffWhite + (a * 0.8) + ')';
          c.fillText('BLEED: 3.0mm ┘', s.x, s.y);
        });

        // Intermediate Accents
        add(0.48, 0.16, (c, a, s) => {
          c.font = '700 9.5px "Space Mono", monospace';
          c.fillStyle = CONFIG.pureWhite + (a * 0.9) + ')';
          c.fillText('+ CENTERLINE AXIS +', s.x, s.y);
          c.strokeStyle = CONFIG.crispLineColor + (a * 0.65) + ')';
          c.lineWidth = 1;
          c.beginPath();
          c.moveTo(s.x - 24, s.y - 3);
          c.lineTo(s.x + 150, s.y - 3);
          c.stroke();
        });

        add(0.38, 0.36, (c, a, s) => {
          c.font = '700 9.5px "Space Mono", monospace';
          c.fillStyle = CONFIG.pureWhite + (a * 0.92) + ')';
          c.fillText('K E R N I N G', s.x, s.y);
          c.font = '400 9px "Space Mono", monospace';
          c.fillStyle = CONFIG.dimSpecimenColor + (a * 0.75) + ')';
          c.fillText('·   ·   ·   ·   ·', s.x, s.y + 11);
        });

        add(0.60, 0.38, (c, a, s) => {
          c.font = 'italic 13px "Instrument Serif", Georgia, serif';
          c.fillStyle = CONFIG.pureWhite + (a * 0.92) + ')';
          c.fillText('Pure Geometry & Proportion', s.x, s.y);
        });
      }

      function resize() {
        dpr = window.devicePixelRatio || 1;
        width = window.innerWidth;
        height = window.innerHeight;

        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';

        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(dpr, dpr);

        setupElements();
      }

      window.addEventListener('resize', resize, { passive: true });

      window.addEventListener('mousemove', (e) => {
        mouse.targetX = e.clientX;
        mouse.targetY = e.clientY;
        if (canvasInteractionActive) mouse.isActive = true;
      }, { passive: true });

      window.addEventListener('mouseleave', () => {
        mouse.isActive = false;
      }, { passive: true });

      function render() {
        // 1. Update Scroll Lerp
        const prevScroll = currentScrollY;
        currentScrollY += (targetScrollY - currentScrollY) * 0.12;
        scrollVel = currentScrollY - prevScroll;

        // 2. Update Zig-Zag Break
        updateZigZagPath();

        // 3. Update Checkerboard Curtain Wipe
        updateCheckerboardCurtain();

        // 4. Update PRANNY Smoke/Ink Dissolve Effect
        if (canvasInteractionActive) {
          renderPrannySmoke();
        }

        // 5. Render Canvas Reveal on Hero
        if (canvasInteractionActive && currentScrollY < window.innerHeight * 1.2) {
          if (mouse.isActive) {
            const prevX = mouse.x;
            const prevY = mouse.y;

            mouse.x += (mouse.targetX - mouse.x) * CONFIG.lerpFactor;
            mouse.y += (mouse.targetY - mouse.y) * CONFIG.lerpFactor;

            mouse.velX = mouse.x - prevX;
            mouse.velY = mouse.y - prevY;
            mouse.speed = Math.hypot(mouse.velX, mouse.velY);
          } else {
            mouse.x += (-1000 - mouse.x) * CONFIG.lerpFactor;
            mouse.y += (-1000 - mouse.y) * CONFIG.lerpFactor;
            mouse.speed = 0;
          }

          const currentRadius = CONFIG.baseRadius + Math.min(CONFIG.maxSpeedBonus, mouse.speed * 2.2);

          ctx.clearRect(0, 0, width, height);

          for (let i = 0; i < elements.length; i++) {
            const el = elements[i];
            const posX = el.relX * width;
            const posY = el.relY * height;

            const dx = mouse.x - posX;
            const dy = mouse.y - posY;
            const dist = Math.hypot(dx, dy);

            if (dist < currentRadius && mouse.isActive) {
              const factor = 1 - (dist / currentRadius);
              el.targetAlpha = Math.min(1.0, Math.pow(factor, 1.25) * 1.35);

              el.shiftX += (-mouse.velX * 0.08 - el.shiftX) * 0.2;
              el.shiftY += (-mouse.velY * 0.08 - el.shiftY) * 0.2;
            } else {
              el.targetAlpha = 0;
              el.shiftX += (0 - el.shiftX) * 0.1;
              el.shiftY += (0 - el.shiftY) * 0.1;
            }

            if (el.targetAlpha > el.alpha) {
              el.alpha += (el.targetAlpha - el.alpha) * CONFIG.enterSpeed;
            } else {
              el.alpha *= CONFIG.decayRate;
            }

            if (el.alpha > 0.005) {
              const renderState = {
                x: posX + el.shiftX,
                y: posY + el.shiftY,
              };
              el.draw(ctx, Math.min(1.0, el.alpha), renderState);
            }
          }
        }

        // 6. Update 3D Perspective Gallery Physics
        if (typeof window.updateGalleryPhysics === 'function') {
          window.updateGalleryPhysics();
        }

        requestAnimationFrame(render);
      }

      resize();
      requestAnimationFrame(render);
    }
  }

  // =========================================================================
  // 6. SMOOTH MOVABLE 3D PERSPECTIVE GALLERY (INFINITE)
  // =========================================================================
  const galleryStage = document.getElementById('work-gallery-stage');
  const galleryPanels = document.querySelectorAll('.gallery-panel');
  const galleryCounter = document.getElementById('gallery-counter');
  const navDots = document.querySelectorAll('.nav-dot');
  const projectView = document.getElementById('project-view');
  const backToWorkBtn = document.getElementById('back-to-work');
  const backToWorkBottomBtn = document.getElementById('back-to-work-bottom');
  const lumaCaseStudy = document.getElementById('luma-case-study');
  const genericPlaceholder = document.getElementById('generic-project-placeholder');
  const pvNum = document.getElementById('pv-num');
  const pvTitle = document.getElementById('pv-title');
  const pvCat = document.getElementById('pv-cat');

  let lastActivePanel = null;

  function openProjectView(panel) {
    if (!projectView) return;
    lastActivePanel = panel;

    const num = panel.dataset.projNum || 'PROJECT';
    const title = (panel.dataset.projTitle || 'PROJECT').trim();
    const cat = panel.dataset.projCat || '';

    if (pvNum) pvNum.textContent = num;
    if (pvTitle) pvTitle.textContent = title;
    if (pvCat) pvCat.textContent = cat;

    if (title.toUpperCase() === 'LUMA') {
      if (lumaCaseStudy) lumaCaseStudy.style.display = 'block';
      if (genericPlaceholder) genericPlaceholder.style.display = 'none';
    } else {
      if (lumaCaseStudy) lumaCaseStudy.style.display = 'none';
      if (genericPlaceholder) genericPlaceholder.style.display = 'block';
    }

    projectView.classList.add('is-open');
    projectView.setAttribute('aria-hidden', 'false');
    projectView.scrollTop = 0;
    document.body.style.overflow = 'hidden';
  }

  function closeProjectView() {
    if (!projectView) return;

    projectView.classList.remove('is-open');
    projectView.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    if (lastActivePanel) {
      lastActivePanel.focus();
      lastActivePanel = null;
    }
  }

  if (backToWorkBtn) {
    backToWorkBtn.addEventListener('click', closeProjectView);
  }

  if (backToWorkBottomBtn) {
    backToWorkBottomBtn.addEventListener('click', closeProjectView);
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && projectView && projectView.classList.contains('is-open')) {
      closeProjectView();
    }
  });

  if (galleryStage && galleryPanels.length > 0) {
    const totalPanels = galleryPanels.length; // 12 panels (2 sets of 6)
    const uniqueProjects = 6;
    let progress = 0;
    let targetProgress = 0;
    let isDragging = false;
    let dragStartX = 0;
    let dragStartProgress = 0;
    let lastDragX = 0;
    let lastDragTime = 0;
    let dragVelocity = 0;
    let dragDistance = 0;
    let mouseParallaxX = 0;
    let mouseParallaxY = 0;
    let wheelTimeout = null;

    function getSpacing() {
      const w = window.innerWidth || 1200;
      if (w <= 640) return w * 0.72;
      if (w <= 900) return w * 0.52;
      return Math.min(520, w * 0.40);
    }

    function updateIndicator(projectIndex) {
      const displayIndex = projectIndex + 1;
      const formatted = displayIndex < 10 ? `0${displayIndex}` : `${displayIndex}`;
      if (galleryCounter) {
        galleryCounter.textContent = `${formatted} / 0${uniqueProjects}`;
      }

      navDots.forEach((dot, i) => {
        if (i === projectIndex) {
          dot.classList.add('is-active');
        } else {
          dot.classList.remove('is-active');
        }
      });
    }

    function renderGallery() {
      const spacingX = getSpacing();
      const modProgress = ((progress % totalPanels) + totalPanels) % totalPanels;

      galleryPanels.forEach((panel, i) => {
        let offset = i - modProgress;
        if (offset > totalPanels / 2) offset -= totalPanels;
        if (offset < -totalPanels / 2) offset += totalPanels;

        const absOffset = Math.abs(offset);

        const translateX = offset * spacingX;
        const translateZ = -Math.min(600, Math.pow(absOffset, 1.15) * 160);
        
        let rotY = Math.max(-45, Math.min(45, -offset * 18));
        let rotX = 0;

        if (absOffset < 0.6) {
          const focusBlend = 1 - (absOffset / 0.6);
          rotY += mouseParallaxX * focusBlend;
          rotX += mouseParallaxY * focusBlend;
        }

        const scale = Math.max(0.64, 1 - absOffset * 0.16);
        const opacity = Math.max(0, 1 - Math.pow(absOffset / 3.4, 2));
        const zIndex = Math.max(1, Math.round((10 - absOffset) * 100));

        panel.style.transform = `translate3d(${translateX.toFixed(2)}px, 0px, ${translateZ.toFixed(2)}px) rotateY(${rotY.toFixed(2)}deg) rotateX(${rotX.toFixed(2)}deg) scale(${scale.toFixed(3)})`;
        panel.style.opacity = opacity.toFixed(3);
        panel.style.zIndex = zIndex;
        panel.style.pointerEvents = opacity > 0.05 ? 'auto' : 'none';

        // Dynamic shadow depth
        const shadow = panel.querySelector('.panel-shadow');
        if (shadow) {
          const shadowOpacity = Math.max(0, 0.95 - absOffset * 0.32);
          shadow.style.opacity = shadowOpacity.toFixed(3);
        }
      });
    }

    // Disable default browser ghost dragging of images/links in 3D gallery
    galleryStage.addEventListener('dragstart', (e) => e.preventDefault());

    let isPointerDown = false;
    let isRealDrag = false;
    let dragStartY = 0;

    // Pointer events for smooth infinite drag
    galleryStage.addEventListener('pointerdown', (e) => {
      if (e.button !== 0 && e.pointerType === 'mouse') return;
      isPointerDown = true;
      isRealDrag = false;
      dragStartX = e.clientX;
      dragStartY = e.clientY;
      lastDragX = e.clientX;
      dragStartProgress = targetProgress;
      lastDragTime = performance.now();
      dragVelocity = 0;
      dragDistance = 0;
    });

    window.addEventListener('pointermove', (e) => {
      const rect = galleryStage.getBoundingClientRect();
      if (e.clientY >= rect.top && e.clientY <= rect.bottom && !isRealDrag) {
        const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const normY = ((e.clientY - rect.top) / rect.height) * 2 - 1;
        mouseParallaxX = normX * 3.5;
        mouseParallaxY = -normY * 2.5;
      } else if (!isRealDrag) {
        mouseParallaxX *= 0.9;
        mouseParallaxY *= 0.9;
      }

      if (!isPointerDown) return;

      const currentX = e.clientX;
      const currentY = e.clientY;
      const dx = currentX - dragStartX;
      const dy = currentY - dragStartY;
      dragDistance = Math.hypot(dx, dy);

      if (dragDistance > 10) {
        isRealDrag = true;
        galleryStage.classList.add('is-dragging');

        const spacingX = getSpacing();
        targetProgress = dragStartProgress - (dx / spacingX);

        const now = performance.now();
        const dt = Math.max(1, now - lastDragTime);
        dragVelocity = (currentX - lastDragX) / dt;
        lastDragX = currentX;
        lastDragTime = now;
      }
    });

    function endDrag(e) {
      if (!isPointerDown) return;
      isPointerDown = false;
      galleryStage.classList.remove('is-dragging');

      if (isRealDrag) {
        const spacingX = getSpacing();
        let projected = targetProgress - (dragVelocity * 180) / spacingX;
        targetProgress = Math.round(projected);
      }

      // Reset isRealDrag after click event dispatch cycle completes
      setTimeout(() => {
        isRealDrag = false;
        dragDistance = 0;
      }, 120);
    }

    window.addEventListener('pointerup', endDrag);
    window.addEventListener('pointercancel', (e) => {
      endDrag(e);
      isRealDrag = false;
      dragDistance = 0;
    });

    // Mouse Wheel / Trackpad smooth scroll inside gallery
    galleryStage.addEventListener('wheel', (e) => {
      if (projectView && projectView.classList.contains('is-open')) return;

      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (Math.abs(delta) < 1) return;

      e.preventDefault();

      targetProgress += (delta * 0.0018);

      clearTimeout(wheelTimeout);
      wheelTimeout = setTimeout(() => {
        targetProgress = Math.round(targetProgress);
      }, 160);
    }, { passive: false });

    // Panel activation logic
    let lastPanelActivationTime = 0;
    function handlePanelActivation(panel, e) {
      if (isRealDrag) {
        if (e && typeof e.preventDefault === 'function') e.preventDefault();
        return;
      }

      // If panel is a native anchor link (e.g. LUMA a.gallery-panel), let browser handle native navigation
      if (panel.tagName === 'A' || panel.closest('a[href]')) {
        return;
      }

      const now = performance.now();
      if (now - lastPanelActivationTime < 250) return;
      lastPanelActivationTime = now;

      const index = Array.from(galleryPanels).indexOf(panel);
      if (index === -1) return;

      const modProgress = ((progress % totalPanels) + totalPanels) % totalPanels;
      let offset = index - modProgress;
      if (offset > totalPanels / 2) offset -= totalPanels;
      if (offset < -totalPanels / 2) offset += totalPanels;

      if (Math.abs(offset) <= 0.35) {
        openProjectView(panel);
      } else {
        if (e && typeof e.preventDefault === 'function') e.preventDefault();
        targetProgress += offset;
      }
    }

    // Panel click & keyboard interaction
    galleryPanels.forEach((panel) => {
      panel.addEventListener('click', (e) => {
        if (isRealDrag) {
          e.preventDefault();
          e.stopPropagation();
          return;
        }
        handlePanelActivation(panel, e);
      });

      panel.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          if (panel.tagName === 'A') return; // native link handles Enter
          e.preventDefault();
          handlePanelActivation(panel, null);
        }
      });
    });

    // Delegated click handler on galleryStage as a fail-safe
    galleryStage.addEventListener('click', (e) => {
      if (isRealDrag) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      const panel = e.target.closest('.gallery-panel');
      if (panel) {
        handlePanelActivation(panel, e);
      }
    });

    // Nav dots click
    navDots.forEach((dot, k) => {
      dot.addEventListener('click', () => {
        const currentActive = ((Math.round(targetProgress) % uniqueProjects) + uniqueProjects) % uniqueProjects;
        let diff = k - currentActive;
        if (diff > uniqueProjects / 2) diff -= uniqueProjects;
        if (diff < -uniqueProjects / 2) diff += uniqueProjects;
        targetProgress += diff;
      });
    });

    // Keyboard arrow keys
    window.addEventListener('keydown', (e) => {
      const rect = galleryStage.getBoundingClientRect();
      const winH = window.innerHeight || 800;
      if (rect.top < winH && rect.bottom > 0 && !(projectView && projectView.classList.contains('is-open'))) {
        if (e.key === 'ArrowRight') {
          targetProgress = Math.round(targetProgress) + 1;
        } else if (e.key === 'ArrowLeft') {
          targetProgress = Math.round(targetProgress) - 1;
        }
      }
    });

    // Animation physics loop
    window.updateGalleryPhysics = function () {
      if (!isDragging) {
        const snapTarget = Math.round(targetProgress);
        targetProgress += (snapTarget - targetProgress) * 0.08;
      }

      const diff = targetProgress - progress;
      progress += diff * 0.12;

      const activeProjectIndex = ((Math.round(progress) % uniqueProjects) + uniqueProjects) % uniqueProjects;
      updateIndicator(activeProjectIndex);

      renderGallery();
    };
  }

  // =========================================================================
  // 7. EDITORIAL FRAME SLIDE PAGE TRANSITION TO WORK
  // =========================================================================
  const editorialSlideOverlay = document.getElementById('editorial-slide');
  const workSection = document.getElementById('work');
  let isSlideTransitioning = false;

  function triggerEditorialFrameSlide(e) {
    console.log('[EDITORIAL FRAME SLIDE] 1. WORK navigation click detected on element:', e ? e.target : 'programmatic');
    if (!workSection) {
      console.error('[EDITORIAL FRAME SLIDE] ERROR: #work section element not found in DOM!');
      return;
    }

    if (e) {
      e.preventDefault();
      e.stopPropagation();
      if (typeof e.stopImmediatePropagation === 'function') {
        e.stopImmediatePropagation();
      }
    }

    if (isSlideTransitioning) {
      console.log('[EDITORIAL FRAME SLIDE] Transition already in progress, ignoring duplicate click.');
      return;
    }
    isSlideTransitioning = true;

    if (!editorialSlideOverlay) {
      console.error('[EDITORIAL FRAME SLIDE] ERROR: #editorial-slide overlay element not found in DOM!');
      return;
    }
    console.log('[EDITORIAL FRAME SLIDE] 2. #editorial-slide overlay found:', editorialSlideOverlay);

    // Phase 1: Rapid sweep in from the right (0ms - 280ms)
    editorialSlideOverlay.classList.remove('is-active');
    void editorialSlideOverlay.offsetWidth; // Force reflow
    editorialSlideOverlay.classList.add('is-active');
    console.log('[EDITORIAL FRAME SLIDE] 3. .is-active class added to overlay');

    // Read and log computed styles immediately after activation
    const computed = window.getComputedStyle(editorialSlideOverlay);
    console.log('[EDITORIAL FRAME SLIDE] 4. Computed styles of #editorial-slide immediately after activation:', {
      display: computed.display,
      visibility: computed.visibility,
      opacity: computed.opacity,
      zIndex: computed.zIndex,
      position: computed.position
    });

    // Phase 2: Snap viewport to Work section during full coverage hold (~400ms)
    setTimeout(() => {
      const workTop = workSection.getBoundingClientRect().top + (window.pageYOffset || document.documentElement.scrollTop || 0);
      console.log(`[EDITORIAL FRAME SLIDE] 5. Moving viewport to #work (scrollY: ${workTop}px) behind solid panel`);

      const prevHtmlScroll = document.documentElement.style.scrollBehavior;
      const prevBodyScroll = document.body.style.scrollBehavior;
      document.documentElement.style.scrollBehavior = 'auto';
      document.body.style.scrollBehavior = 'auto';

      window.scrollTo(0, workTop);

      setTimeout(() => {
        document.documentElement.style.scrollBehavior = prevHtmlScroll || '';
        document.body.style.scrollBehavior = prevBodyScroll || '';
      }, 100);

      // Synchronize smooth-scroll lerp physics state
      targetScrollY = workTop;
      currentScrollY = workTop;
      scrollVel = 0;

      // Refresh transitional screen dividers
      updateZigZagPath();
      updateCheckerboardCurtain();
    }, 400);

    // Phase 3 Completion: Panel exits to the left, revealing live Work gallery (~820ms)
    setTimeout(() => {
      if (editorialSlideOverlay) {
        editorialSlideOverlay.classList.remove('is-active');
      }
      isSlideTransitioning = false;
      console.log('[EDITORIAL FRAME SLIDE] 6. Transition complete. .is-active removed.');

      if (history.pushState) {
        history.pushState(null, '', '#work');
      }
    }, 820);
  }

  // Bind to nav links and document delegation with capture phase
  const workNavLinks = document.querySelectorAll('a[href="#work"], a[href$="#work"], .nav-link[href="#work"], [data-nav="work"]');
  workNavLinks.forEach(link => {
    link.addEventListener('click', triggerEditorialFrameSlide, { capture: true });
  });

  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href="#work"], a[href$="#work"]');
    if (link) {
      triggerEditorialFrameSlide(e);
    }
  }, { capture: true });

  // Contact Section "Final Reveal" Entrance Observer
  function initContactRevealObserver() {
    const contactSection = document.getElementById('contact');
    if (!contactSection) return;

    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      contactSection.classList.add('is-revealed');
      return;
    }

    // Check if section is already in or near viewport (e.g. hash link or short page)
    const rect = contactSection.getBoundingClientRect();
    if (rect.top <= window.innerHeight + 100) {
      contactSection.classList.add('is-revealed');
      return;
    }

    // Arm the animation only when section is cleanly below viewport
    contactSection.classList.add('reveal-armed');

    if ('IntersectionObserver' in window) {
      const contactObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting || entry.intersectionRatio > 0) {
            contactSection.classList.add('is-revealed');
            observer.unobserve(contactSection);
          }
        });
      }, {
        root: null,
        threshold: [0, 0.05, 0.1],
        rootMargin: '120px 0px 0px 0px'
      });
      contactObserver.observe(contactSection);

      // Scroll listener fallback
      const onScrollCheck = () => {
        const r = contactSection.getBoundingClientRect();
        if (r.top <= window.innerHeight + 80) {
          contactSection.classList.add('is-revealed');
          window.removeEventListener('scroll', onScrollCheck);
        }
      };
      window.addEventListener('scroll', onScrollCheck, { passive: true });

      // Absolute safety timer: ensure content is revealed regardless after 3s
      setTimeout(() => {
        contactSection.classList.add('is-revealed');
      }, 3000);
    } else {
      contactSection.classList.add('is-revealed');
    }
  }

  // Run the Opening Sequence on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      runLetterFallSequence();
      initContactRevealObserver();
    });
  } else {
    runLetterFallSequence();
    initContactRevealObserver();
  }

})();
