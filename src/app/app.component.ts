import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Planificador } from './classes/Planificador';
import { Proceso } from './classes/Proceso';
import { CPU } from './interfaces/program.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Planificador de Proceso';

  programStarted: boolean = false;
  procesadores: number = 0;

  procesosActuales: Array<Proceso> = [];
  procesosBloqueados: Array<Proceso> = [];

  planificador: Planificador = new Planificador([]);

  cpu: CPU = {
    nombre: "CPU Principal",
    procesosActivos: Array<Proceso>()
  }

  constructor(
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    setInterval(() => this.verificarProcesosPlanificador(), 500);
    setInterval(() => this.verificarProcesosCpu(), 500);
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

    let proceso: Proceso = new Proceso (
      this.procesoForm.value.nombre!,
      this.procesoForm.value.prioridad!,
      this.procesoForm.value.tiempoEjecucion!,
      false
    );
    
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
      if (this.cpu.procesosActivos.length < this.procesadores && !proceso.bloqueado) {
        proceso.triggerCountdown();
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
        this.procesosBloqueados.push(proceso);
      }
      if(proceso.tiempoEjecucion <= 0) {
        const index = this.cpu.procesosActivos.indexOf(proceso, 0);
        if (index > -1) {
          this.cpu.procesosActivos.splice(index, 1);
        }
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
    this.procesosBloqueados.forEach(p => {
      if (proceso === p) {
        p.bloqueado = false;
        const index = this.procesosBloqueados.indexOf(proceso, 0);
        if (index > -1) {
          this.procesosBloqueados.splice(index, 1);
        }
        this.planificador.procesosListos.push(proceso);
      }
    });
  }
}
