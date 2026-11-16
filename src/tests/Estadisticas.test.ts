import { describe, expect, test } from "vitest";
import { Contacto } from "../Contacto";
import { Correo } from "../Correo";
import { GestorCorreos } from "../GestorCorreos";
import { Bandeja } from "../Bandeja";

 describe( "Procesamiento funcional: obtener asuntos con map",() =>{

    const remitente = new Contacto("Jeon Jungkook", "Jungkook@arirang.com");
    const destinatario = new Contacto("Taehyung", "taehyung@arirang.com");

    const crearCorreo = (id: string, asunto: string): Correo =>
    new Correo(id, asunto, "Cuerpo", remitente, [destinatario]);

     test( "devuelve la lista de asuntos en el mismo orden de los correos",() =>{
        const gestor = new GestorCorreos();
        gestor.recibirCorreo(crearCorreo("1", "BTS"));
        gestor.recibirCorreo(crearCorreo("2", "Arirang"));

         expect(gestor.obtenerAsuntos(Bandeja.ENTRADA)).toEqual([
            "BTS",
            "Arirang",
        ]);

    });

    test("solo incluye los asuntos de la bandeja pedida", () => {
        const gestor = new GestorCorreos();
        gestor.recibirCorreo(crearCorreo("1", "Recibido"));
        gestor.enviar(crearCorreo("2", "Enviado"));

        expect(gestor.obtenerAsuntos(Bandeja.ENVIADOS)).toEqual(["Enviado"]);
    });

    test("devuelve una lista vacía si la bandeja está vacía", () => {
        const gestor = new GestorCorreos();

        expect(gestor.obtenerAsuntos(Bandeja.BORRADORES)).toEqual([]);
    });

    test("refleja los cambios de la bandeja sin guardar nada", () => {
        const gestor = new GestorCorreos();
        const correo = crearCorreo("1", "Aviso");
        gestor.recibirCorreo(correo);

        gestor.eliminarCorreo(correo);

        expect(gestor.obtenerAsuntos(Bandeja.ENTRADA)).toEqual([]);
        expect(gestor.obtenerAsuntos(Bandeja.ELIMINADOS)).toEqual(["Aviso"]);
    });

    test("no modifica los correos originales", () => {
        const gestor = new GestorCorreos();
        const correo = crearCorreo("1", "Arirang");
        gestor.recibirCorreo(correo);

        gestor.obtenerAsuntos(Bandeja.ENTRADA);

        expect(correo.getAsunto()).toBe("Arirang");
    });

   

    });