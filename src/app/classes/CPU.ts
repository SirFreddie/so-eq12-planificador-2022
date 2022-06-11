import { Procesador } from "./Procesador";

// Esta clase representa un CPU que contiene muchos nucleos o procesadores.
export class CPU {

  // Array que contiene los procesadores del sistema.
  public _procesadores: Array<Procesador> = [];

  constructor(
  ) {}

  public get procesadores() { return this._procesadores; }

  // Agrega un procesador previamente creado al CPU.
  public agregarProcesadores(procesador: Procesador): void {
      this._procesadores.push(procesador);
  }

  // Devuelve cuantos procesadores estan activamente procesando procesos.
  procesosActivos(): number {
      let result: number = 0;
      this._procesadores.forEach(procesador => {
        if ( procesador.procesoActivo !== null ) {
          result++;
        }
      });
      return result;
  }
} 