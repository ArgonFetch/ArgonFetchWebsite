import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { LucideAngularModule, Download, Play, Link, X, Search, LoaderCircle, Sun, ChevronRight } from 'lucide-angular';
import { DischargeComponent } from './discharge/discharge.component';
import { MotionService, gsap, SplitText } from '../motion/motion.service';

/** One downloadable variant, as a row in the app's format menu. */
interface Rendition {
  /** Resolution or bitrate, the row's lead label. */
  label: string;
  /** Container tag. */
  container: string;
  /** "fast" streams the source as-is; "slow" has to be merged or converted first. */
  speed: 'fast' | 'slow';
  /** File size, or "converted" when it is only known after transcoding. */
  size: string;
}

/**
 * One pass of the hero demo: a link goes in, the app resolves it, and the
 * format menu opens. Markup and colours mirror the real app at
 * app.argonfetch.dev, so the demo looks like the thing you will actually use.
 */
interface Resolution {
  /** The link as the user would paste it. */
  url: string;
  /** Illustrative title. Deliberately generic - this is a UI demo, not a catalogue. */
  title: string;
  /** The uploader or artist line under the title. */
  author: string;
  /** Cover artwork, as the source would hand it back. */
  cover: string;
  /** Which branch of the format menu opens. */
  kind: 'Video' | 'Audio';
  renditions: Rendition[];
  /** The row the demo's pointer settles on. */
  pick: number;
}

type Phase = 'typing' | 'resolving' | 'resolved' | 'picking';

const RESOLUTIONS: Resolution[] = [
  {
    url: 'https://www.youtube.com/watch?v=aVn8Nq2Kd1s',
    title: 'Live Session - Full Set',
    author: 'Northbound Live',
    cover: 'covers/cover-live-session.jpg',
    kind: 'Video',
    renditions: [
      { label: '2160p (4K)', container: 'MP4', speed: 'slow', size: '689 MB' },
      { label: '1080p', container: 'MP4', speed: 'slow', size: '255 MB' },
      { label: '360p', container: 'MP4', speed: 'slow', size: '27 MB' },
    ],
    pick: 1,
  },
  {
    // Spotify links are looked up for metadata; the audio comes from YouTube Music.
    url: 'https://open.spotify.com/track/2n4kUvIPfx',
    title: 'Midnight Drive',
    author: 'Halcyon Avenue',
    cover: 'covers/cover-midnight-drive.jpg',
    kind: 'Audio',
    renditions: [
      { label: '129 kbps', container: 'WEBM', speed: 'fast', size: '3.6 MB' },
      { label: '129 kbps', container: 'M4A', speed: 'fast', size: '3.6 MB' },
      { label: '192 kbps', container: 'MP3', speed: 'slow', size: 'converted' },
    ],
    pick: 2,
  },
  {
    url: 'https://soundcloud.com/label/field-rec-4',
    title: 'Field Recording No. 4',
    author: 'Quiet Label',
    cover: 'covers/cover-field-rec.jpg',
    kind: 'Audio',
    renditions: [
      { label: '128 kbps', container: 'MP3', speed: 'fast', size: '11.6 MB' },
      { label: '64 kbps', container: 'OPUS', speed: 'fast', size: '5.8 MB' },
      { label: '192 kbps', container: 'MP3', speed: 'slow', size: 'converted' },
    ],
    pick: 0,
  },
];

// Beat lengths for one full pass, in milliseconds.
const TYPE_SPEED = 24;
const PAUSE_AFTER_TYPING = 380;
const RESOLVE_TIME = 900;
const BEFORE_MENU = 750;
const HOLD_MENU = 2900;

@Component({
  selector: 'app-hero',
  imports: [CommonModule, FontAwesomeModule, LucideAngularModule, DischargeComponent],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
})
export class HeroComponent implements OnInit, AfterViewInit, OnDestroy {
  // Font Awesome carries company marks only; everything else is Lucide.
  faGithub = faGithub;

  readonly DownloadIcon = Download;
  readonly PlayIcon = Play;
  readonly LinkIcon = Link;
  readonly XIcon = X;
  readonly SearchIcon = Search;
  readonly LoaderIcon = LoaderCircle;
  readonly SunIcon = Sun;
  readonly ChevronIcon = ChevronRight;
  readonly menuKinds = ['Video', 'Audio'] as const;

  readonly motion = inject(MotionService);
  private zone = inject(NgZone);

  @ViewChild('hero', { static: true }) heroRef!: ElementRef<HTMLElement>;
  @ViewChild('lineA', { static: true }) lineA!: ElementRef<HTMLElement>;
  @ViewChild('lineB', { static: true }) lineB!: ElementRef<HTMLElement>;
  @ViewChild('foot', { static: true }) foot!: ElementRef<HTMLElement>;
  @ViewChild('discharge', { static: true }) discharge!: DischargeComponent;

  private ctx?: gsap.Context;
  private resizeObserver?: ResizeObserver;

  phase: Phase = 'typing';
  typedUrl = '';
  index = 0;

  private timer?: ReturnType<typeof setTimeout>;
  private stopped = false;

  constructor(private cdr: ChangeDetectorRef) {}

  get current(): Resolution {
    return RESOLUTIONS[this.index];
  }

