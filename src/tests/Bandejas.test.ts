import { describe, expect, test } from "vitest";
import { Bandeja } from "../Bandeja";
import { Contacto } from "../Contacto";
import { Correo } from "../Correo";
import { GestorCorreos } from "../GestorCorreos";

describe("Bandejas de correo", () => {
  const crearCorreo = (id: string, asunto: string = "El mejor concierto"): Correo => {
    const remitente = new Contacto("HeeJin", "heejin@gmail.com");
    const destinatario = new Contacto("Chuu", "chuu@gmail.com");
    return new Correo(id, asunto, "LOONA con la casaca argentina", remitente, [destinatario]);
  };

  test("todas las bandejas empiezan vacías", () => {
    const gestor = new GestorCorreos();

    Object.values(Bandeja).forEach((bandeja) => {
      expect(gestor.obtenerBandeja(bandeja)).toEqual([]);
    });
  });

  test("se pueden consultar los correos de cada bandeja", () => {
    const gestor = new GestorCorreos();
    const recibido = crearCorreo("1");
    const enviado = crearCorreo("2");
    const borrador = crearCorreo("3");

    gestor.recibirCorreo(recibido);
    gestor.enviar(enviado);
    gestor.guardarBorrador(borrador);

    expect(gestor.obtenerBandeja(Bandeja.ENTRADA)).toEqual([recibido]);
    expect(gestor.obtenerBandeja(Bandeja.ENVIADOS)).toEqual([enviado]);
    expect(gestor.obtenerBandeja(Bandeja.BORRADORES)).toEqual([borrador]);
    expect(gestor.obtenerBandeja(Bandeja.ELIMINADOS)).toEqual([]);
    expect(gestor.obtenerEliminados()).toEqual([]);
  });

  test("se puede saber en qué bandeja está un correo", () => {
    const gestor = new GestorCorreos();
    const recibido = crearCorreo("1");
    const enviado = crearCorreo("2");
    const borrador = crearCorreo("3");
    const desconocido = crearCorreo("4");

    gestor.recibirCorreo(recibido);
    gestor.enviar(enviado);
    gestor.guardarBorrador(borrador);

    expect(gestor.obtenerBandejaDe(recibido)).toBe(Bandeja.ENTRADA);
    expect(gestor.obtenerBandejaDe(enviado)).toBe(Bandeja.ENVIADOS);
    expect(gestor.obtenerBandejaDe(borrador)).toBe(Bandeja.BORRADORES);
    expect(gestor.obtenerBandejaDe(desconocido)).toBeUndefined();
  });

  test("al enviar un borrador el correo pasa de Borradores a Enviados y queda en una sola bandeja", () => {
    const gestor = new GestorCorreos();
    const correo = crearCorreo("1");
    gestor.guardarBorrador(correo);

    gestor.enviar(correo);

    expect(gestor.obtenerBandejaDe(correo)).toBe(Bandeja.ENVIADOS);
    expect(gestor.obtenerBandeja(Bandeja.BORRADORES)).toEqual([]);
    expect(gestor.obtenerBandeja(Bandeja.ENVIADOS)).toEqual([correo]);
  });

  test("un correo recibido no puede recibirse otra vez", () => {
    const gestor = new GestorCorreos();
    const correo = crearCorreo("1");
    gestor.recibirCorreo(correo);

    expect(() => gestor.recibirCorreo(correo)).toThrow(
      "No se puede recibir un correo que está en Entrada"
    );
    expect(gestor.obtenerBandejaDeEntrada()).toHaveLength(1);
  });

  test("un correo enviado no puede recibirse ni guardarse como borrador", () => {
    const gestor = new GestorCorreos();
    const correo = crearCorreo("1");
    gestor.enviar(correo);

    expect(() => gestor.recibirCorreo(correo)).toThrow(
      "No se puede recibir un correo que está en Enviados"
    );
    expect(() => gestor.guardarBorrador(correo)).toThrow(
      "No se puede guardar como borrador un correo que está en Enviados"
    );
    expect(gestor.obtenerBandejaDe(correo)).toBe(Bandeja.ENVIADOS);
    expect(gestor.obtenerBandejaDeEntrada()).toEqual([]);
    expect(gestor.obtenerBorrador()).toEqual([]);
  });

  test("un correo recibido no puede enviarse", () => {
    const gestor = new GestorCorreos();
    const correo = crearCorreo("1");
    gestor.recibirCorreo(correo);

    expect(() => gestor.enviar(correo)).toThrow(
      "No se puede enviar un correo que está en Entrada"
    );
    expect(gestor.obtenerEnviados()).toEqual([]);
    expect(gestor.obtenerBandejaDe(correo)).toBe(Bandeja.ENTRADA);
  });

  test("guardar de nuevo un borrador lo reemplaza y no lo duplica", () => {
    const gestor = new GestorCorreos();
    const original = crearCorreo("1", "Primer asunto");
    const editado = crearCorreo("1", "Asunto editado");

    gestor.guardarBorrador(original);
    gestor.guardarBorrador(editado);

    expect(gestor.obtenerBorrador()).toHaveLength(1);
    expect(gestor.obtenerBorrador()[0]).toBe(editado);
  });

  test("las consultas devuelven copias: modificarlas no altera las bandejas", () => {
    const gestor = new GestorCorreos();
    gestor.recibirCorreo(crearCorreo("1"));
    gestor.enviar(crearCorreo("2"));
    gestor.guardarBorrador(crearCorreo("3"));

    gestor.obtenerBandejaDeEntrada().pop();
    gestor.obtenerEnviados().pop();
    gestor.obtenerBorrador().pop();
    gestor.obtenerBandeja(Bandeja.ENTRADA).pop();

    expect(gestor.obtenerBandejaDeEntrada()).toHaveLength(1);
    expect(gestor.obtenerEnviados()).toHaveLength(1);
    expect(gestor.obtenerBorrador()).toHaveLength(1);
    expect(gestor.obtenerBandeja(Bandeja.ENTRADA)).toHaveLength(1);
  });

  
});
