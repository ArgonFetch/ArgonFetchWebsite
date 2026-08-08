import { Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import {
  LucideAngularModule,
  ArrowRight,
  Download,
  Minus,
  Square,
  X,
  Play,
} from 'lucide-angular';

/** One pass of the hero demo: a link goes in, a downloadable result comes out. */
interface Resolution {
  /** The link as the user would paste it. */
  url: string;
  /** Where it came from, shown as a mono label on the result. */
  source: string;
  /** Illustrative title. Deliberately generic - this is a UI demo, not a catalogue. */
  title: string;
  /** Secondary line: duration and whatever else the source reports. */
  meta: string;
  /** Downloadable variants, most useful first. */
  formats: string[];
  /** Cover artwork, as the source would hand it back. */
  cover: string;
  kind: 'video' | 'audio';
}

type Phase = 'typing' | 'resolving' | 'resolved';

const RESOLUTIONS: Resolution[] = [
  {
    url: 'https://youtube.com/watch?v=aVn8Nq2Kd1s',
    source: 'YouTube',
    title: 'Live Session - Full Set',
    meta: '48:12 · 1080p60',
    formats: ['MP4 · 1080p', 'MP4 · 720p', 'MP3'],
    cover: 'covers/cover-live-session.jpg',
    kind: 'video',
  },
  {
    url: 'https://open.spotify.com/track/2n4kUvIPfx',
    source: 'Spotify',
    title: 'Midnight Drive',
    // Spotify links are looked up for metadata; the audio comes from YouTube Music.
    meta: '3:41 · via YouTube Music',
    formats: ['MP3', 'WebM', 'Cover art'],
    cover: 'covers/cover-midnight-drive.jpg',
    kind: 'audio',
  },
  {
    url: 'https://soundcloud.com/label/field-rec-4',
    source: 'SoundCloud',
    title: 'Field Recording № 4',
    meta: '12:07 · Track',
    formats: ['MP3', 'WebM', 'Cover art'],
    cover: 'covers/cover-field-rec.jpg',
    kind: 'audio',
  },
];

// Beat lengths for one full pass, in milliseconds.
const TYPE_SPEED = 26;
const PAUSE_AFTER_TYPING = 420;
const RESOLVE_TIME = 950;
const HOLD_RESULT = 3400;

@Component({
  selector: 'app-hero',
  imports: [CommonModule, FontAwesomeModule, LucideAngularModule, RouterLink],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
})
export class HeroComponent implements OnInit, OnDestroy {
  // Font Awesome carries company marks only; everything else is Lucide.
  faGithub = faGithub;

  readonly ArrowRightIcon = ArrowRight;
  readonly DownloadIcon = Download;
  readonly MinusIcon = Minus;
  readonly SquareIcon = Square;
  readonly XIcon = X;
  readonly PlayIcon = Play;

  phase: Phase = 'typing';
  typedUrl = '';
  index = 0;

  private timer?: ReturnType<typeof setTimeout>;
  private stopped = false;

  constructor(private cdr: ChangeDetectorRef) {}

  get current(): Resolution {
    return RESOLUTIONS[this.index];
  }

  get statusLabel(): string {
    return this.phase === 'resolved' ? 'Resolved' : this.phase === 'resolving' ? 'Resolving' : 'Waiting for a link';
  }

  ngOnInit(): void {
    // With reduced motion the panel still tells the story - it just shows the
    // finished state instead of performing it.
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      this.typedUrl = this.current.url;
      this.phase = 'resolved';
      return;
    }

    this.runTypingPass();
  }

  ngOnDestroy(): void {
    this.stopped = true;
    clearTimeout(this.timer);
  }

  private schedule(fn: () => void, delay: number): void {
    if (this.stopped) return;
    this.timer = setTimeout(() => {
      if (this.stopped) return;
      fn();
      this.cdr.markForCheck();
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
    this.schedule(() => {
      this.phase = 'resolved';
      this.schedule(() => this.advance(), HOLD_RESULT);
    }, RESOLVE_TIME);
  }

  private advance(): void {
    this.index = (this.index + 1) % RESOLUTIONS.length;
    this.runTypingPass();
  }
}
