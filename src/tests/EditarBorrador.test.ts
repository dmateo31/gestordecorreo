import { describe, expect, test } from "vitest";
import { Bandeja } from "../Bandeja";
import { Contacto } from "../Contacto";
import { GestorCorreos } from "../GestorCorreos";

describe( "editar borradores", () =>{

    const remitente = new Contacto("Jeon Jungkook", "Jungkook@arirang.com");
    const tae = new Contacto("Taehyung", "taehyung@arirang.com");
    const jimin = new Contacto("Jimin", "jimin@arirang.com");

    test("los cambios de asunto y cuerpo se logran conservar", () =>{
        const gestor = new GestorCorreos(),
        borrador = gestor.iniciarBorrador(remitente);

        gestor.editarBorrador(borrador.getId(), {
            asunto : "El mejor concierto",
            cuerpo :"BTS con la casaca argentina"
        });

        const recuperado = gestor.recuperarBorrador(borrador.getId());
        expect(recuperado.getAsunto()).toBe("El mejor concierto");
        expect(recuperado.getCuerpo()).toBe("BTS con la casaca argentina");

    });

    test("se pueden cambiar los destinatarios", () =>{

        const gestor = new GestorCorreos();
        const borrador = gestor.iniciarBorrador(remitente);
        
        gestor.editarBorrador(borrador.getId(), {destinatarios : [tae, jimin]});

        expect(gestor.recuperarBorrador(borrador.getId()).getDestinatarios()).toEqual([tae,jimin]);
    });

    test ("se puede modicar un campo sin necesidad que los demás cambien", () => {
        const gestor = new GestorCorreos();
        const borrador = gestor.iniciarBorrador(remitente);

        gestor.editarBorrador(borrador.getId(), {asunto :"bts en argentina 2028", cuerpo:"parece que bts vuelve a arg"})

        gestor.editarBorrador(borrador.getId(), {asunto:"se confima que bts viene a arg el 2028"})

        const recuperado = gestor.recuperarBorrador(borrador.getId());
        expect(recuperado.getAsunto()).toBe("se confima que bts viene a arg el 2028");
        expect(recuperado.getCuerpo()).toBe("parece que bts vuelve a arg");
    });

    test("editar no duplica no lo saca de borradores", () => {
        const gestor = new GestorCorreos();
        const borrador = gestor.iniciarBorrador(remitente);

        gestor.editarBorrador(borrador.getId(), {asunto :"bts en argentina 2028"})
        gestor.editarBorrador(borrador.getId(), {asunto:"se confima que bts viene a arg el 2028"})

        expect(gestor.obtenerBandeja(Bandeja.BORRADORES)).toHaveLength(1);
        const recuperado = gestor.recuperarBorrador(borrador.getId());
        expect(recuperado.getAsunto()).toBe("se confima que bts viene a arg el 2028");

    });

    test("falla si no existe un borrador con ese id", () => {
        const gestor = new GestorCorreos();

        expect(() => gestor.editarBorrador("no-existe", { asunto: "x" })).toThrow(
            "No existe un borrador con id no-existe"
        );
  });

});