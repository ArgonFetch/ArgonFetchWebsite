import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    LucideAngularModule,
    LucideIconData,
    Music,
    Globe,
    AudioLines,
    Container,
    MonitorSmartphone,
    Code,
} from 'lucide-angular';

interface Capability {
    /** Mono category label. These are kinds, not steps - hence no numbering. */
    label: string;
    title: string;
    body: string;
    icon: LucideIconData;
}

@Component({
    selector: 'app-features',
    standalone: true,
    imports: [CommonModule, LucideAngularModule],
    templateUrl: './features.component.html',
    styleUrl: './features.component.scss',
})
export class FeaturesComponent {
    capabilities: Capability[] = [
        {
            label: 'Spotify',
            title: 'Search on Spotify, download the audio',
            body: 'Paste a Spotify track link and ArgonFetch looks up the song, then pulls the audio from YouTube Music.',
            icon: Music,
        },
        {
            label: 'Platforms',
            title: 'YouTube, SoundCloud and TikTok',
            body: 'Video and audio from YouTube, tracks from SoundCloud, videos from TikTok. X, Instagram and Facebook are planned.',
            icon: Globe,
        },
        {
            label: 'Formats',
            title: 'MP3, MP4 and WebM',
            body: 'Take audio on its own as MP3, video with sound as MP4, or WebM when you want the smaller file.',
            icon: AudioLines,
        },
        {
            label: 'Deploy',
            title: 'One compose file and it is up',
            body: 'Ships as a container with Postgres alongside it. Drop in a compose.yml, add your credentials, and start it.',
            icon: Container,
        },
        {
            label: 'Interface',
            title: 'One screen, no manual',
            body: 'Paste a link, pick a format, download. The whole interface is a single page you already know how to use.',
            icon: MonitorSmartphone,
        },
        {
            label: 'API',
            title: 'A REST API with Swagger docs',
            body: 'Everything the web interface does is available over HTTP, documented at /swagger on your own instance.',
            icon: Code,
        },
    ];
}
