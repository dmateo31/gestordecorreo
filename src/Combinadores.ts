import { Predicado } from "./Predicados";

// Los combinadores son funciones de orden superior: reciben predicados y devuelven un predicado nuevo.
// Los predicados originales no se modifican, así se pueden reutilizar en cuantas combinaciones haga falta.

// AND: se cumple solo si se cumplen todos los predicados
export const y =
  (...predicados: Predicado[]): Predicado =>
  (correo) =>
    predicados.every((predicado) => predicado(correo));

// OR: se cumple si se cumple al menos uno
export const o =
  (...predicados: Predicado[]): Predicado =>
  (correo) =>
    predicados.some((predicado) => predicado(correo));

// NOT: se cumple cuando el predicado no se cumple
export const no =
  (predicado: Predicado): Predicado =>
  (correo) =>
    !predicado(correo);
