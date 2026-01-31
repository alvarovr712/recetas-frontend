import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { LayoutService } from '../../../services/layout.service';

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

    user = {
        name: 'Invitado', // Default name
        role: '',
        avatarUrl: ''
    };

    ngOnInit() {
        this.authService.currentUser$.subscribe((userInfo: { username: string; role: string } | null) => {
            if (userInfo) {
                this.user.name = userInfo.username;
                // this.user.role = userInfo.role; // Role removal requested previously
            }
        });
    }
}
