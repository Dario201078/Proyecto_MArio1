import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule,FormsModule} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CrudService } from '../services/crud.service';
import { ValidacionService } from '../services/validacion.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,FormsModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  providers: [ValidacionService, CrudService]
})
export class AdminComponent implements OnInit {
  users: any[] = [];
  newUser = { username: '', password: '' };
  selectedUser: any = null;
  isEditing = false;

  constructor( private crudservice: CrudService, private validacionservice: ValidacionService, private http: HttpClient, private router: Router) {}
    ngOnInit(): void {
      this.getUsers();
    }

    getUsers(): void {
      this.crudservice.getUsers().subscribe(users => {
        this.users = users;

      });
    }

    createUser(): void {
      this.crudservice.createUser(this.newUser).subscribe(() => {
        this.getUsers();
        this.newUser = { username: '', password: '' };
      });
      // this.showAlert('success', 'Usuario creado exitosamente.');
    }

    editUser(user: any): void {
      this.selectedUser = { ...user };
      this.isEditing = true;

    }

    updateUser(): void {
      this.crudservice.updateUser(this.selectedUser.id, this.selectedUser).subscribe(() => {
        this.getUsers();
        // this.cancelEdit();
      });
      // this.showAlert('info', 'Usuario actualizado exitosamente.');
      console.log('info','usuario actualizado')
    }

    deleteUser(id: number): void {
      this.crudservice.deleteUser(id).subscribe(() => {
        this.getUsers();
      });
      // this.showAlert('danger', 'Usuario eliminado exitosamente.');
      console.log('info','usuario a sido eliminado')
    }
}

