// Clase abstracta que representa una cola generica utilizando una estructura de array.
export abstract class TCola<T>{

    protected _data: Array<T> = [];

    public get data() { return this._data; }
    public get length() { return this._data.length; }

    public agregarElemento(elemento: T) {
        this.data.push(elemento);
    }

    public quitarElemento(elemento: T): void {
        const index = this._data.indexOf(elemento, 0);
        if (index > -1) {
          this._data.splice(index, 1);
        }
    }

    public primero(): T {
        return this._data[0];
    }

    public abstract ordenarCola(): void;

    public forEach(callbackfn: (value: any, index: number, array: any[]) => void, thisArg?: any): void {
        this.data.forEach(callbackfn, thisArg);   
    }
}