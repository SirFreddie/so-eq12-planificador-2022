import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Proceso, Planificador, CPU } from './interfaces/program.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'planificador';

  programStarted: boolean = false;
  procesadores: number = 0;

  procesosActuales: Array<Proceso> = [];

  planificador: Planificador = {
    procesosListos: []
  }

  cpu: CPU = {
    nombre: "CPU Principal",
    procesosActivos: Array<Proceso>()
  }

  constructor(
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    setInterval(() => this.verificarProcesosPlanificador(), 2000);
    setInterval(() => this.verificarProcesosCpu(), 2000);
  }

  programForm = this.formBuilder.group({
    procesadores: [ null, [ Validators.required, Validators.min(1) ] ]
  });

  procesoForm = this.formBuilder.group({
    nombre: [ null, [ Validators.required ] ],
    prioridad: [ null, [ Validators.required, Validators.min(0), Validators.max(99) ]],
    tiempoEjecucion: [ null, [ Validators.required, Validators.min(0), Validators.max(60) ] ]
  });

  iniciarPrograma() {
    if (this.programForm.invalid) {
      this.programForm.markAllAsTouched();
      return;
    }

    this.procesadores = this.programForm.value.procesadores!;
    this.programStarted = true;
    this.programForm.reset();
  }

  agregarProceso(): void {
    if (this.procesoForm.invalid) {
      this.procesoForm.markAllAsTouched();
      return;
    }

    let proceso: Proceso = {
      nombre: this.procesoForm.value.nombre!,
      prioridad: this.procesoForm.value.prioridad!,
      tiempoEjecucion: this.procesoForm.value.tiempoEjecucion!,
      bloqueado: false
    }
    
    this.procesosActuales.push(proceso);
    this.procesoForm.reset();
  }

  agregarAPlanificador(): void {
    this.procesosActuales.forEach(proceso => {
      this.planificador.procesosListos.push(proceso);
    });
    this.procesosActuales = [];
  }

  verificarProcesosPlanificador(): void {
    this.planificador.procesosListos.forEach(proceso => {
      if (this.cpu.procesosActivos.length < this.procesadores) {
        this.cpu.procesosActivos.push(proceso);
        const index = this.planificador.procesosListos.indexOf(proceso, 0);
        if (index > -1) {
          this.planificador.procesosListos.splice(index, 1);
        }
      }
    });
  }

  verificarProcesosCpu(): void {
    this.cpu.procesosActivos.forEach(proceso => {
      if (proceso.bloqueado) {
        const index = this.cpu.procesosActivos.indexOf(proceso, 0);
        if (index > -1) {
          this.cpu.procesosActivos.splice(index, 1);
        }
        this.planificador.procesosListos.push(proceso);
      }
    });
  }

  bloquear(proceso: Proceso): void {
    this.cpu.procesosActivos.forEach(p => {
      if (proceso === p) {
        p.bloqueado = true;
      }
    });
  }

  desbloquear(proceso: Proceso): void {
    this.planificador.procesosListos.forEach(p => {
      if (proceso === p) {
        p.bloqueado = false;
      }
    });
  }
}
