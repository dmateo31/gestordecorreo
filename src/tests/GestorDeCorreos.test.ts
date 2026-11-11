import { describe, expect, test } from "vitest";
import { Bandeja } from "../Bandeja";
import { Contacto } from "../Contacto";
import { Correo } from "../Correo";
import { ServidorCorreo } from "../ServidorCorreos";
import { GestorCorreos } from "../GestorCorreos";

 describe( "gestor con una casilla por usuario",() =>{

    const joaco = new Contacto("joaco", "Jungkook@arirang.com");
    const tae = new Contacto("Tae", "taehyung@arirang.com");
    const min = new Contacto("min", "yoongi@arirang.com");
    const nam = new Contacto("nam", "nam@arirang.com");
    
    test( "creación de casillas vacías",() =>{
        const servidor = new ServidorCorreo();
        const casilla = servidor.casillaDe(joaco);

        expect(casilla.obtenerBandeja(Bandeja.ENTRADA)).toEqual([]);
        expect(casilla.obtenerBandeja(Bandeja.ENVIADOS)).toEqual([]);
        expect(casilla.obtenerBandeja(Bandeja.BORRADORES)).toEqual([]);
        expect(casilla.obtenerBandeja(Bandeja.ELIMINADOS)).toEqual([]);

    });

      test( "creación de casillas vacías",() =>{
        const servidor = new ServidorCorreo();
       

        const correo = new Correo(
            "24",
            "El mejor concierto",
            "BTS con la casaca argentina",
            joaco,
            [tae, min, nam]
    );

        const correo2 = new Correo(
            "21",
            "BTS llego  a Argentina",
            "BTS se prepara para su primer concierto en Argentina",
            joaco,
            [tae, min, nam]
        );

        servidor.enviar(correo);
        servidor.enviar(correo2);
        servidor.casillaDe(min).eliminarCorreo(correo);

        //se comprueba que los correos de los destinatarios se encuentren en la bandeja de entrada
        expect(servidor.casillaDe(tae).obtenerBandejaDeEntrada()).toHaveLength(2);
        expect(servidor.casillaDe(nam).obtenerBandejaDeEntrada()).toHaveLength(2);
        expect(servidor.casillaDe(min).obtenerBandejaDeEntrada()).toHaveLength(1);
        
        //se comprueba que los correos del remitente se encuentren en la bandeja de enviados
        expect(servidor.casillaDe(joaco).obtenerEnviados()).toHaveLength(2);

        //el correo eliminado quedó en Eliminados solo para quien lo eliminó
        expect(servidor.casillaDe(min).obtenerBandejaDe(correo)).toBe(Bandeja.ELIMINADOS);
        expect(servidor.casillaDe(tae).obtenerBandejaDe(correo)).toBe(Bandeja.ENTRADA);
        expect(servidor.casillaDe(tae).obtenerBandejaDe(correo2)).toBe(Bandeja.ENTRADA);
        



    });
    });
