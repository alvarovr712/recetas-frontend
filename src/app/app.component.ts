import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `<router-outlet></router-outlet>`,
})
export class AppComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) { }

 ngOnInit() {
  this.authService.getUserInfo().subscribe({
    next: (user) => {
      console.log('User info:', user);  // <--- aquí para debug
      if (user && user.username) {
        this.router.navigate(['/recipes']);
      } else {
        this.router.navigate(['/login']);
      }
    },
    error: () => {
      this.router.navigate(['/login']);
    },
  });
}

}
