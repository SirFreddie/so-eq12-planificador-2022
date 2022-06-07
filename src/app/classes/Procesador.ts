import { Proceso } from "./Proceso";

export class Procesador {

    public awake: boolean = false;
    public tiempoProceso: number = 5; 
    public auxTimer: number = 5;

    constructor(
        public nombre: string,
        public procesoActivo: Proceso | null
    ) {}

    async triggerProcessingTimer(): Promise<void> {
        if (this.procesoActivo != null) {
            const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
            this.awake = true;
            while (this.awake) {
                await delay(1000);
                if (this.procesoActivo != null && !this.procesoActivo.bloqueado) {
                    this.auxTimer--;
                    this.procesoActivo.countDown();
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