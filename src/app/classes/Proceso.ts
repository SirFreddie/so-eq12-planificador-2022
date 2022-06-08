export class Proceso {

    private awake: boolean = false;

    public bloquedBy: string = "";
    public bloqueado: boolean = false;
    public auxTimer: number = 0;

    constructor(
        public nombre: string,
        public prioridad: number,
        public tiempoEjecucion: number,
        public tipo: string,
        public tiempoEsperaDesbloqueo: number
    ) {
        this.auxTimer = this.tiempoEsperaDesbloqueo;
    }

    start(): void {
        if (!this.bloqueado) {
            this.tiempoEjecucion--;
            if (this.tiempoEjecucion <= 0) {
                this.tiempoEjecucion = 0;
            }
        }
    }

    async desbloquearse(): Promise<void> {
        const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
        this.awake = true;
        while (this.awake) {
            await delay(1000);
            if (this.bloqueado) {
                this.auxTimer--;
                if (this.auxTimer <= 0) {
                    this.bloqueado = false;
                    this.awake = false;
                    this.auxTimer = this.tiempoEsperaDesbloqueo;
                    console.log("DESBLOQUEADO")
                }
            } else {
                this.bloqueado = false;
                this.awake = false;
            }
        }
    }
} 