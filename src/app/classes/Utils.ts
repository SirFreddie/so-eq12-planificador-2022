export class Timer {
    public static delay = (ms: number) => new Promise(res => setTimeout(res, ms)); // Crea un delay de x segundos.
}