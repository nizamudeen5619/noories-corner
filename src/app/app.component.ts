import { Component, HostListener, OnDestroy } from '@angular/core';
import { UserService } from './user/services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy {
  title = 'noories-corner';
  constructor(private userService: UserService) { }
  @HostListener('window:beforeunload')
  async ngOnDestroy() {
    this.userService.userLogout().subscribe()
  }
}
