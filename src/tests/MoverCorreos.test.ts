import { describe, expect, test } from "vitest";
import { Bandeja } from "../Bandeja";
import { Contacto } from "../Contacto";
import { Correo } from "../Correo";
import { GestorCorreos } from "../GestorCorreos";

describe("Mover correos entre bandejas", () => {
  const crearCorreo = (id: string, asunto: string = "El mejor concierto"): Correo => {
    const remitente = new Contacto("HeeJin", "heejin@gmail.com");
    const destinatario = new Contacto("Chuu", "chuu@gmail.com");
    return new Correo(id, asunto, "LOONA con la casaca argentina", remitente, [destinatario]);
  };

  test("un borrador válido se puede mover a Enviados", () => {
    const gestor = new GestorCorreos();
    const correo = crearCorreo("1");
    gestor.guardarBorrador(correo);

    gestor.moverCorreo(correo, Bandeja.ENVIADOS);

    expect(gestor.obtenerEnviados()).toEqual([correo]);
    expect(gestor.obtenerBorrador()).toEqual([]);
    expect(gestor.obtenerBandejaDe(correo)).toBe(Bandeja.ENVIADOS);
  });

  test("un borrador inválido no se puede mover a Enviados y sigue en Borradores", () => {
    const gestor = new GestorCorreos();
    const sinAsunto = crearCorreo("1", "");
    gestor.guardarBorrador(sinAsunto);

    expect(() => gestor.moverCorreo(sinAsunto, Bandeja.ENVIADOS)).toThrow(
      "El correo debe tener un asunto válido"
    );
    expect(gestor.obtenerBorrador()).toEqual([sinAsunto]);
    expect(gestor.obtenerEnviados()).toEqual([]);
  });

  test("un correo de cualquier bandeja se puede mover a Eliminados", () => {
    const gestor = new GestorCorreos();
    const recibido = crearCorreo("1");
    const enviado = crearCorreo("2");
    const borrador = crearCorreo("3");
    gestor.recibirCorreo(recibido);
    gestor.enviar(enviado);
    gestor.guardarBorrador(borrador);

    gestor.moverCorreo(recibido, Bandeja.ELIMINADOS);
    gestor.moverCorreo(enviado, Bandeja.ELIMINADOS);
    gestor.moverCorreo(borrador, Bandeja.ELIMINADOS);

    expect(gestor.obtenerEliminados()).toEqual([recibido, enviado, borrador]);
    expect(gestor.obtenerBandejaDeEntrada()).toEqual([]);
    expect(gestor.obtenerEnviados()).toEqual([]);
    expect(gestor.obtenerBorrador()).toEqual([]);
  });

  test("mover a Eliminados guarda el origen: se puede restaurar", () => {
    const gestor = new GestorCorreos();
    const correo = crearCorreo("1");
    gestor.recibirCorreo(correo);

    gestor.moverCorreo(correo, Bandeja.ELIMINADOS);
    gestor.restaurarCorreo(correo);

    expect(gestor.obtenerBandejaDe(correo)).toBe(Bandeja.ENTRADA);
  });

  test("un correo recibido no se puede mover a Enviados ni a Borradores", () => {
    const gestor = new GestorCorreos();
    const correo = crearCorreo("1");
    gestor.recibirCorreo(correo);

    expect(() => gestor.moverCorreo(correo, Bandeja.ENVIADOS)).toThrow(
      "No se puede mover un correo de Entrada a Enviados"
    );
    expect(() => gestor.moverCorreo(correo, Bandeja.BORRADORES)).toThrow(
      "No se puede mover un correo de Entrada a Borradores"
    );
    expect(gestor.obtenerBandejaDe(correo)).toBe(Bandeja.ENTRADA);
  });

  test("un correo enviado no se puede mover a Entrada ni volver a Borradores", () => {
    const gestor = new GestorCorreos();
    const correo = crearCorreo("1");
    gestor.enviar(correo);

    expect(() => gestor.moverCorreo(correo, Bandeja.ENTRADA)).toThrow(
      "No se puede mover un correo de Enviados a Entrada"
    );
    expect(() => gestor.moverCorreo(correo, Bandeja.BORRADORES)).toThrow(
      "No se puede mover un correo de Enviados a Borradores"
    );
    expect(gestor.obtenerBandejaDe(correo)).toBe(Bandeja.ENVIADOS);
  });

  test("un correo eliminado no se mueve: solo se recupera con restaurarCorreo", () => {
    const gestor = new GestorCorreos();
    const correo = crearCorreo("1");
    gestor.recibirCorreo(correo);
    gestor.eliminarCorreo(correo);

    expect(() => gestor.moverCorreo(correo, Bandeja.ENTRADA)).toThrow(
      "No se puede mover un correo de Eliminados a Entrada"
    );
    expect(() => gestor.moverCorreo(correo, Bandeja.ENVIADOS)).toThrow(
      "No se puede mover un correo de Eliminados a Enviados"
    );
    expect(gestor.obtenerBandejaDe(correo)).toBe(Bandeja.ELIMINADOS);

    gestor.restaurarCorreo(correo);
    expect(gestor.obtenerBandejaDe(correo)).toBe(Bandeja.ENTRADA);
  });

  test("no se puede mover un correo a la bandeja en la que ya está", () => {
    const gestor = new GestorCorreos();
    const correo = crearCorreo("1");
    gestor.recibirCorreo(correo);

    expect(() => gestor.moverCorreo(correo, Bandeja.ENTRADA)).toThrow(
      "No se puede mover un correo de Entrada a Entrada"
    );
    expect(gestor.obtenerBandejaDeEntrada()).toEqual([correo]);
  });

  test("no se puede mover un correo que no está en ninguna bandeja", () => {
    const gestor = new GestorCorreos();

    expect(() => gestor.moverCorreo(crearCorreo("1"), Bandeja.ELIMINADOS)).toThrow(
      "El correo no se encuentra en ninguna bandeja"
    );
  });

  test("un movimiento rechazado no duplica ni pierde correos", () => {
    const gestor = new GestorCorreos();
    const recibido = crearCorreo("1");
    const borrador = crearCorreo("2", "");
    gestor.recibirCorreo(recibido);
    gestor.guardarBorrador(borrador);

    expect(() => gestor.moverCorreo(recibido, Bandeja.ENVIADOS)).toThrow();
    expect(() => gestor.moverCorreo(borrador, Bandeja.ENVIADOS)).toThrow();

    expect(gestor.obtenerBandeja(Bandeja.ENTRADA)).toEqual([recibido]);
    expect(gestor.obtenerBandeja(Bandeja.BORRADORES)).toEqual([borrador]);
    expect(gestor.obtenerBandeja(Bandeja.ENVIADOS)).toEqual([]);
    expect(gestor.obtenerBandeja(Bandeja.ELIMINADOS)).toEqual([]);
  });
});
