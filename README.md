# 📘 EducaTech – Plataforma Educativa Digital

> **Proyecto académico universitario** · Primera versión funcional

---

## 📌 Descripción

**EducaTech** es una plataforma web educativa diseñada para optimizar el acceso y uso de recursos digitales en estudiantes y docentes de instituciones educativas públicas del Perú. Atiende la problemática de la baja integración de herramientas tecnológicas, la brecha digital y la falta de acceso a materiales académicos en entornos con recursos limitados.

---

## 🎯 Objetivo

Desarrollar una plataforma web educativa interactiva que permita:

- Gestionar y acceder a un repositorio de materiales digitales.
- Facilitar la comunicación entre docentes y estudiantes.
- Funcionar de manera sencilla, sin requerir instalaciones complejas.
- Ser accesible desde computadoras y dispositivos móviles.

---

## 🛠️ Tecnologías utilizadas

| Tecnología | Rol |
|---|---|
| **HTML5** | Estructura semántica de la plataforma |
| **CSS3** | Estilos, diseño responsive, animaciones |
| **JavaScript (Vanilla)** | Lógica de la aplicación, gestión de vistas y datos |
| **Google Fonts** | Tipografías: Sora + DM Sans |

> No se requiere backend, base de datos ni servidor en esta primera versión.

---

## ✅ Funcionalidades principales

### 🏠 Página de inicio
- Nombre y descripción de la plataforma.
- Botones de acceso para docente y estudiante.
- Sección de características del sistema.
- Repositorio público con filtros por curso.
- Preguntas frecuentes (FAQ) con acordeón.
- Formulario público de consultas.

### 🔐 Módulo de login simulado
- Selección de tipo de usuario (docente/estudiante).
- Formulario con nombre, institución y grado/nivel.
- Redirección automática al panel correspondiente.

### 👨‍🏫 Panel del docente
- Bienvenida personalizada con nombre e institución.
- Formulario para registrar materiales (título, curso, tipo, descripción, enlace).
- Lista de materiales publicados con botón para eliminar.
- Visualización de consultas enviadas por estudiantes.

### 🎒 Panel del estudiante
- Bienvenida personalizada.
- Visualización de todos los materiales disponibles.
- Filtro dinámico por curso.
- Botón "Ver material" para cada recurso.
- Formulario para enviar consultas al docente.
- Historial de consultas enviadas.

### 📂 Repositorio de contenidos
- Guías de estudio.
- Presentaciones.
- Videos educativos.
- Lecturas complementarias.
- Actividades.
- 6 materiales de ejemplo precargados al inicio.

### 💬 Módulo de interacción
- Preguntas frecuentes expandibles.
- Formulario de consultas académicas.
- Lista de consultas enviadas visible para docentes.

---

## 🚀 Cómo ejecutar el proyecto

### Opción 1 – Abrir directamente (más sencilla)
```
1. Descargar o clonar el repositorio.
2. Abrir la carpeta del proyecto.
3. Hacer doble clic en el archivo index.html.
4. Se abrirá en el navegador web predeterminado.
```

### Opción 2 – Con extensión Live Server (VS Code)
```
1. Instalar Visual Studio Code.
2. Instalar la extensión "Live Server".
3. Abrir la carpeta del proyecto en VS Code.
4. Hacer clic derecho en index.html → "Open with Live Server".
```

### Opción 3 – Con servidor local Python
```bash
# En la carpeta del proyecto:
python -m http.server 8080
# Luego abrir: http://localhost:8080
```

### Estructura del proyecto
```
plataforma-educatech/
│
├── index.html      ← Estructura principal de la plataforma
├── styles.css      ← Estilos y diseño responsive
├── app.js          ← Lógica de la aplicación
└── README.md       ← Documentación del proyecto
```

---

## 👥 Usuarios de prueba

No se requiere contraseña. Simplemente ingresa:

| Campo | Valor de ejemplo |
|---|---|
| Nombre | Tu nombre completo |
| Institución | I.E. San Martín de Porres |
| Grado/nivel | 3° Secundaria (o Docente) |

---

## 🔮 Mejoras futuras (con backend y CI/CD)

### Backend y base de datos
- **Node.js + Express** o **Django** como servidor backend.
- **PostgreSQL** o **MongoDB** para persistir usuarios, materiales y consultas.
- **JWT (JSON Web Tokens)** para autenticación segura.
- **API REST** para comunicación frontend-backend.
- **Almacenamiento de archivos** con AWS S3 o Cloudinary.
- **Modo offline** con Service Workers y PWA.

### CI/CD con GitHub Actions

Se puede implementar un pipeline en `.github/workflows/ci.yml` que se ejecute en cada `push` o `pull request` a la rama `main`:

```yaml
# .github/workflows/ci.yml
name: CI – EducaTech Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  verificar-archivos:
    name: Verificar archivos requeridos
    runs-on: ubuntu-latest
    steps:
      - name: Checkout del repositorio
        uses: actions/checkout@v3

      - name: Validar existencia de archivos clave
        run: |
          for file in index.html styles.css app.js; do
            if [ ! -f "$file" ]; then
              echo "❌ Archivo faltante: $file"
              exit 1
            fi
          done
          echo "✅ Todos los archivos requeridos existen."

      - name: Validar HTML con HTMLHint
        run: |
          npm install -g htmlhint
          htmlhint index.html

      - name: Validar CSS con Stylelint
        run: |
          npm install -g stylelint stylelint-config-standard
          stylelint styles.css

      - name: Validar JS con ESLint
        run: |
          npm install -g eslint
          eslint app.js --env browser,es6

  desplegar:
    name: Desplegar en GitHub Pages
    needs: verificar-archivos
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: .
```

**El pipeline CI/CD garantiza que:**
1. Los archivos esenciales existen en cada commit.
2. El HTML, CSS y JS son válidos y siguen estándares.
3. La plataforma se despliega automáticamente si todo pasa.

---

## 📄 Licencia

Proyecto académico universitario. Uso educativo libre.

---

*EducaTech – Cerrando la brecha digital en la educación pública peruana 🇵🇪*
