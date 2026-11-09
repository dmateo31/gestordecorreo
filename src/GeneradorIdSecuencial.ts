import {IGeneradorId} from "./interfaces/IGeneradorId";

export class GeneradorIdSecuencial implements IGeneradorId{
    private ultimoId: number = 0;

    constructor (private readonly prefijo: string = "correo-"){}

    public generarID(): string {
        this.ultimoId ++;
        return `${this.prefijo}${this.ultimoId}`;
    }
}