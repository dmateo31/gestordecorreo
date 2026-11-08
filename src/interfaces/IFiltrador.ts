import { Correo } from "../Correo";

export interface IFiltrador {
  cumple(correo: Correo): boolean;
  aplicar(correos: Correo[]): Correo[];
}
