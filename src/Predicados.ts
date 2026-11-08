import { Contacto } from "./Contacto";
import { Correo } from "./Correo";
import { ILeible } from "./interfaces/ILeible";
import { IMarcableFavorito } from "./interfaces/IMarcableFavorito";

// Un predicado es una función que recibe un correo y responde true o false según si cumple una condición
export type Predicado = (correo: Correo) => boolean;

// Los predicados con parámetro son funciones de orden superior: reciben el dato (un texto, un dominio, un contacto)
// y devuelven el predicado ya armado, que después se usa en un filtro o se combina con y / o / no.
// toLowerCase devuelve una copia en minúsculas, así la comparación no distingue mayúsculas de minúsculas (igual que buscar)
export const asuntoContiene =
  (texto: string): Predicado =>
  (correo) =>
    correo.getAsunto().toLowerCase().includes(texto.toLowerCase());

export const cuerpoContiene =
  (texto: string): Predicado =>
  (correo) =>
    correo.getCuerpo().toLowerCase().includes(texto.toLowerCase());

export const remitenteDelDominio = (dominio: string): Predicado => {
  // acepta el dominio con o sin arroba y compara siempre con la arroba adelante,
  // para que "@ucp.edu.ar" no se confunda con "@falso-ucp.edu.ar"
  const sufijo = "@" + dominio.toLowerCase().replace(/^@/, "");
  return (correo) =>
    correo.getRemitente().getEmail().toLowerCase().endsWith(sufijo);
};

// a los contactos se los distingue por su email, igual que en la agenda
export const remitenteEs =
  (contacto: Contacto): Predicado =>
  (correo) =>
    correo.getRemitente().getEmail().toLowerCase() ===
    contacto.getEmail().toLowerCase();

// Estos dos solo necesitan saber si el correo es leíble / favorito, por eso piden la interfaz chica
export const estaLeido = (correo: ILeible): boolean => correo.estaLeido();

export const esFavorito = (correo: IMarcableFavorito): boolean =>
  correo.esFavorito();
