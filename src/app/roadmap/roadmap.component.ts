import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
    selector: 'app-roadmap',
    imports: [
        CommonModule
    ],
    templateUrl: './roadmap.component.html',
    styleUrl: './roadmap.component.scss'
})
export class RoadmapComponent {
  completedFeatures = [
    { name: 'Spotify Songs', description: 'Download individual songs from Spotify.' },
    { name: 'YouTube Media', description: 'Support for downloading videos and audio from YouTube.' },
  ];

  plannedFeatures = [
    { name: 'Spotify Playlists', description: 'Enable downloading of entire Spotify playlists.' },
    { name: 'Spotify Albums', description: 'Allow users to download full albums from Spotify.' },
    { name: 'SoundCloud Media', description: 'Integrate support for SoundCloud tracks and playlists.' },
  ];

  futureIdeas = [
    { name: 'Social Media Support', description: 'Explore adding support for platforms like X, Instagram, TikTok, etc.' },
    { name: 'Enhanced Format/Quality Options', description: 'More granular control over download settings.' },
    { name: 'Batch Downloading from UI', description: 'Allow pasting multiple URLs directly in the web interface.' },
  ];
}
