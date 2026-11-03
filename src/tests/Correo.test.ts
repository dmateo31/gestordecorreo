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

  test("se envia el correo a multiples destinatarios", () => {
    const gestor = new GestorCorreos();
    const remitente = new Contacto("Carla", "carla@example.com");
    const destinatario1 = new Contacto("José", "jose@example.com");
    const destinatario2 = new Contacto("Mateo", "mateo@example.com");
    const destinatario3 = new Contacto("Candela", "candela|@example.com");

    const correo = new Correo(
      "1",
      "Hola",
      "Mensaje de prueba",
      remitente,
      [destinatario1, destinatario2, destinatario3]
    );
    gestor.enviar(correo);

 const enviados = gestor.obtenerEnviados();
    expect(enviados).toContain(correo);
    expect(enviados[0].getDestinatarios()).toHaveLength(3); 
 });


     test("No se permiten enviar correos sin asunto y sin destinatarios", () => {
     const gestor = new GestorCorreos();
    const remitente = new Contacto("Carla", "carla@example.com");

    const correo = new Correo("1", "", "Sin destinataios", remitente, []);

    expect(() => gestor.enviar(correo)).toThrow(
      "El correo debe tener al menos un destinatario; El correo debe tener un asunto válido"
    );
    expect(gestor.obtenerEnviados()).toHaveLength(0);


    });

});