import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { LayoutService } from '../../../services/layout.service';
import { TokenInfoDTO } from '../../../models/dtos/token-info-dto';


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
        this.authService.currentUser$.subscribe((userInfo: TokenInfoDTO | null) => {
            if (userInfo) {
                this.user.name = userInfo.username;
                this.user.avatarUrl = userInfo.image ? `http://localhost:5036${userInfo.image}` : '';
                // this.user.role = userInfo.role; // Role removal requested previously
            }
        });
    }
}
