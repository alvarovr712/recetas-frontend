import { Component, inject, HostBinding, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { LayoutService } from '../../../services/layout.service';
import { Subscription, map, Observable } from 'rxjs';
import { UserInfoDTO } from '../../../models/dtos/user-info-dto';

import { Role } from '../../../models/enum/role';




@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit, OnDestroy {
  public Role = Role;
  private authService = inject(AuthService);
  private router = inject(Router);
  public layoutService = inject(LayoutService);
  private cdr = inject(ChangeDetectorRef);
  private sub: Subscription = new Subscription();

  @HostBinding('class.open') isOpen = false;
  public configOpen = false;

  public adminMenu = [
    { label: 'Inicio', icon: 'bi bi-grid', route: '/recipes' },
    { label: 'Mis Recetas', icon: 'bi bi-journal-album', route: '/my-recipes' },
    { label: 'Favoritos', icon: 'bi bi-heart', route: '/favorites' },
    { label: 'Perfil', icon: 'bi bi-person', route: '/profile' }
  ];

  public userMenu = [
    { label: 'Inicio', icon: 'bi bi-grid', route: '/recipes' },
    { label: 'Mis Recetas', icon: 'bi bi-book', route: '/my-recipes' },
    { label: 'Favoritos', icon: 'bi bi-heart', route: '/favorites' },
    { label: 'Perfil', icon: 'bi bi-person', route: '/profile' }
  ];

  public menuItems$: Observable<any[]>;
  public currentUserRole$: Observable<Role | undefined>;


  constructor() {
    this.currentUserRole$ = this.authService.currentUser$.pipe(
      map(user => user?.role as Role)
    );

    this.menuItems$ = this.authService.currentUser$.pipe(
      map(user => {
        if (user && user.role === Role.ADMIN) {
          return this.adminMenu;
        }
        return this.userMenu;
      })
    );
  }

  toggleConfig() {
    this.configOpen = !this.configOpen;
    this.cdr.detectChanges();
  }

  ngOnInit() {
    this.sub = this.layoutService.sidebarOpen$.subscribe(open => {
      this.isOpen = open;
    });
  }

  onNavItemClick() {
    this.layoutService.closeSidebar();
    this.cdr.detectChanges();
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
