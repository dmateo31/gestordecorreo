// Una regla recibe un valor y devuelve el mensaje de error si no la cumple, o null si la cumple
// (es la misma idea que reglasDeEnvio en GestorCorreos, pero para cualquier tipo de valor)
export type Regla<T> = (valor: T) => string | null;

// Corta la ejecución con un error. Devuelve never para poder usarlo después de ??
// como alternativa cuando falta un valor: buscar(...) ?? lanzarError("no se encontró")
export function lanzarError(mensaje: string): never {
  throw new Error(mensaje);
}

// Evalúa todas las reglas y, si alguna falla, lanza un solo error con todos los mensajes juntos.
// join devuelve "" cuando no hay errores y "" cuenta como falso, así lanzarError solo se ejecuta si hubo alguno
export function validarReglas<T>(valor: T, reglas: Regla<T>[]): void {
  const errores = reglas
    .map((regla) => regla(valor))
    .filter((mensaje): mensaje is string => mensaje !== null);

  const todosLosErrores = errores.join("; ");
  todosLosErrores && lanzarError(todosLosErrores);
}
