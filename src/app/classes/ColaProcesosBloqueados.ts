import { TColaArray } from "./TColaArray";
import { Constantes } from "./Const";
import { Proceso } from "./Proceso";

// Clase que representa la cola de procesos bloqueados.
export class ColaProcesosBloqueados extends TColaArray<Proceso> {

    // Ordena la cola de bloqueados en base al tipo de bloqueo y a su tiempo actual de desbloqueo.
    // De modo que indica quien sera el proximo en desbloquearse.
    public ordenarCola(): void {
        this._data.sort(function(procesoA, procesoB){
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
}