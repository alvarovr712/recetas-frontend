import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { UserProfileDto } from '../../../models/dtos/user-profile-dto';
import { UpdateUserDto } from '../../../models/dtos/update-user-dto';
import { environment } from '../../../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Role } from '../../../models/enum/role';
import { AuthService } from '../../../services/auth.service';
import { ImageUrlPipe } from '../../../pipes/image-url.pipe';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ImageUrlPipe],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  private userService = inject(UserService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private fb = inject(FormBuilder);
  private toastr = inject(ToastrService);

  profile: UserProfileDto | null = null;
  isLoading = true;
  isEditing = false;
  isSaving = false;
  avatarUrl = '';
  errorMessage = '';
  selectedFile: File | null = null;
  editForm!: FormGroup;

  constructor() {
    this.initForm();
  }

  private initForm() {
    this.editForm = this.fb.group({
      name: ['', [Validators.required]],
      surnames: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required]],
      password: [''] // Optional password
    });
  }

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile(showLoading = true) {
    if (showLoading) {
      this.isLoading = true;
    }
    
    this.userService.getProfile().subscribe({
      next: (data) => {
        this.profile = data;
        if (data.image) {
          this.avatarUrl = data.image;
        }
        this.patchForm(data);
        
        // Finalizamos el estado de carga en el siguiente tick para evitar NG0100
        setTimeout(() => {
          this.isLoading = false;
          this.cdr.markForCheck();
        });
      },
      error: (err) => {
        console.error('[DEBUG] Error recuperando perfil:', err);
        setTimeout(() => {
          this.errorMessage = 'No se pudo cargar el perfil. Por favor, intenta de nuevo más tarde.';
          this.isLoading = false;
          this.cdr.markForCheck();
        });
      }
    });
  }

  private patchForm(data: UserProfileDto) {
    this.editForm.patchValue({
      name: data.name,
      surnames: data.surnames,
      email: data.email,
      username: data.username,
      password: ''
    });
  }

  toggleEditMode() {
    this.isEditing = true;
    this.cdr.detectChanges();
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        // Actualizamos previsualización y lanzamos guardado en ticks separados
        setTimeout(() => {
          this.avatarUrl = e.target.result;
          this.cdr.markForCheck();
          
          setTimeout(() => {
            this.saveProfile();
          }, 50);
        });
      };
      reader.readAsDataURL(file);
    }
  }

  closeEditModal() {
    this.isEditing = false;
    if (this.profile) {
      this.patchForm(this.profile);
    }
    this.cdr.detectChanges();
  }

  saveProfile() {
    if (this.editForm.invalid) {
      this.toastr.error('Por favor, rellena todos los campos obligatorios correctamente.');
      return;
    }

    // Usamos setTimeout para activar el estado de guardado
    setTimeout(() => {
      this.isSaving = true;
      this.cdr.markForCheck();
    });

    const updateDto: UpdateUserDto = {
      name: this.editForm.value.name,
      surnames: this.editForm.value.surnames,
      email: this.editForm.value.email,
      username: this.editForm.value.username,
    };

    if (this.editForm.value.password) {
      updateDto.password = this.editForm.value.password;
    }

    if (this.selectedFile) {
      updateDto.image = this.selectedFile;
    }

    this.userService.updateUser(updateDto).subscribe({
      next: (res) => {
        setTimeout(() => {
          this.toastr.success('Perfil actualizado correctamente. Se cerrará sesión en 5 segundos.');
          this.isSaving = false;
          this.isEditing = false;
          this.selectedFile = null;
          this.cdr.markForCheck();

          // Cerrar sesión después de 5 segundos
          setTimeout(() => {
            this.authService.logout().subscribe({
              next: () => {
                this.router.navigate(['/login']);
              },
              error: (err) => {
                console.error('Error logging out after update:', err);
                this.router.navigate(['/login']);
              }
            });
          }, 5000);
        });
      },
      error: (err) => {
        setTimeout(() => {
          this.toastr.error('Error al actualizar el perfil');
          this.isSaving = false;
          this.cdr.markForCheck();
        });
      }
    });
  }

  formatDate(date: string | Date): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }
}
