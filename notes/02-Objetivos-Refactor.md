# Objetivos del Refactor

Lo que te quiero contar en este audio, son los objetivos que perseguimos con el refactor que vamos a hacer durante el curso.

Como hemos visto en el capítulo anterior, todo el código reside dentro de la página ProductsPage, haciéndolo difícil de mantener.

Por lo tanto, añadir nuevas funcionalidades como importar precios desde un csv requeriría duplicar mucho código.

Existe lógica de negocio en esta aplicación que no existe en el backend. Tampoco tenemos la capacidad de modificarlo, ya que es un backend de terceros.

Es importante hacer un refactor que nos permita mantener este código de forma más sencilla.

Cuando refactorizamos una aplicación o una parte de la misma, deberíamos tener los siguientes objetivos:

- No modificar comportamiento

- Avanzar en pequeños pasos

- Mejorar el diseño

Y es fundamental que sigamos este orden de prioridad.

## No modificar comportamiento

Lo primero es asegurarnos que no modificamos el comportamiento. ¿Cómo lo podemos hacer?:

Asegurándonos de que existen tests en los que podamos confiar. De manera que nos avisen cuando estemos modificando comportamiento. Y si no existen, lo primero es crearlos antes de empezar a modificar el código de producción.

A ningún cliente, pero que a ningún cliente, le va a gustar que se haya modificado el comportamiento debido a un refactor.

## Avanzar en pequeños pasos

Después, es importante avanzar con seguridad en pequeños pasos. No se puede avanzar deprisa y con seguridad.

Esto trae varios beneficios. El primer beneficio es que independientemente del tiempo del que dispongamos, siempre tendremos avances estables. Al terminar un paso, es fundamental ejecutar los tests y hacer un commit para guardar los cambios.

El segundo beneficio es que cuando la liemos, porque lo haremos, siempre podemos volver al paso anterior donde funcionaban los tests, sin perder demasiado código porque el paso debería ser pequeño.

## Mejorar el diseño

Y por último, el refactor debería mejorar el diseño del código con el objetivo de que sea más fácil de cambiar en el futuro.

En este caso vamos a refactorizar el diseño a utilizar Clean Architecture.
