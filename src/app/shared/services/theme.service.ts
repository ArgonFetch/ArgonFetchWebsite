import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  // Default theme
  private currentTheme = {
    primary: '#9644ff',
    secondary: '#b764ff',
    dark: '#121212',
    darker: '#0a0a0a',
    light: '#f1f2f6'
  };

  constructor() { }

  // Get current theme
  getTheme() {
    return this.currentTheme;
  }

  // Optional: Method to change theme dynamically
  setTheme(theme: Partial<typeof this.currentTheme>) {
    this.currentTheme = { ...this.currentTheme, ...theme };
    this.applyTheme();
  }

  // Apply theme to CSS variables
  private applyTheme() {
    Object.entries(this.currentTheme).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--${key}`, value);
    });
  }
}
