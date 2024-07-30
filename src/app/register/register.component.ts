import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ValidacionService } from '../services/validacion.service';
import { PasswordValidators } from './password.validators'; // Asegúrate de que la ruta sea correcta

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private validacionService: ValidacionService
  ) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [
        Validators.required,
        PasswordValidators.minlength,
        PasswordValidators.uppercase,
        PasswordValidators.lowercase,
        PasswordValidators.specialChar,
        PasswordValidators.consecutiveNumbers,
        PasswordValidators.consecutiveLetters
      ]]
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.validacionService.register(this.registerForm.value).subscribe(
        response => {
          console.log('User registered successfully');
          this.router.navigate(['/login']);
        },
        error => console.error('Error registering user:', error)
      );
    }
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}
