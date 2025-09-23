import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
    faBolt,
    faSlidersH,
    faGlobe,
    faShieldAlt,
    faPlug,
    faLayerGroup,
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
    faShieldAlt = faShieldAlt;
    faPlug = faPlug;
    faLayerGroup = faLayerGroup;
}
