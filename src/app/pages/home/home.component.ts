import { Component } from '@angular/core';
import { HeroComponent } from '../../hero/hero.component';
import { FeaturesComponent } from '../../features/features.component';
import { ScreenshotsComponent } from '../../screenshots/screenshots.component';
import { UsageComponent } from '../../usage/usage.component';
import { SourcesComponent } from '../../sources/sources.component';
import { SelfhostComponent } from '../../selfhost/selfhost.component';

@Component({
  selector: 'app-home',
  imports: [
    HeroComponent,
    FeaturesComponent,
    ScreenshotsComponent,
    UsageComponent,
    SourcesComponent,
    SelfhostComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
