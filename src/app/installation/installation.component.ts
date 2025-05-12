import {
  Component,
  OnInit,
  Renderer2,
  ElementRef,
  signal,
  WritableSignal,
  effect,
  inject,
  ChangeDetectorRef,
  AfterViewChecked
} from '@angular/core';
import { CommonModule } from '@angular/common';
import * as Prism from 'prismjs';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-powershell';
import 'prismjs/components/prism-markup';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-installation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './installation.component.html',
  styleUrl: './installation.component.scss',
})
export class InstallationComponent implements OnInit, AfterViewChecked {
  bashScriptContent: WritableSignal<string> = signal('Loading...');
  powershellScriptContent: WritableSignal<string> = signal('Loading...');
  contentLoaded: boolean = false;

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

  ngAfterViewChecked() {
    if (this.contentLoaded) {
      this.highlightAllCodeBlocks();
    }
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
  } private highlightCodeBlock(selector: string) {
    setTimeout(() => {
      // Find all code blocks matching the selector
      const codeBlocks = this.el.nativeElement.querySelectorAll(selector);

      if (codeBlocks && codeBlocks.length > 0) {
        codeBlocks.forEach((block: any) => {
          // Make sure Prism is available and initialized
          if (typeof Prism !== 'undefined' && Prism.highlightElement) {
            Prism.highlightElement(block);
          } else {
            console.error('Prism is not properly initialized');
          }
        });
        this.contentLoaded = true;
      } else {
        console.warn(`No code elements found for selector: ${selector}`);
      }
    }, 200); // Give more time for elements to render
  }

  highlightAllCodeBlocks() {
    const codeBlocks = this.el.nativeElement.querySelectorAll('pre code');
    if (codeBlocks && codeBlocks.length > 0) {
      codeBlocks.forEach((block: any) => {
        if (typeof Prism !== 'undefined') {
          Prism.highlightElement(block);
        }
      });
    }
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
