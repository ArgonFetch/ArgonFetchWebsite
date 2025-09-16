import { Component } from '@angular/core';
import { RouterOutlet, ChildrenOutletContexts } from '@angular/router';
import { trigger, transition, style, animate, query, group } from '@angular/animations';

const slideAnimation = trigger('slideAnimation', [
  transition('HomePage => DocsPage', [
    style({ position: 'relative' }),
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%'
      })
    ], { optional: true }),
    query(':enter', [
      style({ transform: 'translateX(100%)' })
    ], { optional: true }),
    group([
      query(':leave', [
        animate('500ms cubic-bezier(0.4, 0, 0.2, 1)',
          style({ transform: 'translateX(-100%)' }))
      ], { optional: true }),
      query(':enter', [
        animate('500ms cubic-bezier(0.4, 0, 0.2, 1)',
          style({ transform: 'translateX(0%)' }))
      ], { optional: true })
    ])
  ]),
  transition('DocsPage => HomePage', [
    style({ position: 'relative' }),
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%'
      })
    ], { optional: true }),
    query(':enter', [
      style({ transform: 'translateX(-100%)' })
    ], { optional: true }),
    group([
      query(':leave', [
        animate('500ms cubic-bezier(0.4, 0, 0.2, 1)',
          style({ transform: 'translateX(100%)' }))
      ], { optional: true }),
      query(':enter', [
        animate('500ms cubic-bezier(0.4, 0, 0.2, 1)',
          style({ transform: 'translateX(0%)' }))
      ], { optional: true })
    ])
  ])
]);

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  animations: [slideAnimation]
})
export class AppComponent {
  title = 'ArgonFetch';

  constructor(private contexts: ChildrenOutletContexts) {}

  getRouteAnimationData() {
    const context = this.contexts.getContext('primary');
    const currentRoute = context?.route?.snapshot?.data?.['animation'];

    if (!currentRoute) return null;

    return currentRoute;
  }

}
