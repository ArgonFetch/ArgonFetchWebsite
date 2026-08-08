import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  LucideAngularModule,
  LucideIconData,
  Link,
  SlidersHorizontal,
  Download,
} from 'lucide-angular';

interface Step {
  title: string;
  body: string;
  icon: LucideIconData;
}

@Component({
  selector: 'app-usage',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './usage.component.html',
  styleUrl: './usage.component.scss',
})
export class UsageComponent {
  // A real sequence - you cannot pick a format before the link resolves - so
  // these are the one place on the page where numbering carries information.
  steps: Step[] = [
    {
      title: 'Paste the link',
      body: 'Copy the address of the video or track from your browser and drop it into the field. ArgonFetch reads the source and tells you what it found.',
      icon: Link,
    },
    {
      title: 'Pick a format',
      body: 'Choose the container and quality you actually want - full-resolution video, audio only, or whatever else the source offers.',
      icon: SlidersHorizontal,
    },
    {
      title: 'Download',
      body: 'The file transfers to your machine and it is yours. Nothing is kept, queued or phoned home about afterwards.',
      icon: Download,
    },
  ];
}
