import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faCheckCircle,
  faHourglassHalf,
  faRocket,
  faAngleRight,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-roadmap',
  standalone: true,
  imports: [
    CommonModule,
    FontAwesomeModule
  ],
  templateUrl: './roadmap.component.html',
  styleUrl: './roadmap.component.scss',
})
export class RoadmapComponent {
  faCheckCircle = faCheckCircle;
  faHourglassHalf = faHourglassHalf;
  faRocket = faRocket;
  faAngleRight = faAngleRight;

  completedFeatures = [
    {
      name: 'Spotify Integration',
      description: 'Search songs via Spotify API, download from YouTube Music.',
    },
    {
      name: 'YouTube Media',
      description: 'Support for downloading videos and audio from YouTube.',
    },
    {
      name: 'SoundCloud Media',
      description: 'Download tracks and audio from SoundCloud.',
    },
    {
      name: 'TikTok Videos',
      description: 'Download videos from TikTok.',
    },
  ];

  plannedFeatures = [
    {
      name: 'Spotify Playlists',
      description: 'Enable downloading of entire Spotify playlists.',
    },
    {
      name: 'Spotify Albums',
      description: 'Allow users to download full albums from Spotify.',
    },
  ];

  futureIdeas = [
    {
      name: 'More Social Media Support',
      description: 'Explore adding support for platforms like X, Instagram, Facebook, etc.',
    },
    {
      name: 'Enhanced Format/Quality Options',
      description: 'More granular control over download settings.',
    },
    {
      name: 'Batch Downloading from UI',
      description: 'Allow pasting multiple URLs directly in the web interface.',
    },
  ];
}
