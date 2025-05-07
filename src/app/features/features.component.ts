import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
    faBolt,
    faSlidersH,
    faGlobe,
    faMusic,
} from '@fortawesome/free-solid-svg-icons';

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
    faBolt = faBolt;
    faSlidersH = faSlidersH;
    faGlobe = faGlobe;
    faMusic = faMusic;
}
