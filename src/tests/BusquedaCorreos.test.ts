import {describe, expect, test} from "vitest";
import {Contacto} from "../Contacto";
import {GestorCorreos} from "../GestorCorreos";
import {Correo} from "../Correo";

describe ("Busqueda de correos", () => {

    test("Correo que se envio se encuentra en la bandeja de entrada", () => {
        const gestor = new GestorCorreos();
        const remitente = new Contacto("Jeon Jungkook", "jungkook@bts.arirang.ar");
        const destinatario = new Contacto("Taehyung", "tae@bts.arirang.ar");
         const correo = new Correo(
            "24",
            "El mejor concierto",
            "BTS con la casaca argentina",
            remitente,
            [destinatario]
        );
        gestor.recibirCorreo(correo);

        expect(gestor.obtenerBandejaDeEntrada()).toContain(correo);
    });

    test("se encuentran correos por su asunto", () => {
        const gestor = new GestorCorreos();
        const remitente = new Contacto("Jeon Jungkook", "jungkook@bts.arirang.ar");
        const destinatario = new Contacto("Taehyung", "tae@bts.arirang.ar");
        const correo = new Correo(
            "24",
            "El mejor concierto",
            "BTS con la casaca argentina",
            remitente,
            [destinatario]
        );

        const correo2 = new Correo(
            "21",
            "BTS llego  a Argentina",
            "BTS se prepara para su primer concierto en Argentina",
            remitente,
            [destinatario]
        );

        gestor.recibirCorreo(correo);
        gestor.recibirCorreo(correo2);

        const correosEncontrados = gestor.buscar("El mejor concierto");
        expect(correosEncontrados).toEqual([correo]);

    });
    });
