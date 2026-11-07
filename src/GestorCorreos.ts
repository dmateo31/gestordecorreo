import{Correo} from "./Correo";

type ReglasDeEnvio = (correo: Correo) => string | null;

const reglasDeEnvio: ReglasDeEnvio[] = [
  (c) => (!c.getRemitente() ? "El correo debe tener un remitente" : null),
  (c) =>
    c.getDestinatarios().length === 0
      ? "El correo debe tener al menos un destinatario"
      : null,
  (c) =>
    c.getAsunto().trim() === ""
      ? "El correo debe tener un asunto válido"
      : null,
];

export class GestorCorreos {
  private enviados: Correo[] = [];
  private borrador: Correo [] = [];
  private bandejaDeEntrada: Correo[] = [];

  public enviar(correo: Correo): void {
    this.validarCorreo(correo);
     this.borrador = this.borrador.filter(
      (b) => b.getId() !== correo.getId()
    );
    const yaEnviado = this.enviados.some((e) => e.getId() === correo.getId());
    if (!yaEnviado) {
      this.enviados.push(correo);
    }
  }

    private validarCorreo(correo: Correo): void {
        const errores= reglasDeEnvio
            .map((regla) => regla(correo))
            .filter((mensaje): mensaje is string => mensaje !== null);

    if (errores.length > 0) {
         throw new Error(errores.join("; "));
      }
    }

  public obtenerEnviados(): Correo[] {
    return this.enviados;
  }

  public guardarBorrador(correo: Correo): void {
    this.borrador.push(correo);
  }

  public obtenerBorrador(): Correo[] {
    return this.borrador;
  }

  public recibirCorreo(correo: Correo): void {
    this.bandejaDeEntrada.push(correo);
  }

  public obtenerBandejaDeEntrada(): Correo[] {
    return [...this.bandejaDeEntrada];
  }

   public buscar(formato: string): Correo[] {
    const formatoBuscado = formato.toLowerCase();
    return this.bandejaDeEntrada.filter(
      (correo) =>{
      const remitente = correo.getRemitente();
      return (
        correo.getAsunto().toLowerCase().includes(formatoBuscado) ||
        correo.getCuerpo().toLowerCase().includes(formatoBuscado) ||
        remitente.getNombre().toLowerCase().includes(formatoBuscado) ||
        remitente.getEmail().toLowerCase().includes(formatoBuscado)
    );
  });

   }
}
