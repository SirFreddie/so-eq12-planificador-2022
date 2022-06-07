import { Proceso } from "../classes/Proceso";

export interface IProceso {
    nombre: string;
    prioridad: number;
    tiempoEjecucion: number;
    bloqueado: boolean;
}

export interface CPU {
    nombre: string;
    procesosActivos: Array<Proceso>;
}

export interface IPlanificador {
    procesosListos: Array<Proceso>;
}