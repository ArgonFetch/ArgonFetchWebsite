import { Component } from '@angular/core';
import { Event, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./navbar/navbar.component";
import { FooterComponent } from "./footer/footer.component";
import { HeroComponent } from "./hero/hero.component";
import { FeaturesComponent } from "./features/features.component";
import { ScreenshotsComponent } from "./screenshots/screenshots.component";
import { InstallationComponent } from "./installation/installation.component";
import { UsageComponent } from "./usage/usage.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent, HeroComponent, FeaturesComponent, ScreenshotsComponent, InstallationComponent, UsageComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'ArgonFetch';

  constructor(private router: Router) {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.scrollToFragment();
      }
    });
  }

  private scrollToFragment() {
    const urlFragment = this.router.parseUrl(this.router.url).fragment;
    if (urlFragment) {
      const element = document.getElementById(urlFragment);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }
}
