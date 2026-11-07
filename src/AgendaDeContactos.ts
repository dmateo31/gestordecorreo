import { Contacto } from "./Contacto";

export class AgendaDeContactos {
  private contactos: Contacto[] = [];

    public agregarContacto(contacto: Contacto): void {
        this.contactos.push(contacto);
    }

    public obtenerContactos(): Contacto[] {
        return this.contactos;
    }

    

}
