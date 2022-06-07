import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Planificador } from './classes/Planificador';
import { Proceso } from './classes/Proceso';
import { CPU } from './interfaces/program.interface';
import { Procesador } from './classes/Procesador';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Planificador de Proceso';

  programStarted: boolean = false;

  procesosActuales: Array<Proceso> = [];
  procesosBloqueados: Array<Proceso> = [];

  planificador: Planificador = new Planificador([]);

  cpu: CPU = {
    nombre: "CPU Principal",
    procesadores: Array<Procesador>()
  }

  constructor(
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    setInterval(() => this.verificarProcesosPlanificador(), 1000);
    setInterval(() => this.verificarProcesosCpu(), 1000);
    //setInterval(() => this.entradaSalidaPeriodica(), 5000);
  }

  programForm = this.formBuilder.group({
    procesadores: [ null, [ Validators.required, Validators.min(1) ] ]
  });

  priorityForm = this.formBuilder.group({
    prioridad: [ null, [ Validators.required, Validators.min(0), Validators.max(99) ]]
  });

  procesoForm = this.formBuilder.group({
    nombre: [ null, [ Validators.required ] ],
    prioridad: [ null, [ Validators.required, Validators.min(0), Validators.max(99) ]],
    tiempoEjecucion: [ null, [ Validators.required, Validators.min(0), Validators.max(60) ] ],
    tipo: ['', Validators.required]
  });

  iniciarPrograma() {
    if (this.programForm.invalid) {
      this.programForm.markAllAsTouched();
      return;
    }

    for (let index = 0; index < this.programForm.value.procesadores!; index++) {
      let p: Procesador = new Procesador(index.toString(), null);
      this.cpu.procesadores.push(p);     
    }
    this.programStarted = true;
    this.programForm.reset();
  }

  agregarProceso(): void {
    if (this.procesoForm.invalid) {
      this.procesoForm.markAllAsTouched();
      return;
    }

    let proceso: Proceso = new Proceso (
      this.procesoForm.value.nombre!,
      this.procesoForm.value.prioridad!,
      this.procesoForm.value.tiempoEjecucion!,
      false,
      this.procesoForm.value.tipo!
    );
    
    this.procesosActuales.push(proceso);
  }

  agregarAPlanificador(): void {
    this.procesosActuales.forEach(proceso => {
      this.planificador.procesosListos.push(proceso);
    });
    this.procesosActuales = [];
  }

  verificarProcesosPlanificador(): void {
    let proceso = this.planificador.procesosListos[0];
    let insertado = false;
    if (proceso != null) {
      this.cpu.procesadores.forEach(procesador => {
        if (procesador.procesoActivo == null && !insertado && !proceso.bloqueado) {
          //proceso.triggerCountdown();
          procesador.procesoActivo = proceso;
          procesador.triggerProcessingTimer();
          insertado = true;
  
          const index = this.planificador.procesosListos.indexOf(proceso, 0);
          if (index > -1) {
            this.planificador.procesosListos.splice(index, 1);
          }
        }
      });
    }
  }

  verificarProcesosCpu(): void {
    this.cpu.procesadores.forEach(procesador => {
      if (procesador.procesoActivo != null) {
        if(procesador.procesoActivo.tiempoEjecucion <= 0) {
          procesador.procesoActivo = null;   
        }
        if (procesador.procesoActivo != null && procesador.procesoActivo.bloqueado) {
          if (procesador.procesoActivo.bloquedBy == "cpu") {
            procesador.procesoActivo.bloqueado = false;
            this.planificador.procesosListos.push(procesador.procesoActivo);
            procesador.procesoActivo = null;
          } else {
            this.procesosBloqueados.push(procesador.procesoActivo);
            procesador.procesoActivo = null;    
          }
        }
      }
    });
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
    this.procesosBloqueados.forEach(p => {
      if (proceso === p) {
        p.bloqueado = false;
        p.bloquedBy = "";
        const index = this.procesosBloqueados.indexOf(p, 0);
        if (index > -1) {
          this.procesosBloqueados.splice(index, 1);
        }
        this.planificador.procesosListos.push(p);
      }
    });
  }

  cambiarPrioridad(proceso: Proceso): void {
    proceso.prioridad = this.priorityForm.value.prioridad!;
    this.priorityForm.reset();
  }

  entradaSalidaPeriodica(): void {
    if (this.cpu.procesadores.length > 0) {

      let aux: Array<number> = [];
      this.cpu.procesadores.forEach(procesador => {
        if (procesador.procesoActivo != null) {
          aux.push(this.cpu.procesadores.indexOf(procesador, 0));
        }
      })

      let index: number = this.randomIntFromInterval(0, aux.length - 1);
      if ( this.cpu.procesadores[index].procesoActivo != null ) {
        this.cpu.procesadores[index].procesoActivo!.bloqueado = true;
        this.cpu.procesadores[index].procesoActivo!.bloquedBy = "E/S";
      }
    }
  }

  randomIntFromInterval(min: number, max: number) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

  procesosActivos(): number {
    let result: number = 0;
    this.cpu.procesadores.forEach(procesador => {
      if ( procesador.procesoActivo != null ) {
        result++;
      }
    });
    return result;
  }
}
