import { Routes, withInMemoryScrolling } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { DocsLayoutComponent } from './layouts/docs-layout/docs-layout.component';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', component: HomeComponent, title: 'ArgonFetch - Modern Media Downloader', data: { animation: 'HomePage' } },
    ]
  },
  {
    path: 'docs',
    component: DocsLayoutComponent,
    children: [
      { path: '', redirectTo: 'installation', pathMatch: 'full' },
      { path: 'installation', loadComponent: () => import('./docs/installation/installation.component').then(c => c.InstallationComponent), title: 'Installation - ArgonFetch Docs', data: { animation: 'DocsInstallation' } },
      { path: 'usage', loadComponent: () => import('./usage/usage.component').then(c => c.UsageComponent), title: 'Usage - ArgonFetch Docs', data: { animation: 'DocsUsage' } },
      { path: 'configuration', component: HomeComponent, title: 'Configuration - ArgonFetch Docs', data: { animation: 'DocsConfiguration' } }, // Placeholder
      { path: 'api', component: HomeComponent, title: 'API Reference - ArgonFetch Docs', data: { animation: 'DocsApi' } }, // Placeholder
      { path: 'development', component: HomeComponent, title: 'Development - ArgonFetch Docs', data: { animation: 'DocsDevelopment' } }, // Placeholder
      { path: 'deployment', component: HomeComponent, title: 'Deployment - ArgonFetch Docs', data: { animation: 'DocsDeployment' } }, // Placeholder
    ]
  },
  { path: 'installation', redirectTo: 'docs/installation', pathMatch: 'full' },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

export const routingConfig = withInMemoryScrolling({
  scrollPositionRestoration: 'enabled',
  anchorScrolling: 'enabled',
});
