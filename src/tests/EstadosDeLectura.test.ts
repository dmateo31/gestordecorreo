import { describe, expect, test } from "vitest";
import { Bandeja } from "../Bandeja";
import { no } from "../Combinadores";
import { Contacto } from "../Contacto";
import { Correo } from "../Correo";
import { Filtro } from "../Filtro";
import { GestorCorreos } from "../GestorCorreos";
import { estaLeido } from "../Predicados";

 describe( "estado de lectura de los correos",() =>{

    const remitente = new Contacto("HeeJin", "heejin@gmail.com");
    const destinatario = new Contacto("Chuu", "chuu@gmail.com");

    const crearCorreo = (id: string): Correo =>
    new Correo(id, "Asunto " + id, "Cuerpo", remitente, [destinatario]);

     test( "el estado leido se mantiene al hacer una consulta la bandeja",() =>{
        const gestor = new GestorCorreos();
        const correo = crearCorreo("1");

        gestor.recibirCorreo(correo);
        correo.marcarComoLeido();

        expect(gestor.obtenerBandeja(Bandeja.ENTRADA)[0].estaLeido()).toBe(true);
    });

     test( "marcar como leído no mueve el correo de su bandeja",() =>{
        const gestor = new GestorCorreos();
        const correo = crearCorreo("1");

        gestor.recibirCorreo(correo);
        correo.marcarComoLeido();

        expect(gestor.obtenerBandejaDe(correo)).toBe(Bandeja.ENTRADA);
        expect(gestor.obtenerBandeja(Bandeja.ENTRADA)).toHaveLength(1);
    });

     test("filtrar por no leídos y obtenerNoLeidos dan el mismo resultado", () => {
        const gestor = new GestorCorreos();
        const sinLeer = new Filtro("Sin leer", no(estaLeido));
        const uno = crearCorreo("1");
        const dos = crearCorreo("2");

        gestor.recibirCorreo(uno);
        gestor.recibirCorreo(dos);
        dos.marcarComoLeido();

        expect(gestor.filtrar(Bandeja.ENTRADA, sinLeer)).toEqual(
            gestor.obtenerNoLeido(Bandeja.ENTRADA)
         );
    });

    test("el cambio de estado se refleja enseguida en un filtro aplicado desde el gestor", () => {
        const gestor = new GestorCorreos();
        const sinLeer = new Filtro("Sin leer", no(estaLeido));
        const correo = crearCorreo("1");

        gestor.recibirCorreo(correo);
        expect(gestor.filtrar(Bandeja.ENTRADA, sinLeer)).toEqual([correo]);

        correo.marcarComoLeido();
        expect(gestor.filtrar(Bandeja.ENTRADA, sinLeer)).toEqual([]);

        correo.marcarComoNoLeido();
        expect(gestor.filtrar(Bandeja.ENTRADA, sinLeer)).toEqual([correo]);
  });

    });