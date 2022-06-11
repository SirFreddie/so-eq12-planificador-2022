import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Constantes } from 'src/app/classes/Const';
import { Proceso } from '../../classes/Proceso';

@Component({
  selector: 'app-dialog-proceso',
  templateUrl: './dialog-proceso.component.html',
  styleUrls: ['./dialog-proceso.component.scss']
})
export class DialogProcesoComponent implements OnInit {

  // Constantes //
  PRIORIDAD_MIN: number = Constantes.PRIORIDAD_MIN;
  PRIORIDAD_MAX: number = Constantes.PRIORIDAD_MAX;
  PRIORIDAD_MAX_SO: number = Constantes.PRIORIDAD_MAX_SO;
  PRIORIDAD_MIN_USUARIO: number = Constantes.PRIORIDAD_MIN_USUARIO;
  TIPO_PROCESO_USUARIO: string = Constantes.TIPO_PROCESO.USUARIO;
  TIPO_PROCESO_SO: string = Constantes.TIPO_PROCESO.SO;
  ///////////////

  // Formulario de cambio de prioridad.
  priorityForm = this.formBuilder.group({
    prioridad: [ null, [ Validators.required, Validators.min(0), Validators.max(99) ]]
  });

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<DialogProcesoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.priorityForm.controls.prioridad.setValue(this.data.prioridad);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  cambiarPrioridad():void {
    this.data.prioridad = this.priorityForm.value.prioridad;
    this.dialogRef.close(this.data);
  }

}
