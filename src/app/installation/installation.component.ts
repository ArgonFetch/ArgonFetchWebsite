import {
  Component,
  OnInit,
  Renderer2,
  ElementRef,
  signal,
  WritableSignal,
  effect,
  inject,
  ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import * as Prism from 'prismjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-installation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './installation.component.html',
  styleUrl: './installation.component.scss',
})
export class InstallationComponent implements OnInit {
  bashScriptContent: WritableSignal<string> = signal('Loading...');
  powershellScriptContent: WritableSignal<string> = signal('Loading...');

  constructor(
    private http: HttpClient,
    private renderer: Renderer2,
    private el: ElementRef,
    private cdr: ChangeDetectorRef
  ) {
    effect(() => {
      const content = this.bashScriptContent();
      if (
        content &&
        content !== 'Loading...' &&
        content !== 'Failed to load script.'
      ) {
        this.highlightCodeBlock('.language-bash');
      }
    });

    effect(() => {
      const content = this.powershellScriptContent();
      if (
        content &&
        content !== 'Loading...' &&
        content !== 'Failed to load script.'
      ) {
        this.highlightCodeBlock('.language-powershell');
      }
    });
  }

  ngOnInit() {
    this.loadScripts();
  }

  loadScripts() {
    this.http
      .get('./scripts/setup.sh', { responseType: 'text' })
      .subscribe({
        next: (data) => {
          this.bashScriptContent.set(data);
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Failed to load bash script:', err);
          this.bashScriptContent.set('Failed to load script.');
          this.cdr.detectChanges();
        },
      });

    this.http
      .get('./scripts/setup.ps1', { responseType: 'text' })
      .subscribe({
        next: (data) => {
          this.powershellScriptContent.set(data);
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Failed to load powershell script:', err);
          this.powershellScriptContent.set('Failed to load script.');
          this.cdr.detectChanges();
        },
      });
  }

  private highlightCodeBlock(selector: string) {
    setTimeout(() => {
      const specificCodeElement =
        this.el.nativeElement.querySelector(selector);
      if (specificCodeElement) {
        Prism.highlightElement(specificCodeElement);
      } else {
        console.warn(`Element not found for selector: ${selector}`);
      }
    }, 0);
  }

  copyToClipboard(text: string, event: MouseEvent) {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        const button = event.target as HTMLElement;
        const originalText = button.innerText;
        button.innerText = 'Copied!';
        this.renderer.addClass(button, 'copied');
        setTimeout(() => {
          button.innerText = originalText;
          this.renderer.removeClass(button, 'copied');
        }, 2000);
      })
      .catch((err) => {
        console.error('Failed to copy text: ', err);
        const button = event.target as HTMLElement;
        const originalText = button.innerText;
        button.innerText = 'Failed!';
        setTimeout(() => {
          button.innerText = originalText;
        }, 2000);
      });
  }
}
