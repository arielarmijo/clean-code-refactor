# Análisis de la Página de Productos

El fichero ProductsPage tiene un tamaño de 300 líneas de código. Para la funcionalidad que tiene la página, es un tamaño excesivo.

Normalmente, cuando te encuentres con un fichero de este tamaño, sea de una clase o una función, es un indicativo de que hace demasiadas cosas.

## ¿Qué responsabilidades debería tener la página de productos?

Cuando estamos separando bien las responsabilidades, una página como esta, solo debería tener la responsabilidad de la lógica de pintado o renderizado, es decir, solo debe pintar.

## ¿Qué responsabilidades tiene actualmente?

Además de esta responsabilidad de pintado, hay más responsabilidades:

- Decide cuando mostrar los productos.

- Decide cuando mostrar los mensajes de éxito o error al usuario y como hacerlo.

- Se encarga de validar si el usuario es administrador para mostrar el diálogo o un mensaje de error

- Se encarga de las validaciones relacionadas con el precio

  - Solo se admiten números

  - Solo se admiten números en formato decimal en dólares

  - El número máximo admitido es 999.99

- Se comunica con la API REST directamente

- Convierte entre el tipo devuelto por la API REST y el tipo usado en la aplicación.

- En función del valor del precio, calcula el valor del campo estado

## ¿Qué problemas supone tener tantas responsabilidades concentradas?

Esto supone que el código es difícil de leer y mantener.

Es fácil que al intentar añadir una feature o modificar una responsabilidad, cambiemos otra sin darnos cuenta.

Es fácil terminar en el clásico arreglo una cosa y se rompen 3.

Es difícil reutilizar responsabilidades que existen en esta página actualmente y posiblemente en el futuro se terminan duplicando con los problemas que eso tiene.
