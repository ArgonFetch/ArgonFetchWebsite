import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LucideAngularModule, Menu, X, ArrowLeft } from 'lucide-angular';
import { Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';

/** Landing page sections, in document order, used for the active-link marker. */
const SECTIONS = ['hero', 'features', 'interface', 'usage'];

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
export class NavbarComponent implements OnInit, OnDestroy {
  isMobileMenuOpen = false;
  isScrolled = false;
  activeSection = 'hero';
  isDocsMode = false;
  private destroy$ = new Subject<void>();

  // Font Awesome carries company marks only; everything else is Lucide.
  faGithub = faGithub;

  readonly MenuIcon = Menu;
  readonly XIcon = X;
  readonly ArrowLeftIcon = ArrowLeft;

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe((event: NavigationEnd) => {
        this.isDocsMode = event.url.includes('/docs');
        this.closeMobileMenu();
      });

    this.isDocsMode = this.router.url.includes('/docs');
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 8;
    if (!this.isDocsMode) {
      this.updateActiveSection();
    }
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

  navigateBack() {
    this.router.navigate(['/']);
  }

  navigateToDocs() {
    this.router.navigate(['/docs']);
  }
}
