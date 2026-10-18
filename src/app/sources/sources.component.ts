import {
  AfterViewInit,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  QueryList,
  ViewChildren,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MotionService, gsap } from '../motion/motion.service';

/**
 * Where links can come from, as two belts of type.
 *
 * The belts idle slowly and take the reader's scroll speed on top, flipping
 * direction with it - the page feels like it is pulling the sources through.
 */
@Component({
  selector: 'app-sources',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="sources" aria-labelledby="sources-title">
      <h2 id="sources-title" class="visually-hidden">Supported sources</h2>
      <p class="visually-hidden">
        Works with YouTube, Spotify, SoundCloud and TikTok. Instagram, X and Facebook are planned.
      </p>

      <div class="belt belt-now" #belt aria-hidden="true">
        <div class="track">
          <ng-container *ngFor="let copy of copies">
            <span class="item" *ngFor="let name of now">{{ name }}<svg class="spark" viewBox="0 0 24 24"><path d="M12 0c.6 6.4 5.6 11.4 12 12-6.4.6-11.4 5.6-12 12-.6-6.4-5.6-11.4-12-12C6.4 11.4 11.4 6.4 12 0Z"/></svg></span>
          </ng-container>
        </div>
      </div>

      <div class="belt belt-next" #belt aria-hidden="true">
        <div class="track">
          <ng-container *ngFor="let copy of copies">
            <span class="item" *ngFor="let name of next">{{ name }}<span class="soon">planned</span></span>
          </ng-container>
        </div>
      </div>
    </section>
  `,
  styleUrl: './sources.component.scss',
})
export class SourcesComponent implements AfterViewInit, OnDestroy {
  private motion = inject(MotionService);
  private zone = inject(NgZone);

  @ViewChildren('belt') belts!: QueryList<ElementRef<HTMLElement>>;

  readonly now = ['YouTube', 'Spotify', 'SoundCloud', 'TikTok'];
  readonly next = ['Instagram', 'X', 'Facebook'];

  /** Four copies of each list: the track wraps at -50%, so the seam is never on screen. */
  readonly copies = [0, 1, 2, 3];

  private tick?: (time: number, deltaMs: number) => void;
  private onResize?: () => void;

  ngAfterViewInit(): void {
    if (this.motion.reduced) return;

    this.zone.runOutsideAngular(() => {
      const tracks = this.belts.map((b) => b.nativeElement.firstElementChild as HTMLElement);
      const offsets = tracks.map(() => 0);
      // Direction of travel per belt; the second belt runs against the first.
      const sense = [-1, 1];
      // Speed in px per frame. Scroll only sets a target; the belt eases toward
      // it, so a burst of scrolling swells the motion instead of kicking it, and
      // a change of direction turns the belt around instead of flipping it.
      const idle = 0.6;
      let speed = idle;

      // Measured up front and on resize, never inside the frame loop.
      let halves = tracks.map((t) => t.offsetWidth / 2);
      this.onResize = () => (halves = tracks.map((t) => t.offsetWidth / 2));
      window.addEventListener('resize', this.onResize);

      this.tick = (_time: number, deltaMs: number) => {
        const v = this.motion.velocity;
        const target = (idle + Math.min(Math.abs(v) * 0.25, 6)) * (v < -0.5 ? -1 : 1);
        speed += (target - speed) * 0.06;
        const frames = Math.min(deltaMs / (1000 / 60), 3);

        tracks.forEach((track, i) => {
          offsets[i] = gsap.utils.wrap(-halves[i], 0, offsets[i] + speed * frames * sense[i]);
          track.style.transform = `translate3d(${offsets[i]}px, 0, 0)`;
        });
      };

      gsap.ticker.add(this.tick);
    });
  }

  ngOnDestroy(): void {
    if (this.tick) gsap.ticker.remove(this.tick);
    if (this.onResize) window.removeEventListener('resize', this.onResize);
  }
}
