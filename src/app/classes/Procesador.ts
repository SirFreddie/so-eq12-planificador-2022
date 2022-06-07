import { Proceso } from "./Proceso";

export class Procesador {
    constructor(
        public nombre: string,
        public procesoActivo: Proceso | null
    ) {}
} 