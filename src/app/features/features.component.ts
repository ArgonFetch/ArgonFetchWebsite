import {
    AfterViewInit,
    Component,
    ElementRef,
    NgZone,
    OnDestroy,
    QueryList,
    ViewChild,
    ViewChildren,
    inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MotionService, gsap } from '../motion/motion.service';

interface Capability {
    title: string;
    body: string;
}

@Component({
    selector: 'app-features',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './features.component.html',
    styleUrl: './features.component.scss',
})
export class FeaturesComponent implements AfterViewInit, OnDestroy {
    private motion = inject(MotionService);
    private zone = inject(NgZone);

    @ViewChild('section', { static: true }) section!: ElementRef<HTMLElement>;
    @ViewChild('paper', { static: true }) paper!: ElementRef<HTMLElement>;
    @ViewChildren('row') rows!: QueryList<ElementRef<HTMLElement>>;

    capabilities: Capability[] = [
        {
            title: 'Spotify in, audio out',
            body: 'Paste a Spotify track link and ArgonFetch looks up the song, then pulls the audio from YouTube Music.',
        },
        {
            title: 'YouTube, SoundCloud, TikTok',
            body: 'Video and audio from YouTube, tracks from SoundCloud, videos from TikTok. X, Instagram and Facebook are planned.',
        },
        {
            title: 'MP3, MP4, WebM',
            body: 'Audio on its own as MP3, video with sound as MP4, or WebM when you want the smaller file.',
        },
        {
            title: 'One compose file',
            body: 'Ships as a container with Postgres alongside it. Drop in a compose.yml, add your credentials, start it.',
        },
        {
            title: 'One screen',
            body: 'Paste, pick, download. The whole interface is a single page you already know how to use.',
        },
        {
            title: 'A REST API',
            body: 'Everything the interface does is available over HTTP, documented at /swagger on your own instance.',
        },
    ];

    private ctx?: gsap.Context;

    ngAfterViewInit(): void {
        if (this.motion.reduced) return;

        this.zone.runOutsideAngular(() => {
            this.ctx = gsap.context(() => {
                // The light band opens out of a rounded window as it arrives.
                gsap.fromTo(this.paper.nativeElement,
                    { clipPath: 'inset(0% 3% 0% 3% round 48px)' },
                    {
                        clipPath: 'inset(0% 0% 0% 0% round 0px)',
                        ease: 'none',
                        scrollTrigger: {
                            trigger: this.section.nativeElement,
                            start: 'top bottom',
                            end: 'top 35%',
                            scrub: true,
                        },
                    });

                // Each row lights while it crosses the middle of the screen, so
                // the list reads one line at a time instead of as a wall.
                this.rows.forEach(({ nativeElement: row }) => {
                    gsap.timeline({
                        scrollTrigger: {
                            trigger: row,
                            start: 'top 75%',
                            end: 'bottom 25%',
                            scrub: true,
                        },
                    })
                        .fromTo(row, { '--lit': 0 }, { '--lit': 1, ease: 'power1.out', duration: 1 })
                        .to(row, { '--lit': 0.35, ease: 'power1.in', duration: 1 });
                });
            }, this.section.nativeElement);
        });
    }

    ngOnDestroy(): void {
        this.ctx?.revert();
    }
}
