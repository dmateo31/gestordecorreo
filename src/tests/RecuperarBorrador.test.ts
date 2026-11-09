import { describe, expect, test } from "vitest";
import { Contacto } from "../Contacto";
import { Correo } from "../Correo";
import { GestorCorreos } from "../GestorCorreos";

describe( "recuperar borradores", () => {

    const remitente = new Contacto("Jeon Jungkook", "Jungkook@arirang.com");
    const destinatario = new Contacto("Taehyung", "taehyung@arirang.com");

    test("se puede recuperar un borrador existente por su id", () => {

        const gestor = new GestorCorreos();
        const borrador = gestor.iniciarBorrador(remitente);

        const recuperado = gestor.recuperarBorrador(borrador.getId());

        expect(recuperado).toBe(borrador);
    });

    test("falla si es queno existe un borraodr con el id pedido", () => {
        const gestor = new GestorCorreos();
    
        expect(() => gestor.recuperarBorrador("no-existe")).toThrow(
            "No existe un borrador con id no-existe"
        );

    });

    test("falla si el correo existe pero ya no es un borrador", () => {
        const gestor = new GestorCorreos();
        const correo = new Correo(
            "24",
            "El mejor concierto",
            "BTS con la casaca argentina",
            remitente,
            [destinatario]
        );

        gestor.enviar(correo);

        expect(() => gestor.recuperarBorrador("24")).toThrow(
            "No existe un borrador con id 24"
        );
     });
});