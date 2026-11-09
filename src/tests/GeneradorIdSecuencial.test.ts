import { describe, expect, test } from "vitest";
import {GeneradorIdSecuencial} from "../GeneradorIdSecuencial";

describe ("generador de IDs", () => {

    test("usa el prefijo 'correo-' por defecto", () => {
        const generador = new GeneradorIdSecuencial();

        expect(generador.generarID()).toBe("correo-1");
    });

    test("se genera id secuacilaes con el profijo indicado", () =>{
        const generador = new GeneradorIdSecuencial("borrador-");

        expect(generador.generarID()).toBe("borrador-1");
        expect(generador.generarID()).toBe("borrador-2");
    })


});
