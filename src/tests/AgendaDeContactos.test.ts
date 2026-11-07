import {describe, expect, test} from "vitest";
import {AgendaDeContactos} from "../AgendaDeContactos";
import {Contacto} from "../Contacto";

describe("Gestor de correos", () => {
  test("se agrega un contacto nuevo", () => {
    const agenda = new AgendaDeContactos();
    const contacto = new Contacto ("Jungkook", "jungkook@bts.arirang.ar");

    agenda.agregarContacto(contacto);
    expect(agenda.obtenerContactos()).toContain(contacto);

  });

  test("se puede buscar un contacto por su email", () => {
    const agenda = new AgendaDeContactos();
    const contacto = new Contacto("Jungkook", "jungkook@bts.arirang.ar");

    agenda.agregarContacto(contacto);

    expect(agenda.buscarContactoPorEmail("jungkook@bts.arirang.ar")).toBe(contacto);

  });
});