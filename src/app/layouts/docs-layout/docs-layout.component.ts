import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { DocsNavbarComponent } from '../../docs/docs-navbar/docs-navbar.component';

@Component({
  selector: 'app-docs-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, DocsNavbarComponent],
  templateUrl: './docs-layout.component.html',
  styleUrl: './docs-layout.component.scss'
})
export class DocsLayoutComponent {}
