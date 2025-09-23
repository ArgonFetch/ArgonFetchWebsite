import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { faBars, faTimes, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';
import { trigger, state, style, transition, animate, stagger, query } from '@angular/animations';

@Component({
  selector: 'app-navbar',
  imports: [
    RouterLink,
    CommonModule,
    FontAwesomeModule
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  animations: [
    trigger('iconFadeOut', [
      transition('* => docs', [
        query('.nav-link-icon', [
          stagger(100, [
            animate('300ms ease-out', style({ opacity: 0, transform: 'scale(0.8)' }))
          ])
        ], { optional: true })
      ])
    ]),
    trigger('slideContent', [
      state('main', style({ transform: 'translateX(0)' })),
      state('docs', style({ transform: 'translateX(0)' })),
      transition('main => docs', [
        animate('400ms ease-in-out', style({ transform: 'translateX(-100%)' }))
      ]),
      transition('docs => main', [
        animate('400ms ease-in-out', style({ transform: 'translateX(100%)' }))
      ])
    ])
  ]
})

export class NavbarComponent implements OnInit, OnDestroy {
  isMobileMenuOpen = false;
  isScrolled = false;
  activeSection = 'hero';
  isDocsMode = false;
  animationState = 'main';
  private destroy$ = new Subject<void>();

  faBars = faBars;
  faTimes = faTimes;
  faGithub = faGithub;
  faArrowLeft = faArrowLeft;

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe((event: NavigationEnd) => {
        this.isDocsMode = event.url.includes('/docs');
        this.animationState = this.isDocsMode ? 'docs' : 'main';
      });

    // Check initial route
    this.isDocsMode = this.router.url.includes('/docs');
    this.animationState = this.isDocsMode ? 'docs' : 'main';
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 50;
    if (!this.isDocsMode) {
      this.updateActiveSection();
    }
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

  navigateBack() {
    this.router.navigate(['/']);
  }

  navigateToDocs() {
    this.router.navigate(['/docs']);
  }
}
