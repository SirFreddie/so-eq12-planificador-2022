export interface Proceso {
    nombre: string;
    prioridad: number;
    tiempoEjecucion: number;
    bloqueado: boolean;
}

export interface CPU {
    nombre: string;
    procesosActivos: Array<Proceso>;
}

export interface Planificador {
    procesosListos: Array<Proceso>;
}