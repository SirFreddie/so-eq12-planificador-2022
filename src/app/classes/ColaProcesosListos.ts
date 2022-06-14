import { TColaArray } from "./TColaArray";
import { Constantes } from "./Const";
import { Proceso } from "./Proceso";

// Clase que representa la cola de procesos listos.
export class ColaProcesosListos extends TColaArray<Proceso> {

    // Ordena la cola de listos en base a la prioridad y al tipo de proceso.
    // Si devuelve 0, se mantiene el orden, si devuelve -1 procesoA va antes que procesoB, si devuelve 1 procesoB va antes que procesoA.
    public override ordenarCola(): void {
        this._data.sort(function(procesoA, procesoB){
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
}