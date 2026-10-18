import { Injectable, NgZone, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);

/**
 * One owner for scroll and motion.
 *
 * Scrolling is the browser's own. A JS smooth-scroll layer (Lenis) was tried
 * and removed: on Windows, Chrome's scrolling thread could move the page a
 * frame before the script pulled it back, which showed as the whole page
 * jumping ahead and snapping back. Native scrolling is already smooth there,
 * and ScrollTrigger reads it directly.
 *
 * Everything runs outside Angular's zone: a 60fps loop must never trigger
 * change detection.
 */
@Injectable({ providedIn: 'root' })
export class MotionService {
  private zone = inject(NgZone);
  private router = inject(Router);
  private started = false;

  /** True when the visitor asked the OS for less motion. */
  readonly reduced =
    typeof window !== 'undefined' &&
    !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  /** Smoothed scroll velocity in px per frame, for effects that lean into speed. */
  velocity = 0;

  start(): void {
    if (typeof window === 'undefined' || this.started || this.reduced) return;
    this.started = true;

    this.zone.runOutsideAngular(() => {
      // Velocity is measured once per frame from the native position and eased,
      // so effects that follow it (the sources belt) never jerk on one wheel notch.
      let lastY = window.scrollY;
      gsap.ticker.add((_time, deltaMs) => {
        const frames = Math.max(deltaMs / (1000 / 60), 0.25);
        const raw = (window.scrollY - lastY) / frames;
        lastY = window.scrollY;
        this.velocity += (raw - this.velocity) * 0.2;
      });

      // A phone's address bar showing and hiding is not a real resize; re-measuring on it jumps the page.
      ScrollTrigger.config({ ignoreMobileResize: true });

      // Triggers are measured on first paint, before the webfonts arrive. When the
      // display face swaps in, headings change height and every pin below them
      // would start a few pixels off. So re-measure once the fonts are in, and
      // whenever the page height changes.
      document.fonts?.ready.then(() => ScrollTrigger.refresh());

      let height = document.body.scrollHeight;
      let pending: ReturnType<typeof setTimeout> | undefined;
      new ResizeObserver(() => {
        clearTimeout(pending);
        pending = setTimeout(() => {
          const next = document.body.scrollHeight;
          if (Math.abs(next - height) > 1) {
            height = next;
            ScrollTrigger.refresh();
          }
        }, 150);
      }).observe(document.body);
    });

    // A route change swaps the whole page, so every trigger has to re-measure.
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => requestAnimationFrame(() => ScrollTrigger.refresh()));
  }
}

export { gsap, ScrollTrigger, SplitText };
