# Gestión de Estudiantes — Frontend

Dashboard en React (Vite) conectado a tu API de Spring Boot en Render. Incluye:
- CRUD completo de estudiantes (crear, listar, editar, eliminar)
- Gráficas con Recharts (barras + pie)
- Notificaciones con `react-hot-toast`

## 1. Instalar y correr

```bash
npm install
npm run dev
```

Se abre en `http://localhost:5173`.

## 2. Configurar la URL de tu API

Crea un archivo `.env` en la raíz del proyecto:

```
VITE_API_URL=https://gestion-estudiantes-hclw.onrender.com/api/v1
```

(Si no lo creas, usa esa misma URL por defecto — ver `src/api.js`).

## 3. IMPORTANTE: habilitar CORS en tu backend

Ahora mismo tu Spring Boot API probablemente rechazará las peticiones desde
`localhost:5173` (y desde donde despliegues el frontend) por CORS. Agrega esta
clase de configuración a tu proyecto Spring Boot:

```java
package com.ingenieria.gestion_estudiantes.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                        .allowedOrigins(
                            "http://localhost:5173",
                            "https://TU-FRONTEND-DESPLEGADO.com" // agrégalo cuando lo despliegues
                        )
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*");
            }
        };
    }
}
```

Sin esto, verás errores de CORS en la consola del navegador y los toasts
mostrarán "No se pudo conectar con la API".

## 4. Falta un endpoint: actualizar (PUT)

Tu `EstudianteController` actual solo tiene GET, POST y DELETE — no hay forma
de editar un estudiante existente. El botón de editar del frontend ya está
listo para usarlo, pero necesitas agregar esto al controller:

```java
@PutMapping("/{id}")
public ResponseEntity<Estudiante> actualizar(@PathVariable Long id, @RequestBody Estudiante datos) {
    return ResponseEntity.ok(service.actualizar(id, datos));
}
```

Y en `EstudianteService`:

```java
@Transactional
public Estudiante actualizar(Long id, Estudiante datos) {
    Estudiante existente = obtenerPorId(id);
    existente.setNombre(datos.getNombre());
    existente.setEmail(datos.getEmail());
    existente.setCodigo(datos.getCodigo());
    return repository.save(existente);
}
```

Hasta que agregues esto, "Guardar" al editar devolverá un error 404/405 (el
toast te lo va a mostrar claramente).

## 5. Desplegar el frontend

Cuando quieras subirlo (Render, Vercel o Netlify sirven bien para esto):

```bash
npm run build
```

Esto genera la carpeta `dist/` lista para servir como sitio estático. Recuerda
agregar esa URL final a `allowedOrigins` en el `CorsConfig` de tu backend.
