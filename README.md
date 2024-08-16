
# Test Case API v2

Test Case API v2 es una aplicación desarrollada en Node.js con Express que permite la gestión y exportación de casos de prueba. Esta aplicación incluye la capacidad de filtrar y exportar casos de prueba en formato Excel con un formato personalizado.

## Características

- **Gestión de Casos de Prueba:** Permite crear, editar, eliminar y visualizar casos de prueba.
- **Filtrado:** Filtra los casos de prueba por Level 1 Test Suite y Level 2 Test Suite.
- **Exportación a Excel:** Exporta los casos de prueba filtrados a un archivo Excel, manteniendo el formato de la tabla con acciones en filas separadas.

## Instalación

1. Clona este repositorio en tu máquina local.
    \`\`\`bash
    git clone https://github.com/tu-usuario/test-case-api-v2.git
    \`\`\`
2. Navega al directorio del proyecto.
    \`\`\`bash
    cd test-case-api-v2
    \`\`\`
3. Instala las dependencias necesarias.
    \`\`\`bash
    npm install
    \`\`\`

## Uso

### Ejecutar la Aplicación

Para ejecutar la aplicación en modo de desarrollo con \`nodemon\`, usa el siguiente comando:

\`\`\`bash
npm run dev
\`\`\`

Para ejecutar la aplicación en modo de producción:

\`\`\`bash
npm start
\`\`\`

### Configuración

Asegúrate de tener un archivo \`.env\` en la raíz del proyecto con las siguientes variables de entorno configuradas:

\`\`\`env
DB_HOST=tu_host_de_base_de_datos
DB_USER=tu_usuario_de_base_de_datos
DB_PASSWORD=tu_contraseña_de_base_de_datos
DB_NAME=tu_nombre_de_base_de_datos
DB_PORT=puerto_de_tu_base_de_datos
\`\`\`

### Rutas API

- **GET /api/test-suites:** Obtiene todas las Level 1 Test Suites.
- **GET /api/test-suites-level-2/level1/:level1Id:** Obtiene las Level 2 Test Suites asociadas a un Level 1 Test Suite específico.
- **GET /api/test-cases:** Filtra y obtiene los casos de prueba según el Level 2 Test Suite seleccionado.
- **GET /api/test-cases/export/excel:** Exporta los casos de prueba filtrados a un archivo Excel.

### Funcionalidad de Exportación

La funcionalidad de exportación exportará los casos de prueba filtrados a un archivo Excel manteniendo el formato de la tabla. Cada acción se exportará en una fila separada, mientras que los demás campos estarán vacíos para las acciones subsiguientes.

## Dependencias

Este proyecto utiliza las siguientes dependencias:

- **dotenv:** Para manejar variables de entorno.
- **exceljs:** Para la generación de archivos Excel.
- **express:** Framework para construir la API REST.
- **file-saver:** Biblioteca para guardar archivos en el frontend.
- **pg:** Cliente PostgreSQL para Node.js.

## Contribuir

Si deseas contribuir a este proyecto, por favor sigue estos pasos:

1. Haz un fork del proyecto.
2. Crea una nueva rama (\`git checkout -b feature/nueva-funcionalidad\`).
3. Realiza los cambios necesarios y haz commit (\`git commit -m 'Agrega nueva funcionalidad'\`).
4. Empuja los cambios a la rama (\`git push origin feature/nueva-funcionalidad\`).
5. Abre un Pull Request.

## Licencia

Este proyecto está licenciado bajo la Licencia MIT. Consulta el archivo \`LICENSE\` para más detalles.
