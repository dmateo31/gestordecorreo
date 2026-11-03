import { Contacto } from "./Contacto";
import { IIdentificable } from "./interfaces/IIdentificable";
import { ILeible } from "./interfaces/ILeible";
export class Correo implements IIdentificable, ILeible {
  private id: string = "";
  private asunto: string = "";
  private cuerpo: string = "";
  private remitente!: Contacto;
  private destinatarios: Contacto[] = [];
  private leido: boolean = false;

  constructor(
    id: string,
    asunto: string,
    cuerpo: string,
    remitente: Contacto,
    destinatarios: Contacto[]
  ) {
    this.setId(id);
    this.setAsunto(asunto);
    this.setCuerpo(cuerpo);
    this.setRemitente(remitente);
    this.setDestinatarios(destinatarios);
  }

  public getId(): string {
    return this.id;
  }

  private setId(id: string): void {
    this.id = id;
  }

  public getAsunto(): string {
    return this.asunto;
  }

  public setAsunto(asunto: string): void {
    this.asunto = asunto;
  }

  public getCuerpo(): string {
    return this.cuerpo;
  }

  public setCuerpo(cuerpo: string): void {
    this.cuerpo = cuerpo;
  }

  public getRemitente(): Contacto {
    return this.remitente;
  }

  public setRemitente(remitente: Contacto): void {
    this.remitente = remitente;
  }

  public getDestinatarios(): Contacto[] {
    return [...this.destinatarios];
  }

  public setDestinatarios(destinatarios: Contacto[]): void {
    this.destinatarios = [...destinatarios];
  }
  public marcarComoLeido(): void {
    this.setLeido(true);
  }

  public marcarComoNoLeido(): void {
    this.setLeido(false);
  }

  public estaLeido(): boolean {
    return this.leido;
  }

  private setLeido(leido: boolean): void {
    this.leido = leido;
  }
}