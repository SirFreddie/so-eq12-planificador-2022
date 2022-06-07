export class Proceso {

    awake: boolean = false;
    public bloquedBy: string = "";

    constructor(
        public nombre: string,
        public prioridad: number,
        public tiempoEjecucion: number,
        public bloqueado: boolean,
        public tipo: string,
    ) { }

    public async triggerCountdown(): Promise<void> {
        const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
        this.awake = true;
        while (this.awake) {
            await delay(1000);
            this.countDown();
        }
    }

    countDown(): void {
        if (!this.bloqueado) {
            this.tiempoEjecucion--;
            if (this.tiempoEjecucion <= 0) {
                this.tiempoEjecucion = 0;
            }
        } else {
            this.awake = false;
        }
    }
} 