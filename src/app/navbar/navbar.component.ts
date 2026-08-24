import { Component, HostListener } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LucideAngularModule, Menu, X } from 'lucide-angular';

/** Landing page sections, in document order, used for the active-link marker. */
const SECTIONS = ['hero', 'features', 'interface', 'usage'];

/** The docs live in their own VitePress site, not in this app. */
const DOCS_URL = 'https://docs.argonfetch.dev';

@Component({
  selector: 'app-navbar',
  imports: [
    RouterLink,
    CommonModule,
    FontAwesomeModule,
    LucideAngularModule
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  isMobileMenuOpen = false;
  isScrolled = false;
  activeSection = 'hero';

  readonly docsUrl = DOCS_URL;

  // Font Awesome carries company marks only; everything else is Lucide.
  faGithub = faGithub;

  readonly MenuIcon = Menu;
  readonly XIcon = X;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 8;
    this.updateActiveSection();
  }

  /**
   * Marks whichever section owns the upper third of the viewport. Using a
   * fixed probe line rather than "any part visible" keeps exactly one link lit
   * when short sections stack up.
   */
  private updateActiveSection() {
    const probe = window.innerHeight / 3;
    let current = SECTIONS[0];

    for (const id of SECTIONS) {
      const el = document.getElementById(id);
      if (el && el.getBoundingClientRect().top <= probe) {
        current = id;
      }
    }

    this.activeSection = current;
  }

  isActiveSection(section: string): boolean {
    return this.activeSection === section;
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
  }

  closeMobileMenuAndScroll(_fragment: string) {
    this.closeMobileMenu();
  }
}
