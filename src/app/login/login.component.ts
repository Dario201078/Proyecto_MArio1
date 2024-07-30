import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ValidacionService } from '../services/validacion.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private validacionService: ValidacionService
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;

      this.validacionService.login(username, password).subscribe(
        response => {
          if (response.message === 'Logueo exitoso') {
            console.log('User logged in successfully');
            localStorage.setItem('role', response.user.role); // Almacenar el rol en el localStorage
            if (response.user.role === 'admin') {
              this.router.navigate(['/admin']);
            } else {
              this.router.navigate(['/home']);
            }
          } else {
            console.error('Error logging in:', response.message);
          }
        },
        error => console.error('Error:', error)
      );
    }
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }
}
