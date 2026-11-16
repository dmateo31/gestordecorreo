import { describe, expect, test } from "vitest";
import { Bandeja } from "../Bandeja";
import { Contacto } from "../Contacto";
import { Correo } from "../Correo";
import { Filtro } from "../Filtro";
import { GestorCorreos } from "../GestorCorreos";
import { asuntoContiene } from "../Predicados";

describe("Filtrar muchos correos por asunto", () => {
  const heejin = new Contacto("HeeJin", "heejin@gmail.com");
  const chuu = new Contacto("Chuu", "chuu@gmail.com");

  test("de 100 correos enviados, el filtro deja solo los del asunto buscado", () => {
    const gestor = new GestorCorreos();
    const asuntos = ["Reunión del viernes", "Entrega del TP"];

    // 100 correos con id del 0 al 99. i % 2 da 0 o 1, así que los asuntos se alternan:
    // los pares son "Reunión del viernes" (50) y los impares "Entrega del TP" (50)
    const correos = Array.from(
      { length: 100 },
      (_, i) => new Correo(String(i), asuntos[i % 2], "Te paso los detalles", heejin, [chuu])
    );
    correos.forEach((correo) => gestor.enviar(correo));

    // el filtro busca "reunión" en el asunto, sin distinguir mayúsculas
    const reuniones = new Filtro("Reuniones", asuntoContiene("reunión"));
    const resultado = gestor.filtrar(Bandeja.ENVIADOS, reuniones);

    // se enviaron los 100, y el filtro devuelve solo las 50 reuniones
    expect(gestor.obtenerEnviados()).toHaveLength(100);
    expect(resultado).toHaveLength(50);
    // todos los que devuelve tienen el asunto buscado
    expect(resultado.every((correo) => correo.getAsunto() === "Reunión del viernes")).toBe(true);
  });
});