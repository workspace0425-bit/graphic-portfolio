/**
 * Global Project View Scale Component
 * Allows recruiters to adjust the presentation scale of project content.
 */
(function() {
  'use strict';

  const MIN_SCALE = 0.6;   // 60%
  const MAX_SCALE = 1.3;   // 130%
  const STEP = 0.10;       // 10% step
  const STORAGE_KEY = 'pranny_project_view_scale';

  let currentScale = 1.0;
  let mainTarget = null;
  let indicatorEl = null;
  let minusBtn = null;
  let plusBtn = null;
  let resetBtn = null;

  // Restore saved scale if available
  try {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = parseFloat(saved);
      if (!isNaN(parsed) && parsed >= MIN_SCALE && parsed <= MAX_SCALE) {
        currentScale = Math.round(parsed * 100) / 100;
      }
    }
  } catch (e) {
    // SessionStorage restricted
  }

  function init() {
    mainTarget = document.querySelector('main') || document.querySelector('.luma-container, .velora-container, .mm-container, .exp-container, .moffee-container, .ns-container');
    if (!mainTarget) return;

    createControlWidget();
    applyScale(currentScale, false);
    attachGestures();
  }

  function createControlWidget() {
    if (document.getElementById('viewScaleControl')) return;

    const control = document.createElement('div');
    control.className = 'view-scale-control';
    control.id = 'viewScaleControl';
    control.setAttribute('role', 'region');
    control.setAttribute('aria-label', 'Project View Scale');

    control.innerHTML = `
      <button class="vsc-btn vsc-minus" id="vscMinus" aria-label="Reduce View Scale" title="Zoom Out (Ctrl + Scroll Down)">−</button>
      <span class="vsc-indicator" id="vscValue" title="Current scale (Click to Reset)">100%</span>
      <button class="vsc-btn vsc-plus" id="vscPlus" aria-label="Increase View Scale" title="Zoom In (Ctrl + Scroll Up)">+</button>
      <button class="vsc-reset-btn" id="vscReset" aria-label="Reset View Scale">RESET</button>
      <div class="vsc-hint">Ctrl + Scroll to zoom</div>
    `;

    document.body.appendChild(control);

    minusBtn = document.getElementById('vscMinus');
    plusBtn = document.getElementById('vscPlus');
    indicatorEl = document.getElementById('vscValue');
    resetBtn = document.getElementById('vscReset');

    minusBtn.addEventListener('click', () => adjustScale(-STEP));
    plusBtn.addEventListener('click', () => adjustScale(STEP));
    indicatorEl.addEventListener('click', () => resetScale());
    resetBtn.addEventListener('click', () => resetScale());
  }

  function applyScale(scale, animate = true) {
    // Clamp scale to bounds
    scale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, Math.round(scale * 100) / 100));
    currentScale = scale;

    if (!mainTarget) return;

    // Apply scale to main project container
    if ('zoom' in mainTarget.style) {
      mainTarget.style.zoom = scale.toString();
    } else {
      mainTarget.style.transform = `scale(${scale})`;
      mainTarget.style.transformOrigin = 'top center';
    }

    // Update UI elements
    const percentStr = Math.round(scale * 100) + '%';
    if (indicatorEl) {
      indicatorEl.textContent = percentStr;
    }

    if (minusBtn) {
      minusBtn.disabled = (scale <= MIN_SCALE);
    }
    if (plusBtn) {
      plusBtn.disabled = (scale >= MAX_SCALE);
    }

    if (resetBtn) {
      if (Math.abs(scale - 1.0) < 0.01) {
        resetBtn.classList.add('is-default');
      } else {
        resetBtn.classList.remove('is-default');
      }
    }

    // Save preference
    try {
      sessionStorage.setItem(STORAGE_KEY, scale.toString());
    } catch (e) {}
  }

  function adjustScale(delta) {
    applyScale(currentScale + delta, true);
  }

  function resetScale() {
    applyScale(1.0, true);
  }

  function attachGestures() {
    // 1. Mouse wheel + Ctrl/Meta modifier zoom
    window.addEventListener('wheel', function(e) {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const delta = e.deltaY < 0 ? 0.05 : -0.05;
        adjustScale(delta);
      }
    }, { passive: false });

    // 2. Trackpad gesture (WebKit/Safari)
    let initialGestureScale = 1.0;
    document.addEventListener('gesturestart', function(e) {
      initialGestureScale = currentScale;
      e.preventDefault();
    });

    document.addEventListener('gesturechange', function(e) {
      e.preventDefault();
      applyScale(initialGestureScale * e.scale, false);
    });

    // 3. Touch 2-finger pinch gesture on mobile
    let touchStartDist = 0;
    let touchStartScale = 1.0;

    window.addEventListener('touchstart', function(e) {
      if (e.touches.length === 2) {
        touchStartDist = Math.hypot(
          e.touches[0].pageX - e.touches[1].pageX,
          e.touches[0].pageY - e.touches[1].pageY
        );
        touchStartScale = currentScale;
      }
    }, { passive: true });

    window.addEventListener('touchmove', function(e) {
      if (e.touches.length === 2 && touchStartDist > 0) {
        const currentDist = Math.hypot(
          e.touches[0].pageX - e.touches[1].pageX,
          e.touches[0].pageY - e.touches[1].pageY
        );
        const factor = currentDist / touchStartDist;
        applyScale(touchStartScale * factor, false);
      }
    }, { passive: true });

    window.addEventListener('touchend', function(e) {
      if (e.touches.length < 2) {
        touchStartDist = 0;
      }
    }, { passive: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
