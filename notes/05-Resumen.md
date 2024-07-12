## Cubrir primero con tests

Antes de empezar ningún refactor, es importante revisar si la parte que tenemos que refactorizar está cubierta por tests y de no ser así añadirlos.

El objetivo es que nos avisen si modificamos comportamiento o introducimos un bug.

Es justo lo que hicimos al principio del curso.

Primero decidimos el tipo de testing que íbamos a realizar. Descartamos en este curso testing end to end porque son un tipo de test frágiles, incluso haciendo las cosas muy bien.

En mis proyectos reales suelo utilizarlos usando Cypress o Playwright, pero me limito a probar happy paths.

Para este curso, la apuesta de testing fue usando React Testing Library y Vitest.

### Configurando el torno de testing

Primero configuramos el entorno de testing, añadiendo Vitest y la React Testing Library.

Configuramos Git Hooks para que al hacer push se ejecutaran el linter, prettier y se ejecutaran los tests. El objetivo era tener feedback en el lado del cliente antes de integrarnos con los cambios en el servidor.

También configuramos GitHub Actions para que se ejecutaran los test en el lado del servidor. El objetivo era tener un segundo feedback en el lado del servidor al integrarnos con los cambios en el servidor.

Después era importante decidir cómo íbamos a aislar los test de red.

El objetivo era que se ejecutarán rápido y poder crear diferentes escenarios de prueba.

Para ello usamos Mock Service Worker y creando el wrapper evitando acoplamiento de la librería con los tests.

Crear tests

Una vez preparado el entorno de testing, creamos tests para cubrir la funcionalidad de la página de productos.

## Refactor

Cuando tuvimos cubierto con tests la página de productos, era el momento de empezar con el refactor.

Primero identificamos las funcionalidades dentro de la página.

Fuimos refactorizando cada una siguiendo ciclos cortos de refactoring.

En cada paso íbamos desacoplando responsabilidades de donde no debían de estar.

Los pasos eran pequeños.

Cada paso consistía en desacoplar responsabilidades y hacer lo necesario para qué compilará y pasarán los tests.

Esto a veces requería de hacer temporalmente algo que sabíamos que íbamos a quitar más adelante, como cuando tuvimos que añadir StoreApi al custom hook varias veces.

Es importante avanzar de esta manera para no hacer el paso demasiado grande.

También aplicamos en la gestión de estado de errores la técnica de parallel change.

Primero marcamos como deprecada la forma antigua SnackbarError y nos creamos la nueva en el custom hook. Esto es la fase de expansión.

Después continuamos con los refactors y cuando ya no quedaba ningún cliente usando SnackbarError, hicimos la fase de contracción y para ello eliminamos la forma actígua de gestionar el estado de errores mediante SnackbarError.

## Feedback

En todo momento teníamos tres niveles de feedback, de más temprano a menos.

-   Test en modo watch: ejecutando los test en modo watch en el momento de hacer los cambios nos enterábamos de si modificamos comportamiento o introduciamos un error. De hecho nos pasó algunas veces.

-   Git hook: Al hacer push es el siguiente nivel donde obtenermos feedback en el lado del cliente.

-   GitHub Action: Al recibir el push el servidor del repositorio es donde se realiza el feedback en el lado del servidor al integrar nuestros cambios con los del resto del repositorio. Este feedback es muy interesante porque esa integración se puede realizar con cambios de otros componentes del equipo que no teníamos en local nosotros.

## Cada lógica en su lugar

- Lógica de renderizo - Products Page

- Lógica de presentatión - UseProducts

- Lógica de negocio de aplicación - Casos de uso

- Lógica de negocio empresarial - Entidades y value objects

- Lógica de datos - Implementación del repositorio
