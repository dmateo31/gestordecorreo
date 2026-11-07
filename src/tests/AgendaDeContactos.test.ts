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

  test("devuelve undefined si el email no está en la agenda", () => {
    const agenda = new AgendaDeContactos();

    expect(agenda.buscarContactoPorEmail("nadie@bts.arirang.ar")).toBeUndefined();
  });

  test ("no se puedes agregar dos contactos con el mismo email, tambien no hace diferencia entre miniscula y mayuscula", () => {
    const agenda = new AgendaDeContactos();
    const contacto = new Contacto("Jungkook", "jungkook@bts.arirang.ar");
    agenda.agregarContacto(contacto);
    const contactoDuplicado = new Contacto("Jeon Jungkook", "JUNGKOOK@bts.arirang.ar");

    expect(() => agenda.agregarContacto(contactoDuplicado)).toThrow(
      "Ya existe un contacto con este email"
    );

    expect(agenda.obtenerContactos()).toHaveLength(1);


  });


});