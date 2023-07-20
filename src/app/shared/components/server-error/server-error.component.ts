import { Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { SharedDataService } from '../../../shared/services/shared-data.service';
import { ErrorMessageService } from 'src/app/shared/services/error-message.service';

@Component({
  selector: 'app-server-error',
  templateUrl: './server-error.component.html',
  styleUrls: ['./server-error.component.css']
})
export class ServerErrorComponent implements OnInit {

  @Input() statusCode !: number;
  errorHeading!: string;
  errorInfo!: string;

  constructor(private location: Location, private sharedData: SharedDataService, private errMsgService: ErrorMessageService) { }
  ngOnInit(): void {
    const { errorHeading, errorInfo } = this.errMsgService.getErrorMsg(this.statusCode);
    this.errorHeading = errorHeading;
    this.errorInfo = errorInfo;
  }
  goBack() {
    this.location.back();
  }

}
