import { IIdentificable } from "./interfaces/IIdentificable";

export class Correo implements IIdentificable {
  private id: string = "";
  private asunto: string = "";
  private cuerpo: string = "";

  constructor(id: string, asunto: string, cuerpo: string) {
    this.setId(id);
    this.setAsunto(asunto);
    this.setCuerpo(cuerpo);
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
}