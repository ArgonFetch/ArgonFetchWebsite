import { AfterViewInit, Component, ElementRef, NgZone, OnDestroy, ViewChild, inject } from '@angular/core';
import { LucideAngularModule, ArrowUpRight } from 'lucide-angular';
import { MotionService, gsap } from '../motion/motion.service';

@Component({
    selector: 'app-screenshots',
    imports: [LucideAngularModule],
    templateUrl: './screenshots.component.html',
    styleUrl: './screenshots.component.scss'
})
export class ScreenshotsComponent implements AfterViewInit, OnDestroy {
    readonly ArrowUpRightIcon = ArrowUpRight;

    private motion = inject(MotionService);
    private zone = inject(NgZone);

    @ViewChild('section', { static: true }) section!: ElementRef<HTMLElement>;
    @ViewChild('stage', { static: true }) stage!: ElementRef<HTMLElement>;
    @ViewChild('frame', { static: true }) frame!: ElementRef<HTMLElement>;

    private ctx?: gsap.Context;

    ngAfterViewInit(): void {
        if (this.motion.reduced) return;

        this.zone.runOutsideAngular(() => {
            this.ctx = gsap.context(() => {
                gsap.fromTo(this.frame.nativeElement,
                    { rotateX: 28, scale: 0.84, yPercent: 6 },
                    {
                        rotateX: 0,
                        scale: 1,
                        yPercent: 0,
                        ease: 'none',
                        scrollTrigger: {
                            trigger: this.stage.nativeElement,
                            start: 'top bottom',
                            end: 'center 55%',
                            scrub: true,
                        },
                    });
            }, this.section.nativeElement);
        });
    }

    ngOnDestroy(): void {
        this.ctx?.revert();
    }
}
