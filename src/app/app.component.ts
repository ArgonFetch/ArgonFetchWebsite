import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { IntroAnimationComponent } from './intro-animation/intro-animation.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, IntroAnimationComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'ArgonFetch';
  showIntroAnimation = true;

  ngOnInit() {
    // Check if intro has been shown before in this session
    const introShown = sessionStorage.getItem('introAnimationShown');
    if (introShown) {
      this.showIntroAnimation = false;
    }
  }

  onIntroAnimationComplete() {
    this.showIntroAnimation = false;
    sessionStorage.setItem('introAnimationShown', 'true');
  }
}
