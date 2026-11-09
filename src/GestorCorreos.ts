import{Correo} from "./Correo";
import { Bandeja } from "./Bandeja";
import { IFiltrador } from "./interfaces/IFiltrador";
import { lanzarError, validarReglas } from "./Reglas";
import { Contacto } from "./Contacto";
import { GeneradorIdSecuencial } from "./GeneradorIdSecuencial";
import { IGeneradorId } from "./interfaces/IGeneradorId";



type ReglasDeEnvio = (correo: Correo) => string | null;

type Movimiento = (correo: Correo) => void;

//para cada bandeja de origen: a qué bandejas se puede mover y con qué operación
type TablaDeMovimientos = Record<Bandeja, Partial<Record<Bandeja, Movimiento>>>;

const reglasDeEnvio: ReglasDeEnvio[] = [
  (c) => (!c.getRemitente() ? "El correo debe tener un remitente" : null),
  (c) =>
    c.getDestinatarios().length === 0
      ? "El correo debe tener al menos un destinatario"
      : null,
  (c) =>
    c.getAsunto().trim() === ""
      ? "El correo debe tener un asunto válido"
      : null,
];

export class GestorCorreos {
  private enviados: Correo[] = [];
  private borrador: Correo [] = [];
  private bandejaDeEntrada: Correo[] = [];
  private eliminados: Correo[] = [];
  //de qué bandeja salió cada correo eliminado (id -> bandeja), para poder restaurarlo
  private origenDeEliminados: Map<string, Bandeja> = new Map();

  public enviar(correo: Correo): void {
    this.validarCorreo(correo);
    //un correo recibido o eliminado no se puede enviar, solo uno nuevo, un borrador o uno ya enviado
    this.validarUbicacion(correo, [undefined, Bandeja.BORRADORES, Bandeja.ENVIADOS], "enviar");
     this.borrador = this.borrador.filter(
      (b) => b.getId() !== correo.getId()
    );
    const yaEnviado = this.enviados.some((e) => e.getId() === correo.getId());
    if (!yaEnviado) {
      this.enviados.push(correo);
    }
  }

    private validarCorreo(correo: Correo): void {
        const errores= reglasDeEnvio
            .map((regla) => regla(correo))
            .filter((mensaje): mensaje is string => mensaje !== null);

    if (errores.length > 0) {
         throw new Error(errores.join("; "));
      }
    }

  public obtenerEnviados(): Correo[] {
    return [...this.enviados];
  }

  public guardarBorrador(correo: Correo): void {
    this.validarUbicacion(correo, [undefined, Bandeja.BORRADORES], "guardar como borrador");
    //si el borrador ya estaba se reemplaza por esta versión, así nunca queda repetido
    this.borrador = [
      ...this.borrador.filter((b) => b.getId() !== correo.getId()),
      correo,
    ];
  }

  public obtenerBorrador(): Correo[] {
    return [...this.borrador];
  }

  public recibirCorreo(correo: Correo): void {
    this.validarUbicacion(correo, [undefined], "recibir");
    this.bandejaDeEntrada.push(correo);
  }

  public obtenerBandejaDeEntrada(): Correo[] {
    return [...this.bandejaDeEntrada];
  }

  public obtenerEliminados(): Correo[] {
    return [...this.eliminados];
  }

  //eliminación lógica: el correo no se borra, pasa a Eliminados y se recuerda de dónde venía
  public eliminarCorreo(correo: Correo): void {
    const origen = this.obtenerBandejaActual(correo);
    validarReglas(origen, [
      (bandeja) =>
        bandeja === Bandeja.ELIMINADOS
          ? "El correo ya se encuentra en Eliminados"
          : null,
    ]);
    this.trasladar(correo, origen, Bandeja.ELIMINADOS);
    this.origenDeEliminados.set(correo.getId(), origen);
  }

  //mueve el correo a otra bandeja solo si el dominio lo permite (ver obtenerMovimientosPermitidos)
  public moverCorreo(correo: Correo, destino: Bandeja): void {
    const origen = this.obtenerBandejaActual(correo);
    const movimiento =
      this.obtenerMovimientosPermitidos()[origen][destino] ??
      lanzarError(`No se puede mover un correo de ${origen} a ${destino}`);
    movimiento(correo);
  }

  //devuelve el correo a la bandeja de la que salió al eliminarse (conserva leído y favorito, porque el correo no cambia)
  public restaurarCorreo(correo: Correo): void {
    const origen =
      this.origenDeEliminados.get(correo.getId()) ??
      lanzarError("El correo no se encuentra en Eliminados");
    this.trasladar(correo, Bandeja.ELIMINADOS, origen);
    this.origenDeEliminados.delete(correo.getId());
  }

  //devuelve una copia de la bandeja pedida, para que desde afuera no se pueda alterar
  public obtenerBandeja(bandeja: Bandeja): Correo[] {
    return [...this.obtenerListaDe(bandeja)];
  }

