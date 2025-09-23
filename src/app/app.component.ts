import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { IntroAnimationComponent } from './intro-animation/intro-animation.component';
import { NavbarComponent } from './navbar/navbar.component';
import { trigger, transition, style, animate, query, group } from '@angular/animations';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, IntroAnimationComponent, NavbarComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  animations: [
    trigger('routeAnimations', [
      transition('HomePage => DocsPage', [
        group([
          query(':leave', [
            style({ position: 'absolute', width: '100%', top: 0 }),
            animate('400ms ease-in-out', style({ transform: 'translateX(-100%)', opacity: 0 }))
          ], { optional: true }),
          query(':enter', [
            style({ position: 'absolute', width: '100%', top: 0, transform: 'translateX(100%)' }),
            animate('400ms ease-in-out', style({ transform: 'translateX(0)', opacity: 1 }))
          ], { optional: true })
        ])
      ]),
      transition('DocsPage => HomePage', [
        group([
          query(':leave', [
            style({ position: 'absolute', width: '100%', top: 0 }),
            animate('400ms ease-in-out', style({ transform: 'translateX(100%)', opacity: 0 }))
          ], { optional: true }),
          query(':enter', [
            style({ position: 'absolute', width: '100%', top: 0, transform: 'translateX(-100%)' }),
            animate('400ms ease-in-out', style({ transform: 'translateX(0)', opacity: 1 }))
          ], { optional: true })
        ])
      ])
    ])
  ]
})
export class AppComponent implements OnInit {
  title = 'ArgonFetch';
  showIntroAnimation = true;
  currentRoute = '';

  constructor(private router: Router) {}

  ngOnInit() {
    // Check if intro has been shown before in this session
    const introShown = sessionStorage.getItem('introAnimationShown');
    if (introShown) {
      this.showIntroAnimation = false;
    }

    // Track route changes for animations
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentRoute = event.urlAfterRedirects;
      });
  }

  onIntroAnimationComplete() {
    this.showIntroAnimation = false;
    sessionStorage.setItem('introAnimationShown', 'true');
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet?.activatedRouteData?.['animation'];
  }
}
