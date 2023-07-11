import { Component, Input, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent {
  @Input() process!: string;
  @Input() message!: string;
  modalRef: NgbModalRef | undefined;

  constructor(private modalService: NgbModal, private router: Router) { }

  openModal() {
    this.modalRef = this.modalService.open(this.message, { windowClass: 'dark-modal', centered: true });
  }

  closeModal() {
    if (this.modalRef) {
      this.modalRef.close();
      this.modalRef = undefined;
    }
  }

  dismissModal() {
    if (this.modalRef) {
      this.modalRef.dismiss();
      this.modalRef = undefined;
    }
  }

  navigateToProfile() {
    this.closeModal();
    this.router.navigate(['/profile']);
  }

  navigateToHome() {
    this.closeModal();
    this.router.navigate(['/home']);
  }
}
