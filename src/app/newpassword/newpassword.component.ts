import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ValidacionService } from '../services/validacion.service'; // Asegúrate de importar el servicio correctamente

@Component({
  selector: 'app-new-password',
  templateUrl: './newpassword.component.html',
  styleUrls: ['./newpassword.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule]
})
export class NewPasswordComponent implements OnInit {
  newPasswordForm: FormGroup;
  token: string | null = null;
  username: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private ValidacionService: ValidacionService
  ) {
    this.newPasswordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
      this.username = params['username'];
    });
  }

  ngOnInit(): void {
    // Obtén el token y el username de la URL
    this.token = this.route.snapshot.queryParamMap.get('token');
    this.username = this.route.snapshot.queryParamMap.get('username');

    console.log('Token:', this.token);
    console.log('Username:', this.username);
  }

  updatePassword(): void {
    if (this.newPasswordForm.valid && this.token && this.username) {
      const newPassword = this.newPasswordForm.value.newPassword;

      console.log('Enviando solicitud para actualizar la contraseña...'); // Agrega esto para depurar

      this.ValidacionService.resetPassword(this.username, this.token, newPassword).subscribe(
        response => {
          console.log('Contraseña actualizada:', response);
          this.router.navigate(['/login']);
        },
        error => {
          console.error('Error al actualizar la contraseña:', error);
        }
      );
    } else {
      console.log('Formulario inválido o faltan parámetros');
    }
  }
}
