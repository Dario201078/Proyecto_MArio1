import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, PrivacyPolicyComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private router: Router) {}

  isPrivacyAccepted(): boolean {
    return localStorage.getItem('privacyAccepted') === 'true';
  }

  ngOnInit() {
    if (!this.isPrivacyAccepted()) {
      this.router.navigate(['/privacy-policy']);
    }
  }
}
