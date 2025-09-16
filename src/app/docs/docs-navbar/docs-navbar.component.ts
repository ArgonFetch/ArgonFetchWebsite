import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'app-docs-navbar',
  imports: [RouterLink, FontAwesomeModule],
  templateUrl: './docs-navbar.component.html',
  styleUrl: './docs-navbar.component.scss'
})
export class DocsNavbarComponent {
  faArrowLeft = faArrowLeft;
  faGithub = faGithub;
}
