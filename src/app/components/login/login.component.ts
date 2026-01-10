import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  private authService = inject(AuthService);
  private toastr = inject(ToastrService);
  private router = inject(Router);
  usernameOrEmail = '';
  password = '';
  errorMessage = '';
  loading = false;

  onLogin() {
    this.errorMessage = '';
    this.loading = true;

    this.authService
      .login({ usernameOrEmail: this.usernameOrEmail, password: this.password })
      .subscribe({
        next: (res) => {
          this.loading = false;
          this.toastr.success('Logeado con éxito', 'Bienvenido');
          setTimeout(() => {
            this.router.navigate(['/recipes']);
          }, 3000);
        },
        error: (err) => {
          this.loading = false;
          const message = err.error?.message || err.error || 'Email o contraseña incorrectos';
          this.toastr.error(message, 'Error al iniciar sesión');
        },
      });
  }
}
