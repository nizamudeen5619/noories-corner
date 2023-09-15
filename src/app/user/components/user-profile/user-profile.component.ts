import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser'
import { Router } from '@angular/router';
import { SharedDataService } from '../../../shared/services/shared-data.service';
import { EMPTY, Subject, Subscription, catchError, finalize, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})

export class UserProfileComponent implements OnInit, OnDestroy {

  constructor(private userService: UserService, private sanitizer: DomSanitizer, private route: Router, private sharedData: SharedDataService) { }
  user: any;
  filesToUpload!: File;
  imageUrl!: SafeUrl;
  imageText!: string;
  showFileInput = false;
  isFileError = false;
  fileErrorText = '';
  displayStyle = '';
  errorMessage = '';
  modalHeading = '';
  modalBody = '';
  currentProcess = '';
  confirmPassword = '';
  goTohomeButton = false;

  private destroy$ = new Subject<void>();

  isLoading!: boolean;
  passwordError = true;
  isError!: boolean;
  errorStatusCode: any;


  ngOnInit(): void {
    if (this.userService.isLoggedIn()) {
      this.isLoading = true;
      this.userService.userProfile().pipe(
        takeUntil(this.destroy$)
      ).subscribe({
        next: (user) => {
          this.user = user;
          this.getAvatar();
        },
        error: (error) => {
          this.isError = true;
          this.errorStatusCode = error.status;
        }
      });
    }
  }

  getAvatar(): void {
    this.userService.avatarView().pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (res) => {
        if (res && res.body) {
          const unsafeImageUrl = URL.createObjectURL(res.body);
          this.imageUrl = this.sanitizer.bypassSecurityTrustUrl(unsafeImageUrl);
          this.showFileInput = false;
        }
      },
      error: (error) => {
        if (error.status !== 404) {
          this.isError = true;
          this.errorStatusCode = error.status;
        }
        else {
          this.imageText = 'Add Avatar:';
          this.imageUrl = 'https://i.imgur.com/MQ7EiFx.png';
        }
      },
      complete: () => {
        this.isLoading = false;
        if (this.imageUrl === '') {
          this.imageText = 'Change Avatar:';
        }
      }
    });
  }

  upload(): void {
    this.isLoading = true;
    const formData: FormData = new FormData();

    formData.append('avatar', this.filesToUpload);

    this.userService.avatarUpload(formData).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: () => {
        this.getAvatar();
      },
      error: (error) => {
        this.isError = true;
        this.errorStatusCode = error.status;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  fileChangeEvent(fileInput: any) {
    const file: File = fileInput.target.files.item(0);

    if (file) {
      const allowedFormats = ['image/jpeg', 'image/png'];
      const maxSizeInBytes = 2 * 1024 * 1024; // 2 MB

      if (allowedFormats.includes(file.type)) {
        if (file.size < maxSizeInBytes) {
          this.filesToUpload = file;
        } else {
          this.setError('File size should be less than 2MB.', 'file');
        }
      } else {
        this.setError('Invalid file format.', 'file');
      }
    }
  }

  private setError(errorMessage: string, errorType: string) {
    if (errorType === 'file') {
      this.isFileError = true;
      this.fileErrorText = errorMessage;
    }
  }

  logoutAll(): void {
    this.isLoading = true;
    this.userService.userLogoutAll().pipe(
      takeUntil(this.destroy$),
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe({
      next: () => {
        this.displayStyle = 'block';
        this.goTohomeButton = true;
      },
      error: (error) => {
        this.isError = true;
        this.errorStatusCode = error.status;
      }
    });
  }

  deleteAccount(): void {
    this.isLoading = true;
    this.userService.userDelete(this.confirmPassword).pipe(
      takeUntil(this.destroy$),
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe({
      next: () => {
        this.displayStyle = 'block';
        this.goTohomeButton = true;
      },
      error: (error) => {
        this.isError = true;
        this.errorStatusCode = error.status;
      }
    });
  }

  openModal(currentProcess: string) {
    this.currentProcess = currentProcess;
    if (this.currentProcess === 'logoutAll') {
      this.modalHeading = "Confirm Logout from All Devices"
    }
    else if (this.currentProcess === 'deleteAccount') {
      this.modalHeading = "Account Deletion Confirmation"
    }
    this.displayStyle = 'block';
  }

  closeModal() {
    this.displayStyle = 'none';
  }

  confirmLogoutAllAndDeleteAccount() {
    if (this.currentProcess === 'logoutAll') {
      this.logoutAll();
    }
    else if (this.currentProcess === 'deleteAccount') {
      if (!this.confirmPassword) {
        return;
      }
      this.deleteAccount();
    }
  }

  logout() {
    this.isLoading = true;
    this.userService.userLogout().pipe(
      catchError((error) => {
        this.errorStatusCode = error.status;
        this.route.navigate(['/error', this.errorStatusCode]);
        return EMPTY;
      })
    ).subscribe(() => {
      this.sharedData.removeData();
      this.route.navigateByUrl('');
      this.isLoading = false;
    });
  }

  goToHome() {
    this.displayStyle = 'none';
    this.sharedData.removeData();
    this.route.navigate(['']);
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions when the component is destroyed
    this.destroy$.next();
    this.destroy$.complete();
  }
}