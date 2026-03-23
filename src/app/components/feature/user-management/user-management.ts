import { Component, OnInit, inject, ChangeDetectorRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../services/user.service';
import { UserDto } from '../../../models/dtos/user-dto';
import { ConfirmModal } from '../../shared/confirm-modal/confirm-modal';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, ConfirmModal],
  templateUrl: './user-management.html',
  styleUrl: './user-management.css'
})
export class UserManagementComponent implements OnInit {
  private userService = inject(UserService);
  private cdr = inject(ChangeDetectorRef);
  protected Math = Math;

  public users: UserDto[] = [];
  public currentPage: number = 1;
  public pageSize: number = 5;
  public totalCount: number = 0;
  public totalPages: number = 0;
  public pageSizeOptions = [
    { value: 5, label: '5' },
    { value: 10, label: '10' },
    { value: 25, label: '25' },
    { value: 50, label: '50' },
    { value: -1, label: 'Todos' }
  ];
  public loading: boolean = false;
  public activeActionIndex: number | null = null;

  // Modal properties
  public showModal: boolean = false;
  public modalMessage: string = '';
  public userToToggle: UserDto | null = null;

  @HostListener('document:click')
  onDocClick(): void {
    this.activeActionIndex = null;
    this.cdr.detectChanges();
  }

  ngOnInit(): void {
    this.fetchUsers();
  }

  toggleUserActions(index: number): void {
    this.activeActionIndex = this.activeActionIndex === index ? null : index;
    this.cdr.detectChanges();
  }

  editUser(user: UserDto): void {
    console.log('Edit user:', user);
  }

  openConfirmToggle(user: UserDto): void {
    this.userToToggle = user;
    const action = user.enabled ? 'desactivar' : 'activar';
    this.modalMessage = `¿Seguro que quieres ${action} al usuario ${user.name} ${user.surnames}?`;
    this.showModal = true;
    this.activeActionIndex = null; // Close dropdown
    this.cdr.detectChanges();
  }

  handleConfirmToggle(): void {
    if (this.userToToggle) {
      this.userService.toggleEnabled(this.userToToggle.id).subscribe({
        next: () => {
          this.fetchUsers();
          this.showModal = false;
          this.userToToggle = null;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error toggling user status:', err);
          this.showModal = false;
          this.cdr.detectChanges();
        }
      });
    }
  }

  handleCancelToggle(): void {
    this.showModal = false;
    this.userToToggle = null;
    this.cdr.detectChanges();
  }

  fetchUsers(): void {
    this.loading = true;
    this.cdr.detectChanges();
    
    this.userService.getAllUsers(this.currentPage, this.pageSize).subscribe({
      next: (response: any) => {
        setTimeout(() => {
          this.users = response.items;
          this.totalCount = response.totalCount;
          this.totalPages = response.totalPages;
          this.loading = false;
          this.cdr.detectChanges();
        }, 0);
      },
      error: (err: any) => {
        console.error('Error fetching users:', err);
        setTimeout(() => {
          this.loading = false;
          this.cdr.detectChanges();
        }, 0);
      }
    });
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.fetchUsers();
      this.cdr.detectChanges();
    }
  }

  onPageSizeChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.pageSize = +target.value;
    this.currentPage = 1;
    this.fetchUsers();
    this.cdr.detectChanges();
  }

  getPagesArray(): number[] {
    return Array.from({length: this.totalPages}, (_, i) => i + 1);
  }
}
