import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.css']
})
export class PrivacyPolicyComponent {
  constructor(private router: Router) {}

  acceptPrivacyPolicy() {
    localStorage.setItem('privacyAccepted', 'true');
    this.router.navigate(['/register']); // Redirige a la página de registro
  }
}
