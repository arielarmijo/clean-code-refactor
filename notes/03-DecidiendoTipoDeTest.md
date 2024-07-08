Existen diferentes tipos de test que podríamos hacer con el objetivo de validar que no modificamos comportamiento o introducimos un bug al ir haciendo el refactor. 

Por un lado, están los test end to end. Usando por ejemplo Cypress o Playwright.

Pero este tipo de test hay que tener cuidado con ellos. 

Los tests end to end pueden ser muy frágiles y requieren de conocer muy bien buenas y malas prácticas para no caer en falsos errores. 

Me gusta dejar este tipo de testing exclusivamente para happy paths.

Los test end to end, por simplificar, quedan fuera del alcance de este curso.

Los test que vamos a usar y son suficientes para el objetivo del curso son usando Vitest y la React Testing library. 

En el siguiente video añadiremos las librerías necesarias.