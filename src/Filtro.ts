import { Correo } from "./Correo";
import { IFiltrador } from "./interfaces/IFiltrador";
import { Predicado } from "./Predicados";
import { validarReglas } from "./Reglas";

// Un filtro es solo un nombre y una condición (un predicado). No guarda correos:
// los evalúa en el momento sobre la colección que reciba, así siempre ve el estado actual.
export class Filtro implements IFiltrador {
  private nombre: string = "";
  private condicion!: Predicado;

  constructor(nombre: string, condicion: Predicado) {
    this.setNombre(nombre);
    this.setCondicion(condicion);
  }

  public getNombre(): string {
    return this.nombre;
  }

  private setNombre(nombre: string): void {
    validarReglas(nombre, [
      (n) => (n.trim() === "" ? "El filtro debe tener un nombre" : null),
    ]);
    this.nombre = nombre;
  }

  // se expone la condición para poder reutilizarla al armar otros filtros
  public getCondicion(): Predicado {
    return this.condicion;
  }

  private setCondicion(condicion: Predicado): void {
    this.condicion = condicion;
  }

  public cumple(correo: Correo): boolean {
    return this.getCondicion()(correo);
  }

  //filter devuelve una lista nueva: la colección original y sus correos no se tocan
  public aplicar(correos: Correo[]): Correo[] {
    return correos.filter((correo) => this.cumple(correo));
  }
}
