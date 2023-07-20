import { Component, HostListener, OnDestroy } from '@angular/core';
import { UserService } from './user/services/user.service';
import { SharedDataService } from './shared/services/shared-data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy {
  title = 'noories-corner';
  constructor(private userService: UserService,private sharedData:SharedDataService) { }
  @HostListener('window:beforeunload')
  async ngOnDestroy() {
    this.sharedData.getAuthTokenObs().subscribe((token)=>{
      if(token){
        this.userService.userLogout().subscribe()
      }
    })
  }
}
