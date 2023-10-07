import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent {

  @Input() displayStyle!: string;

  constructor(private router: Router) { }

  closeModal() {
    this.displayStyle = "none";
  }

  navigateToLoginPage() {
    this.displayStyle = "none";
    this.router.navigateByUrl('/user/login')
  }

}
