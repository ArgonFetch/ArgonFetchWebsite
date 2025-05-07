import { Component } from '@angular/core';
import { Event, NavigationEnd, Router } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { HeroComponent } from './hero/hero.component';
import { FeaturesComponent } from './features/features.component';
import { ScreenshotsComponent } from './screenshots/screenshots.component';
import { InstallationComponent } from './installation/installation.component';
import { UsageComponent } from './usage/usage.component';
import { RoadmapComponent } from './roadmap/roadmap.component';

@Component({
  selector: 'app-root',
  imports: [
    NavbarComponent,
    FooterComponent,
    HeroComponent,
    FeaturesComponent,
    ScreenshotsComponent,
    InstallationComponent,
    UsageComponent,
    RoadmapComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'ArgonFetch';

  constructor(private router: Router) {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        const fragment = this.router.parseUrl(this.router.url).fragment;
        if (fragment) {
          this.scrollToFragment(fragment);
        }
      }
    });
  }

  private scrollToFragment(fragment: string) {
    const element = document.getElementById(fragment);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
