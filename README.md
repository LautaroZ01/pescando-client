# Guía de Instalación del Proyecto - Cliente

Esta guía te ayudará a configurar el proyecto en tu computadora paso a paso. **No necesitas conocimientos previos de React**, solo sigue las instrucciones en orden.

---

## Requisitos Previos

Antes de comenzar, necesitas tener instalado en tu computadora:

### 1. **Node.js** (incluye npm)
   - Ve a: https://nodejs.org/
   - Descarga la versión **LTS** (recomendada)
   - Ejecuta el instalador y sigue los pasos
   - Para verificar que se instaló correctamente, abre una terminal y escribe:
     ```bash
     node --version
     npm --version
     ```
   - Deberías ver los números de versión de ambos programas

### 2. **Git**
   - Ve a: https://git-scm.com/downloads
   - Descarga e instala Git para tu sistema operativo
   - Para verificar la instalación, abre una terminal y escribe:
     ```bash
     git --version
     ```

---

## Paso 1: Crear la Carpeta del Proyecto

1. Abre el **Explorador de Archivos** de Windows
2. Ve a la ubicación donde quieres guardar el proyecto (por ejemplo: `Documentos`)
3. Crea una carpeta nueva llamada `Pescando` (o el nombre que prefieras) si no existe
4. Dentro de esa carpeta, debes crear otra llamada `Client` si quieres mantener la misma estructura

**Ejemplo de ruta final:**
```
C:\Users\TuNombre\Documents\Pescando\Client\
```

---

## Paso 2: Clonar el Repositorio

1. **Abre la terminal** en la carpeta que creaste:
   - Opción A: Haz clic derecho dentro de la carpeta `Client` → Selecciona **"Git Bash Here"** o **"Abrir en Terminal"**
   - Opción B: Abre la terminal y navega hasta la carpeta:
     ```bash
     cd "C:\Users\TuNombre\Documents\Pescando\Client"
     ```

2. **Clona el repositorio** escribiendo el siguiente comando:
   ```bash
   git clone https://github.com/LautaroZ01/pescando-client.git ./
   ```

---

## Paso 3: Instalar las Dependencias

Las dependencias son todas las librerías y herramientas que el proyecto necesita para funcionar.

1. Asegúrate de estar dentro de la carpeta `Client`
2. Ejecuta el siguiente comando:
   ```bash
   npm install
   ```
3. Espera a que termine (puede tardar unos minutos). Verás que se crea una carpeta llamada `node_modules` con todos los archivos necesarios.

---

## Paso 4: Configurar Variables de Entorno (Opcional)

Si el proyecto necesita configuraciones especiales (como URLs de APIs), tu equipo te proporcionará un archivo `.env.local`.

1. Si te dieron un archivo `.env.local`, cópialo en la carpeta raíz del proyecto `Client`
2. Si no te dieron ninguno, pregunta a tu equipo si es necesario

---

## Paso 5: Iniciar el Proyecto

1. Ejecuta el siguiente comando para iniciar el servidor de desarrollo:
   ```bash
   npm run dev
   ```

2. Verás un mensaje similar a este:
   ```
   VITE v7.x.x  ready in XXX ms

   ➜  Local:   http://localhost:5173/
   ➜  Network: use --host to expose
   ```

3. **Abre tu navegador** y ve a: `http://localhost:5173/`

4. ¡Listo! Deberías ver la aplicación funcionando 🎉

---

## Detener el Proyecto

Para detener el servidor de desarrollo:
- Presiona `Ctrl + C` en la terminal
- Confirma con `Y` si te lo pide

---

## Comandos Útiles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia el servidor de desarrollo |
| `npm run build` | Crea una versión optimizada para producción |
| `npm run preview` | Previsualiza la versión de producción |
| `npm run lint` | Revisa el código en busca de errores |

---

## Problemas Comunes

### Error: "npm no se reconoce como comando"
**Solución:** Node.js no está instalado o no está en el PATH. Reinstala Node.js desde https://nodejs.org/

### Error: "git no se reconoce como comando"
**Solución:** Git no está instalado. Descárgalo desde https://git-scm.com/downloads

### Error al instalar dependencias
**Solución:** 
1. Elimina la carpeta `node_modules` (si existe)
2. Elimina el archivo `package-lock.json` (si existe)
3. Vuelve a ejecutar `npm install`

### Error: El puerto 5173 ya está en uso
**Solución:** 
- Cierra otras instancias del proyecto que puedan estar corriendo
- O usa otro puerto: `npm run dev -- --port 3000`

---

## Soporte

Si tienes algún problema que no puedes resolver:
1. Revisa esta guía nuevamente
2. Consulta con tu equipo
3. Comparte el mensaje de error completo para que puedan ayudarte mejor

---

## Resumen Rápido

```bash
# 1. Navegar a la carpeta del proyecto
cd "ruta/a/tu/carpeta/Pescando"

# 2. Entrar a la carpeta
cd Client

# 3. Clonar el repositorio
git clone https://github.com/LautaroZ01/pescando-client.git ./

# 4. Instalar dependencias
npm install

# 5. Iniciar el proyecto
npm run dev
```

¡Y eso es todo! 🚀
