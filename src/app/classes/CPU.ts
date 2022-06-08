import { Procesador } from "./Procesador";
import { Proceso } from "./Proceso";

export class CPU {

    public procesadores: Array<Procesador> = [];

    constructor(

    ) {}

    public agregarProcesadores(procesador: Procesador): void {
        this.procesadores.push(procesador);
    }

    procesosActivos(): number {
        let result: number = 0;
        this.procesadores.forEach(procesador => {
          if ( procesador.procesoActivo !== null ) {
            result++;
          }
        });
        return result;
    }
} 