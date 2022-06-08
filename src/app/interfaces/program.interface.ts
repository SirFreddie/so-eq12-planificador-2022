import { Proceso } from "../classes/Proceso";
import { Procesador } from '../classes/Procesador';

export interface IProceso {
    nombre: string;
    prioridad: number;
    tiempoEjecucion: number;
    bloqueado: boolean;
}

export interface ICPU {
    nombre: string;
    procesadores: Array<Procesador>;
}

export interface IPlanificador {
    procesosListos: Array<Proceso>;
}