import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { AdminComponent } from './admin/admin.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { PasswordComponent } from './password/password.component';
import { NewPasswordComponent } from './newpassword/newpassword.component';

export const routes: Routes = [
  { path: '', redirectTo: '/privacy-policy', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: HomeComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'privacy-policy', component: PrivacyPolicyComponent },
  { path: 'password', component: PasswordComponent },
  { path: 'reset-password', component: NewPasswordComponent },
  { path: '**', redirectTo: '/privacy-policy' }

];
