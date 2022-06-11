import { Constantes } from "./Const";
import { CPU } from "./CPU";
import { Proceso } from "./Proceso";

export class Planificador {

    private _procesosListos: Array<Proceso> = []; // Cola de procesos listos.
    private _procesosBloqueados: Array<Proceso> = []; // Cola de procesos bloqueados.
    private _procesosFinalizados: Array<any> = []; // Procesos finalizados.

    constructor(       
    ) {}

    // Ejecuta la funcionalidad del planificador cada x tiempo.
    public iniciarPlanificador(cpu: CPU): void {
        this.gestionarProcesosListos(cpu); // Gestiona los procesos en la cola de listos.
        this.gestionarProcesosEnCpu(cpu); // Gestiona los procesos activos en CPU.
        this.gestionarProcesosBloqueados(); // Gestiona los procesos en la cola de bloqueados.
    }

    // GETTERS //
    public get procesosListos() { return this._procesosListos; }
    public get procesosBloqueados() { return this._procesosBloqueados; }
    public get procesosFinalizados() { return this._procesosFinalizados; }

    // Agrega un proceso a la cola de listos.
    public agregarProcesoListo(proceso: Proceso): void {
      proceso.edad = 0; // Se reinicia la edad del proceso.
      this._procesosListos.push(proceso); // Agrega el proceso a la cola.
      this.ordenarColaListos(); // Reordena la cola de listos.
    }

    // Ordena la cola de listos en base a la prioridad y al tipo de proceso.
    // Si devuelve 0, se mantiene el orden, si devuelve -1 procesoA va antes que procesoB, si devuelve 1 procesoB va antes que procesoA.
    public ordenarColaListos(): void {
      this._procesosListos.sort(function(procesoA, procesoB){
        if (procesoA.prioridad === procesoB.prioridad) {
          if (procesoA.tipo === procesoB.tipo) {
            return 0;
          } else if (procesoA.tipo === Constantes.TIPO_PROCESO.SO && procesoB.tipo !== Constantes.TIPO_PROCESO.SO) {
            return -1;
          } else if (procesoA.tipo !== Constantes.TIPO_PROCESO.SO && procesoB.tipo === Constantes.TIPO_PROCESO.SO) {
            return 1;
          }
        } else {
          return procesoA.prioridad - procesoB.prioridad;
        }        
        return procesoA.prioridad - procesoB.prioridad
      });
    }

    // Ordena la cola de bloqueados en base al tipo de bloqueo y a su tiempo actual de desbloqueo.
    // De modo que indica quien sera el proximo en desbloquearse.
    private ordenarColaBloqueados(): void {
      this._procesosBloqueados.sort(function(procesoA, procesoB){
        if (procesoA.bloquedBy === procesoB.bloquedBy) {
          if (procesoA.tiempoActualDesbloqueo < procesoB.tiempoActualDesbloqueo) {
            return -1;
          } else if (procesoA.tiempoActualDesbloqueo > procesoB.tiempoActualDesbloqueo) {
            return 1;
          } else {
            return 0;
          }
        } else {
          if (procesoA.bloquedBy === Constantes.TIPO_BLOQUEO.ES && procesoB.bloquedBy === Constantes.TIPO_BLOQUEO.USUARIO ) {
            return -1;
          } else if (procesoA.bloquedBy === Constantes.TIPO_BLOQUEO.USUARIO && procesoB.bloquedBy === Constantes.TIPO_BLOQUEO.ES) {
            return 1;
          }
        }
        return 0;
      });
    }

    // Quita un proceso de la cola de procesos listos.
    private quitarProcesoListo(proceso: Proceso): void {
        const index = this._procesosListos.indexOf(proceso, 0);
        if (index > -1) {
          this._procesosListos.splice(index, 1);
        }
    }

    // Quita un proceso de la cola de bloqueados.
    private quitarProcesoBloqueado(proceso: Proceso): void {
        const index = this._procesosBloqueados.indexOf(proceso, 0);
        if (index > -1) {
          this._procesosBloqueados.splice(index, 1);
        }
    }

    // Desbloquea el proceso seleccionado.
    public desbloquearProceso(proceso: Proceso): void {
      // Recorre los procesos bloqueados.
      this._procesosBloqueados.forEach(procesoActual => {
          if (proceso === procesoActual) {
            procesoActual.desbloquear();
            procesoActual.tiempoActualDesbloqueo = procesoActual.tiempoEsperaDesbloqueo;
          }
      });
    }

