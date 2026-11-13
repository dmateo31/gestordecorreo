import { describe, expect, test } from "vitest";
import { Bandeja } from "../Bandeja";
import { Contacto } from "../Contacto";
import { Correo } from "../Correo";
import { GestorCorreos } from "../GestorCorreos";

describe("Restaurar correos", () => {
  const crearCorreo = (id: string): Correo => {
    const remitente = new Contacto("HeeJin", "heejin@gmail.com");
    const destinatario = new Contacto("Chuu", "chuu@gmail.com");
    return new Correo(id, "El mejor concierto", "LOONA son 12", remitente, [destinatario]);
  };

  test("un correo recibido vuelve a Entrada", () => {
    const gestor = new GestorCorreos();
    const correo = crearCorreo("1");
    gestor.recibirCorreo(correo);
    gestor.eliminarCorreo(correo);

    gestor.restaurarCorreo(correo);

    expect(gestor.obtenerBandejaDeEntrada()).toEqual([correo]);
    expect(gestor.obtenerEliminados()).toEqual([]);
    expect(gestor.obtenerBandejaDe(correo)).toBe(Bandeja.ENTRADA);
  });

  test("un correo enviado vuelve a Enviados", () => {
    const gestor = new GestorCorreos();
    const correo = crearCorreo("1");
    gestor.enviar(correo);
    gestor.eliminarCorreo(correo);

    gestor.restaurarCorreo(correo);

    expect(gestor.obtenerEnviados()).toEqual([correo]);
    expect(gestor.obtenerEliminados()).toEqual([]);
    expect(gestor.obtenerBandejaDe(correo)).toBe(Bandeja.ENVIADOS);
  });

  test("un borrador vuelve a Borradores", () => {
    const gestor = new GestorCorreos();
    const correo = crearCorreo("1");
    gestor.guardarBorrador(correo);
    gestor.eliminarCorreo(correo);

    gestor.restaurarCorreo(correo);

    expect(gestor.obtenerBorrador()).toEqual([correo]);
    expect(gestor.obtenerEliminados()).toEqual([]);
    expect(gestor.obtenerBandejaDe(correo)).toBe(Bandeja.BORRADORES);
  });

  test("cada correo vuelve a su propia bandeja de origen", () => {
    const gestor = new GestorCorreos();
    const recibido = crearCorreo("1");
    const enviado = crearCorreo("2");
    gestor.recibirCorreo(recibido);
    gestor.enviar(enviado);
    gestor.eliminarCorreo(recibido);
    gestor.eliminarCorreo(enviado);

    gestor.restaurarCorreo(enviado);
    expect(gestor.obtenerBandejaDe(enviado)).toBe(Bandeja.ENVIADOS);
    expect(gestor.obtenerEliminados()).toEqual([recibido]);

    gestor.restaurarCorreo(recibido);
    expect(gestor.obtenerBandejaDe(recibido)).toBe(Bandeja.ENTRADA);
    expect(gestor.obtenerEliminados()).toEqual([]);
  });

  test("restaurar no genera duplicados", () => {
    const gestor = new GestorCorreos();
    const correo = crearCorreo("1");
    gestor.recibirCorreo(correo);

    gestor.eliminarCorreo(correo);
    gestor.restaurarCorreo(correo);

    const bandejasConElCorreo = Object.values(Bandeja).filter((bandeja) =>
      gestor.obtenerBandeja(bandeja).includes(correo)
    );
    expect(bandejasConElCorreo).toEqual([Bandeja.ENTRADA]);
    expect(gestor.obtenerBandejaDeEntrada()).toHaveLength(1);
  });

  test("el correo conserva su estado de lectura y su favorito al eliminarse y restaurarse", () => {
    const gestor = new GestorCorreos();
    const correo = crearCorreo("1");
    correo.marcarComoLeido();
    correo.marcarComoFavorito();
    gestor.recibirCorreo(correo);

    gestor.eliminarCorreo(correo);
    gestor.restaurarCorreo(correo);

    expect(correo.estaLeido()).toBe(true);
    expect(correo.esFavorito()).toBe(true);
    expect(correo.getAsunto()).toBe("El mejor concierto");
  });

  test("un correo restaurado vuelve a aparecer en la búsqueda", () => {
    const gestor = new GestorCorreos();
    const correo = crearCorreo("1");
    gestor.recibirCorreo(correo);
    gestor.eliminarCorreo(correo);
    expect(gestor.buscar("concierto")).toEqual([]);

    gestor.restaurarCorreo(correo);

    expect(gestor.buscar("concierto")).toEqual([correo]);
  });

  test("un correo restaurado se puede eliminar otra vez y vuelve a su origen", () => {
    const gestor = new GestorCorreos();
    const correo = crearCorreo("1");
    gestor.enviar(correo);

    gestor.eliminarCorreo(correo);
    gestor.restaurarCorreo(correo);
    gestor.eliminarCorreo(correo);
    gestor.restaurarCorreo(correo);

    expect(gestor.obtenerEnviados()).toEqual([correo]);
    expect(gestor.obtenerEliminados()).toEqual([]);
  });

  test("un borrador restaurado se puede enviar", () => {
    const gestor = new GestorCorreos();
    const correo = crearCorreo("1");
    gestor.guardarBorrador(correo);
    gestor.eliminarCorreo(correo);
    gestor.restaurarCorreo(correo);

    gestor.enviar(correo);

    expect(gestor.obtenerBandejaDe(correo)).toBe(Bandeja.ENVIADOS);
    expect(gestor.obtenerBorrador()).toEqual([]);
  });

  test("no se puede restaurar un correo que no está en Eliminados", () => {
    const gestor = new GestorCorreos();
    const enEntrada = crearCorreo("1");
    gestor.recibirCorreo(enEntrada);

    expect(() => gestor.restaurarCorreo(enEntrada)).toThrow(
      "El correo no se encuentra en Eliminados"
    );
    expect(() => gestor.restaurarCorreo(crearCorreo("2"))).toThrow(
      "El correo no se encuentra en Eliminados"
    );
    expect(gestor.obtenerBandejaDeEntrada()).toEqual([enEntrada]);
  });

  test("no se puede restaurar dos veces seguidas el mismo correo", () => {
    const gestor = new GestorCorreos();
    const correo = crearCorreo("1");
    gestor.recibirCorreo(correo);
    gestor.eliminarCorreo(correo);
    gestor.restaurarCorreo(correo);

    expect(() => gestor.restaurarCorreo(correo)).toThrow(
      "El correo no se encuentra en Eliminados"
    );
    expect(gestor.obtenerBandejaDeEntrada()).toHaveLength(1);
  });
});
