import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-intro-animation',
  standalone: true,
  imports: [],
  template: `
    @if (showIntro) {
      <div class="intro-container" [class.fade-out]="fadeOut">
        <div class="logo-container">
          <img src="/logo-simple.svg"
               alt="ArgonFetch Logo"
               class="argon-logo"
               [class.logo-drop]="logoDrop" />
          <h1 class="logo-text" [class.text-fade-in]="textFadeIn">ArgonFetch</h1>
        </div>
        <div class="wave-container" [class.wave-visible]="waveVisible">
          <svg class="wave wave-1" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path fill="url(#waveGradient1)" d="M0,96L48,112C96,128,192,160,288,165.3C384,171,480,149,576,133.3C672,117,768,107,864,128C960,149,1056,203,1152,213.3C1248,224,1344,192,1392,176L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
            <defs>
              <linearGradient id="waveGradient1" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style="stop-color:#a855f7;stop-opacity:0.9" />
                <stop offset="100%" style="stop-color:#7c3aed;stop-opacity:0.4" />
              </linearGradient>
            </defs>
          </svg>
          <svg class="wave wave-2" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path fill="url(#waveGradient2)" d="M0,224L48,213.3C96,203,192,181,288,186.7C384,192,480,224,576,224C672,224,768,192,864,181.3C960,171,1056,181,1152,186.7C1248,192,1344,192,1392,192L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
            <defs>
              <linearGradient id="waveGradient2" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style="stop-color:#7c3aed;stop-opacity:0.7" />
                <stop offset="100%" style="stop-color:#a855f7;stop-opacity:0.2" />
              </linearGradient>
            </defs>
          </svg>
          <svg class="wave wave-3" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path fill="url(#waveGradient3)" d="M0,128L48,138.7C96,149,192,171,288,165.3C384,160,480,128,576,128C672,128,768,160,864,165.3C960,171,1056,149,1152,138.7C1248,128,1344,128,1392,128L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
            <defs>
              <linearGradient id="waveGradient3" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style="stop-color:#a855f7;stop-opacity:0.5" />
                <stop offset="100%" style="stop-color:#7c3aed;stop-opacity:0.1" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
    }
  `,
  styleUrl: './intro-animation.component.scss'
})
export class IntroAnimationComponent implements OnInit {
  @Output() animationComplete = new EventEmitter<void>();

  showIntro = true;
  logoDrop = false;
  textFadeIn = false;
  waveVisible = false;
  fadeOut = false;

  ngOnInit() {
    // Start the animation sequence
    setTimeout(() => {
      this.logoDrop = true;
    }, 100);

    // Show text after logo drops
    setTimeout(() => {
      this.textFadeIn = true;
    }, 100);

    // Waves rise from bottom
    setTimeout(() => {
      this.waveVisible = true;
    }, 100);

    // Start fade out after waves are visible
    setTimeout(() => {
      this.fadeOut = true;
    }, 3500);

    // Hide intro completely and emit complete
    setTimeout(() => {
      this.showIntro = false;
      this.animationComplete.emit();
    }, 4300);
  }
}