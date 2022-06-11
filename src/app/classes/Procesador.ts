import { Constantes } from './Const';
import { Proceso } from './Proceso';
import { Timer } from './Utils';

// Esta clase representa un procesador o nucleo de procesamiento.
export class Procesador {

    private _awake: boolean = false;

    public quantumRestante: number = 0; // Tiempo de procesamiento actual del procesador.
    public procesoActivo: Proceso | null = null; // Proceso que se esta ejecutando.

    constructor(
        public nombre: string,
        private quantum: number
    ) {
        this.quantumRestante = this.quantum;
    }

    // Logica para ejecutar un proceso.
    public async ejecutarProceso(proceso: Proceso): Promise<void> {
        this.procesoActivo = proceso; // Asigna un nuevo proceso al procesador.
        this._awake = true; // Despierta al procesador.

        // Mientras el procesador este despierto, ejecuta una unidad de tiempo de proceso y procesador. 
        while (this._awake) {
            await Timer.delay(1000); // Ejecuta cada un segundo.

            // Si existe un proceso activo y el proceso no esta bloqueado.
            if (this.procesoActivo !== null && !this.procesoActivo.bloqueado) {
                this.quantumRestante--; // Disminuye en 1 el tiempo de ejecucion del procesador.
                this.procesoActivo.tick(); // Ejecuta una unidad de tiempo de proceso.

                // Si el procesador cumplio su ciclo de procesamiento.
                if (this.quantumRestante <= 0) {
                    this.quantumRestante = this.quantum; // Se reinicia el tiempo de procesamiento.
                    this.procesoActivo.bloquear(Constantes.TIPO_BLOQUEO.CPU) // Indica que se bloqueo al proceso por CPU.
                    this._awake = false; // Duerme al procesador.
                }
            } else {
                this._awake = false; // Duerme al procesador.
            }
        }
    }

    // Libera el procesador para que entre un nuevo proceso.
    public liberar(): void {
        this.procesoActivo = null;
    }
} 