    // Verifica si hay procesos listos en el planificador, luego verifica que haya procesadores disponibles.
    // De ser el caso, asigna un proceso al procesador disponible.
    // Gestiona si hay procesos bloqueados en la cola de listos y los agrega a la cola de bloqueados.
    // Si el proceso no esta bloqueado aumenta su edad.
    private gestionarProcesosListos(cpu: CPU): void {
      // Si existen procesos listos.
      if (this._procesosListos.length > 0) {
        let proceso = this._procesosListos[0]; // Quita el elemento en el tope de la lista.
        let insertado = false;

        // Si existe un proceso en el tope de la cola.
        if (proceso) {
          // Recorre los procesadores.
          cpu.procesadores.forEach(procesador => {
            // Si el procesador no tiene un proceso activo, si no se inserto un proceso y si el proceso a insertar no esta bloqueado.
            if (procesador.procesoActivo === null && !insertado && !proceso.bloqueado) {
              procesador.ejecutarProceso(proceso); // Inicia el timer de ejecucion de proceso del procesador.
              this.quitarProcesoListo(proceso); // Quita el proceso de la cola de listos.
              insertado = true;
            }
          });
        }

        // Recorre los procesos de la cola de listos.
        this._procesosListos.forEach(procesoActual => {
          // Si el proceso actual esta bloqueado.
          if (procesoActual.bloqueado) {
            this._procesosBloqueados.push(procesoActual); // Agrega el proceso a la cola de bloqueados.
            this.quitarProcesoListo(procesoActual); // Quita el proceso de la cola de listos.
          } else {
            // Si la edad del proceso actual es igual a la edad maxima de envejecimiento.
            if (procesoActual.edad == Constantes.EDAD_MAX_ENVEJECIMIENTO) {
              procesoActual.subirPrioridad(); // Sube la prioridad del proceso.
            } else {
              procesoActual.envejecer(); // Envejece el proceso.
            }
          }
        });
      }
    }

    // Verifica si hay procesos bloqueados en CPU, si los hay lo manda a la cola de bloqueados.
    // Si un proceso completo su tiempo de ejecucion lo envia a finalizados.
    // Si un procesador completo su tiempo de ejecucion, envia su proceso actual a listo.
    private gestionarProcesosEnCpu(cpu: CPU): void {
      // Recorre los procesadores.
      cpu.procesadores.forEach(procesador => {
        // Si el procesador actual tiene un proceso activo.
        if (procesador.procesoActivo !== null) {
          // Si el proceso termino su ejecucion.
          if(procesador.procesoActivo.tiempoEjecucion <= 0) {
            // Agrega el proceso a una lista de finalizados. Crea un objeto temporal con datos del proceso.
            this._procesosFinalizados.push({ 
              nombre: procesador.procesoActivo.nombre,
              tipo: procesador.procesoActivo.tipo,
              });
            procesador.liberar();  // Lo quita del procesador.  
            return;
          }
          // Si el proceso activo esta bloqueado.
          if (procesador.procesoActivo.bloqueado) {
            // Si esta bloqueado por el CPU.
            if (procesador.procesoActivo.bloquedBy === Constantes.TIPO_BLOQUEO.CPU) {
              procesador.procesoActivo.desbloquear(); // Desbloquea el proceso.
              this.agregarProcesoListo(procesador.procesoActivo); // Envia el proceso a la cola de listos.
              procesador.liberar(); // Libera el procesador para que netre un nuevo proceso.
              return;
            } else if (procesador.procesoActivo.bloquedBy === Constantes.TIPO_BLOQUEO.ES) { // Si el proceso fue bloqueado por E/S.
              procesador.procesoActivo.desbloquearse(); // Inicia la cuenta regresiva de desbloqueo.
              this._procesosBloqueados.push(procesador.procesoActivo); // Agrega el proceso a la cola de bloqueados.
              procesador.liberar(); // Libera el CPU.
              return;
            } else { // Si fue bloqeuado por otra cosa.
              this._procesosBloqueados.push(procesador.procesoActivo); // Agrega el proceso a la cola de bloqueados.
              procesador.liberar(); // Libera el CPU.
              return;
            }
          }
        }
      });
    }

    // Verifica los procesos bloqueados. Si hay procesos desbloqueados los envia a la cola de listos.
    private gestionarProcesosBloqueados(): void {
      this.ordenarColaBloqueados(); // Ordena los procesos bloqueados.
      // Recorre los procesos bloqueados.
      this._procesosBloqueados.forEach(proceso => {
        // Si el proceso actual no esta bloqueado.
        if (!proceso.bloqueado) {
            this.agregarProcesoListo(proceso); // Lo agrega a la cola de procesos listos.
            this.quitarProcesoBloqueado(proceso); // Lo quita de la cola de procesos bloqueados.
        }
      });
    }
} 