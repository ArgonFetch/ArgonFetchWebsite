import { Component, HostListener } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-navbar',
  imports: [
    RouterLink,
    CommonModule,
    FontAwesomeModule
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})

export class NavbarComponent {
  isMobileMenuOpen = false;
  isScrolled = false;
  activeSection = 'hero';

  faBars = faBars;
  faTimes = faTimes;
  faGithub = faGithub;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 50;
    this.updateActiveSection();
  }

  private updateActiveSection() {
    const sections = ['hero', 'features', 'screenshots', 'usage', 'roadmap'];
    const scrollPosition = window.scrollY + 100; // Offset for better UX

    for (const sectionId of sections) {
      const section = document.getElementById(sectionId);
      if (section) {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          this.activeSection = sectionId;
          break;
        }
      }
    }
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

  closeMobileMenuAndScroll(fragment: string) {
    this.closeMobileMenu();
  }
}
