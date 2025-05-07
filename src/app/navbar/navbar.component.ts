import { Component, HostListener } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common'; // Import CommonModule for *ngIf

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule], // Add CommonModule
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  isMobileMenuOpen = false;
  isScrolled = false;

  constructor(private router: Router) {}

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 50; // Add 'scrolled' class after 50px scroll
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
  }

  closeMobileMenuAndScroll(fragment: string) {
    this.closeMobileMenu();
    // Optional: if AppComponent's scrollToFragment is not sufficient or you want direct control
    // this.router.navigate(['/'], { fragment: fragment });
    // Or, if you have a shared scroll service:
    // this.scrollService.scrollTo(fragment);
    // For now, relying on AppComponent's logic triggered by fragment change.
  }
}
