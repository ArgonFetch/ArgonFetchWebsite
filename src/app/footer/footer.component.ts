import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';

@Component({
    selector: 'app-footer',
    imports: [RouterLink, FontAwesomeModule],
    templateUrl: './footer.component.html',
    styleUrl: './footer.component.scss'
})
export class FooterComponent {
    // Company mark, so it stays with Font Awesome's brand set.
    faGithub = faGithub;

    /** The year the ArgonFetch repository was created (2025-02-23). */
    private readonly firstYear = 2025;

    /**
     * "2025" in the first year, "2025-2026" after that. Reads the clock so the
     * range never has to be edited by hand again.
     */
    get copyrightYears(): string {
        const now = new Date().getFullYear();
        return now > this.firstYear ? `${this.firstYear}-${now}` : `${this.firstYear}`;
    }
}
