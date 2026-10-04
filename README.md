# ACT4-B4 - Mini Tienda con API publica, ESLint y Husky

Practica de GIT + control de calidad de codigo. Es una mini aplicacion web
(HTML + CSS + JavaScript puro) que:

1. Obtiene productos desde una **API publica** con `fetch()`
   (`https://dummyjson.com/products?limit=30`).
2. Muestra los datos **dinamicamente** en pantalla usando un `<template>`.
3. Permite **interaccion basica**: busqueda por texto, filtro por categoria,
   boton "Recargar datos" y boton "Agregar al carrito" por producto.

## Estructura del proyecto

```
ACT4-B4Jcajchun-2022425/
├── index.html            # Estructura de la pagina
├── style.css             # Estilos (tema oscuro, responsive con grid)
├── script.js             # Logica: fetch, filtros, renderizado, carrito
├── eslint.config.mjs     # Configuracion de ESLint (flat config)
├── package.json          # Dependencias y scripts de npm
├── .gitattributes        # Fuerza finales de linea LF (hooks de Husky)
├── .husky/
│   └── pre-commit        # Hook que ejecuta ESLint antes de cada commit
└── .gitignore            # Ignora node_modules y archivos del editor
```

## Requisitos

- Node.js 18 o superior (probado con Node 24 y npm 11).
- Git instalado.

## Instalacion

```bash
npm install
```

`npm install` tambien ejecuta el script `prepare`, que es el que instala los
hooks de Husky (`core.hooksPath = .husky/_`). Si clonaste el repositorio y el
hook no funciona, ejecuta:

```bash
npx husky
```

## Ejecutar la aplicacion

Los navegadores bloquean `fetch()` al abrir el archivo con doble clic, asi que
hay que servir la carpeta con un servidor local:

```bash
npm start            # usa npx serve en http://localhost:8080
```

Alternativas: `npx serve .`, `python -m http.server 8080` o la extension
"Live Server" de Visual Studio Code.

## Linter

```bash
npx eslint .         # revisa todo el proyecto
npm run lint         # mismo comando
npm run lint:fix     # corrige automaticamente lo corregible
```

Reglas activadas (flat config en `eslint.config.mjs`):

| Regla            | Uso                                          |
| ---------------- | -------------------------------------------- |
| `quotes`         | Comillas dobles                              |
| `semi`           | Punto y coma al final de cada instruccion    |
| `no-var`         | Prohibido `var`, se usa `let` o `const`      |
| `prefer-const`   | `const` cuando la variable no cambia         |
| `eqeqeq`         | Comparaciones con `===`                      |
| `no-undef`       | Detecta variables/funciones no definidas     |
| `no-unused-vars` | Detecta variables sin usar                   |
| `no-console`     | Marca `console.log` como advertencia         |

## Proceso realizado (paso a paso)

1. **Proyecto en Visual Studio Code** con los archivos base
   `index.html`, `script.js` y `style.css`.
2. **Desarrollo de la mini app**: `fetch()` a la API DummyJSON, renderizado
   dinamico de tarjetas con `<template>` y controles de busqueda, filtro por
   categoria, recarga y carrito.
3. **Repositorio Git inicializado** (`git init`, `git status`, primer commit).
4. **Instalacion de las herramientas de calidad**:

   ```bash
   npm install --save-dev eslint husky
   npx husky init
   ```

5. **Configuracion de ESLint** mediante `eslint.config.mjs`, declarando los
   globales de navegador (`document`, `fetch`, `console`, etc.).
6. **Hook pre-commit** en `.husky/pre-commit`:

   ```bash
   npx eslint .
   ```

   Antes, Husky genera ese archivo con `npm test`; se reemplazo por ESLint.
7. **Verificacion** de que el hook bloquea commits con errores de estilo:

   ```bash
   # Con 'var', comillas simples y sin punto y coma:
   git commit -m "prueba"
   # 1:1  error  Unexpected var, use let or const instead  no-var
   # 1:14 error  Strings must use doublequote            quotes
   # 1:33 error  Missing semicolon                       semi
   # husky - pre-commit script failed (code 1)   <-- commit BLOQUEADO
   ```

   Al corregir el estilo, el commit se realizo normalmente
   (`husky - pre-commit script passed`). El commit de prueba se revirtio con
   `git reset --soft HEAD~1`.

## Estructura del hook

Husky v9 usa `core.hooksPath = .husky/_`, por lo que los hooks se guardan en
`.husky/` y se versionan con el proyecto. El archivo `pre-commit` es un script
de shell y debe guardarse con saltos de linea **LF**, no CRLF; por eso el
repositorio incluye `.gitattributes` con `* text=auto eol=lf`.

## Problemas encontrados y solucion

- **ESLint 10 no incluye `globals` por defecto**: se declararon los globales de
  navegador a mano en `eslint.config.mjs` para evitar una dependencia extra.
- **`Option no esta definido`**: `Option` es un constructor del navegador, se
  anuncio como global de solo lectura en la configuracion.
- **Saltos de linea CRLF en Windows**: Git/configuran `core.autocrlf`, que
  puede romper los hooks de shell. Si el hook no se ejecuta, usar Git Bash o
  agregar `.gitattributes` con `* text=auto eol=lf`.

## Autor

Pablo Polanco - 2022425
