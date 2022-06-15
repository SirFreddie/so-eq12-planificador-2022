import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Planificador } from './classes/Planificador';
import { Proceso } from './classes/Proceso';
import { Procesador } from './classes/Procesador';
import { CPU } from './classes/CPU';
import { Constantes } from './classes/Const';
import { MatDialog } from '@angular/material/dialog';
import { DialogProcesoComponent } from './components/dialog-proceso/dialog-proceso.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'S.O. - Equipo 12 - Planificador de Procesos - 2022';

  // Constantes //
  MAX_CHAR_NOMBRE: number = Constantes.MAX_CHAR_NOMBRE;
  PRIORIDAD_MIN: number = Constantes.PRIORIDAD_MIN;
  PRIORIDAD_MAX: number = Constantes.PRIORIDAD_MAX;
  PRIORIDAD_MAX_SO: number = Constantes.PRIORIDAD_MAX_SO;
  PRIORIDAD_MIN_USUARIO: number = Constantes.PRIORIDAD_MIN_USUARIO;
  TIPO_PROCESO_USUARIO: string = Constantes.TIPO_PROCESO.USUARIO;
  TIPO_PROCESO_SO: string = Constantes.TIPO_PROCESO.SO;
  ///////////////

  programStarted: boolean = false;
  procesosActuales: Array<Proceso> = [];

  planificador: Planificador = new Planificador(); // Instancia del planificador.
  cpu: CPU = new CPU(); // Instancia del cpu.

  constructor(
    private formBuilder: FormBuilder,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
  }

  //// FORMULARIOS ////
  // Formulario de creacion de procesadores.
  programForm = this.formBuilder.group({
    cantProcesadores: [ null, [ Validators.required, Validators.min(1), Validators.pattern("^[0-9]*$") ] ],
    tiempoProceso: [ null, [ Validators.required, Validators.min(1), Validators.max(60), Validators.pattern("^[0-9]*$") ] ],
  });

  // Formulario de creacion de proceso.
  procesoForm = this.formBuilder.group({
    nombre: [ null, [ Validators.required, Validators.maxLength(8) ] ],
    prioridad: [ null, [ Validators.required, Validators.min(1), Validators.max(99), Validators.pattern("^[0-9]*$") ]],
    tiempoEjecucion: [ null, [ Validators.required, Validators.min(1), Validators.max(60), Validators.pattern("^[0-9]*$") ] ],
    tipo: ['', Validators.required],
    tiempoBloqueoPorEntradaSalida: [ null, [ Validators.required, Validators.min(0), Validators.max(60) , Validators.pattern("^[0-9]*$")] ],
    tiempoEspera: [ null, [ Validators.required, Validators.min(0), Validators.max(60), Validators.pattern("^[0-9]*$") ] ]
  });
  /////////////////////

  // Se activa al apretar el boton de iniciar.
  // Ejecuta el programa en base a los datos de procesadores ingresados.
  iniciarPrograma() {
    // Validador de formulario.
    if (this.programForm.invalid) {
      this.programForm.markAllAsTouched();
      return;
    }

    // Crea los procesadores en base al input de usuario y los agrega al cpu.
    for (let index = 0; index < this.programForm.value.cantProcesadores!; index++) {      
      this.cpu.agregarProcesadores(new Procesador(index.toString(), this.programForm.value.tiempoProceso!));  
    }  
  
    // Inicializa el timer global del planificador y sus procesos.
    this.planificador.ejecutarPlanificador(this.cpu);

    this.programStarted = true;
    this.programForm.reset();
  }

  //// METODOS DE LA INTERFAZ ////

  // Se activa al apretar un boton.
  // Agregar proceso a array temporal.
  agregarProceso(): void {
    // Validador de formulario.
    if (this.procesoForm.invalid) {
      this.procesoForm.markAllAsTouched();
      return;
    }

    // Crea una instancia de un proceso.
    let proceso: Proceso = new Proceso (
      this.procesoForm.value.nombre!,
      this.procesoForm.value.prioridad!,
      this.procesoForm.value.tiempoEjecucion!,
      this.procesoForm.value.tipo!,
      this.procesoForm.value.tiempoBloqueoPorEntradaSalida!,
      this.procesoForm.value.tiempoEspera!
    );
    
    // Guarda el proceso en un array temporal.
    this.procesosActuales.push(proceso);
  }

  // Se activa al apretar un boton.
  // Agrega los procesos del array temporal al planificador.
  agregarAPlanificador(): void {
    this.procesosActuales.forEach(proceso => {
      this.planificador.agregarProcesoListo(proceso);
    });
    this.procesosActuales = []; // Limpia el array temporal de modo que se puedan agregar nuevos procesos.
  }

  // Se activa al apretar un boton.
  // Metodo de bloqueo de proceso por usuario si esta en el cpu.
  bloquearCpu(proceso: Proceso): void {
    this.cpu.procesadores.forEach(procesador => {
      if (proceso === procesador.procesoActivo) {
        procesador.procesoActivo.bloquear(Constantes.TIPO_BLOQUEO.USUARIO);
      }
    });
  }

  // Se activa al apretar un boton.
  // Metodo de bloqueo de proceso por usuario si esta en la cola de listos.
  bloquearListos(proceso: Proceso): void {
    this.planificador.procesosListos.forEach(procesoActual => {
      if(procesoActual === proceso) {
        procesoActual.bloquear(Constantes.TIPO_BLOQUEO.USUARIO);
      }
    });
  }

  // Se activa al apretar un boton.
  // Metodo de desbloqueo de proceso por usuario si esta en la cola de bloqueados.
  desbloquear(proceso: Proceso): void {
    this.planificador.desbloquearProceso(proceso);
  }

  // Logica para los radio buttons.
  cambiarTipo(): void {
    this.procesoForm.controls.prioridad.reset();
  }

  // Se activa al apretar un boton.
  // Metodo para cambiar la prioridad de un proceso.
  openDialogProceso(proceso: Proceso, cola: Array<Proceso>): void {
    const dialogRef = this.dialog.open(DialogProcesoComponent, {
      width: '350px',
      height: '350px',
      data: { nombre: proceso.nombre, prioridad: proceso.prioridad, tipo: proceso.tipo }
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        cola.forEach(procesoActual => {
          if(procesoActual === proceso) {
            procesoActual.prioridad = result.prioridad;
            procesoActual.edad = 0;
            this.planificador.procesosListos.ordenarCola(); // Ordena la lista de listos en base a la prioridad.
          }
        }); 
      }
    });
  }

  /////////////////////////////////////
}
