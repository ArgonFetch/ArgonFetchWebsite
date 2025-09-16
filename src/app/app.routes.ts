import { Routes, withInMemoryScrolling } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { DocsLayoutComponent } from './layouts/docs-layout/docs-layout.component';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', component: HomeComponent, title: 'ArgonFetch - Modern Media Downloader' },
    ],
    data: { animation: 'HomePage' }
  },
  {
    path: 'docs',
    component: DocsLayoutComponent,
    children: [
      { path: '', redirectTo: 'installation', pathMatch: 'full' },
      { path: 'installation', loadComponent: () => import('./docs/installation/installation.component').then(c => c.InstallationComponent), title: 'Installation - ArgonFetch Docs' },
      { path: 'usage', loadComponent: () => import('./docs/usage/usage.component').then(c => c.UsageComponent), title: 'Usage - ArgonFetch Docs' },
      { path: 'configuration', loadComponent: () => import('./docs/configuration/configuration.component').then(c => c.ConfigurationComponent), title: 'Configuration - ArgonFetch Docs' },
      { path: 'api', loadComponent: () => import('./docs/api/api.component').then(c => c.ApiComponent), title: 'API Reference - ArgonFetch Docs' },
      { path: 'development', loadComponent: () => import('./docs/development/development.component').then(c => c.DevelopmentComponent), title: 'Development - ArgonFetch Docs' },
      { path: 'deployment', loadComponent: () => import('./docs/deployment/deployment.component').then(c => c.DeploymentComponent), title: 'Deployment - ArgonFetch Docs' }
    ],
    data: { animation: 'DocsPage' }
  },
  { path: 'installation', redirectTo: 'docs/installation', pathMatch: 'full' },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

export const routingConfig = withInMemoryScrolling({
  scrollPositionRestoration: 'enabled',
  anchorScrolling: 'enabled',
});
