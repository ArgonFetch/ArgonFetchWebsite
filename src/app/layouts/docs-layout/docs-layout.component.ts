import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { LucideAngularModule, ArrowLeft, ArrowRight, Menu, X } from 'lucide-angular';

interface DocsLink {
  path: string;
  label: string;
}

interface DocsGroup {
  title: string;
  links: DocsLink[];
}

const DOCS_NAV: DocsGroup[] = [
  {
    title: 'Getting started',
    links: [
      { path: '/docs/installation', label: 'Installation' },
      { path: '/docs/usage', label: 'Basic usage' },
      { path: '/docs/configuration', label: 'Configuration' },
    ],
  },
  {
    title: 'Advanced',
    links: [
      { path: '/docs/api', label: 'API reference' },
      { path: '/docs/development', label: 'Development' },
      { path: '/docs/deployment', label: 'Deployment' },
    ],
  },
];

/** The sidebar order, flattened - this is what prev/next walks. */
const FLAT_NAV: DocsLink[] = DOCS_NAV.flatMap(group => group.links);

@Component({
  selector: 'app-docs-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, LucideAngularModule],
  templateUrl: './docs-layout.component.html',
  styleUrl: './docs-layout.component.scss',
})
export class DocsLayoutComponent implements OnInit, OnDestroy {
  readonly groups = DOCS_NAV;
  readonly ArrowLeftIcon = ArrowLeft;
  readonly ArrowRightIcon = ArrowRight;
  readonly MenuIcon = Menu;
  readonly XIcon = X;

  isSidebarOpen = false;
  private currentUrl = '';
  private destroy$ = new Subject<void>();

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.currentUrl = this.router.url;

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd), takeUntil(this.destroy$))
      .subscribe((event: NavigationEnd) => {
        this.currentUrl = event.urlAfterRedirects;
        this.isSidebarOpen = false;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  private get currentIndex(): number {
    return FLAT_NAV.findIndex(link => this.currentUrl.startsWith(link.path));
  }

  get previous(): DocsLink | null {
    const i = this.currentIndex;
    return i > 0 ? FLAT_NAV[i - 1] : null;
  }

  get next(): DocsLink | null {
    const i = this.currentIndex;
    return i > -1 && i < FLAT_NAV.length - 1 ? FLAT_NAV[i + 1] : null;
  }
}
