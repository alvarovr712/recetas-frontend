import { Component, OnInit, inject } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { SidebarComponent } from './components/shared/sidebar/sidebar.component';
import { NavbarComponent } from './components/shared/navbar/navbar.component';
import { UserInfoDTO } from './models/dtos/user-info-dto';
import { Role } from './models/enum/role';



import { LayoutService } from './services/layout.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.css',
})
export class AppComponent implements OnInit {
  isAuthPage: boolean = false;
  private authService = inject(AuthService);
  private router = inject(Router);
  public layoutService = inject(LayoutService);

  constructor() {
    this.router.events.subscribe(() => {
      this.isAuthPage = this.router.url.includes('/login') || this.router.url.includes('/register');
    });
  }

  ngOnInit() {
    this.authService.getUserInfo().subscribe({
      next: (user) => {
        if (user && user.username) {
          if (this.router.url.includes('/login') || this.router.url.includes('/register')) {
            if (user.role === Role.ADMIN) {
              this.router.navigate(['/admin/dashboard']);
            } else {
              this.router.navigate(['/recipes']);
            }
          }
        } else {
          if (!this.router.url.includes('/register')) {
            this.router.navigate(['/login']);
          }
        }
      },
      error: () => {
        if (!this.router.url.includes('/login') && !this.router.url.includes('/register')) {
          this.router.navigate(['/login']);
        }
      },
    });
  }

}
