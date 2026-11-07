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
});
 