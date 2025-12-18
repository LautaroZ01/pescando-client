# 🐟 Pescando – Client (Frontend)

Frontend de **Pescando**, una aplicación web orientada a la creación de hábitos, el aprendizaje constante y la motivación en comunidad.  
Este repositorio contiene la interfaz de usuario desarrollada con **React** y **TailwindCSS**, y se comunica con una API REST construida en Node.js.

---

## 🌱 Descripción del Proyecto

**Pescando** es más que un tracker de hábitos: es una plataforma educativa y colaborativa que ayuda a estudiantes y desarrolladores a construir disciplina, visualizar su progreso y compartir logros con otros usuarios.

Desde el frontend, el usuario puede:
- Registrarse e iniciar sesión
- Crear y gestionar hábitos
- Visualizar su progreso mediante dashboards
- Interactuar con la comunidad
- Personalizar su perfil

El enfoque está puesto en una **experiencia clara, moderna y motivadora**.

---

## 🧩 Tecnologías Utilizadas

- **React** – Librería principal para la interfaz
- **Vite** – Entorno de desarrollo de última generación
- **TailwindCSS** – Framework de estilos y diseño UI
- **React Router** – Enrutamiento y navegación
- **TanStack Query** – Gestión de estado asíncrono y caché
- **Axios** – Cliente HTTP para comunicación con la API
- **React Hook Form + Zod** – Manejo y validación de formularios
- **Recharts** – Gráficos y visualización de datos
- **Vercel AI SDK** – Integración de inteligencia artificial
- **Lucide React / React Icons** – Colección de íconos

---

## 📁 Estructura del Proyecto
```bash
client/
├── public/            # Recursos estáticos (imágenes, logos)
├── src/
│   ├── API/           # Funciones de petición al backend (UserAPI, etc.)
│   ├── components/    # Componentes reutilizables de UI
│   ├── hooks/         # Custom hooks (lógica reutilizable)
│   ├── layouts/       # Estructuras de página (Layout principal, Auth)
│   ├── libs/          # Configuraciones de librerías (axios, ia, etc.)
│   ├── locales/       # Archivos de internacionalización o textos
│   ├── utils/         # Funciones de utilidad y helpers
│   ├── views/         # Páginas principales de la aplicación
│   ├── index.css      # Estilos globales
│   ├── main.jsx       # Punto de entrada de la aplicación
│   └── router.jsx     # Configuración de rutas
├── .env.local         # Variables de entorno (no trackeado)
└── package.json       # Dependencias y scripts
```

## 🚀 Instalación y Uso

### 1️⃣ Clonar el repositorio

Clonar el repositorio del frontend y acceder a la carpeta del proyecto:

git clone https://github.com/tu-usuario/pescando-client.git

cd pescando-client

### 2️⃣ Instalar dependencias

Instalar las dependencias del proyecto:

npm install

### 3️⃣ Configurar variables de entorno

Crear un archivo `.env.local` en la raíz del proyecto (`client/`) y definir las siguientes variables:

```env
VITE_API_URL=http://localhost:3000/api
VITE_OPENROUTER_API=tu_api_key_de_openrouter
VITE_CLOUDINARY_URL=tu_url_de_cloudinary
VITE_CLOUDINARY_UPLOAD_PRESET=tu_upload_preset
```

Es importante contar con las credenciales de **Cloudinary** (para subida de imágenes) y **OpenRouter** (para funcionalidades de IA).

### 4️⃣ Ejecutar el proyecto

Iniciar el servidor de desarrollo:

npm run dev

La aplicación estará disponible en:
http://localhost:5173

## 🔗 Conexión con el Backend

El frontend consume la API REST del proyecto Pescando – Server, encargada de:

- Autenticación de usuarios
- Gestión de hábitos
- Estadísticas y visualización de progreso
- Funcionalidades de comunidad
- Los repositorios de cliente y servidor se mantienen separados para garantizar una arquitectura clara, escalable y fácil de mantener.

## 🎨 Diseño y Experiencia de Usuario

- Interfaz moderna y responsive
- Estilos implementados con TailwindCSS
- Diseño basado en prototipos realizados en Figma
- Enfoque en usabilidad, claridad y motivación visual
  
## 👥 Equipo de Desarrollo

Proyecto realizado en el marco de Fundación Pescar 2025.

- Eduardo Colque
- Agustina Insfran
- Diana Pereyra
- Khiara Razzolini
- Lautaro Zuleta

## 🎯 Objetivo

Construir una aplicación que ayude a desarrollar disciplina, constancia y aprendizaje continuo, combinando tecnología, motivación y comunidad.

# “Pescando hábitos, construyendo futuro.” 🐟✨
