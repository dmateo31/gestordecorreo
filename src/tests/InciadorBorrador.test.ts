import { describe, expect, test } from "vitest";
import { Bandeja } from "../Bandeja"
import { Contacto } from "../Contacto";
import { GestorCorreos } from "../GestorCorreos";
import { IGeneradorId } from "../interfaces/IGeneradorId";

describe ("iniciación del borrador", () => {

      const remitente = new Contacto("jungkook", "jungkook@bts.ar");


    test("Se inicia un borrador y lo registra en borradores", () => {
        const gestor = new GestorCorreos();
        const borrador = gestor.iniciarBorrador(remitente);

        expect(gestor.obtenerBandeja(Bandeja.BORRADORES)).toEqual([borrador]);
        expect(gestor.obtenerBandejaDe(borrador)).toBe(Bandeja.BORRADORES);


    });

    test("se crea el borrador con el remitente y sin el resto de los datos por defecto", () => {
        const gestor = new GestorCorreos();

        const borrador = gestor.iniciarBorrador(remitente);

        expect(borrador.getRemitente()).toBe(remitente);
        expect(borrador.getAsunto()).toBe("");
        expect(borrador.getCuerpo()).toBe("");
        expect(borrador.getDestinatarios()).toEqual([]);
          
    });

    test(" se genera un id falso o inyectado", () => {
        const generadorFalso : IGeneradorId = { generarID: () => "id-de-prueba" };
        const gestor = new GestorCorreos (generadorFalso);

        const borrador = gestor.iniciarBorrador(remitente);

        expect(borrador.getId()).toBe("id-de-prueba");
    });

    test("se comprueba que dos borradores iniciados no tienen la misma id", () => {
        const gestor = new GestorCorreos();

        const correo1 = gestor.iniciarBorrador(remitente);
        const correo2 = gestor.iniciarBorrador(remitente);

        expect(correo1.getId()).not.toBe(correo2.getId());
        expect(gestor.obtenerBandeja(Bandeja.BORRADORES)).toHaveLength(2);

    });
});