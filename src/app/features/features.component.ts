import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
    faMusic,
    faVideo,
    faFileAlt,
    faCube,
    faDesktop,
    faCode,
} from '@fortawesome/free-solid-svg-icons';
import { faSpotify, faYoutube, faDocker } from '@fortawesome/free-brands-svg-icons';

@Component({
    selector: 'app-features',
    standalone: true,
    imports: [
        FontAwesomeModule
    ],
    templateUrl: './features.component.html',
    styleUrl: './features.component.scss',
})
export class FeaturesComponent {
    faMusic = faMusic;
    faVideo = faVideo;
    faFileAlt = faFileAlt;
    faDocker = faDocker;
    faDesktop = faDesktop;
    faCode = faCode;
    faSpotify = faSpotify;
    faYoutube = faYoutube;
    faCube = faCube;
}
