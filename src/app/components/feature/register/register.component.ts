import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { Router, RouterModule } from '@angular/router';
import { RegisterDto } from '../../../models/dtos/register-dto';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  private userService = inject(UserService);
  private toastr = inject(ToastrService);
  private router = inject(Router);

  registerDto: RegisterDto = {
    name: '',
    surnames: '',
    username: '',
    email: '',
    password: ''
  };
  confirmPassword = '';
  loading = false;
  imagePreview: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (file.type.match(/image\/*/) == null) {
        this.toastr.warning('Solo se permiten imágenes', 'Archivo no válido');
        return;
      }
      this.selectedFile = file;
      this.registerDto.image = file;

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (_event) => {
        this.imagePreview = reader.result;
      };
    }
  }

  triggerFileInput() {
    document.getElementById('fileUpload')?.click();
  }

  onRegister() {
    if (this.registerDto.password !== this.confirmPassword) {
      this.toastr.error('Las contraseñas no coinciden', 'Error');
      return;
    }

    if (!this.registerDto.name || !this.registerDto.surnames || !this.registerDto.username || !this.registerDto.email || !this.registerDto.password) {
      this.toastr.warning('Por favor, completa todos los campos requeridos', 'Campos incompletos');
      return;
    }

    this.loading = true;

    if (!this.registerDto.image && this.registerDto.name && this.registerDto.surnames) {
      this.registerDto.image = this.generateAvatar(this.registerDto.name, this.registerDto.surnames);
    }

    this.userService.register(this.registerDto).subscribe({
      next: () => {
        this.loading = false;
        this.toastr.success('Registro completado con éxito', 'Bienvenido');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.loading = false;
        const message = err.error?.message || err.error || 'Error al registrar el usuario';
        this.toastr.error(message, 'Error de Registro');
      }
    });
  }

  private generateAvatar(name: string, surname: string): File {
    const canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 200;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Draw background
      ctx.fillStyle = '#7a00ff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw text
      const initial1 = name.trim() ? name.trim().charAt(0).toUpperCase() : '';
      const initial2 = surname.trim() ? surname.trim().charAt(0).toUpperCase() : '';
      const initials = `${initial1}${initial2}`;

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 80px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      // Adjust y position slightly for better vertical centering
      ctx.fillText(initials, canvas.width / 2, (canvas.height / 2) + 5);
    }

    const dataUrl = canvas.toDataURL('image/png');
    const arr = dataUrl.split(',');
    const mimeMatch = arr[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : 'image/png';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    
    return new File([u8arr], 'avatar.png', { type: mime });
  }
}
