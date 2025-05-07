import { Routes, withInMemoryScrolling } from '@angular/router';
import { HeroComponent } from './hero/hero.component';
import { FeaturesComponent } from './features/features.component';
import { ScreenshotsComponent } from './screenshots/screenshots.component';
import { InstallationComponent } from './installation/installation.component';
import { UsageComponent } from './usage/usage.component';
import { RoadmapComponent } from './roadmap/roadmap.component';

export const routes: Routes = [
  { path: '', component: HeroComponent, title: 'ArgonFetch - Home' },
  { path: 'features', component: FeaturesComponent, title: 'ArgonFetch - Features' },
  { path: 'screenshots', component: ScreenshotsComponent, title: 'ArgonFetch - Screenshots' },
  { path: 'installation', component: InstallationComponent, title: 'ArgonFetch - Installation' },
  { path: 'usage', component: UsageComponent, title: 'ArgonFetch - Usage' },
  { path: 'roadmap', component: RoadmapComponent, title: 'ArgonFetch - Roadmap' }, 
  { path: '**', redirectTo: '' },
];

export const routingConfig = withInMemoryScrolling({
  scrollPositionRestoration: 'enabled',
  anchorScrolling: 'enabled', 
});
