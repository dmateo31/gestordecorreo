import { Correo } from "../Correo";
import { Contacto } from "../Contacto";
import { describe, expect, test } from "vitest";

describe("Clase Correo", () => {
  test("guarda los datos que recibe en el constructor", () => {
    const remitente = new Contacto("Irene", "irene@gmail.com");
    const destinatario = new Contacto("Seulgi", "seulgi@hotmail.com");

    const correo = new Correo("1", "Hola", "Mensaje de prueba", remitente, [destinatario]);

    expect(correo.getId()).toBe("1");
    expect(correo.getAsunto()).toBe("Hola");
    expect(correo.getCuerpo()).toBe("Mensaje de prueba");
    expect(correo.getRemitente()).toBe(remitente);
    expect(correo.getDestinatarios()).toHaveLength(1);
    expect(correo.getDestinatarios()[0]).toBe(destinatario);
  });

  test("los setters modifican asunto, cuerpo, remitente y destinatarios", () => {
    const irene = new Contacto("Irene", "irene@gmail.com");
    const seulgi = new Contacto("Seulgi", "seulgi@hotmail.com");
    const heejin = new Contacto("Heejin", "heejin@outlook.com");
    const correo = new Correo("1", "Hola", "Mensaje de prueba", irene, [seulgi]);

    correo.setAsunto("Nuevo asunto");
    correo.setCuerpo("Nuevo cuerpo");
    correo.setRemitente(heejin);
    correo.setDestinatarios([seulgi, irene]);

    expect(correo.getAsunto()).toBe("Nuevo asunto");
    expect(correo.getCuerpo()).toBe("Nuevo cuerpo");
    expect(correo.getRemitente()).toBe(heejin);
    expect(correo.getDestinatarios()).toHaveLength(2);
  });

  test("un correo nuevo arranca no leído y no favorito", () => {
    const remitente = new Contacto("Irene", "irene@gmail.com");
    const correo = new Correo("1", "Hola", "Mensaje de prueba", remitente, []);

    expect(correo.estaLeido()).toBe(false);
    expect(correo.esFavorito()).toBe(false);
  });

  test("se puede marcar como leído y como no leído", () => {
    const remitente = new Contacto("Irene", "irene@gmail.com");
    const correo = new Correo("1", "Hola", "Mensaje de prueba", remitente, []);

    correo.marcarComoLeido();
    expect(correo.estaLeido()).toBe(true);

    correo.marcarComoNoLeido();
    expect(correo.estaLeido()).toBe(false);
  });

  test("se puede marcar y desmarcar como favorito", () => {
    const remitente = new Contacto("Irene", "irene@gmail.com");
    const correo = new Correo("1", "Hola", "Mensaje de prueba", remitente, []);

    correo.marcarComoFavorito();
    expect(correo.esFavorito()).toBe(true);

    correo.desmarcarComoFavorito();
    expect(correo.esFavorito()).toBe(false);
  });

});