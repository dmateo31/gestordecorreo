import { describe, expect, test } from "vitest";
import { no, y } from "../Combinadores";
import { Contacto } from "../Contacto";
import { Correo } from "../Correo";
import { Filtro } from "../Filtro";
import { asuntoContiene, estaLeido, esFavorito, remitenteDelDominio } from "../Predicados";

describe("Filtro", () => {
  const profesor = new Contacto("Wendy", "wendy@ucp.edu.ar");
  const seulgi = new Contacto("Kang Seulgi", "seulgi@gmail.com");
  const joy = new Contacto("Joy", "joy@gmail.com");

  const crearCorreo = (id: string, asunto: string, remitente: Contacto = profesor): Correo =>
    new Correo(id, asunto, "Sin novedades", remitente, [joy]);

  test("un filtro tiene un nombre y una condición", () => {
    const condicion = asuntoContiene("Examen");
    const filtro = new Filtro("Exámenes", condicion);

    expect(filtro.getNombre()).toBe("Exámenes");
    expect(filtro.getCondicion()).toBe(condicion);
  });

  test("no se puede crear un filtro sin nombre", () => {
    expect(() => new Filtro("", asuntoContiene("Examen"))).toThrow(
      "El filtro debe tener un nombre"
    );
    expect(() => new Filtro("   ", asuntoContiene("Examen"))).toThrow(
      "El filtro debe tener un nombre"
    );
  });

  test("cumple indica si un correo cumple la condición del filtro", () => {
    const filtro = new Filtro("Exámenes", asuntoContiene("Examen"));

    expect(filtro.cumple(crearCorreo("1", "Examen final"))).toBe(true);
    expect(filtro.cumple(crearCorreo("2", "Aviso general"))).toBe(false);
  });

  test("aplicar devuelve solo los correos que cumplen la condición", () => {
    const filtro = new Filtro("Exámenes", asuntoContiene("Examen"));
    const examen1 = crearCorreo("1", "Examen final");
    const aviso = crearCorreo("2", "Aviso general");
    const examen2 = crearCorreo("3", "Examen recuperatorio");

    expect(filtro.aplicar([examen1, aviso, examen2])).toEqual([examen1, examen2]);
  });

  test("aplicar devuelve una lista vacía si ningún correo cumple", () => {
    const filtro = new Filtro("Exámenes", asuntoContiene("Examen"));

    expect(filtro.aplicar([crearCorreo("1", "Aviso general")])).toEqual([]);
  });

  test("aplicar sobre una colección vacía devuelve una lista vacía", () => {
    const filtro = new Filtro("Exámenes", asuntoContiene("Examen"));

    expect(filtro.aplicar([])).toEqual([]);
  });

  test("aplicar no modifica la colección ni los correos originales", () => {
    const filtro = new Filtro("Sin leer", no(estaLeido));
    const correo1 = crearCorreo("1", "Examen final", seulgi);
    const correo2 = crearCorreo("2", "Aviso general");
    correo1.marcarComoFavorito();
    correo2.marcarComoLeido();
    const correos = [correo1, correo2];

    filtro.aplicar(correos);

    expect(correos).toEqual([correo1, correo2]);
    expect(correos).toHaveLength(2);
    expect(correo1.getAsunto()).toBe("Examen final");
    expect(correo1.getRemitente()).toBe(seulgi);
    expect(correo1.estaLeido()).toBe(false);
    expect(correo1.esFavorito()).toBe(true);
    expect(correo2.estaLeido()).toBe(true);
    expect(correo2.esFavorito()).toBe(false);
  });

  test("aplicar devuelve una lista nueva, no la colección recibida", () => {
    const filtro = new Filtro("Todos", () => true);
    const correos = [crearCorreo("1", "Examen final")];

    const resultado = filtro.aplicar(correos);

    expect(resultado).toEqual(correos);
    expect(resultado).not.toBe(correos);
  });

  test("un mismo filtro se puede aplicar sobre distintas colecciones", () => {
    const filtro = new Filtro("De la UCP", remitenteDelDominio("@ucp.edu.ar"));
    const deLaUcp1 = crearCorreo("1", "Examen final");
    const deSeulgi = crearCorreo("2", "Comeback de Red Velvet", seulgi);
    const deLaUcp2 = crearCorreo("3", "Aviso general");

    expect(filtro.aplicar([deLaUcp1, deSeulgi])).toEqual([deLaUcp1]);
    expect(filtro.aplicar([deSeulgi, deLaUcp2])).toEqual([deLaUcp2]);
    expect(filtro.aplicar([deSeulgi])).toEqual([]);
  });

  test("los cambios en los correos se reflejan al aplicar de nuevo el filtro, sin guardarlos otra vez", () => {
    const filtro = new Filtro("Sin leer", no(estaLeido));
    const correo = crearCorreo("1", "Aviso general");
    const correos = [correo];

    expect(filtro.aplicar(correos)).toEqual([correo]);

    correo.marcarComoLeido();
    expect(filtro.aplicar(correos)).toEqual([]);

    correo.marcarComoNoLeido();
    expect(filtro.aplicar(correos)).toEqual([correo]);
  });

  test("un filtro nuevo se puede armar reutilizando la condición de otro", () => {
    const deLaUcp = new Filtro("De la UCP", remitenteDelDominio("@ucp.edu.ar"));
    const favoritosDeLaUcp = new Filtro(
      "Favoritos de la UCP",
      y(deLaUcp.getCondicion(), esFavorito)
    );
    const favorito = crearCorreo("1", "Examen final");
    const comun = crearCorreo("2", "Aviso general");
    favorito.marcarComoFavorito();

    expect(favoritosDeLaUcp.aplicar([favorito, comun])).toEqual([favorito]);
    expect(deLaUcp.aplicar([favorito, comun])).toEqual([favorito, comun]);
  });
});
