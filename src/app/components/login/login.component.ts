import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  private authService = inject(AuthService); // Aquí inyectas el servicio

  usernameOrEmail = '';
  password = '';
  errorMessage = '';
  loading = false;

  onLogin() {
    this.errorMessage = '';
    this.loading = true;

    this.authService.login({ usernameOrEmail: this.usernameOrEmail, password: this.password }).subscribe({
      next: (res) => {
        this.loading = false;
        alert(res);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error || 'Error al iniciar sesión';
      },
    });
  }
}
