import { describe, expect, test } from "vitest";
import { Bandeja } from "../Bandeja";
import { no, y } from "../Combinadores";
import { Contacto } from "../Contacto";
import { Correo } from "../Correo";
import { Filtro } from "../Filtro";
import { GestorCorreos } from "../GestorCorreos";
import { asuntoContiene, estaLeido, remitenteEs } from "../Predicados";

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
  test("sin correos favoritos la vista está vacía", () => {
    const gestor = new GestorCorreos();
    gestor.recibirCorreo(crearCorreo("1"));

    expect(gestor.obtenerFavoritos()).toEqual([]);
  });

  test("la vista de favoritos junta los correos de todas las bandejas", () => {
    const gestor = new GestorCorreos();
    const recibido = crearCorreo("1");
    const enviado = crearCorreo("2");
    const borrador = crearCorreo("3");
    const comun = crearCorreo("4");
    [recibido, enviado, borrador].forEach((c) => c.marcarComoFavorito());
    gestor.recibirCorreo(recibido);
    gestor.enviar(enviado);
    gestor.guardarBorrador(borrador);
    gestor.recibirCorreo(comun);

    expect(gestor.obtenerFavoritos()).toEqual([recibido, enviado, borrador]);
  });

  test("al desmarcar un favorito deja de aparecer en la vista", () => {
    const gestor = new GestorCorreos();
    const correo = crearCorreo("1");
    correo.marcarComoFavorito();
    gestor.recibirCorreo(correo);

    correo.desmarcarComoFavorito();

    expect(gestor.obtenerFavoritos()).toEqual([]);
  });

  test("un favorito no aparece repetido aunque se lo marque varias veces", () => {
    const gestor = new GestorCorreos();
    const correo = crearCorreo("1");
    gestor.recibirCorreo(correo);

    correo.marcarComoFavorito();
    correo.marcarComoFavorito();

    expect(gestor.obtenerFavoritos()).toEqual([correo]);
  });

  test("un favorito que se envía desde borrador aparece una sola vez", () => {
    const gestor = new GestorCorreos();
    const correo = crearCorreo("1");
    correo.marcarComoFavorito();
    gestor.guardarBorrador(correo);

    gestor.enviar(correo);

    expect(gestor.obtenerFavoritos()).toEqual([correo]);
    expect(gestor.obtenerBandejaDe(correo)).toBe(Bandeja.ENVIADOS);
  });

  test("un favorito eliminado queda en Eliminados y no aparece en la vista de favoritos", () => {
    const gestor = new GestorCorreos();
    const correo = crearCorreo("1");
    correo.marcarComoFavorito();
    gestor.recibirCorreo(correo);

    gestor.eliminarCorreo(correo);

    expect(gestor.obtenerFavoritos()).toEqual([]);
    expect(gestor.obtenerEliminados()).toEqual([correo]);
    expect(correo.esFavorito()).toBe(true);
  });

  test("al restaurar un favorito vuelve a la vista de favoritos conservando su indicador", () => {
    const gestor = new GestorCorreos();
    const correo = crearCorreo("1");
    correo.marcarComoFavorito();
    gestor.recibirCorreo(correo);
    gestor.eliminarCorreo(correo);

    gestor.restaurarCorreo(correo);

    expect(correo.esFavorito()).toBe(true);
    expect(gestor.obtenerFavoritos()).toEqual([correo]);
    expect(gestor.obtenerBandejaDe(correo)).toBe(Bandeja.ENTRADA);
  });

  test("solo los favoritos eliminados salen de la vista, los demás siguen", () => {
    const gestor = new GestorCorreos();
    const eliminado = crearCorreo("1");
    const vigente = crearCorreo("2");
    [eliminado, vigente].forEach((c) => c.marcarComoFavorito());
    gestor.recibirCorreo(eliminado);
    gestor.recibirCorreo(vigente);

    gestor.eliminarCorreo(eliminado);

    expect(gestor.obtenerFavoritos()).toEqual([vigente]);
  });

  test("consultar favoritos devuelve una copia: no modifica las bandejas ni los correos", () => {
    const gestor = new GestorCorreos();
    const favorito = crearCorreo("1");
    const comun = crearCorreo("2");
    favorito.marcarComoFavorito();
    gestor.recibirCorreo(favorito);
    gestor.recibirCorreo(comun);

    gestor.obtenerFavoritos().pop();

    expect(gestor.obtenerFavoritos()).toEqual([favorito]);
    expect(gestor.obtenerBandejaDeEntrada()).toEqual([favorito, comun]);
    expect(comun.esFavorito()).toBe(false);
  });
});