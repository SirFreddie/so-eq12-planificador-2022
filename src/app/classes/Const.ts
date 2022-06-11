export class Constantes {
    public static PRIORIDAD_MIN: number = 1;
    public static PRIORIDAD_MAX: number = 99;
    public static PRIORIDAD_MAX_SO: number = 50;
    public static PRIORIDAD_MIN_USUARIO: number = 51;

    public static EDAD_MAX_ENVEJECIMIENTO: number = 10;

    public static TIPO_PROCESO = {
        USUARIO: "Usuario",
        SO: "S.O."
    }

    public static TIPO_BLOQUEO = {
        USUARIO: "Usuario",
        ES: "E/S",
        CPU: "Cpu",
        NONE: "NONE"
    }
}