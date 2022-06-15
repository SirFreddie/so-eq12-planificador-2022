import { Constantes } from "./Const";
import { Timer } from "./Utils";

export class Proceso {

    private _awake: boolean = false;
    private _bloquedBy: string = Constantes.TIPO_BLOQUEO.NONE;
    private _bloqueado: boolean = false;
    private _esperandoEntradaSalida: number = 0;
    
    public tiempoActualDesbloqueo: number = 0;
    public edad: number = 0;


    constructor(
        public nombre: string,
        public prioridad: number,
        public tiempoEjecucion: number,
        public tipo: string,
        public tiempoBloqueoPorEntradaSalida: number,
        public tiempoEsperaDesbloqueo: number
    ) {
        this.tiempoActualDesbloqueo = this.tiempoEsperaDesbloqueo;
    }

    // GETTERS //
    public get bloquedBy() { return this._bloquedBy; }
    public get bloqueado() { return this._bloqueado; }
    public get esperandoEntradaSalida() { return this._esperandoEntradaSalida; }

    // Bloquea el proceso.
    public bloquear(tipoBloqueo: string): void {
        this._bloqueado = true;
        this._bloquedBy = tipoBloqueo;
    }

    // Desloquea el proceso.
    public desbloquear(): void {
        this._bloqueado = false;
        this._bloquedBy = Constantes.TIPO_BLOQUEO.NONE;
    }

    // Tick de ejecucion del proceso.
    tick(): void {
        // Si el proceso no esta bloqueado.
        if (!this._bloqueado) {
            this.tiempoEjecucion--; // Disminuye el tiempo de ejecucion.
            this._esperandoEntradaSalida++; // Aumenta el contador de E/S.

            // Si se llega al tiempo indicado para E/S.
            if (this.tiempoBloqueoPorEntradaSalida === this._esperandoEntradaSalida) {
                this.bloquear(Constantes.TIPO_BLOQUEO.ES); // Bloquea el proceso por E/S.
                this._esperandoEntradaSalida = 0; // Reinicia el tiempo de espera de E/S.
            }
            // Verifica si se termino de ejecutar el proceso.
            if (this.tiempoEjecucion <= 0) {
                this.tiempoEjecucion = 0;
            }
        }
    }

    // Aumenta la prioridad del proceso.
    public subirPrioridad(): void {
        this.prioridad--;
        if (this.tipo === Constantes.TIPO_PROCESO.SO) {
            if (this.prioridad <= Constantes.PRIORIDAD_MIN) {
                this.prioridad = Constantes.PRIORIDAD_MIN;
            }
        } else {
            if (this.prioridad <= Constantes.PRIORIDAD_MIN_USUARIO) {
                this.prioridad = Constantes.PRIORIDAD_MIN_USUARIO;
            }
        }
        this.edad = 0; // Se reinicia la edad.
    }

    // Aumenta la edad del proceso.
    public envejecer(): void {
        if (this.tipo === Constantes.TIPO_PROCESO.SO) {
            if (this.prioridad <= Constantes.PRIORIDAD_MIN) {
                return;
            }
        } else {
            if (this.prioridad <= Constantes.PRIORIDAD_MIN_USUARIO) {
                return;
            }
        }
        this.edad++;
        if (this.edad >= Constantes.EDAD_MAX_ENVEJECIMIENTO) {
            this.edad = Constantes.EDAD_MAX_ENVEJECIMIENTO;
        }
    }

    // Inicia el desbloqueo del proceso por E/S.
    public async timerDesbloqueo(): Promise<void> {
        this._awake = true;
        // Si esta despierto.
        while (this._awake) {
            await Timer.delay(1000); // Espera un segundo.
            // Si esta bloqueado.
            if (this._bloqueado) {
                this.tiempoActualDesbloqueo--; // Disminuye el tiempo actual de desbloqueo.
                // Si se termina el contador de desbloqueo.
                if (this.tiempoActualDesbloqueo <= 0) {
                    this.desbloquear(); // Desbloquea el proceso.
                    this._awake = false; // Duerme el debloqueo.
                    this.tiempoActualDesbloqueo = this.tiempoEsperaDesbloqueo; // Reinicia el tiempo de desbloqueo por E/S.
                }
            } else {
                this.desbloquear(); // Desbloquea el proceso.
                this._awake = false; // Duerme el desbloqueo.
            }
        }
    }
} 