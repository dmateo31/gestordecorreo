import { Filtro } from "./Filtro";
import { lanzarError, validarReglas } from "./Reglas";

export class GestorFiltros {
  private static readonly MAXIMO_DE_FILTROS = 5;
  private filtros: Filtro[] = [];

  public registrarFiltro(filtro: Filtro): void {
    validarReglas(filtro, [
      () =>
        this.filtros.length >= GestorFiltros.MAXIMO_DE_FILTROS
          ? `No se pueden registrar más de ${GestorFiltros.MAXIMO_DE_FILTROS} filtros`
          : null,
      (f) =>
        this.buscarFiltroPorNombre(f.getNombre())
          ? "Ya existe un filtro con este nombre"
          : null,
    ]);
    this.filtros.push(filtro);
  }

  public obtenerFiltros(): Filtro[] {
    return [...this.filtros];
  }

  public buscarFiltroPorNombre(nombre: string): Filtro | undefined {
    //el nombre es el identificador del filtro, se compara sin distinguir mayúsculas
    return this.filtros.find(
      (filtro) => filtro.getNombre().toLowerCase() === nombre.toLowerCase()
    );
  }

  public eliminarFiltro(nombre: string): void {
    const filtro =
      this.buscarFiltroPorNombre(nombre) ??
      lanzarError("No se encontró el filtro con el nombre proporcionado");
    this.filtros = this.filtros.filter((f) => f !== filtro);
  }
}