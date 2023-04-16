# Ntetris

Ntetris.js es una librería JavaScript que permite agregar un juego de Tetris en cualquier sitio web o aplicación.

### Instalación
Para instalar Ntetris.js, simplemente agregue el siguiente script en su documento HTML:

#### html
```html
<script src="https://ruta/a/Ntetris.js"></script>
```

#### Uso
Para agregar el juego de Ntetris en su sitio web o aplicación, simplemente llame al método start de la siguiente manera:
#### javascript
```javascript
var tetris = new Ntetris();
```

### Opciones
Puede personalizar la apariencia y el comportamiento del juego de Tetris utilizando las siguientes opciones:

- canvas: Elemento canvas donde se dibujará el juego.
- board_width: Número de columnas del juego.
- board_height: Número de filas del juego.
- xlinea: array de puntuacion por lineas completadas.
- down_time: Velocidad del juego en milisegundos.`
#### javascript

```javascript
var options = {
    canvas: document.getElementById('canvas'), // requerido
    board_width:10, // default 10
    board_height:20, // defaiñt 20
    xlinea: [100, 200, 400, 800], // puntuacion por lineas. default [100, 200, 400, 800]
    down_time: 800, //default 800
};
var tetris = new Ntetris(options);
```


### Contribuir
Si desea contribuir a Ntetris.js, por favor abra un pull request en nuestro repositorio en GitHub.

### Licencia
Ntetris.js está disponible bajo la licencia MIT.