import { Routes, withRouterConfig } from '@angular/router';
import { HeroComponent } from './hero/hero.component';
import { FeaturesComponent } from './features/features.component';
import { ScreenshotsComponent } from './screenshots/screenshots.component';
import { InstallationComponent } from './installation/installation.component';
import { UsageComponent } from './usage/usage.component';

export const routes: Routes = [
    { path: '', component: HeroComponent },
    { path: 'features', component: FeaturesComponent },
    { path: 'screenshots', component: ScreenshotsComponent },
    { path: 'installation', component: InstallationComponent },
    { path: 'usage', component: UsageComponent },
    { path: '**', redirectTo: '' }
];

// Apply scrolling behavior
export const routingConfig = withRouterConfig({});
