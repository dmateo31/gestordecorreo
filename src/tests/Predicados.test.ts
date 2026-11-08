import { describe, expect, test } from "vitest";
import { Contacto } from "../Contacto";
import { Correo } from "../Correo";
import {
  asuntoContiene,
  cuerpoContiene,
  esFavorito,
  estaLeido,
  remitenteDelDominio,
  remitenteEs,
} from "../Predicados";

describe("Predicados básicos", () => {
  const profesor = new Contacto("Wendy", "wendy@ucp.edu.ar");
  const seulgi = new Contacto("Kang Seulgi", "seulgi@gmail.com");
  const joy = new Contacto("Joy", "joy@gmail.com");

  const crearCorreo = (
    asunto: string,
    cuerpo: string,
    remitente: Contacto
  ): Correo => new Correo("24", asunto, cuerpo, remitente, [joy]);

  test("asuntoContiene encuentra el texto en el asunto sin distinguir mayúsculas", () => {
    const correo = crearCorreo("Examen final de Paradigmas", "Fecha a confirmar", profesor);

    expect(asuntoContiene("Examen")(correo)).toBe(true);
    expect(asuntoContiene("EXAMEN FINAL")(correo)).toBe(true);
    expect(asuntoContiene("parcial")(correo)).toBe(false);
  });

  test("asuntoContiene admite coincidencias parciales", () => {
    const correo = crearCorreo("Examen final de Paradigmas", "Fecha a confirmar", profesor);

    expect(asuntoContiene("exam")(correo)).toBe(true);
    expect(asuntoContiene("paradig")(correo)).toBe(true);
  });

  test("asuntoContiene no mira el cuerpo del mensaje", () => {
    const correo = crearCorreo("Aviso", "Hay examen el lunes", profesor);

    expect(asuntoContiene("examen")(correo)).toBe(false);
  });

  test("cuerpoContiene encuentra el texto en el cuerpo sin distinguir mayúsculas", () => {
    const correo = crearCorreo("Trabajo práctico", "Recuerden la entrega del viernes", profesor);

    expect(cuerpoContiene("entrega")(correo)).toBe(true);
    expect(cuerpoContiene("ENTREGA DEL")(correo)).toBe(true);
    expect(cuerpoContiene("nota")(correo)).toBe(false);
  });

  test("cuerpoContiene no mira el asunto", () => {
    const correo = crearCorreo("Entrega del TP", "Nos vemos el viernes", profesor);

    expect(cuerpoContiene("entrega")(correo)).toBe(false);
  });

  test("remitenteDelDominio acepta el dominio con o sin arroba", () => {
    const delProfesor = crearCorreo("Aviso", "Hola", profesor);
    const deSeulgi = crearCorreo("Aviso", "Hola", seulgi);

    expect(remitenteDelDominio("@ucp.edu.ar")(delProfesor)).toBe(true);
    expect(remitenteDelDominio("ucp.edu.ar")(delProfesor)).toBe(true);
    expect(remitenteDelDominio("@ucp.edu.ar")(deSeulgi)).toBe(false);
  });

  test("remitenteDelDominio no se confunde con dominios parecidos", () => {
    const falso = new Contacto("Falso", "falso@falso-ucp.edu.ar");
    const otroDominio = new Contacto("Otro", "otro@ucp.edu.ar.com");

    expect(remitenteDelDominio("@ucp.edu.ar")(crearCorreo("Aviso", "Hola", falso))).toBe(false);
    expect(remitenteDelDominio("@ucp.edu.ar")(crearCorreo("Aviso", "Hola", otroDominio))).toBe(false);
  });

  test("remitenteEs compara por email sin distinguir mayúsculas", () => {
    const correo = crearCorreo("Aviso", "Hola", seulgi);
    const mismoEmail = new Contacto("SG", "SEULGI@gmail.com");

    expect(remitenteEs(seulgi)(correo)).toBe(true);
    expect(remitenteEs(mismoEmail)(correo)).toBe(true);
    expect(remitenteEs(profesor)(correo)).toBe(false);
  });

  test("estaLeido y esFavorito reflejan el estado actual del correo", () => {
    const correo = crearCorreo("Aviso", "Hola", profesor);

    expect(estaLeido(correo)).toBe(false);
    expect(esFavorito(correo)).toBe(false);

    correo.marcarComoLeido();
    correo.marcarComoFavorito();

    expect(estaLeido(correo)).toBe(true);
    expect(esFavorito(correo)).toBe(true);

    correo.marcarComoNoLeido();
    correo.desmarcarComoFavorito();

    expect(estaLeido(correo)).toBe(false);
    expect(esFavorito(correo)).toBe(false);
  });
});