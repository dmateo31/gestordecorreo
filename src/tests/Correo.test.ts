import {Correo} from "../Correo";
import {Contacto} from "../Contacto";
import {GestorCorreos} from "../GestorCorreos";
import { describe, expect, test } from "vitest";


describe("Correo", () => {
    test("correo enviado se guarda en la bandeja de enviados", () => {
        const gestor = new GestorCorreos();
        const remitente = new Contacto("Jeon Jungkook", "Jungkook@bts.ariran.ar");
        const destinatario = new Contacto("Taehyung", "taehyung@bts.arirang.ar");
  const correo = new Correo(
      "24",
      "El mejor concierto",
      "BTS con la casaca argentina",
      remitente,
      [destinatario]
    );
    gestor.enviar(correo);

    expect(gestor.obtenerEnviados()).toContain(correo);

 });

  test("se envia el correo a multiples destinatarios", () => {
    const gestor = new GestorCorreos();
    const remitente = new Contacto("Jeon Jungkook", "Jungkook@arirang.com");
    const destinatario1 = new Contacto("Taehyung", "taehyung@arirang.com");
    const destinatario2 = new Contacto("Jimin", "jimin@arirang.com");
    const destinatario3 = new Contacto("Namjoon", "nam@arirang.com");

    const correo = new Correo(
      "24",
      "El mejor concierto",
      "BTS con la casaca argentina",
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
    const remitente = new Contacto("Jeon Jungkook", "Jungkook@arirang.com");

    const correo = new Correo("24", "", "Sin destinataios", remitente, []);

    expect(() => gestor.enviar(correo)).toThrow(
      "El correo debe tener al menos un destinatario; El correo debe tener un asunto válido"
    );
    expect(gestor.obtenerEnviados()).toHaveLength(0);


    });

    test("un correo enviado desde borradores deja de pertencer a la bandeja de borradores", () => {
        const gestor = new GestorCorreos();
        const remitente = new Contacto("Jeon Jungkook", "Jungkook@arirang.com");
        const destinatario = new Contacto("Taehyung", "taehyung@arirang.com");
        const correo = new Correo(
            "24",
            "arirang tour argentina",
            "Cypher 4 y Young Forever se quedo en casa",
            remitente,
            [destinatario]
        );
       
        gestor.guardarBorrador(correo);
        expect(gestor.obtenerBorrador()).toContain(correo);

        gestor.enviar(correo);

        expect(gestor.obtenerBorrador()).not.toContain(correo);
        expect(gestor.obtenerEnviados()).toContain(correo);
    });

    test("no se generan correos duplicados", () => {
        const gestor = new GestorCorreos();
        const remitente = new Contacto("Jeon Jungkook", "Jungkook@arirang.com");
        const destinatario = new Contacto("Taehyung", "taehyung@arirang.com");
        const correo = new Correo(
            "28",
            "arirang tour 2028",
            "si dios quiere los bitis vuelven a arg",
            remitente,
            [destinatario]
        );

        gestor.enviar(correo);
        gestor.enviar(correo);

        expect(gestor.obtenerEnviados()).toHaveLength(1);

    });
    });
