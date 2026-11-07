import {describe, it, expect, test} from 'vitest';
import {Contacto} from '../Contacto';

describe('Validación de contactos', () => {
  it.each([ 
    "jungkook-sin-arroba",
    "jungkook@",
    "bts.arirang.ar",
    "jungkook@bts",
    "jungkook @bts.arirang.ar",
    "",
  ])("no se permite crear un contacto con email inválido: %s", (email) => {
    expect(() => new Contacto("Jungkook", email)).toThrow(
      "El email no es válido"
    );

  });

  test("se crea un contacto con emial válido", () => {
    const contacto = new Contacto("Jungkook", "Jungkook@bts.arirang.ar");

    expect(contacto.getEmail()).toBe("Jungkook@bts.arirang.ar");

});

});