  ngOnInit(): void {
    // With reduced motion the panel still tells the story - it just shows the
    // finished state instead of performing it.
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      this.typedUrl = this.current.url;
      this.phase = 'picking';
      return;
    }

    // The demo ticks every few dozen milliseconds. Outside the zone, each tick
    // re-renders only this component instead of the whole app.
    this.zone.runOutsideAngular(() => this.runTypingPass());
  }

  ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => {
      // Keep both electrodes aimed at the gap between the two headline lines.
      this.resizeObserver = new ResizeObserver(() => this.aimElectrodes());
      this.resizeObserver.observe(this.heroRef.nativeElement);
      this.aimElectrodes();

      if (this.motion.reduced) {
        this.discharge.charge = 1;
        return;
      }

      this.ctx = gsap.context(() => this.choreograph(), this.heroRef.nativeElement);
    });
  }

  ngOnDestroy(): void {
    this.stopped = true;
    clearTimeout(this.timer);
    this.ctx?.revert();
    this.resizeObserver?.disconnect();
  }

  private aimElectrodes(): void {
    const hero = this.heroRef.nativeElement.getBoundingClientRect();
    const a = this.lineA.nativeElement.getBoundingClientRect();
    const b = this.lineB.nativeElement.getBoundingClientRect();
    const column = parseFloat(getComputedStyle(this.lineB.nativeElement).paddingRight) || 0;

    // The tube runs through the middle of the gap between the lines...
    const tubeY = (a.bottom + b.top) / 2 - hero.top;
    this.discharge.electrode = 1 - tubeY / hero.height;
    // ...then turns down the column kept free beside the second line, with the
    // tray landing on that line's baseline (the glyph box runs past it for descenders).
    const baseline = b.bottom - b.height * 0.14 - hero.top;
    this.discharge.floor = 1 - baseline / hero.height;
    this.discharge.arrowX = (b.right - hero.left) / hero.width;
    this.discharge.arrowW = column / hero.width;
    this.discharge.redraw();
  }

  /**
   * The page's one orchestrated moment. The tube strikes from the cathode, and
   * the headline charges up with it: every letter starts compressed to the
   * narrowest width the face has and snaps out to full width. Width is a layout
   * property, so it animates once here and never on scroll.
   */
  private choreograph(): void {
    const split = new SplitText([this.lineA.nativeElement, this.lineB.nativeElement], {
      type: 'chars',
      charsClass: 'char',
    });

    const intro = gsap.timeline({ defaults: { ease: 'expo.out' } });

    intro
      .fromTo(this.discharge, { charge: 0 }, { charge: 1, duration: 1.6, ease: 'power2.inOut' }, 0)
      .from(split.chars, {
        '--cw': 0.42,
        opacity: 0,
        duration: 1.2,
        stagger: { each: 0.035, from: 'start' },
      }, 0.15)
      .from(this.foot.nativeElement.children, {
        opacity: 0,
        y: 24,
        duration: 1,
        stagger: 0.12,
      }, 0.9);

  }

  private schedule(fn: () => void, delay: number): void {
    if (this.stopped) return;
    this.timer = setTimeout(() => {
      if (this.stopped) return;
      fn();
      this.cdr.detectChanges();
    }, delay);
  }

  private runTypingPass(): void {
    this.phase = 'typing';
    this.typedUrl = '';
    this.typeNextCharacter();
  }

  private typeNextCharacter(): void {
    const { url } = this.current;

    if (this.typedUrl.length >= url.length) {
      this.schedule(() => this.startResolving(), PAUSE_AFTER_TYPING);
      return;
    }

    this.schedule(() => {
      this.typedUrl = url.slice(0, this.typedUrl.length + 1);
      this.typeNextCharacter();
    }, TYPE_SPEED);
  }

  private startResolving(): void {
    this.phase = 'resolving';
    this.sendPulse();
    this.schedule(() => {
      this.phase = 'resolved';
      this.schedule(() => {
        this.phase = 'picking';
        this.schedule(() => this.advance(), HOLD_MENU);
      }, BEFORE_MENU);
    }, RESOLVE_TIME);
  }

  /**
   * While the demo fetches, current surges: a band of light runs the tube from
   * the link side, turns down into the download arrow, and the tray flashes
   * as the result appears.
   */
  private sendPulse(): void {
    if (this.motion.reduced) return;
    const tube = this.discharge;
    gsap.timeline()
      .set(tube, { pulseX: -0.05 })
      .to(tube, { flow: 1, pulse: 1, duration: 0.25, ease: 'power2.out' }, 0)
      .to(tube, { pulseX: 1.05, duration: RESOLVE_TIME / 1000, ease: 'power1.inOut' }, 0)
      .to(tube, { flow: 0, pulse: 0, duration: 0.8, ease: 'power2.out' }, RESOLVE_TIME / 1000 - 0.15)
      .to(tube, { land: 1, duration: 0.12, ease: 'power2.out' }, RESOLVE_TIME / 1000 - 0.05)
      .to(tube, { land: 0, duration: 1.1, ease: 'power2.in' });
  }

  private advance(): void {
    this.index = (this.index + 1) % RESOLUTIONS.length;
    this.runTypingPass();
  }
}
