import {Correo} from "../Correo";
import {Contacto} from "../Contacto";
import {GestorCorreos} from "../GestorCorreos";
import { describe, expect, test } from "vitest";
import { Bandeja } from "../Bandeja";


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


    //bandeja de entrada de todos los destinatarios
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
        const remitente = new Contacto("Joaco", "Jungkook@arirang.com");
        const destinatario = new Contacto("Tae", "taehyung@arirang.com");
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

   test("prueba1", () => {
    const gestorUsuario1 = new GestorCorreos();
    const gestorUsuario2 = new GestorCorreos();
    const gestorUsuario3 = new GestorCorreos();
    const remitente = new Contacto("joaco", "Jungkook@arirang.com");
    const destinatario1 = new Contacto("Tae", "taehyung@arirang.com");
    const destinatario2 = new Contacto("Jimin", "jimin@arirang.com");
    const destinatario3 = new Contacto("Nam", "nam@arirang.com");

    const correo = new Correo(
      "24",
      "El mejor concierto",
      "BTS con la casaca argentina",
      remitente,
      [destinatario1, destinatario2, destinatario3]
    );

    gestorUsuario1.recibirCorreo(correo);
    gestorUsuario2.recibirCorreo(correo);
    gestorUsuario3.recibirCorreo(correo);

    gestorUsuario1.eliminarCorreo(correo);
     
    gestorUsuario1.obtenerBandejaDeEntrada();
    gestorUsuario2.obtenerBandejaDeEntrada();
    gestorUsuario3.obtenerBandejaDeEntrada();


    expect(gestorUsuario1.obtenerBandejaDeEntrada()).toHaveLength(0);
    expect(gestorUsuario2.obtenerBandejaDeEntrada()).toHaveLength(1);
    expect(gestorUsuario3.obtenerBandejaDeEntrada()).toHaveLength(1);
  


    //bandeja de entrada de todos los destinatarios
 });

describe("Clase Correo", () => {
  test("guarda los datos que recibe en el constructor", () => {
    const remitente = new Contacto("Irene", "irene@gmail.com");
    const destinatario = new Contacto("Seulgi", "seulgi@hotmail.com");

    const correo = new Correo("1", "Hola", "Mensaje de prueba", remitente, [destinatario]);

    expect(correo.getId()).toBe("1");
    expect(correo.getAsunto()).toBe("Hola");
    expect(correo.getCuerpo()).toBe("Mensaje de prueba");
    expect(correo.getRemitente()).toBe(remitente);
    expect(correo.getDestinatarios()).toHaveLength(1);
    expect(correo.getDestinatarios()[0]).toBe(destinatario);
  });

  test("los setters modifican asunto, cuerpo, remitente y destinatarios", () => {
    const irene = new Contacto("Irene", "irene@gmail.com");
    const seulgi = new Contacto("Seulgi", "seulgi@hotmail.com");
    const heejin = new Contacto("Heejin", "heejin@outlook.com");
    const correo = new Correo("1", "Hola", "Mensaje de prueba", irene, [seulgi]);

    correo.setAsunto("Nuevo asunto");
    correo.setCuerpo("Nuevo cuerpo");
    correo.setRemitente(heejin);
    correo.setDestinatarios([seulgi, irene]);

    expect(correo.getAsunto()).toBe("Nuevo asunto");
    expect(correo.getCuerpo()).toBe("Nuevo cuerpo");
    expect(correo.getRemitente()).toBe(heejin);
    expect(correo.getDestinatarios()).toHaveLength(2);
  });

  test("un correo nuevo arranca no leído y no favorito", () => {
    const remitente = new Contacto("Irene", "irene@gmail.com");
    const correo = new Correo("1", "Hola", "Mensaje de prueba", remitente, []);

    expect(correo.estaLeido()).toBe(false);
    expect(correo.esFavorito()).toBe(false);
  });

  test("se puede marcar como leído y como no leído", () => {
    const remitente = new Contacto("Irene", "irene@gmail.com");
    const correo = new Correo("1", "Hola", "Mensaje de prueba", remitente, []);

    correo.marcarComoLeido();
    expect(correo.estaLeido()).toBe(true);

    correo.marcarComoNoLeido();
    expect(correo.estaLeido()).toBe(false);
  });

  test("se puede marcar y desmarcar como favorito", () => {
    const remitente = new Contacto("Irene", "irene@gmail.com");
    const correo = new Correo("1", "Hola", "Mensaje de prueba", remitente, []);

    correo.marcarComoFavorito();
    expect(correo.esFavorito()).toBe(true);

    correo.desmarcarComoFavorito();
    expect(correo.esFavorito()).toBe(false);
  });

});
    });
