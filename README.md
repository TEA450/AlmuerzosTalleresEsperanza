# AlmuerzosTalleresEsperanza

Página web dedicada a la gestión de pedidos de almuerzos para estudiantes y profesores en Talleres Esperanza.

## Descripción

Esta aplicación web permite gestionar pedidos de almuerzos de manera fácil y accesible. Los usuarios pueden seleccionar personas (estudiantes y profesores), configurar sus pedidos de comida, y generar reportes en PDF. La aplicación utiliza React con TypeScript, Vite para el desarrollo, Tailwind CSS para el estilo, y Supabase como base de datos.

## Requisitos Previos

- Node.js (versión 16 o superior)
- npm o yarn
- Una cuenta en Supabase (opcional, ya que incluye datos de muestra)

## Instalación

1. Clona el repositorio o descarga los archivos.
2. Navega al directorio del proyecto:
   ```
   cd project
   ```
3. Instala las dependencias:
   ```
   npm install
   ```

## Configuración

1. Si deseas usar Supabase, crea un proyecto en [Supabase](https://supabase.com) y configura las tablas necesarias (ver `src/config/supabase.ts` para detalles).
2. Crea un archivo `.env` en el directorio `project/` con las variables de entorno de Supabase (si aplicable):
   ```
   VITE_SUPABASE_URL=tu_url_de_supabase
   VITE_SUPABASE_ANON_KEY=tu_clave_anonima
   ```
3. Si no configuras Supabase, la aplicación usará datos de muestra incluidos en el código.

## Ejecutar el Proyecto

Para ejecutar en modo desarrollo:
```
npm run dev
```

Esto iniciará el servidor de desarrollo en `http://localhost:5173` (por defecto).

Para construir para producción:
```
npm run build
```

Para previsualizar la build:
```
npm run preview
```

## Tutorial: Cómo Funciona el Código

### Estructura General

- **App.tsx**: Punto de entrada principal. Configura el enrutamiento con React Router, incluyendo rutas para Home, MakeOrder, OrderOptions, OrderSummary y History. Envuelve todo en un Layout común.

- **Páginas Principales**:
  - **Home**: Página de bienvenida con enlaces a "Hacer Pedido" y "Ver Historial". Incluye instrucciones básicas.
  - **MakeOrder**: Carga la lista de personas desde Supabase o usa datos de muestra. Muestra estudiantes y profesores en grids, permitiendo seleccionar cada uno para configurar su pedido. Usa localStorage para almacenar pedidos temporalmente.
  - **OrderOptions**: Para cada persona seleccionada, permite elegir opciones de menú (plato principal, fruta/sopa, jugo/limonada).
  - **OrderSummary**: Muestra un resumen de todos los pedidos y permite descargar un reporte en PDF usando jsPDF.
  - **History**: (No detallado en el código visto, pero probablemente muestra pedidos anteriores).

### Flujo de Trabajo

1. **Inicio**: El usuario llega a Home y hace clic en "Hacer Pedido".
2. **Selección de Personas**: En MakeOrder, se cargan personas. Cada tarjeta representa una persona; al hacer clic, navega a OrderOptions para esa persona.
3. **Configuración de Pedido**: En OrderOptions, selecciona opciones de menú. Se guarda en el estado local y localStorage.
4. **Resumen**: Una vez completados todos los pedidos, se muestra OrderSummary con un botón para descargar PDF.
5. **Persistencia**: Los pedidos se almacenan en localStorage durante la sesión. Para persistencia real, usa Supabase.

### Tecnologías Clave

- **React**: Componentes funcionales con hooks (useState, useEffect).
- **TypeScript**: Tipado fuerte para Person y Order.
- **Tailwind CSS**: Estilos responsivos y modernos.
- **Supabase**: Base de datos para personas y pedidos (opcional).
- **React Router**: Navegación entre páginas.
- **Lucide React**: Iconos.
- **jsPDF**: Generación de PDFs.
- **xlsx**: Para exportar datos (si se usa en History).

### Notas Adicionales

- La aplicación incluye datos de muestra si Supabase no está configurado, facilitando el desarrollo local.
- Es responsiva, adaptándose a móviles y desktops.
- Para producción, configura Supabase y ajusta las variables de entorno.
