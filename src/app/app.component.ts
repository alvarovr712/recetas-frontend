import { Component, OnInit, inject } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { SidebarComponent } from './components/shared/sidebar/sidebar.component';
import { NavbarComponent } from './components/shared/navbar/navbar.component';

import { LayoutService } from './services/layout.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.css',
})
export class AppComponent implements OnInit {
  isLoginPage: boolean = false;
  private authService = inject(AuthService);
  private router = inject(Router);
  public layoutService = inject(LayoutService);

  constructor() {
    this.router.events.subscribe(() => {
      this.isLoginPage = this.router.url === '/login';
    });
  }

  ngOnInit() {
    this.authService.getUserInfo().subscribe({
      next: (user) => {
        console.log('User info:', user);
        if (user && user.username) {
          if (this.router.url === '/login') {
            this.router.navigate(['/recipes']);
          }
        } else {
          this.router.navigate(['/login']);
        }
      },
      error: () => {
        if (this.router.url !== '/login') {
          this.router.navigate(['/login']);
        }
      },
    });
  }

}
