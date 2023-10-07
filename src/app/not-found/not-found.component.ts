import { Location } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css']
})
export class NotFoundComponent {

  constructor(private location: Location) { }
  
  goBack() {
    this.location.back()
  }

}
