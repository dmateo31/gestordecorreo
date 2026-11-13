import { describe, expect, test } from "vitest";
import { Bandeja } from "../Bandeja";
import { Contacto } from "../Contacto";
import { Correo } from "../Correo";
import { GestorCorreos } from "../GestorCorreos";

describe("Gestión de correos favoritos", () => {
  const heejin = new Contacto("HeeJin", "heejin@gmail.com");
  const chuu = new Contacto("Chuu", "chuu@gmail.com");

  const crearCorreo = (id: string, asunto: string = "Asunto " + id, remitente: Contacto = heejin): Correo =>
    new Correo(id, asunto, "Te paso los detalles para la reunión del viernes", remitente, [chuu]);

  test("un correo se puede marcar y desmarcar como favorito", () => {
    const correo = crearCorreo("1");

    correo.marcarComoFavorito();
    expect(correo.esFavorito()).toBe(true);

    correo.desmarcarComoFavorito();
    expect(correo.esFavorito()).toBe(false);
  });

  test("un correo nuevo no es favorito", () => {
    expect(crearCorreo("1").esFavorito()).toBe(false);
  });

  test("marcar un correo como favorito no lo mueve de su bandeja", () => {
    const gestor = new GestorCorreos();
    const recibido = crearCorreo("1");
    const enviado = crearCorreo("2");
    const borrador = crearCorreo("3");
    gestor.recibirCorreo(recibido);
    gestor.enviar(enviado);
    gestor.guardarBorrador(borrador);

    [recibido, enviado, borrador].forEach((c) => c.marcarComoFavorito());

    expect(gestor.obtenerBandejaDe(recibido)).toBe(Bandeja.ENTRADA);
    expect(gestor.obtenerBandejaDe(enviado)).toBe(Bandeja.ENVIADOS);
    expect(gestor.obtenerBandejaDe(borrador)).toBe(Bandeja.BORRADORES);
    expect(gestor.obtenerBandejaDeEntrada()).toEqual([recibido]);
    expect(gestor.obtenerEnviados()).toEqual([enviado]);
    expect(gestor.obtenerBorrador()).toEqual([borrador]);
  });

  test("desmarcar un favorito tampoco lo mueve de su bandeja", () => {
    const gestor = new GestorCorreos();
    const correo = crearCorreo("1");
    correo.marcarComoFavorito();
    gestor.recibirCorreo(correo);

    correo.desmarcarComoFavorito();

    expect(gestor.obtenerBandejaDe(correo)).toBe(Bandeja.ENTRADA);
    expect(gestor.obtenerBandejaDeEntrada()).toEqual([correo]);
  });
});