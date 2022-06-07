export class Proceso {
    constructor(
        public nombre: string,
        public prioridad: number,
        public tiempoEjecucion: number,
        public bloqueado: boolean,
    ) {
        //this.autoBlock();
    }

    public triggerCountdown(): void {
        setInterval(() => this.countDown(), 1000);
    }

    autoBlock(): void {
        setInterval(() => this.bloqueado = true, this.tiempoEjecucion*1000);
    }

    countDown(): void {
        if (!this.bloqueado) {
            this.tiempoEjecucion--;
            if (this.tiempoEjecucion <= 0) {
                this.tiempoEjecucion = 0;
            }
        }
    }
} 