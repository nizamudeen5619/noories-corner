import { Component, OnInit } from '@angular/core';
import { SharedDataService } from '../shared/shared-data.service';
import { UserService } from '../user/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  isLoggedIn = false;
  userName?: string
  constructor(private sharedData: SharedDataService, private userService: UserService, private route$: Router) {
  }
  ngOnInit(): void {
    this.sharedData.getUserObs().subscribe((username) => {
      if (username) {
        this.isLoggedIn = true
        this.userName = username
      }
    })
  }
  logout() {
    this.userService.userLogout().subscribe(() => {
      this.sharedData.removeData()
      this.route$.navigateByUrl('')
    })
    this.isLoggedIn = false
  }
}
