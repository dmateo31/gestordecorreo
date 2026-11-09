import { describe, expect, test } from "vitest";
import { Bandeja } from "../Bandeja";
import { Contacto } from "../Contacto";
import { GestorCorreos } from "../GestorCorreos";

describe("Enviar borradores", () => {

    const remitente = new Contacto("Jeon Jungkook", "Jungkook@arirang.com");
    const destinatario = new Contacto("Taehyung", "taehyung@arirang.com");

    test( "un borrador que es valido pasa de bandeja de borrador a bandeja de enviados",() =>{
        const gestor = new GestorCorreos();
        const borrador = gestor.iniciarBorrador(remitente);

        gestor.editarBorrador(borrador.getId(), {
            asunto: "El mejor concierto",
            destinatarios: [destinatario],
        });

        gestor.enviar(borrador);

        expect(gestor.obtenerBandejaDe(borrador)).toBe(Bandeja.ENVIADOS);
        expect(gestor.obtenerBandeja(Bandeja.ENVIADOS)).toEqual([borrador]);
        expect(gestor.obtenerBandeja(Bandeja.BORRADORES)).toEqual([]);

    });

     test( "un borrador inconpleto no se puede enviar",() =>{
        const gestor = new GestorCorreos();
        const borrador = gestor.iniciarBorrador(remitente);

        expect(() => gestor.enviar(borrador)).toThrow("El correo debe tener un asunto válido");
        expect(() => gestor.enviar(borrador)).toThrow("El correo debe tener al menos un destinatario");

    });

    test( "un borrador con asunto perp sin destinatario no se puede enviar",() =>{
        const gestor = new GestorCorreos();
        const borrador = gestor.iniciarBorrador(remitente);

        gestor.editarBorrador(borrador.getId(), {asunto:"se confima que bts viene a arg el 2028"})

        expect(() => gestor.enviar(borrador)).toThrow("El correo debe tener al menos un destinatario");

    });

     test( "si el envio del correo falla no se pasa de banadeja",() =>{
        const gestor = new GestorCorreos();
        const borrador = gestor.iniciarBorrador(remitente);

        expect(() => gestor.enviar(borrador)).toThrow();

        expect(gestor.obtenerBandejaDe(borrador)).toBe(Bandeja.BORRADORES);
        expect(gestor.obtenerBandeja(Bandeja.ENVIADOS)).toEqual([]);
    });

    test( "se puede enviar un borrador moviendolo a la bandeja de enviados",() =>{
        const gestor = new GestorCorreos();
        const borrador = gestor.iniciarBorrador(remitente);

        gestor.editarBorrador(borrador.getId(), {asunto:"se confima que bts viene a arg el 2028", destinatarios:[destinatario]})
       
        gestor.moverCorreo(borrador, Bandeja.ENVIADOS)
        expect(gestor.obtenerBandejaDe(borrador)).toBe(Bandeja.ENVIADOS);
       });

    });
