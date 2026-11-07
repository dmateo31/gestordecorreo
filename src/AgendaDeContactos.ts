import { Contacto } from "./Contacto";

export class AgendaDeContactos {
  private contactos: Contacto[] = [];

    public agregarContacto(contacto: Contacto): void {
        if(this.buscarContactoPorEmail(contacto.getEmail())) {
            throw new Error("Ya existe un contacto con este email");
        }
        this.contactos.push(contacto);
    }

    public obtenerContactos(): Contacto[] {
       return [...this.contactos];
    }

    public buscarContactoPorEmail(email: string): Contacto | undefined {
        //toLowerCase devuelve una copia del texto con todas las letras en miniqscula, esto es para que la busqueda no sea sensible a mayusculas y minusculas
        //ej: "JUNGKOOK@bts.arirang.ar".toLowerCase();  == "jungkook@bts.arirang.ar"
        return this.contactos.find((contacto) => contacto.getEmail().toLowerCase() === email.toLowerCase());
    }

    public modificarContacto(email: string, nuevoNombre: string, nuevoEmail: string): void {
        const contacto= this.buscarContactoPorEmail(email);
         if (!contacto) {
            throw new Error("No se encontró el contacto con el email proporcionado");
        }

     const otro = this.buscarContactoPorEmail(nuevoEmail);
        if (otro && otro !== contacto) {
            throw new Error("Ya existe un contacto con este email");
        }

        contacto.setEmail(nuevoEmail);
        contacto.setNombre(nuevoNombre);
    
    }

}
