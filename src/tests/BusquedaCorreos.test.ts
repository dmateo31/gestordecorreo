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

    test("no disitngue entre mayusculas y minusculas al buscar", () => {

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
        expect(gestor.buscar("El mejor concierto")).toEqual([correo]);
        expect(gestor.buscar("EL MEJOR CONCIERTO")).toEqual([correo]);

    });

    test("no se admiten busqeudas parciales ", () => {
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

        expect(gestor.buscar("mejo")).toEqual([correo]);
        expect(gestor.buscar("conciert")).toEqual([correo]);
    });

     test("se encuentran correos por su cuerpo", () => {
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

        const correosEncontrados = gestor.buscar("BTS con la casaca argentina");
        expect(correosEncontrados).toEqual([correo]);

    });
    
    test("se encuentran correos por su remitente", () => {
        const gestor = new GestorCorreos();
        const jungkook = new Contacto("Jeon Jungkook", "jungkook@bts.arirang.ar");
        const tae = new Contacto("Taehyung", "tae@bts.arirang.ar");
        const jimin = new Contacto("Jimin", "jimin@bts.arirang.ar");

        const correo = new Correo(
            "24",
            "El mejor concierto",
            "BTS con la casaca argentina",
            jungkook,
            [jimin]
        );

        const correo2 = new Correo(
            "21",
            "BTS llego  a Argentina",
            "BTS se prepara para su primer concierto en Argentina",
            tae,
            [jimin]
        );

        gestor.recibirCorreo(correo);
        gestor.recibirCorreo(correo2);

        expect(gestor.buscar("Jeon Jungkook")).toEqual([correo]);
        expect(gestor.buscar("tae@bts.arirang.ar")).toEqual([correo2]);

    });

    test("se encuentran correos por su destinatario", () => {
        const gestor = new GestorCorreos();
        const remitente = new Contacto("Namjoon", "namjoon@bts.arirang.ar");
        const jungkook = new Contacto("Jeon Jungkook", "jungkook@bts.arirang.ar");
        const tae = new Contacto("Taehyung", "tae@bts.arirang.ar");
        const jimin = new Contacto("Jimin", "jimin@bts.arirang.ar");

        const correoparaJK = new Correo(
            "24",
            "El mejor concierto",
            "BTS con la casaca argentina",
            remitente,
            [jungkook]
        );

        const correoparaJMyTH = new Correo(
            "21",
            "BTS llego  a Argentina",
            "BTS se prepara para su primer concierto en Argentina",
            remitente,
            [jimin, tae]
        );

        gestor.recibirCorreo(correoparaJK);
        gestor.recibirCorreo(correoparaJMyTH);

        expect(gestor.buscar("Jungkook")).toEqual([correoparaJK]);
        expect(gestor.buscar("tae@bts.arirang.ar")).toEqual([correoparaJMyTH]);
    });

    test("un correo que coincide en varios campos aparece una soal vex", () => {
        const gestor = new GestorCorreos();
        const JK = new Contacto("Jeon Jungkook", "jungkook@bts.arirang.ar");
        const nam = new Contacto ("Namjoon", "namjoon@bts.arirang.ar");
        const tae = new Contacto("Taehyung", "tae@bts.arirang.ar");

        const correo = new Correo(
            "24",
            "ese es jungkook",
            "Jungkook con la casaca argentina",
            JK,
            [nam]
        );

          const correo2 = new Correo(
            "21",
            "BTS llego  a Argentina",
            "BTS se prepara para su primer concierto en Argentina",
            tae,
            [nam]
        );

        gestor.recibirCorreo(correo);
        gestor.recibirCorreo(correo2);

        const Buscar = gestor.buscar("jungkook")

        expect(Buscar).toHaveLength(1);
        expect(Buscar).toEqual([correo]);


        });

    test("no devuelve nada cuando no se encuentran coincidencias" , () => {
        const gestor = new GestorCorreos();
        const remitente = new Contacto("Jeon Jungkook", "jungkook@bts.arirang.ar");
        const destinatario= new Contacto ("Namjoon", "namjoon@bts.arirang.ar");
     

        const correo = new Correo(
            "24",
            "ese es jungkook",
            "Jungkook con la casaca argentina",
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

        expect(gestor.buscar("BTS argentina 2016")).toEqual([]);
     });

    test("devuelve vacio al buscar en una bandeja vacía", () => {
        const gestor = new GestorCorreos();

        expect(gestor.buscar("cualquier cosa")).toEqual([]);
     });

     test("la busqueda no modifica nada de los correo originales" , () => {
        const gestor = new GestorCorreos();
        const remitente = new Contacto("Jeon Jungkook", "jungkook@bts.arirang.ar");
        const destinatario= new Contacto ("Namjoon", "namjoon@bts.arirang.ar");
        

        const correo = new Correo(
            "24",
            "ese es jungkook",
            "Jungkook con la casaca argentina",
            remitente,
            [destinatario]
        );
        correo.marcarComoFavorito();
        gestor.recibirCorreo(correo);

        gestor.buscar("CASACA");

        expect(correo.getAsunto()).toBe("ese es jungkook");
        expect(correo.getCuerpo()).toBe("Jungkook con la casaca argentina");
        expect(correo.getRemitente()).toBe(remitente);
        expect(correo.getDestinatarios()).toEqual([destinatario]);
        expect(correo.estaLeido()).toBe(false);
        expect(correo.esFavorito()).toBe(true);
        expect(gestor.obtenerBandejaDeEntrada()).toEqual([correo]);
     });
});
