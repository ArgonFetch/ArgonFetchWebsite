import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-docs-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './docs-layout.component.html',
  styleUrl: './docs-layout.component.scss'
})
export class DocsLayoutComponent {}
