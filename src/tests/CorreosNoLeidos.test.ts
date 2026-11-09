import { describe, expect, test } from "vitest";
import { Bandeja } from "../Bandeja";
import { Contacto } from "../Contacto";
import { Correo } from "../Correo";
import { GestorCorreos } from "../GestorCorreos";

 describe( "correos no leidos de uan bandeja",() =>{

    const remitente = new Contacto("HeeJin", "heejin@gmail.com");
    const destinatario = new Contacto("Chuu", "chuu@gmail.com");

    const crearCorreo = (id: string): Correo =>
    new Correo(id, "Asunto " + id, "Cuerpo", remitente, [destinatario]);

    test( "devuelve solo aquellos correos no leidos de la bandeja",() =>{
        const gestor = new GestorCorreos();
        const sinleer = crearCorreo("1");
        const leido = crearCorreo("2");

        gestor.recibirCorreo(sinleer);
        gestor.recibirCorreo(leido);
        leido.marcarComoLeido();

        expect(gestor.obtenerNoLeido(Bandeja.ENTRADA)).toEqual([sinleer]);

    });

    test( "un nuevo correo lo toma como no leido",() =>{
        const gestor = new GestorCorreos();
        const correo = crearCorreo("1");

        gestor.recibirCorreo(correo);

        expect(gestor.obtenerNoLeido(Bandeja.ENTRADA)).toEqual([correo]);

    });

    test( "la bandeja de entrada se encuetra vacía cuando todos los correos estan leidos",() =>{
        const gestor = new GestorCorreos();
        const correo = crearCorreo("1");

        gestor.recibirCorreo(correo);
        correo.marcarComoLeido();

        expect(gestor.obtenerNoLeido(Bandeja.ENTRADA)).toEqual([]);
      
    });

    test("al volver a marcarlo como no leído, reaparece en la lista", () => {
        const gestor = new GestorCorreos();
        const correo = crearCorreo("1");
        
        gestor.recibirCorreo(correo);
        correo.marcarComoLeido();
        correo.marcarComoNoLeido();

        expect(gestor.obtenerNoLeido(Bandeja.ENTRADA)).toEqual([correo]);
  });

    });