import { describe, expect, test } from "vitest";
import { Bandeja } from "../Bandeja";
import { Contacto } from "../Contacto";
import { Correo } from "../Correo";
import { GestorCorreos } from "../GestorCorreos";

describe("Eliminar correos", () => {
  const crearCorreo = (id: string): Correo => {
    const remitente = new Contacto("HeeJin", "heejin@gmail.com");
    const destinatario = new Contacto("Chuu", "chuu@gmail.com");
    return new Correo(id, "El mejor concierto", "LOONA con la casaca argentina", remitente, [destinatario]);
  };

  test("un correo recibido eliminado pasa a Eliminados y sale de Entrada", () => {
    const gestor = new GestorCorreos();
    const correo = crearCorreo("1");
    gestor.recibirCorreo(correo);

    gestor.eliminarCorreo(correo);

    expect(gestor.obtenerEliminados()).toContain(correo);
    expect(gestor.obtenerBandejaDeEntrada()).not.toContain(correo);
    expect(gestor.obtenerBandejaDe(correo)).toBe(Bandeja.ELIMINADOS);
  });

  test("un correo enviado eliminado pasa a Eliminados y sale de Enviados", () => {
    const gestor = new GestorCorreos();
    const correo = crearCorreo("1");
    gestor.enviar(correo);

    gestor.eliminarCorreo(correo);

    expect(gestor.obtenerEliminados()).toContain(correo);
    expect(gestor.obtenerEnviados()).not.toContain(correo);
    expect(gestor.obtenerBandejaDe(correo)).toBe(Bandeja.ELIMINADOS);
  });

  test("un borrador eliminado pasa a Eliminados y sale de Borradores", () => {
    const gestor = new GestorCorreos();
    const correo = crearCorreo("1");
    gestor.guardarBorrador(correo);

    gestor.eliminarCorreo(correo);

    expect(gestor.obtenerEliminados()).toContain(correo);
    expect(gestor.obtenerBorrador()).not.toContain(correo);
    expect(gestor.obtenerBandejaDe(correo)).toBe(Bandeja.ELIMINADOS);
  });

  test("eliminar es lógico: el correo conserva sus datos, su estado de lectura y su favorito", () => {
    const gestor = new GestorCorreos();
    const correo = crearCorreo("1");
    correo.marcarComoLeido();
    correo.marcarComoFavorito();
    gestor.recibirCorreo(correo);

    gestor.eliminarCorreo(correo);

    expect(gestor.obtenerEliminados()).toEqual([correo]);
    expect(correo.getAsunto()).toBe("El mejor concierto");
    expect(correo.getCuerpo()).toBe("LOONA con la casaca argentina");
    expect(correo.estaLeido()).toBe(true);
    expect(correo.esFavorito()).toBe(true);
  });

  test("después de eliminarlo el correo queda en una sola bandeja", () => {
    const gestor = new GestorCorreos();
    const correo = crearCorreo("1");
    gestor.recibirCorreo(correo);

    gestor.eliminarCorreo(correo);

    const bandejasConElCorreo = Object.values(Bandeja).filter((bandeja) =>
      gestor.obtenerBandeja(bandeja).includes(correo)
    );
    expect(bandejasConElCorreo).toEqual([Bandeja.ELIMINADOS]);
  });

  test("eliminar un correo no afecta a los demás de su bandeja", () => {
    const gestor = new GestorCorreos();
    const correo1 = crearCorreo("1");
    const correo2 = crearCorreo("2");
    gestor.recibirCorreo(correo1);
    gestor.recibirCorreo(correo2);

    gestor.eliminarCorreo(correo1);

    expect(gestor.obtenerBandejaDeEntrada()).toEqual([correo2]);
    expect(gestor.obtenerEliminados()).toEqual([correo1]);
  });

  test("no se puede eliminar dos veces el mismo correo", () => {
    const gestor = new GestorCorreos();
    const correo = crearCorreo("1");
    gestor.recibirCorreo(correo);
    gestor.eliminarCorreo(correo);

    expect(() => gestor.eliminarCorreo(correo)).toThrow(
      "El correo ya se encuentra en Eliminados"
    );
    expect(gestor.obtenerEliminados()).toHaveLength(1);
  });

  test("no se puede eliminar un correo que no está en ninguna bandeja", () => {
    const gestor = new GestorCorreos();

    expect(() => gestor.eliminarCorreo(crearCorreo("1"))).toThrow(
      "El correo no se encuentra en ninguna bandeja"
    );
    expect(gestor.obtenerEliminados()).toEqual([]);
  });

  test("un correo eliminado de Entrada deja de aparecer en la búsqueda", () => {
    const gestor = new GestorCorreos();
    const correo = crearCorreo("1");
    gestor.recibirCorreo(correo);
    expect(gestor.buscar("concierto")).toEqual([correo]);

    gestor.eliminarCorreo(correo);

    expect(gestor.buscar("concierto")).toEqual([]);
  });
});
