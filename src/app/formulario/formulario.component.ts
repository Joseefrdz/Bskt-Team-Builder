import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { DataService } from '../service/data.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-formulario',
  imports: [FormsModule],
  templateUrl: './formulario.component.html',
  styleUrl: './formulario.component.css'
})
export class FormularioComponent {

  nombre: string = '';
  email: string = '';
  asunto: string = '';
  mensaje: string = '';

  constructor(private dataService: DataService) {
  }

  agregarElemento() {
    if (this.nombre.length > 0 && this.email.length > 0 && this.email.length > 0 && this.mensaje.length > 0) {
      this.dataService.addContacto({
        nombre: this.nombre,
        email: this.email,
        asunto: this.asunto,
        mensaje: this.mensaje
      });
      Swal.fire({
        icon: 'success',
        title: 'Mensaje agregado correctamente',
        showConfirmButton: false,
        timer: 1500,
      });
      this.limpiarDatos();
      localStorage.setItem('contactos', JSON.stringify(this.dataService.getContactos()))
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Faltan datos',
        showConfirmButton: false,
        timer: 1500,
      });
    }
    this.limpiarDatos();

  }

  public limpiarDatos() {
    this.nombre = '',
      this.email = '',
      this.asunto = '',
      this.mensaje = '';
  };

}
