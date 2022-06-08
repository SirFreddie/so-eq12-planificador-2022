import { CPU } from "./CPU";
import { Proceso } from "./Proceso";

export class Planificador {

    public procesosListos: Array<Proceso> = [];
    public procesosBloqueados: Array<Proceso> = [];


    constructor(       
    ) {}

    public iniciarPlanificador(cpu: CPU): void {
        this.gestionarProcesosListos(cpu);
        this.gestionarProcesosEnCpu(cpu);
        this.gestionarProcesosBloqueados();
    }

    public agregarProcesoListo(proceso: Proceso): void {
        this.procesosListos.push(proceso);
    }

    public quitarProcesoListo(proceso: Proceso): void {
        const index = this.procesosListos.indexOf(proceso, 0);
        if (index > -1) {
          this.procesosListos.splice(index, 1);
        }
    }

    public quitarProcesoBloqueado(proceso: Proceso): void {
        const index = this.procesosBloqueados.indexOf(proceso, 0);
        if (index > -1) {
          this.procesosBloqueados.splice(index, 1);
        }
    }

    public desbloquearProceso(proceso: Proceso): void {
        this.procesosBloqueados.forEach(p => {
            if (proceso === p) {
              p.bloqueado = false;
              p.bloquedBy = "";
              p.auxTimer = p.tiempoEsperaDesbloqueo;
              const index = this.procesosBloqueados.indexOf(p, 0);
              if (index > -1) {
                this.procesosBloqueados.splice(index, 1);
              }
              this.agregarProcesoListo(p);
            }
        });
    }

    // Verifica si hay procesos listos en el planificador, luego verifica que haya procesadores disponibles.
    // De ser el caso, asigna un proceso al procesador disponible.
    private gestionarProcesosListos(cpu: CPU): void {
        let proceso = this.procesosListos[0];
        let insertado = false;

        if (proceso) {
          cpu.procesadores.forEach(procesador => {
            if (procesador.procesoActivo === null && !insertado && !proceso.bloqueado) {
              procesador.ejecutarProceso(proceso); // Inicia el timer de ejecucion de proceso del procesador.
              insertado = true;
              
              this.quitarProcesoListo(proceso);
            }
          });
        }
    }

    // Verifica si hay procesos bloqueados en cpi, si los hay lo manda a la cola de bloqueados.
    // Si un proceso completo su tiempo de ejecucion lo envia a finalizados.
    // Si un procesador completo su tiempo de ejecucion, envia su proceso actual a listo.
    private gestionarProcesosEnCpu(cpu: CPU): void {
        cpu.procesadores.forEach(procesador => {
          if (procesador.procesoActivo !== null) {
            if(procesador.procesoActivo.tiempoEjecucion <= 0) {
              procesador.procesoActivo = null;   
              return;
            }
            if (procesador.procesoActivo.bloqueado) {
              if (procesador.procesoActivo.bloquedBy === "cpu") {
                procesador.procesoActivo.bloqueado = false;
                this.agregarProcesoListo(procesador.procesoActivo);
                procesador.procesoActivo = null;
                return;
              } else if (procesador.procesoActivo.bloquedBy === "E/S") {
                procesador.procesoActivo.desbloquearse();
                this.procesosBloqueados.push(procesador.procesoActivo);
                procesador.procesoActivo = null;    
                return;
              } else {
                this.procesosBloqueados.push(procesador.procesoActivo);
                procesador.procesoActivo = null;    
                return;
              }
            }
          }
        });
    }

    private gestionarProcesosBloqueados(): void {
        this.procesosBloqueados.forEach(proceso => {
            if (!proceso.bloqueado) {
                this.agregarProcesoListo(proceso);
                this.quitarProcesoBloqueado(proceso);
            }
        });
    }
} 