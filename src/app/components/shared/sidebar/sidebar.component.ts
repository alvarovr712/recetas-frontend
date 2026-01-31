import { Component, inject, HostBinding, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { LayoutService } from '../../../services/layout.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private router = inject(Router);
  public layoutService = inject(LayoutService);
  private sub: Subscription = new Subscription();

  @HostBinding('class.open') isOpen = false;

  public currentUser: { username: string; role: string } | null = null;

  public adminMenu = [
    { label: 'Dashboard', icon: 'bi bi-speedometer2', route: '/admin/dashboard' },
    { label: 'Recetas', icon: 'bi bi-journal-text', route: '/admin/recipes' },
    { label: 'Mis Recetas', icon: 'bi bi-journal-album', route: '/admin/myrecipes' },
    { label: 'Favoritos', icon: 'bi bi-heart', route: '/admin/favorites' },
    { label: 'Configuración', icon: 'bi bi-gear', route: '/admin/config' }
  ];

  public userMenu = [
    { label: 'Recetas', icon: 'bi bi-grid', route: '/recipes' },
    { label: 'Mis Recetas', icon: 'bi bi-book', route: '/my-recipes' },
    { label: 'Favoritos', icon: 'bi bi-heart', route: '/favorites' }
  ];

  get menuItems() {
    if (this.currentUser && this.currentUser.role === 'ADMIN') {
      return this.adminMenu;
    }
    return this.userMenu;
  }
  ngOnInit() {
    this.sub = this.layoutService.sidebarOpen$.subscribe(open => {
      this.isOpen = open;
    });
    this.sub.add(
      this.authService.currentUser$.subscribe(user => {
        this.currentUser = user;
      })
    );
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.clientSideLogout();
      },
      error: (err) => {
        console.error('Error cerrando sesión', err);
        // Force logout on frontend even if backend fails (e.g. invalid cookie)
        this.clientSideLogout();
      }
    });
  }

  private clientSideLogout() {
    this.layoutService.closeSidebar();
    this.router.navigate(['/login']);
  }


}
