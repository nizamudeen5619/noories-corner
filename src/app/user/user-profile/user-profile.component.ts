import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser'
import { Router } from '@angular/router';
import { SharedDataService } from 'src/app/shared/shared-data.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  constructor(private userService: UserService, private sanitizer: DomSanitizer, private route: Router, private sharedData: SharedDataService) { }
  user: any;
  filesToUpload!: File;
  imageUrl!: SafeUrl;
  imageText!: string;
  showFileInput = false
  userSubscription$!: Subscription;

  ngOnInit(): void {
    if (this.userService.isLoggedIn()) {
      this.userService.userProfile().subscribe((user) => {
        this.user = user;
      })
      this.getAvatar();
    }
  }

  getAvatar() {
    this.userService.avatarView().subscribe((res) => {
      const unsafeImageUrl = URL.createObjectURL(res.body);
      this.imageUrl = this.sanitizer.bypassSecurityTrustUrl(unsafeImageUrl);
      this.imageText = "Change Avatar:";
      this.showFileInput = this.imageUrl ? false : true;
    });
  }

  upload() {
    const formData: FormData = new FormData();
    const file: File = this.filesToUpload;

    formData.append('avatar', file);

    this.userService.avatarUpload(formData).subscribe((files) => {
      alert('File Uploaded Successfully');
      this.getAvatar();
    });
  }

  fileChangeEvent(fileInput: any) {
    this.filesToUpload = fileInput.target.files.item(0);
  }
  changeAvatar() {
    this.showFileInput = true;
  }
  logoutAll() {
    if (confirm('You will be logged out from all devices')) {
      this.userService.userLogoutAll().subscribe(() => {
        alert('Logged out from All Devices');
        this.sharedData.removeData();
        this.route.navigate(['']);
      });
    }
  }
  deleteAccount() {
    this.userService.userDelete().subscribe(() => {
      alert('Account Deleted');
      this.sharedData.removeData();
      this.route.navigate(['']);
    })
  }
}
