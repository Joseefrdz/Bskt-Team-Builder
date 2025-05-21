import { Injectable } from '@angular/core';
import { Contacto } from '../models/Clases';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private contactos: Contacto[]=[];

  constructor() { }

  public getContactos(){
    return this.contactos;
  }

  public addContacto(contacto: Contacto){
    this.contactos.push(contacto)
  }
}
