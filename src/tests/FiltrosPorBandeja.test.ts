import { describe, expect, test } from "vitest";
import { Bandeja } from "../Bandeja";
import { no, y } from "../Combinadores";
import { Contacto } from "../Contacto";
import { Correo } from "../Correo";
import { Filtro } from "../Filtro";
import { GestorCorreos } from "../GestorCorreos";
import { GestorFiltros } from "../GestorFiltros";
import { asuntoContiene, esFavorito, estaLeido, remitenteEs } from "../Predicados";

describe("Filtros sobre las bandejas", () => {
  const heejin = new Contacto("HeeJin", "heejin@gmail.com");
  const hyunjin = new Contacto("HyunJin", "hyunjin@gmail.com");
  const chuu = new Contacto("Chuu", "chuu@gmail.com");

  const crearCorreo = (id: string, asunto: string, remitente: Contacto = heejin): Correo =>
    new Correo(id, asunto, "LOONA con la casaca argentina", remitente, [chuu]);

  test("un filtro se aplica sobre la bandeja elegida", () => {
    const gestor = new GestorCorreos();
    const filtro = new Filtro("Conciertos", asuntoContiene("concierto"));
    const recibido = crearCorreo("1", "El mejor concierto");
    const enviado = crearCorreo("2", "Otro concierto");
    gestor.recibirCorreo(recibido);
    gestor.recibirCorreo(crearCorreo("3", "Cumpleaños de Chuu"));
    gestor.enviar(enviado);

    expect(gestor.filtrar(Bandeja.ENTRADA, filtro)).toEqual([recibido]);
    expect(gestor.filtrar(Bandeja.ENVIADOS, filtro)).toEqual([enviado]);
  });

  test("el mismo filtro se puede reutilizar en todas las bandejas", () => {
    const gestor = new GestorCorreos();
    const favoritos = new Filtro("Favoritos", esFavorito);
    const recibido = crearCorreo("1", "Uno");
    const enviado = crearCorreo("2", "Dos");
    const borrador = crearCorreo("3", "Tres");
    const eliminado = crearCorreo("4", "Cuatro");
    [recibido, enviado, borrador, eliminado].forEach((c) => c.marcarComoFavorito());
    gestor.recibirCorreo(recibido);
    gestor.enviar(enviado);
    gestor.guardarBorrador(borrador);
    gestor.recibirCorreo(eliminado);
    gestor.eliminarCorreo(eliminado);

    expect(gestor.filtrar(Bandeja.ENTRADA, favoritos)).toEqual([recibido]);
    expect(gestor.filtrar(Bandeja.ENVIADOS, favoritos)).toEqual([enviado]);
    expect(gestor.filtrar(Bandeja.BORRADORES, favoritos)).toEqual([borrador]);
    expect(gestor.filtrar(Bandeja.ELIMINADOS, favoritos)).toEqual([eliminado]);
  });

  test("filtrar una bandeja vacía devuelve una lista vacía", () => {
    const gestor = new GestorCorreos();
    const filtro = new Filtro("Todos", () => true);

    Object.values(Bandeja).forEach((bandeja) => {
      expect(gestor.filtrar(bandeja, filtro)).toEqual([]);
    });
  });

  test("los cambios en los correos se reflejan sin volver a guardarlos en la bandeja", () => {
    const gestor = new GestorCorreos();
    const sinLeer = new Filtro("Sin leer", no(estaLeido));
    const correo = crearCorreo("1", "El mejor concierto");
    gestor.recibirCorreo(correo);

    expect(gestor.filtrar(Bandeja.ENTRADA, sinLeer)).toEqual([correo]);

    correo.marcarComoLeido();
    expect(gestor.filtrar(Bandeja.ENTRADA, sinLeer)).toEqual([]);

    correo.marcarComoNoLeido();
    expect(gestor.filtrar(Bandeja.ENTRADA, sinLeer)).toEqual([correo]);
  });

  test("al eliminar un correo deja de aparecer en el filtro de su bandeja y aparece en el de Eliminados", () => {
    const gestor = new GestorCorreos();
    const filtro = new Filtro("Conciertos", asuntoContiene("concierto"));
    const correo = crearCorreo("1", "El mejor concierto");
    gestor.recibirCorreo(correo);

    gestor.eliminarCorreo(correo);

    expect(gestor.filtrar(Bandeja.ENTRADA, filtro)).toEqual([]);
    expect(gestor.filtrar(Bandeja.ELIMINADOS, filtro)).toEqual([correo]);

    gestor.restaurarCorreo(correo);

    expect(gestor.filtrar(Bandeja.ENTRADA, filtro)).toEqual([correo]);
    expect(gestor.filtrar(Bandeja.ELIMINADOS, filtro)).toEqual([]);
  });

  test("filtrar no modifica la bandeja ni los correos", () => {
    const gestor = new GestorCorreos();
    const filtro = new Filtro("Favoritos de HeeJin", y(esFavorito, remitenteEs(heejin)));
    const favorito = crearCorreo("1", "El mejor concierto");
    const comun = crearCorreo("2", "Cumpleaños de Chuu", hyunjin);
    favorito.marcarComoFavorito();
    gestor.recibirCorreo(favorito);
    gestor.recibirCorreo(comun);

    gestor.filtrar(Bandeja.ENTRADA, filtro);

    expect(gestor.obtenerBandejaDeEntrada()).toEqual([favorito, comun]);
    expect(favorito.esFavorito()).toBe(true);
    expect(favorito.estaLeido()).toBe(false);
    expect(comun.esFavorito()).toBe(false);
    expect(comun.getRemitente()).toBe(hyunjin);
  });

  test("un filtro registrado en el gestor de filtros se puede aplicar sobre una bandeja", () => {
    const gestor = new GestorCorreos();
    const filtros = new GestorFiltros();
    filtros.registrarFiltro(new Filtro("De HyunJin", remitenteEs(hyunjin)));
    const deHyunJin = crearCorreo("1", "Saludos", hyunjin);
    gestor.recibirCorreo(deHyunJin);
    gestor.recibirCorreo(crearCorreo("2", "Gira de LOONA"));

    const [filtroDeHyunJin] = filtros.obtenerFiltros();

    expect(gestor.filtrar(Bandeja.ENTRADA, filtroDeHyunJin)).toEqual([deHyunJin]);
  });
});
