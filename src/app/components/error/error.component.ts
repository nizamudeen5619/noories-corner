import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { ErrorMessageService } from '../../modules/shared/services/error-message.service';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent implements OnInit {

  errorHeading!: string;
  errorInfo!: string;
  errorCode!: number;

  constructor(private location: Location, private errMsgService: ErrorMessageService, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.errorCode = this.activatedRoute.snapshot.params['errorCode'];
    const { errorHeading, errorInfo } = this.errMsgService.getErrorMsg(this.errorCode);
    this.errorHeading = errorHeading;
    this.errorInfo = errorInfo;
  }

  goBack() {
    this.location.back()
  }

}
