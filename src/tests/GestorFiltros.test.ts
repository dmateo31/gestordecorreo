import { describe, expect, test } from "vitest";
import { Filtro } from "../Filtro";
import { GestorFiltros } from "../GestorFiltros";
import { asuntoContiene } from "../Predicados";

describe("Gestor de filtros", () => {
  const crearFiltro = (nombre: string): Filtro =>
    new Filtro(nombre, asuntoContiene(nombre));

  const registrarCinco = (gestor: GestorFiltros): void => {
    ["Filtro 1", "Filtro 2", "Filtro 3", "Filtro 4", "Filtro 5"].forEach((nombre) =>
      gestor.registrarFiltro(crearFiltro(nombre))
    );
  };

  test("se registra un filtro", () => {
    const gestor = new GestorFiltros();
    const filtro = crearFiltro("Exámenes");

    gestor.registrarFiltro(filtro);

    expect(gestor.obtenerFiltros()).toContain(filtro);
  });

  test("se pueden registrar hasta cinco filtros", () => {
    const gestor = new GestorFiltros();

    registrarCinco(gestor);

    expect(gestor.obtenerFiltros()).toHaveLength(5);
  });

  test("no se puede registrar un sexto filtro", () => {
    const gestor = new GestorFiltros();
    registrarCinco(gestor);

    expect(() => gestor.registrarFiltro(crearFiltro("Filtro 6"))).toThrow(
      "No se pueden registrar más de 5 filtros"
    );
    expect(gestor.obtenerFiltros()).toHaveLength(5);
  });

  test("no se permiten dos filtros con el mismo nombre", () => {
    const gestor = new GestorFiltros();
    gestor.registrarFiltro(crearFiltro("Exámenes"));

    expect(() => gestor.registrarFiltro(crearFiltro("Exámenes"))).toThrow(
      "Ya existe un filtro con este nombre"
    );
    expect(() => gestor.registrarFiltro(crearFiltro("EXÁMENES"))).toThrow(
      "Ya existe un filtro con este nombre"
    );
    expect(gestor.obtenerFiltros()).toHaveLength(1);
  });

  test("se puede buscar un filtro por su nombre", () => {
    const gestor = new GestorFiltros();
    const filtro = crearFiltro("Exámenes");
    gestor.registrarFiltro(filtro);

    expect(gestor.buscarFiltroPorNombre("Exámenes")).toBe(filtro);
    expect(gestor.buscarFiltroPorNombre("exámenes")).toBe(filtro);
  });

  test("devuelve undefined si el filtro no está registrado", () => {
    const gestor = new GestorFiltros();

    expect(gestor.buscarFiltroPorNombre("Inexistente")).toBeUndefined();
  });

  test("al eliminar un filtro queda lugar para registrar otro", () => {
    const gestor = new GestorFiltros();
    registrarCinco(gestor);

    gestor.eliminarFiltro("Filtro 1");
    expect(gestor.obtenerFiltros()).toHaveLength(4);
    expect(gestor.buscarFiltroPorNombre("Filtro 1")).toBeUndefined();

    gestor.registrarFiltro(crearFiltro("Filtro 6"));
    expect(gestor.obtenerFiltros()).toHaveLength(5);
  });

  test("error al eliminar un filtro que no existe", () => {
    const gestor = new GestorFiltros();

    expect(() => gestor.eliminarFiltro("Inexistente")).toThrow(
      "No se encontró el filtro con el nombre proporcionado"
    );
  });

  test("obtenerFiltros devuelve una copia: modificarla no cambia el registro", () => {
    const gestor = new GestorFiltros();
    gestor.registrarFiltro(crearFiltro("Exámenes"));

    const copia = gestor.obtenerFiltros();
    copia.pop();

    expect(copia).toHaveLength(0);
    expect(gestor.obtenerFiltros()).toHaveLength(1);
  });
});
