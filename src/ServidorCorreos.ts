import { Contacto } from "./Contacto";
import { GeneradorIdSecuencial } from "./GeneradorIdSecuencial";
import { GestorCorreos } from "./GestorCorreos";
import { IGeneradorId } from "./interfaces/IGeneradorId";
import { Correo } from "./Correo";
 
 
 export class ServidorCorreo{

  private readonly gestores: Map<string, GestorCorreos> = new Map();

    constructor (
      private readonly generadorId : IGeneradorId = new GeneradorIdSecuencial()
    ){}

  public casillaDe(contacto: Contacto): GestorCorreos {
    const clave = contacto.getEmail().toLowerCase();
    //se utiliza let ya que la variable gestores puede cambiar de undefined defined
    let gestor = this.gestores.get(clave);
    if (gestor === undefined) {
      gestor = new GestorCorreos(this.generadorId);
      this.gestores.set(clave, gestor);
    }
    return gestor;
  }

   public enviar(correo: Correo): void {
    // se obtiene el remitente del correo y se busac en el map el gestor de ese remitente y envia los correos
    this.casillaDe(correo.getRemitente()).enviar(correo);
    //devuevle una lisyta con todos los destinatarios y ejecuta el if por cada destinatario
    correo.getDestinatarios().forEach((destinatario) => {
      const gestor = this.casillaDe(destinatario);
      if (gestor.obtenerBandejaDe(correo) === undefined) {
        gestor.recibirCorreo(correo);
      }
    });
  }

  }
 