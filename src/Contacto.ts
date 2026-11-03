export class Contacto {
  private nombre: string = "";
  private email: string = "";

  constructor(nombre: string, email: string) {
    this.setNombre(nombre);
    this.setEmail(email);
  }

  public getNombre(): string {
    return this.nombre;
  }

  public setNombre(nombre: string): void {
    this.nombre = nombre;
  }

  public getEmail(): string {
    return this.email;
  }

  public setEmail(email: string): void {
    this.email = email;
  }
}