  //el filtro no guarda correos: se aplica sobre los que tenga la bandeja en este momento.
  //Se pide la interfaz IFiltrador, así sirve cualquier filtro y no solo la clase Filtro
  public filtrar(bandeja: Bandeja, filtro: IFiltrador): Correo[] {
    return filtro.aplicar(this.obtenerBandeja(bandeja));
  }

  //cada correo está en una sola bandeja, se lo identifica por su id. Si no está en ninguna devuelve undefined
  public obtenerBandejaDe(correo: Correo): Bandeja | undefined {
    return Object.values(Bandeja).find((bandeja) =>
      this.obtenerListaDe(bandeja).some((c) => c.getId() === correo.getId())
    );
  }

  //se arma en cada llamada porque enviar() reemplaza la lista de borradores por una nueva
  private obtenerListaDe(bandeja: Bandeja): Correo[] {
    const listas: Record<Bandeja, Correo[]> = {
      [Bandeja.ENTRADA]: this.bandejaDeEntrada,
      [Bandeja.ENVIADOS]: this.enviados,
      [Bandeja.BORRADORES]: this.borrador,
      [Bandeja.ELIMINADOS]: this.eliminados,
    };
    return listas[bandeja];
  }

  //tabla de movimientos: bandeja de origen -> a qué bandejas puede ir y qué operación lo hace.
  //Lo que no figura en la tabla no está permitido. Desde Eliminados solo se vuelve con restaurarCorreo.
  private obtenerMovimientosPermitidos(): TablaDeMovimientos {
    const eliminar: Movimiento = (c) => this.eliminarCorreo(c);
    //enviar valida el correo, así un borrador incompleto no pasa a Enviados
    const enviar: Movimiento = (c) => this.enviar(c);
    return {
      [Bandeja.ENTRADA]: { [Bandeja.ELIMINADOS]: eliminar },
      [Bandeja.ENVIADOS]: { [Bandeja.ELIMINADOS]: eliminar },
      [Bandeja.BORRADORES]: {
        [Bandeja.ENVIADOS]: enviar,
        [Bandeja.ELIMINADOS]: eliminar,
      },
      [Bandeja.ELIMINADOS]: {},
    };
  }

  //si el correo no está en ninguna bandeja, obtenerBandejaDe devuelve undefined y ?? ejecuta lanzarError, que corta con un error
  private obtenerBandejaActual(correo: Correo): Bandeja {
    return (
      this.obtenerBandejaDe(correo) ??
      lanzarError("El correo no se encuentra en ninguna bandeja")
    );
  }

  //lo saca de la bandeja de origen y lo agrega en la de destino, así nunca queda en las dos ni repetido
  private trasladar(correo: Correo, origen: Bandeja, destino: Bandeja): void {
    const trasladado = this.quitarDeBandeja(origen, correo.getId());
    this.obtenerListaDe(destino).push(trasladado);
  }

  private quitarDeBandeja(bandeja: Bandeja, id: string): Correo {
    const lista = this.obtenerListaDe(bandeja);
    const correo =
      lista.find((c) => c.getId() === id) ??
      lanzarError(`El correo no se encuentra en ${bandeja}`);
    lista.splice(lista.indexOf(correo), 1);
    return correo;
  }

  //undefined en las ubicaciones permitidas significa "correo nuevo", que todavía no está en ninguna bandeja
  private validarUbicacion(
    correo: Correo,
    ubicacionesPermitidas: (Bandeja | undefined)[],
    operacion: string
  ): void {
    validarReglas(this.obtenerBandejaDe(correo), [
      (bandeja) =>
        ubicacionesPermitidas.includes(bandeja)
          ? null
          : `No se puede ${operacion} un correo que está en ${bandeja}`,
    ]);
  }

   public buscar(texto: string): Correo[] {
    const textoBuscado = texto.toLowerCase();
    return this.bandejaDeEntrada.filter((correo) => {
      const remitente = correo.getRemitente();
      return (
        correo.getAsunto().toLowerCase().includes(textoBuscado) ||
        correo.getCuerpo().toLowerCase().includes(textoBuscado) ||
        remitente.getNombre().toLowerCase().includes(textoBuscado) ||
        remitente.getEmail().toLowerCase().includes(textoBuscado) ||
        correo.getDestinatarios().some(
          (d) =>
            d.getNombre().toLowerCase().includes(textoBuscado) ||
            d.getEmail().toLowerCase().includes(textoBuscado)
        )
      );
    });
  }


  constructor (
    private readonly generadorId : IGeneradorId = new GeneradorIdSecuencial()
  ){}

  public iniciarBorrador(remitente:Contacto): Correo{
    const borrador = new Correo(this.generadorId.generarID(), "", "", remitente, []);
    this.guardarBorrador(borrador);
    return borrador;
  }
}
