import { no, o, y } from "./Combinadores";
import { Contacto } from "./Contacto";
import { Filtro } from "./Filtro";
import {
  asuntoContiene,
  cuerpoContiene,
  esFavorito,
  estaLeido,
  remitenteDelDominio,
  remitenteEs,
} from "./Predicados";

// Filtros de ejemplo del enunciado. Cada uno se arma combinando predicados con y / o / no.
// Son funciones que devuelven un filtro nuevo, así cada gestor puede registrar el suyo.

// Simple: una sola condición
export const filtroCorreosDeLaUcp = (): Filtro =>
  new Filtro("Correos de la UCP", remitenteDelDominio("@ucp.edu.ar"));

// Complejo (remitente + asunto): reutiliza la condición del filtro de la UCP
export const filtroAcademicosImportantes = (): Filtro =>
  new Filtro(
    "Correos académicos importantes",
    y(filtroCorreosDeLaUcp().getCondicion(), asuntoContiene("Examen"))
  );

// Complejo (estado de lectura + contenido): NOT leído AND contenido con "Entrega"
export const filtroPendientesDeRevision = (): Filtro =>
  new Filtro(
    "Pendientes de revisión",
    y(no(estaLeido), cuerpoContiene("Entrega"))
  );

// Complejo (favorito + remitente): el contacto determinado se recibe por parámetro
export const filtroPersonalesPrioritarios = (contacto: Contacto): Filtro =>
  new Filtro(
    "Correos personales prioritarios",
    y(esFavorito, remitenteEs(contacto))
  );

// Complejo (asunto + estado de lectura): (Proyecto OR Reunión) AND NOT leído
export const filtroParaSeguimiento = (): Filtro =>
  new Filtro(
    "Correos para seguimiento",
    y(
      o(asuntoContiene("Proyecto"), asuntoContiene("Reunión")),
      no(estaLeido)
    )
  );
