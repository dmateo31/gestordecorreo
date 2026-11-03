import {Correo} from "../Correo";
import {Contacto} from "../Contacto";
import {GestorCorreos} from "../GestorCorreos";
import { describe, expect, test } from "vitest";


describe("Correo", () => {
    test("correo enviado se guarda en la bandeja de enviados", () => {
        const gestor = new GestorCorreos();
        const remitente = new Contacto("Carla", "carla@example.com");
        const destinatario = new Contacto("José", "jose @example.com");
  const correo = new Correo(
      "1",
      "Hola",
      "Mensaje de prueba",
      remitente,
      [destinatario]
    );
    gestor.enviar(correo);

    expect(gestor.obtenerEnviados()).toContain(correo);

 });
});