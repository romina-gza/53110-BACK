# 53110-BACK

## Proyecto Coderhouse Back End
 - **Tema del Proyecto:** "Petshop & Veterinaria"
 - **Autor:** Romina Galarza

## Heramientas
    + Node JS
    + Express
    + Multer
    + Passport
    + Sweet Alert
    + Mongo DB
    + Socket
    + Winston
    + Nodemailer

## Frontend
    + Bootstrap
    + Handlebars

## Instrucciones para levantar y correr el proyecto

> [!IMPORTANTE]
> Para poder proseguir con los siguientes pasos, debes tener instalados: 
> GIT BASH - NODE JS - NPM - NODEMON

### Clonar el repositorio
Estos son los pasos para clonar este repositorio de GitHub en tu PC utilizando `git bash`:

1. **Abrir `git bash`** en tu computadora.
   - Si es la primera vez que clonas un repositorio, mi recomendación es que abras git bash haciendo clic derecho con el mouse, seleccionar "Mostrar más opciones" y seleccionar "Open Git Bash Here". 
   > [!NOTA]
   > Si aún no has instalado git bash, puedes descargalo desde el sitio oficial: https://git-scm.com/downloads.

2. **Navegar al directorio donde clonaras el repositorio:**
   - Clonar este repositorio usando el comando `cd`. Por ejemplo, si quieres clonarlo en una carpeta llamada `Proyectos` en tu directorio de inicio, podrías usar:

   ```bash
   cd ~/Proyectos
   ```

   Si la carpeta no existe, puedes crearla primero con:

   ```bash
   mkdir ~/Proyectos
   cd ~/Proyectos
   ```

3. **Clonar el repositorio:**
   - Una de las opciones más sencillas en mi opinión es clonar con url. Usa el comando `git clone` seguido del enlace del repositorio. Este enlace lo puedes copiar desde el desplegable verde de arriba a la derecha, "<> CODE", la primera opción HTTP es seleccionado automaticamente, solo debes "copiar" el link.

   ```bash
   git clone https://github.com/romina-gza/53110-BACK.git
   ```

   Este comando descargará el contenido del repositorio y lo guardará en una carpeta llamada `53110-BACK` dentro del directorio actual.

4. **Acceder al repositorio clonado:**
   - Una vez clonado, navega al directorio del repositorio:

   ```bash
   cd 53110-BACK
   ```

Ahora habrás clonado el repositorio de GitHub en tu PC y estarás listo para trabajar con él.

### Instalar dependencias

Para instalar todas las dependencias listadas en el archivo `package.json` después de clonar el proyecto, sigue estos pasos:

1. **Navega al directorio del proyecto:**

   Abre `git bash` y navega al directorio donde clonaste el proyecto. Puedes hacerlo con el comando `cd`. Siguiendo el ejemplo anterior, si el proyecto está en la carpeta llamada `Proyectos`, usa:

   ```bash
   cd Proyectos
   ```

2. **Instala las dependencias:**

   Una vez que estés en el directorio del proyecto, ejecuta el siguiente comando:

   ```bash
   npm install
   ```

   Este comando leerá el archivo `package.json` e instalará todas las dependencias necesarias para el proyecto.

3. **Verifica que las dependencias se hayan instalado correctamente:**

   Después de ejecutar `npm install`, deberías ver una carpeta `node_modules` en el proyecto. Esta carpeta contiene todas las dependencias que `npm` ha instalado.

¡Listo! Ya puedes empezar a trabajar en el proyecto desde tu PC.

## Cómo iniciar con la aplicación.
En el archivo package.json se definen comandos personalizados que puedes ejecutar con npm.

> [!IMPORTANTE]
> Recuerda estar en la ruta del proyecto, me ha pasado muchas veces al empezar en programación. :shipit:

Para poder iniciar con la app ingresa los siguientes comandos desde git bash:

El comando `npm run start` ejecuta el archivo app.js usando Node.js. Es útil para ejecutar la aplicación en un entorno de producción.
```
   npm start
```

El comando `npm run dev` Ejecuta el archivo app.js usando Nodemon, que reinicia automáticamente el servidor cuando detecta cambios en el código. 
```
   npm run dev
```
:sunglasses: :call_me_hand: ¡Sigamos codeando! :sunglasses: :call_me_hand:
