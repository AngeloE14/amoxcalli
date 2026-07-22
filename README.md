# Amoxcalli

Plataforma de lectura digital donde puedes explorar, suscribirte y leer libros desde cualquier dispositivo. Inspirada en las culturas mesoamericanas del conocimiento.

## Funcionalidades

- Registro e inicio de sesión
- Catálogo de libros con filtros por género, idioma y autor
- Dos planes de suscripción: Estándar ($79.99 MXN) y Premium ($149.99 MXN)
- Lector de PDF con zoom y progreso automático
- Biblioteca personal para guardar tus libros
- Compra de libros individuales
- Reseñas y opiniones
- Panel de administrador para gestionar el catálogo

## Cómo ejecutar

1. Clonar el repositorio e instalar dependencias:
```bash
git clone https://github.com/tu-usuario/ver_nosql.git
cd ver_nosql
npm install
```

2. Crear un archivo `.env` en la raíz con las siguientes variables:
```
MONGO_URI=tu_url_de_mongodb_atlas
JWT_SECRET=tu_clave_secreta
PORT=4000
```

3. Iniciar el servidor backend y el frontend en terminales separadas:
```bash
npm run server
npm run dev
```

## Tecnologías

- **Frontend:** React, React Router, Vite
- **Backend:** Express, MongoDB (Mongoose)
- **Autenticación:** JWT (JSON Web Tokens)
- **Lector PDF:** pdfjs-dist / react-pdf
