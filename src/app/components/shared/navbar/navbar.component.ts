import { Component, OnInit, inject, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { LayoutService } from '../../../services/layout.service';
import { Router, RouterModule } from '@angular/router';
import { TokenInfoDTO } from '../../../models/dtos/token-info-dto';
import { environment } from '../../../../environments/environment';


@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
    private authService = inject(AuthService);
    public layoutService = inject(LayoutService);
    private router = inject(Router);
    private eRef = inject(ElementRef);

    user = {
        name: 'Invitado', 
        avatarUrl: ''
    };

    showDropdown = false;

    @HostListener('document:click', ['$event'])
    onClickOutside(event: Event) {
        if (!this.eRef.nativeElement.contains(event.target)) {
            this.showDropdown = false;
        }
    }

    ngOnInit() {
        this.authService.currentUser$.subscribe((userInfo: TokenInfoDTO | null) => {
            if (userInfo) {
                this.user.name = userInfo.username;
                this.user.avatarUrl = userInfo.image ? `${environment.apiUrl}${userInfo.image}` : '';
            }
        });
    }

    toggleDropdown() {
        this.showDropdown = !this.showDropdown;
    }

    goToProfile() {
        this.showDropdown = false;
        this.router.navigate(['/profile']);
    }

    logout() {
        this.showDropdown = false;
        this.authService.logout().subscribe({
            next: () => {
                this.router.navigate(['/login']);
            },
            error: (err) => console.error('Error logging out', err)
        });
    }
}
