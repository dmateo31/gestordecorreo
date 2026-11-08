import { describe, expect, test } from "vitest";
import { Contacto } from "../Contacto";
import { Correo } from "../Correo";
import {
  filtroAcademicosImportantes,
  filtroCorreosDeLaUcp,
  filtroParaSeguimiento,
  filtroPendientesDeRevision,
  filtroPersonalesPrioritarios,
} from "../FiltrosPredefinidos";
import { GestorFiltros } from "../GestorFiltros";

describe("Filtros predefinidos", () => {
  const profesor = new Contacto("Wendy", "wendy@ucp.edu.ar");
  const secretaria = new Contacto("Irene", "irene@ucp.edu.ar");
  const seulgi = new Contacto("Kang Seulgi", "seulgi@gmail.com");
  const yeri = new Contacto("Yeri", "yeri@gmail.com");
  const joy = new Contacto("Joy", "joy@gmail.com");

  const crearCorreo = (
    id: string,
    asunto: string,
    cuerpo: string,
    remitente: Contacto
  ): Correo => new Correo(id, asunto, cuerpo, remitente, [joy]);

  test("Correos de la UCP: solo los enviados desde @ucp.edu.ar", () => {
    const examenUcp = crearCorreo("1", "Examen de Paradigmas", "Fecha confirmada", profesor);
    const avisoUcp = crearCorreo("2", "Cambio de aula", "Pasamos al aula 3", secretaria);
    const deSeulgi = crearCorreo("3", "Examen de baile", "Ensayo el lunes", seulgi);

    const resultado = filtroCorreosDeLaUcp().aplicar([examenUcp, avisoUcp, deSeulgi]);

    expect(resultado).toEqual([examenUcp, avisoUcp]);
  });

  test("Correos académicos importantes: de la UCP y con Examen en el asunto", () => {
    const examenUcp = crearCorreo("1", "Examen de Paradigmas", "Fecha confirmada", profesor);
    const avisoUcp = crearCorreo("2", "Cambio de aula", "Pasamos al aula 3", secretaria);
    const examenAjeno = crearCorreo("3", "Examen de baile", "Ensayo el lunes", seulgi);

    const resultado = filtroAcademicosImportantes().aplicar([examenUcp, avisoUcp, examenAjeno]);

    expect(resultado).toEqual([examenUcp]);
  });

  test("Pendientes de revisión: no leídos con Entrega en el contenido", () => {
    const sinLeer = crearCorreo("1", "Trabajo práctico", "Recuerden la Entrega del viernes", secretaria);
    const yaLeido = crearCorreo("2", "Otro trabajo", "Otra Entrega pendiente", secretaria);
    const sinEntrega = crearCorreo("3", "Cambio de aula", "Pasamos al aula 3", secretaria);
    yaLeido.marcarComoLeido();
    const filtro = filtroPendientesDeRevision();

    expect(filtro.aplicar([sinLeer, yaLeido, sinEntrega])).toEqual([sinLeer]);

    sinLeer.marcarComoLeido();
    expect(filtro.aplicar([sinLeer, yaLeido, sinEntrega])).toEqual([]);
  });

  test("Correos personales prioritarios: favoritos enviados por el contacto elegido", () => {
    const favoritoDeSeulgi = crearCorreo("1", "Comeback de Red Velvet", "Vamos juntos", seulgi);
    const comunDeSeulgi = crearCorreo("2", "Saludos", "Hola", seulgi);
    const favoritoDeYeri = crearCorreo("3", "Cumpleaños de Joy", "Te espero", yeri);
    favoritoDeSeulgi.marcarComoFavorito();
    favoritoDeYeri.marcarComoFavorito();
    const correos = [favoritoDeSeulgi, comunDeSeulgi, favoritoDeYeri];
    const filtro = filtroPersonalesPrioritarios(seulgi);

    expect(filtro.aplicar(correos)).toEqual([favoritoDeSeulgi]);
    expect(filtroPersonalesPrioritarios(yeri).aplicar(correos)).toEqual([favoritoDeYeri]);

    favoritoDeSeulgi.desmarcarComoFavorito();
    expect(filtro.aplicar(correos)).toEqual([]);
  });

  test("Correos para seguimiento: Proyecto o Reunión en el asunto, excluyendo los leídos", () => {
    const proyecto = crearCorreo("1", "Proyecto final", "Avancemos", yeri);
    const reunion = crearCorreo("2", "Reunión del grupo", "Mañana a las 10", yeri);
    const proyectoLeido = crearCorreo("3", "Proyecto viejo", "Ya está", yeri);
    const otro = crearCorreo("4", "Cumpleaños de Joy", "Traigan torta", yeri);
    proyectoLeido.marcarComoLeido();
    const correos = [proyecto, reunion, proyectoLeido, otro];
    const filtro = filtroParaSeguimiento();

    expect(filtro.aplicar(correos)).toEqual([proyecto, reunion]);

    reunion.marcarComoLeido();
    expect(filtro.aplicar(correos)).toEqual([proyecto]);
  });

  test("los filtros compuestos reutilizan la condición del filtro de la UCP", () => {
    const examenUcp = crearCorreo("1", "Examen de Paradigmas", "Fecha confirmada", profesor);
    const examenAjeno = crearCorreo("2", "Examen de baile", "Ensayo el lunes", seulgi);

    const academicos = filtroAcademicosImportantes().aplicar([examenUcp, examenAjeno]);

    expect(filtroCorreosDeLaUcp().aplicar(academicos)).toEqual(academicos);
  });

  test("los cinco filtros predefinidos entran justo en el gestor de filtros", () => {
    const gestor = new GestorFiltros();

    gestor.registrarFiltro(filtroCorreosDeLaUcp());
    gestor.registrarFiltro(filtroAcademicosImportantes());
    gestor.registrarFiltro(filtroPendientesDeRevision());
    gestor.registrarFiltro(filtroPersonalesPrioritarios(seulgi));
    gestor.registrarFiltro(filtroParaSeguimiento());

    expect(gestor.obtenerFiltros()).toHaveLength(5);
    expect(() => gestor.registrarFiltro(filtroCorreosDeLaUcp())).toThrow(
      "No se pueden registrar más de 5 filtros"
    );
  });
});
