import { Proceso } from './Proceso';

export class Procesador {

    public awake: boolean = false;
    public auxTimer: number = 0;
    public procesoActivo: Proceso | null = null;

    constructor(
        public nombre: string,
        public tiempoProceso: number
    ) {
        this.auxTimer = this.tiempoProceso;
    }

    async ejecutarProceso(proceso: Proceso): Promise<void> {
        this.procesoActivo = proceso;
        if (this.procesoActivo !== null) {
            const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
            this.awake = true;
            while (this.awake) {
                await delay(1000);
                if (this.procesoActivo !== null && !this.procesoActivo.bloqueado) {
                    this.auxTimer--;
                    this.procesoActivo.start();
                    if (this.auxTimer <= 0) {
                        this.auxTimer = this.tiempoProceso;
                        this.procesoActivo.bloquedBy = "cpu";
                        this.procesoActivo.bloqueado = true;
                        this.awake = false;
                    }
                } else {
                    this.awake = false;
                }
            }
        }
    }
} 