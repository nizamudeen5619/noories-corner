import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser'
import { Router } from '@angular/router';
import { SharedDataService } from 'src/app/shared/shared-data.service';
import { EMPTY, Subscription, catchError, finalize, tap } from 'rxjs';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})

export class UserProfileComponent implements OnInit, OnDestroy {

  constructor(private formBuilder: FormBuilder,private userService: UserService, private sanitizer: DomSanitizer, private route: Router, private sharedData: SharedDataService) { }
  user: any;
  filesToUpload!: File;
  imageUrl!: SafeUrl;
  imageText!: string;
  showFileInput = false;
  isFileError = false;
  fileErrorText = "";

  avatarViewSubscription$!: Subscription;
  avatarUploadSubscription$!: Subscription;
  userLoadSubscription$!: Subscription;
  userLogoutAllSubscription$!: Subscription;
  userDeleteSubscription$!: Subscription;


  isLoading!: boolean;
  isError!: boolean;
  errorStatusCode: any;

  ngOnInit(): void {
    if (this.userService.isLoggedIn()) {
      this.isLoading = true;
      this.userLoadSubscription$ = this.userService.userProfile().pipe(
        catchError((error) => {
          this.isError = true;
          this.errorStatusCode = error.status
          return EMPTY;
        })
      ).subscribe((user) => {
        this.user = user;
        this.getAvatar();
      });
    }
  }

  getAvatar(): void {
    this.avatarViewSubscription$ = this.userService.avatarView().pipe(
      tap((res) => {
        if (res && res.body) {
          const unsafeImageUrl = URL.createObjectURL(res.body);
          this.imageUrl = this.sanitizer.bypassSecurityTrustUrl(unsafeImageUrl);
          this.showFileInput = false
        }
      }),
      catchError((error) => {
        if (error.status !== 404) {
          this.isError = true;
          this.errorStatusCode = error.status
        }
        else {
          this.imageText = "Add Avatar:";
          this.imageUrl = "https://www.iconpacks.net/icons/2/free-user-icon-3296-thumb.png"
        }
        return EMPTY;
      }),
      finalize(() => {
        this.isLoading = false;
        if (this.imageUrl === "") {
          this.imageText = "Change Avatar:";
        }
      })
    ).subscribe();
  }

  upload(): void {
    const formData: FormData = new FormData();
    const file: File = this.filesToUpload;

    formData.append('avatar', file);

    this.avatarUploadSubscription$ = this.userService.avatarUpload(formData).pipe(
      tap(() => {
        alert('File Uploaded Successfully');
        this.getAvatar();
      }),
      catchError((error) => {
        this.isError = true;
        this.errorStatusCode = error.status
        return EMPTY;
      })
    ).subscribe(() => {
      this.getAvatar()
    });
  }

  fileChangeEvent(fileInput: any) {
    const file: File = fileInput.target.files.item(0);

    if (file) {
      const allowedFormats = ['image/jpeg', 'image/png'];
      const maxSizeInBytes = 2 * 1024 * 1024; // 2 MB

      if (allowedFormats.includes(file.type)) {
        if (file.size > maxSizeInBytes) {
          this.filesToUpload = file;
        } else {
          this.setError('File size should be less than 2MB.', 'file');
        }
      } else {
        this.setError('Invalid file format.', 'file');
      }
    }
  }

  changeAvatar() {
    this.showFileInput = true;
  }
  private setError(errorMessage: string, errorType: string) {
    if (errorType === 'file') {
      this.isFileError = true;
      this.fileErrorText = errorMessage;
    }
  }
  logoutAll(): void {
    if (confirm('You will be logged out from all devices')) {
      this.userLogoutAllSubscription$ = this.userService.userLogoutAll().pipe(
        catchError((error) => {
          this.isError = true;
          this.errorStatusCode = error.status
          return EMPTY;
        }),
        finalize(() => {
          this.sharedData.removeData();
          this.route.navigate(['']);
        })
      ).subscribe(() => {
        alert('Logged out from All Devices');
      });
    }
  }

  deleteAccount(): void {
    this.userDeleteSubscription$ = this.userService.userDelete().pipe(
      catchError((error) => {
        this.isError = true;
        this.errorStatusCode = error.status
        return EMPTY;
      }),
      finalize(() => {
        this.sharedData.removeData();
        this.route.navigate(['']);
      })
    ).subscribe(() => {
      alert('Account Deleted');
    });
  }

  ngOnDestroy(): void {
    if (this.userLoadSubscription$) {
      this.userLoadSubscription$.unsubscribe();
    }
    if (this.userDeleteSubscription$) {
      this.userDeleteSubscription$.unsubscribe();
    }
    if (this.avatarUploadSubscription$) {
      this.avatarUploadSubscription$.unsubscribe();
    }
    if (this.avatarViewSubscription$) {
      this.avatarViewSubscription$.unsubscribe();
    }
    if (this.userLogoutAllSubscription$) {
      this.userLogoutAllSubscription$.unsubscribe();
    }
  }
}