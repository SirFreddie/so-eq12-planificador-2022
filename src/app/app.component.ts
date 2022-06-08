import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Planificador } from './classes/Planificador';
import { Proceso } from './classes/Proceso';
import { Procesador } from './classes/Procesador';
import { CPU } from './classes/CPU';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Planificador de Proceso';

  programStarted: boolean = false;

  procesosActuales: Array<Proceso> = [];

  planificador: Planificador = new Planificador();
  cpu: CPU = new CPU();

  constructor(
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
  }

  // FORMULARIOS //
  // Formulario de creacion de procesadores.
  programForm = this.formBuilder.group({
    cantProcesadores: [ null, [ Validators.required, Validators.min(1) ] ],
    tiempoProceso: [ null, [ Validators.required, Validators.min(1), Validators.max(60) ] ],
  });

  // Formulario de cambio de prioridad.
  priorityForm = this.formBuilder.group({
    prioridad: [ null, [ Validators.required, Validators.min(0), Validators.max(99) ]]
  });

  // Formulario de creacion de proceso.
  procesoForm = this.formBuilder.group({
    nombre: [ null, [ Validators.required ] ],
    prioridad: [ null, [ Validators.required, Validators.min(0), Validators.max(99) ]],
    tiempoEjecucion: [ null, [ Validators.required, Validators.min(0), Validators.max(60) ] ],
    tipo: ['', Validators.required],
    tiempoEspera: [ null, [ Validators.required, Validators.min(0), Validators.max(60) ] ]
  });
  /////////////////

  iniciarPrograma() {
    if (this.programForm.invalid) {
      this.programForm.markAllAsTouched();
      return;
    }

    // Crea los procesadores en base al input de usuario y los agrega al cpu.
    for (let index = 0; index < this.programForm.value.cantProcesadores!; index++) {      
      this.cpu.agregarProcesadores(new Procesador(index.toString(), this.programForm.value.tiempoProceso!));  
    }  
  
    setInterval(() => {
      this.planificador.iniciarPlanificador(this.cpu);
    }, 1000);

    setInterval(() => {
      this.entradaSalidaPeriodica();
    }, 5000);

    this.programStarted = true;
    this.programForm.reset();
  }

  // Agregar proceso a array temporal.
  agregarProceso(): void {
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
      this.procesoForm.value.tiempoEspera!
    );
    
    // Guarda el proceso en un array temporal.
    this.procesosActuales.push(proceso);
  }

  // Agrega los procesos del array temporal al planificador.
  agregarAPlanificador(): void {
    this.procesosActuales.forEach(proceso => {
      this.planificador.agregarProcesoListo(proceso);
    });
    this.procesosActuales = []; // Limpia el array temporal de modo que se puedan agregar nuevos procesos.
  }

  bloquear(proceso: Proceso): void {
    this.cpu.procesadores.forEach(procesador => {
      if (proceso === procesador.procesoActivo) {
        procesador.procesoActivo.bloqueado = true;
        procesador.procesoActivo.bloquedBy = 'usuario';
      }
    });
  }

  desbloquear(proceso: Proceso): void {
    this.planificador.desbloquearProceso(proceso);
  }

  cambiarPrioridad(proceso: Proceso): void {
    proceso.prioridad = this.priorityForm.value.prioridad!;
    this.priorityForm.reset();
  }

  entradaSalidaPeriodica(): void {
    if (this.cpu.procesadores.length > 0) {

      let aux: Array<number> = [];
      this.cpu.procesadores.forEach(procesador => {
        if (procesador.procesoActivo !== null) {
          aux.push(this.cpu.procesadores.indexOf(procesador, 0));
        }
      })

      let index: number = this.randomIntFromInterval(0, aux.length - 1);
      if ( this.cpu.procesadores[index].procesoActivo !== null ) {
        this.cpu.procesadores[index].procesoActivo!.bloqueado = true;
        this.cpu.procesadores[index].procesoActivo!.bloquedBy = "E/S";
      }
    }
  }

  randomIntFromInterval(min: number, max: number) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
  }
}
