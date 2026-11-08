import { describe, expect, test } from "vitest";
import { no, o, y } from "../Combinadores";
import { Contacto } from "../Contacto";
import { Correo } from "../Correo";
import { asuntoContiene, esFavorito, estaLeido, remitenteDelDominio } from "../Predicados";

describe("Combinadores lógicos", () => {
  const profesor = new Contacto("Wendy", "wendy@ucp.edu.ar");
  const seulgi = new Contacto("Kang Seulgi", "seulgi@gmail.com");
  const joy = new Contacto("Joy", "joy@gmail.com");

  const crearCorreo = (asunto: string, remitente: Contacto = profesor): Correo =>
    new Correo("24", asunto, "Sin novedades", remitente, [joy]);

  test("y se cumple solo cuando se cumplen todos los predicados", () => {
    const examenDeLaUcp = y(remitenteDelDominio("@ucp.edu.ar"), asuntoContiene("Examen"));

    expect(examenDeLaUcp(crearCorreo("Examen final"))).toBe(true);
    expect(examenDeLaUcp(crearCorreo("Aviso general"))).toBe(false);
    expect(examenDeLaUcp(crearCorreo("Examen de baile", seulgi))).toBe(false);
    expect(examenDeLaUcp(crearCorreo("Aviso general", seulgi))).toBe(false);
  });

  test("y acepta más de dos predicados", () => {
    const condicion = y(asuntoContiene("Examen"), estaLeido, esFavorito);
    const correo = crearCorreo("Examen final");

    expect(condicion(correo)).toBe(false);

    correo.marcarComoLeido();
    expect(condicion(correo)).toBe(false);

    correo.marcarComoFavorito();
    expect(condicion(correo)).toBe(true);
  });

  test("o se cumple cuando se cumple al menos uno de los predicados", () => {
    const proyectoOReunion = o(asuntoContiene("Proyecto"), asuntoContiene("Reunión"));

    expect(proyectoOReunion(crearCorreo("Proyecto final"))).toBe(true);
    expect(proyectoOReunion(crearCorreo("Reunión del grupo"))).toBe(true);
    expect(proyectoOReunion(crearCorreo("Cumpleaños de Joy"))).toBe(false);
  });

  test("no invierte el resultado del predicado", () => {
    const noLeido = no(estaLeido);
    const correo = crearCorreo("Aviso");

    expect(noLeido(correo)).toBe(true);

    correo.marcarComoLeido();
    expect(noLeido(correo)).toBe(false);
  });

  test("los combinadores se pueden anidar", () => {
    // (asunto con Proyecto o Reunión) y no leído
    const seguimiento = y(
      o(asuntoContiene("Proyecto"), asuntoContiene("Reunión")),
      no(estaLeido)
    );
    const pendiente = crearCorreo("Reunión del grupo");
    const leido = crearCorreo("Reunión del grupo");
    leido.marcarComoLeido();

    expect(seguimiento(pendiente)).toBe(true);
    expect(seguimiento(leido)).toBe(false);
    expect(seguimiento(crearCorreo("Cumpleaños de Joy"))).toBe(false);
  });

  test("un predicado se puede reutilizar en varias combinaciones", () => {
    const esExamen = asuntoContiene("Examen");
    const examenLeido = y(esExamen, estaLeido);
    const examenOFavorito = o(esExamen, esFavorito);
    const correo = crearCorreo("Examen final");

    expect(examenLeido(correo)).toBe(false);
    expect(examenOFavorito(correo)).toBe(true);
    expect(esExamen(correo)).toBe(true);
  });

  test("combinar predicados no modifica el correo", () => {
    const correo = crearCorreo("Examen final");
    y(asuntoContiene("Examen"), no(estaLeido))(correo);

    expect(correo.getAsunto()).toBe("Examen final");
    expect(correo.estaLeido()).toBe(false);
    expect(correo.esFavorito()).toBe(false);
    expect(correo.getRemitente()).toBe(profesor);
  });
});
