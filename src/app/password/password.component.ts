import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ValidacionService } from '../services/validacion.service';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reset-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.css'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule]
})
export class PasswordComponent {
  resetForm: FormGroup;
  requestForm: FormGroup;
  token: string | null;
  username: string | null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private ValidacionService: ValidacionService,
    private router: Router
  ) {
    this.token = this.route.snapshot.queryParamMap.get('token');
    this.username = this.route.snapshot.queryParamMap.get('username');

    this.resetForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.requestForm = this.fb.group({
      username: ['', [Validators.required]]
    });
  }

  resetPassword(): void {
    if (this.resetForm.valid && this.token && this.username) {
      const newPassword = this.resetForm.value.newPassword;
      this.ValidacionService.resetPassword(this.username, this.token, newPassword).subscribe(
        () => {
          this.router.navigate(['/login']);
        },
        error => {
          console.error('Error al restablecer la contraseña', error);
        }
      );
    }
  }

  requestReset(): void {
    if (this.requestForm.valid) {
      const username = this.requestForm.value.username;  // Cambiado de email a username
      console.log('Username:', username);  // Verifica que el username sea correcto
      this.ValidacionService.requestPasswordReset(username).subscribe(
        response => {
          console.log('Correo de restablecimiento enviado', response);
        },
        error => {
          console.error('Error solicitando el restablecimiento de contraseña', error);
        }
      );
    }
  }
}
