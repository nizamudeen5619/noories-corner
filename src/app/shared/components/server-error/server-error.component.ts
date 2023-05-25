import { Location } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { SharedDataService } from 'src/app/shared/shared-data.service';

@Component({
  selector: 'app-server-error',
  templateUrl: './server-error.component.html',
  styleUrls: ['./server-error.component.css']
})
export class ServerErrorComponent implements OnInit {

  @Input() statusCode !: number;
  errorHeading!: string;
  errorInfo!: string;

  constructor(private location: Location, private sharedData: SharedDataService) { }
  ngOnInit(): void {
    const { errorHeading, errorInfo } = this.sharedData.getErrorMsg(this.statusCode);
    this.errorHeading = errorHeading;
    this.errorInfo = errorInfo;
  }
  goBack() {
    this.location.back();
  }

}
