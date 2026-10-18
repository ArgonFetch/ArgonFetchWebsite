import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  ViewChild,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MotionService, gsap, SplitText } from '../motion/motion.service';

interface Step {
  title: string;
  body: string;
}

/** Deterministic bar heights, so the waveform looks like audio and never reshuffles. */
const BARS = Array.from({ length: 44 }, (_, i) => {
  const envelope = Math.sin((i / 43) * Math.PI) * 0.7 + 0.3;
  const jitter = (Math.sin(i * 12.9898) * 43758.5453) % 1;
  return +(envelope * (0.45 + Math.abs(jitter) * 0.55)).toFixed(3);
});

@Component({
  selector: 'app-usage',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './usage.component.html',
  styleUrl: './usage.component.scss',
})
export class UsageComponent implements AfterViewInit, OnDestroy {
  readonly motion = inject(MotionService);
  private zone = inject(NgZone);
  private cdr = inject(ChangeDetectorRef);

  @ViewChild('section', { static: true }) section!: ElementRef<HTMLElement>;
  @ViewChild('pin', { static: true }) pin!: ElementRef<HTMLElement>;
  @ViewChild('railFill', { static: true }) railFill!: ElementRef<HTMLElement>;
  @ViewChild('url', { static: true }) url!: ElementRef<HTMLElement>;
  @ViewChild('wave', { static: true }) wave!: ElementRef<HTMLElement>;
  @ViewChild('picks', { static: true }) picks!: ElementRef<HTMLElement>;
  @ViewChild('file', { static: true }) file!: ElementRef<HTMLElement>;
  @ViewChild('progress', { static: true }) progress!: ElementRef<HTMLElement>;
  @ViewChild('downloading', { static: true }) downloading!: ElementRef<HTMLElement>;
  @ViewChild('saved', { static: true }) saved!: ElementRef<HTMLElement>;

  readonly bars = BARS;

  // A real sequence - you cannot pick a format before the link resolves.
  readonly steps: Step[] = [
    {
      title: 'Paste the link',
      body: 'Copy the address of the video or track and drop it into the field. ArgonFetch reads the source and tells you what it found.',
    },
    {
      title: 'Pick a format',
      body: 'Full-resolution video, audio only, or whatever else the source offers. You choose the container and the quality.',
    },
    {
      title: 'Download',
      body: 'The file transfers to your machine and it is yours. Nothing is kept, queued or reported anywhere afterwards.',
    },
  ];

  /** Which step the scroll position is on. With reduced motion every step shows at once. */
  active = 0;

  private ctx?: gsap.Context;

  ngAfterViewInit(): void {
    if (this.motion.reduced) return;
    this.zone.runOutsideAngular(() => {
      this.ctx = gsap.context(() => this.choreograph(), this.section.nativeElement);
    });
  }

  ngOnDestroy(): void {
    this.ctx?.revert();
  }

  private setActive(index: number): void {
    if (index === this.active) return;
    // Only this section changes, so only this section is checked; the rest of
    // the app is left alone mid-scroll.
    this.active = index;
    this.cdr.detectChanges();
  }

  /**
   * Scroll is the playhead. The section pins for a few screens while the same
   * object passes through three states: the address breaks apart into signal,
   * a format is picked, and the signal collapses into a file that fills up.
   */
  private choreograph(): void {
    const chars = new SplitText(this.url.nativeElement, { type: 'chars' }).chars;
    const bars = this.wave.nativeElement.children;
    const picks = this.picks.nativeElement.children;

    gsap.set(bars, { scaleY: 0 });
    gsap.set(picks, { opacity: 0, y: 12 });
    gsap.set(this.file.nativeElement, { clipPath: 'inset(0 100% 0 0 round 20px)' });
    gsap.set(this.progress.nativeElement, { scaleX: 0 });
    gsap.set(this.railFill.nativeElement, { scaleX: 0 });
    gsap.set(this.downloading.nativeElement, { opacity: 1 });

    const tl = gsap.timeline({
      defaults: { ease: 'power3.inOut' },
      scrollTrigger: {
        trigger: this.pin.nativeElement,
        start: 'top top',
        end: '+=260%',
        pin: true,
        scrub: 0.8,
        onUpdate: (self) => this.setActive(self.progress < 0.36 ? 0 : self.progress < 0.68 ? 1 : 2),
      },
    });

    tl.to(this.railFill.nativeElement, { scaleX: 1, ease: 'none', duration: 3 }, 0)
      // 1 -> 2: the address scatters and becomes signal.
      .to(chars, {
        opacity: 0,
        y: () => gsap.utils.random(-120, 120),
        x: () => gsap.utils.random(-40, 40),
        rotate: () => gsap.utils.random(-50, 50),
        stagger: { each: 0.012, from: 'random' },
        duration: 0.6,
      }, 0.35)
      .to(bars, { scaleY: 1, stagger: { each: 0.01, from: 'center' }, duration: 0.5 }, 0.5)
      .to(picks, { opacity: 1, y: 0, stagger: 0.08, duration: 0.35 }, 1.0)
      // 2 -> 3: the signal collapses into a file.
      .to(bars, { scaleY: 0, stagger: { each: 0.008, from: 'edges' }, duration: 0.45 }, 1.75)
      .to(picks, { opacity: 0, y: -12, stagger: 0.05, duration: 0.3 }, 1.75)
      .to(this.file.nativeElement, { clipPath: 'inset(0 0% 0 0 round 20px)', duration: 0.5 }, 2.0)
      .to(this.progress.nativeElement, { scaleX: 1, ease: 'none', duration: 0.6 }, 2.3)
      .to(this.downloading.nativeElement, { opacity: 0, duration: 0.1 }, 2.9)
      .fromTo(this.saved.nativeElement, { opacity: 0 }, { opacity: 1, duration: 0.1 }, 2.9);
  }
}
