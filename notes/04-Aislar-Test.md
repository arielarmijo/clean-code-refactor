# Aislar los test de la red

Debido a que los test que vamos a realizar son test que se ejecutarán en local dentro del flujo de desarrollo, deberían estar aislados de red.

Una de las claves al crear tests de este tipo, es que se ejecutan lo más rápido posible. Para ello es necesario aislarlos de red, así reducimos los tiempos de ejecución.

Además, como veremos más adelante, aislar de red los tests, nos proporciona la ventaja de poder simular diferentes escenarios de prueba.

Existen diferentes estrategias para asilar los test de red. Normalmente, la estrategia elegida va a depender del estado del código legado, el tipo de aplicación y el tipo de conexión de salida que tiene.

No voy a entrar a explicar las diferentes opciones que hay, y cuando deberíamos usar una opción u otra. Esto es algo que explico en el curso de Clean Architecture.

Dado el estado actual del código legado al que nos enfrentamos, no es posible utilizar objetos dobles en este momento.

Al ser llamadas de red a una API Rest, lo más recomendable en este caso es utilizar interceptores.

Vamos a utilizar la librería Mock Service Worker (MSW) para crear esos interceptores y moquear respuestas del servidor.
