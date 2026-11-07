import {describe, expect, test} from "vitest";
import {AgendaDeContactos} from "../AgendaDeContactos";
import {Contacto} from "../Contacto";
import {GestorCorreos} from "../GestorCorreos";
import {Correo} from "../Correo";

describe("Agenda de contactos", () => {
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

  test("Se pueden modificar contactos existentes", () => {
    const agenda = new AgendaDeContactos();
    const contacto = new Contacto("Jungkook", "jungkook@bts.arirang.ar");

    agenda.agregarContacto(contacto);

    agenda.modificarContacto("jungkook@bts.arirang.ar", "Jeon Jungkook", "jungkook@bts.loveyourself.ar");
    expect(contacto.getNombre()).toBe("Jeon Jungkook");
    expect(contacto.getEmail()).toBe("jungkook@bts.loveyourself.ar");

  });

  test("no se permite modificar el contacto a uno que ya es usado por otro contacto", () => {
    const agenda = new AgendaDeContactos();
    agenda.agregarContacto(new Contacto("Jungkook", "jungkook@bts.arirang.ar"));
    agenda.agregarContacto(new Contacto("Taehyung", "tae@bts.arirang.ar"));

    expect(() =>
        agenda.modificarContacto("tae@bts.arirang.ar", "Taehyung", "jungkook@bts.arirang.ar")
        ).toThrow("Ya existe un contacto con este email");

     expect(agenda.buscarContactoPorEmail("tae@bts.arirang.ar")).toBeDefined();

  });

  test("se puede eliminar un constacto de la agenda", () => {
    const agenda = new AgendaDeContactos();
    const contacto = new Contacto("Jungkook", "jungkook@bts.arirang.ar");
    const contacto2 = new Contacto("Taehyung", "tae@bts.arirang.ar");

    agenda.agregarContacto(contacto);
    agenda.agregarContacto(contacto2);

    agenda.eliminarContacto("jungkook@bts.arirang.ar");

    expect(agenda.buscarContactoPorEmail("jungkook@bts.arirang.ar")).toBeUndefined();
    expect(agenda.obtenerContactos()).toEqual([contacto2]);

  });

  test("error al eliminar un contacto que no existe", () => {
    const agenda = new AgendaDeContactos(); 

    expect(() => agenda.eliminarContacto("nadie@bts.arirang.ar")).toThrow(
        "No se encontró el contacto con el email proporcionado"
    );
});

    test("si se elimina un contacto su historial de correo no desaparece", () => {
        const agenda = new AgendaDeContactos();
        const gestor = new GestorCorreos();
        const contacto = new Contacto("Jungkook", "jungkook@bts.arirang.ar");
        const contacto2 = new Contacto("Taehyung", "tae@.bts.arirang.ar");

        agenda.agregarContacto(contacto);
        agenda.agregarContacto(contacto2);

        const correo = new Correo(
            "24",
            "El mejor concierto",
            "BTS con la casaca argentina",
            contacto,
            [contacto2]
        );
        gestor.enviar(correo);

        agenda.eliminarContacto("jungkook@bts.arirang.ar");

        expect(agenda.buscarContactoPorEmail("jungkook@bts.arirang.ar")).toBeUndefined();
        expect(gestor.obtenerEnviados()).toContain(correo);
        expect(correo.getRemitente().getNombre()).toBe("Jungkook");
        expect(correo.getRemitente().getEmail()).toBe("jungkook@bts.arirang.ar");

    });

});