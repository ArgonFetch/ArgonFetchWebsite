import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
    faLink,
    faTasks,
    faDownload,
} from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'app-usage',
    standalone: true,
    imports: [
        FontAwesomeModule
    ],
    templateUrl: './usage.component.html',
    styleUrl: './usage.component.scss',
})
export class UsageComponent {
    faLink = faLink;
    faTasks = faTasks;
    faDownload = faDownload;
}
