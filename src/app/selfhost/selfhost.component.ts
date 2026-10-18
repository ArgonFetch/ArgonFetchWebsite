import {
  AfterViewInit,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  ViewChild,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MotionService, gsap } from '../motion/motion.service';

/** One line of the terminal. `cmd` lines are typed, output lines just appear. */
interface TermLine {
  kind: 'cmd' | 'ok' | 'note';
  text: string;
}

const LINES: TermLine[] = [
  { kind: 'cmd', text: 'docker compose up -d' },
  { kind: 'ok', text: 'Container argonfetch-db  Started' },
  { kind: 'ok', text: 'Container argonfetch     Started' },
  { kind: 'note', text: 'ArgonFetch is up at http://localhost:8080' },
];

@Component({
  selector: 'app-selfhost',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './selfhost.component.html',
  styleUrl: './selfhost.component.scss',
})
export class SelfhostComponent implements AfterViewInit, OnDestroy {
  private motion = inject(MotionService);
  private zone = inject(NgZone);

  @ViewChild('section', { static: true }) section!: ElementRef<HTMLElement>;
  @ViewChild('term', { static: true }) term!: ElementRef<HTMLElement>;

  readonly lines = LINES;
  private ctx?: gsap.Context;

  ngAfterViewInit(): void {
    if (this.motion.reduced) return;

    this.zone.runOutsideAngular(() => {
      this.ctx = gsap.context(() => {
        const rows = Array.from(this.term.nativeElement.querySelectorAll<HTMLElement>('.term-line'));
        const tl = gsap.timeline({
          paused: true,
          scrollTrigger: { trigger: this.term.nativeElement, start: 'top 70%', once: true },
        });
        gsap.set(rows, { autoAlpha: 0 });

        rows.forEach((row, i) => {
          const text = row.querySelector<HTMLElement>('.term-text')!;
          tl.set(row, { autoAlpha: 1 }, i === 0 ? 0 : '+=0.25');

          // Commands are typed out a character at a time; output lands whole.
          if (LINES[i].kind === 'cmd') {
            const full = LINES[i].text;
            text.textContent = '';
            const typed = { n: 0 };
            tl.to(typed, {
              n: full.length,
              duration: full.length * 0.045,
              ease: 'none',
              onUpdate: () => (text.textContent = full.slice(0, Math.round(typed.n))),
            });
            tl.to({}, { duration: 0.5 });
          }
        });
      }, this.section.nativeElement);
    });
  }

  ngOnDestroy(): void {
    this.ctx?.revert();
  }
}
