/**
 * EducaTech – Plataforma Educativa Digital
 * app.js
 *
 * Archivo principal de lógica de la aplicación.
 * Gestiona: vistas, login simulado, materiales, consultas y filtros.
 *
 * Tecnologías: JavaScript Vanilla (sin librerías externas)
 * Autor: Proyecto académico universitario
 * ----------------------------------------------------------------
 * INTEGRACIÓN CI/CD CON GITHUB ACTIONS (futura implementación):
 *
 * Se puede agregar un workflow en .github/workflows/ci.yml que:
 * 1. Se dispare en cada push o pull request a la rama main.
 * 2. Valide la existencia de los archivos clave: index.html, styles.css, app.js.
 * 3. Ejecute una herramienta de linting (HTMLHint, Stylelint, ESLint).
 * 4. Publique automáticamente en GitHub Pages si todo pasa.
 *
 * Ejemplo de step de validación en YAML:
 * ─────────────────────────────────────────
 * - name: Verificar archivos requeridos
 *   run: |
 *     for file in index.html styles.css app.js; do
 *       [ -f "$file" ] || (echo "Falta: $file" && exit 1)
 *     done
 *     echo "✅ Todos los archivos existen."
 * ─────────────────────────────────────────
 */

// ================================================================
// ESTADO GLOBAL DE LA APLICACIÓN
// Almacena todos los datos en memoria (sin backend en esta versión)
// ================================================================

/**
 * @type {{ titulo: string, curso: string, tipo: string, desc: string, enlace: string, docente: string }[]}
 * Lista de materiales educativos publicados por docentes.
 */
const materiales = [];

/**
 * @type {{ nombre: string, curso: string, mensaje: string, fecha: string }[]}
 * Lista de consultas enviadas por estudiantes.
 */
const consultas = [];

/**
 * @type {{ tipo: 'docente'|'estudiante', nombre: string, institucion: string } | null}
 * Usuario actualmente autenticado.
 */
let usuarioActual = null;

// ================================================================
// MATERIALES DE EJEMPLO (precargados al inicio)
// Simulan un repositorio base de contenidos educativos
// ================================================================
const materialesEjemplo = [
  {
    titulo: "Guía de Álgebra Básica",
    curso: "Matemática",
    tipo: "📄 Guía de estudio",
    desc: "Conceptos fundamentales de álgebra para 3° secundaria: expresiones, ecuaciones y factorización.",
    enlace: "#",
    docente: "Prof. García"
  },
  {
    titulo: "Comprensión Lectora – Textos Argumentativos",
    curso: "Comunicación",
    tipo: "📖 Lectura complementaria",
    desc: "Antología de textos argumentativos con guía de comprensión y análisis crítico.",
    enlace: "#",
    docente: "Prof. Ríos"
  },
  {
    titulo: "Introducción a la Célula",
    curso: "Ciencias",
    tipo: "📊 Presentación",
    desc: "Presentación interactiva sobre estructura y funciones de la célula eucariota y procariota.",
    enlace: "#",
    docente: "Prof. Medina"
  },
  {
    titulo: "Historia del Perú – Virreinato",
    curso: "Historia",
    tipo: "🎬 Video educativo",
    desc: "Video explicativo sobre la organización política, económica y social del Virreinato del Perú.",
    enlace: "#",
    docente: "Prof. Torres"
  },
  {
    titulo: "Actividades de Geometría",
    curso: "Matemática",
    tipo: "✏️ Actividad",
    desc: "Ejercicios prácticos de geometría plana: áreas, perímetros y construcciones geométricas.",
    enlace: "#",
    docente: "Prof. García"
  },
  {
    titulo: "Grammar: Present & Past Tenses",
    curso: "Inglés",
    tipo: "📄 Guía de estudio",
    desc: "Guía de gramática inglesa enfocada en tiempos verbales con ejemplos y ejercicios.",
    enlace: "#",
    docente: "Prof. Sánchez"
  }
];

// Cargar materiales de ejemplo al iniciar
materiales.push(...materialesEjemplo);

// ================================================================
// GESTIÓN DE VISTAS
// Controla qué sección de la página se muestra al usuario
// ================================================================

/**
 * Muestra una vista específica y oculta las demás.
 * @param {string} idVista - ID del elemento HTML a mostrar
 */
function mostrarVista(idVista) {
  // Ocultar todas las vistas
  document.querySelectorAll('.vista').forEach(v => v.classList.remove('activa'));

  // Activar la vista solicitada
  const vista = document.getElementById(idVista);
  if (vista) {
    vista.classList.add('activa');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

/**
 * Hace scroll hacia una sección dentro de la vista de inicio.
 * @param {string} idSeccion - ID de la sección destino
 */
function mostrarSeccion(idSeccion) {
  // Asegurar que estamos en la vista de inicio
  mostrarVista('vista-inicio');
  setTimeout(() => {
    const seccion = document.getElementById(idSeccion);
    if (seccion) seccion.scrollIntoView({ behavior: 'smooth' });
  }, 100);
}

// ================================================================
// MÓDULO DE LOGIN (simulado)
// ================================================================

/**
 * Prepara la pantalla de login según el tipo de usuario seleccionado.
 * @param {'docente'|'estudiante'} tipo - Tipo de usuario
 */
function mostrarLogin(tipo) {
  // Configurar contenido del login según el tipo
  const esDocente = tipo === 'docente';
  document.getElementById('login-icono').textContent = esDocente ? '👨‍🏫' : '🎒';
  document.getElementById('login-titulo').textContent = esDocente ? 'Acceso Docente' : 'Acceso Estudiante';
  document.getElementById('login-desc').textContent = esDocente
    ? 'Ingresa tus datos para gestionar materiales educativos'
    : 'Ingresa tus datos para acceder a los materiales de tus cursos';

  // Guardar tipo de usuario temporalmente
  document.getElementById('btn-ingresar').setAttribute('data-tipo', tipo);

  mostrarVista('vista-login');
}

/**
 * Procesa el ingreso a la plataforma.
 * Valida los campos del formulario y redirige al panel correspondiente.
 */
function ingresar() {
  const nombre = document.getElementById('login-nombre').value.trim();
  const institucion = document.getElementById('login-institucion').value.trim();
  const tipo = document.getElementById('btn-ingresar').getAttribute('data-tipo');

  // Validación básica de campos
  if (!nombre || !institucion) {
    mostrarModal('⚠️', 'Por favor completa todos los campos antes de continuar.');
    return;
  }

  // Guardar usuario actual en el estado global
  usuarioActual = { tipo, nombre, institucion };

  if (tipo === 'docente') {
    // Personalizar panel del docente
    document.getElementById('docente-nombre').textContent = nombre;
    document.getElementById('docente-info').textContent = `📍 ${institucion}`;

    // Actualizar vista de materiales del docente
    renderizarMaterialesDocente();
    renderizarConsultasDocente();
    mostrarVista('vista-docente');

  } else {
    // Personalizar panel del estudiante
    document.getElementById('estudiante-nombre').textContent = nombre;
    document.getElementById('estudiante-info').textContent = `📍 ${institucion}`;

    // Cargar materiales disponibles para el estudiante
    renderizarMaterialesEstudiante('todos');
    mostrarVista('vista-estudiante');
  }

  // Limpiar formulario de login
  document.getElementById('login-nombre').value = '';
  document.getElementById('login-institucion').value = '';
}

// ================================================================
// MÓDULO DOCENTE – Gestión de materiales
// ================================================================

/**
 * Agrega un nuevo material educativo a la lista global.
 * Toma los valores del formulario del panel docente.
 */
function agregarMaterial() {
  // Obtener valores del formulario
  const titulo = document.getElementById('mat-titulo').value.trim();
  const curso   = document.getElementById('mat-curso').value;
  const tipo    = document.getElementById('mat-tipo').value;
  const desc    = document.getElementById('mat-desc').value.trim();
  const enlace  = document.getElementById('mat-enlace').value.trim() || '#';

  // Validar campos obligatorios
  if (!titulo || !curso || !tipo || !desc) {
    mostrarModal('⚠️', 'Por favor completa todos los campos del formulario.');
    return;
  }

  // Crear objeto material y agregar al arreglo global
  const nuevoMaterial = {
    titulo,
    curso,
    tipo,
    desc,
    enlace,
    docente: usuarioActual ? usuarioActual.nombre : 'Docente'
  };
  materiales.push(nuevoMaterial);

  // Limpiar formulario
  document.getElementById('mat-titulo').value = '';
  document.getElementById('mat-curso').value = '';
  document.getElementById('mat-tipo').value = '';
  document.getElementById('mat-desc').value = '';
  document.getElementById('mat-enlace').value = '';

  // Actualizar vistas
  renderizarMaterialesDocente();

  mostrarModal('✅', `Material "${titulo}" publicado correctamente. Los estudiantes ya pueden verlo.`);
}

/**
 * Elimina un material de la lista según su índice.
 * @param {number} index - Posición del material en el arreglo
 */
function eliminarMaterial(index) {
  const nombre = materiales[index].titulo;
  materiales.splice(index, 1);
  renderizarMaterialesDocente();
  mostrarModal('🗑️', `Material "${nombre}" eliminado correctamente.`);
}

/**
 * Renderiza la lista de materiales en el panel del docente.
 * Solo muestra los materiales publicados por el docente actual.
 */
function renderizarMaterialesDocente() {
  const lista = document.getElementById('lista-materiales-docente');
  const msgVacio = document.getElementById('msg-sin-materiales');

  // Filtrar materiales del docente actual
  const misMateriales = materiales.filter(m =>
    m.docente === (usuarioActual ? usuarioActual.nombre : '')
  );

  lista.innerHTML = '';

  if (misMateriales.length === 0) {
    msgVacio.style.display = 'block';
    return;
  }

  msgVacio.style.display = 'none';

  // Renderizar cada material como tarjeta
  misMateriales.forEach((mat, i) => {
    // Calcular índice real en el arreglo global para poder eliminarlo
    const indiceGlobal = materiales.indexOf(mat);
    lista.innerHTML += crearTarjetaMaterial(mat, indiceGlobal, true);
  });
}

// ================================================================
// MÓDULO ESTUDIANTE – Visualización y filtrado de materiales
// ================================================================

/**
 * Renderiza los materiales disponibles para el estudiante.
 * Aplica filtro por curso si se especifica.
 * @param {string} cursoFiltro - Nombre del curso o 'todos'
 */
function renderizarMaterialesEstudiante(cursoFiltro) {
  const lista = document.getElementById('lista-materiales-estudiante');
  const msgVacio = document.getElementById('msg-sin-mat-est');

  // Filtrar materiales según el curso seleccionado
  const filtrados = cursoFiltro === 'todos'
    ? materiales
    : materiales.filter(m => m.curso === cursoFiltro);

  lista.innerHTML = '';

  if (filtrados.length === 0) {
    msgVacio.style.display = 'block';
    return;
  }

  msgVacio.style.display = 'none';

  // Renderizar cada material (sin botón eliminar)
  filtrados.forEach(mat => {
    lista.innerHTML += crearTarjetaMaterial(mat, null, false);
  });
}

/**
 * Filtra los materiales del estudiante según el curso seleccionado.
 * También actualiza el estado visual del botón activo.
 * @param {string} curso - Nombre del curso o 'todos'
 * @param {HTMLElement} btn - Botón que se presionó
 */
function filtrarMateriales(curso, btn) {
  // Actualizar botón activo
  document.querySelectorAll('#tab-materiales-est .filtro-btn').forEach(b => b.classList.remove('activo'));
  btn.classList.add('activo');

  renderizarMaterialesEstudiante(curso);
}

/**
 * Filtra el repositorio público de la página de inicio.
 * @param {string} curso - Nombre del curso o 'todos'
 * @param {HTMLElement} btn - Botón presionado
 */
function filtrarRepositorio(curso, btn) {
  document.querySelectorAll('.repositorio__filtros .filtro-btn').forEach(b => b.classList.remove('activo'));
  btn.classList.add('activo');

  const lista = document.getElementById('lista-repositorio-publico');
  const filtrados = curso === 'todos'
    ? materiales
    : materiales.filter(m => m.curso === curso);

  lista.innerHTML = '';
  filtrados.forEach(mat => {
    lista.innerHTML += crearTarjetaMaterial(mat, null, false);
  });
}

// ================================================================
// MÓDULO CONSULTAS – Interacción docente-estudiante
// ================================================================

/**
 * Envía una consulta desde el formulario público de la página de inicio.
 */
function enviarConsulta() {
  const nombre  = document.getElementById('consulta-nombre').value.trim();
  const curso   = document.getElementById('consulta-curso').value.trim();
  const mensaje = document.getElementById('consulta-mensaje').value.trim();

  if (!nombre || !curso || !mensaje) {
    mostrarModal('⚠️', 'Por favor completa todos los campos de la consulta.');
    return;
  }

  // Crear objeto consulta y guardarlo
  const nuevaConsulta = {
    nombre,
    curso,
    mensaje,
    fecha: obtenerFechaActual()
  };
  consultas.push(nuevaConsulta);

  // Renderizar en la lista pública
  renderizarConsultasPublicas();

  // Limpiar formulario
  document.getElementById('consulta-nombre').value = '';
  document.getElementById('consulta-curso').value = '';
  document.getElementById('consulta-mensaje').value = '';

  mostrarModal('✅', '¡Consulta enviada correctamente! Un docente responderá pronto.');
}

/**
 * Envía una consulta desde el panel del estudiante.
 */
function enviarConsultaEstudiante() {
  const curso   = document.getElementById('est-consulta-curso').value.trim();
  const mensaje = document.getElementById('est-consulta-msg').value.trim();

  if (!curso || !mensaje) {
    mostrarModal('⚠️', 'Por favor completa todos los campos de tu consulta.');
    return;
  }

  const nuevaConsulta = {
    nombre: usuarioActual ? usuarioActual.nombre : 'Estudiante',
    curso,
    mensaje,
    fecha: obtenerFechaActual()
  };
  consultas.push(nuevaConsulta);

  // Actualizar ambas listas (panel estudiante y panel docente)
  renderizarMisConsultas();
  renderizarConsultasDocente();

  document.getElementById('est-consulta-curso').value = '';
  document.getElementById('est-consulta-msg').value = '';

  mostrarModal('✅', '¡Consulta enviada! Tu docente la revisará pronto.');
}

/**
 * Renderiza las consultas del docente en su panel.
 */
function renderizarConsultasDocente() {
  const lista = document.getElementById('consultas-docente-lista');
  const msgVacio = document.getElementById('msg-sin-consultas');

  lista.innerHTML = '';

  if (consultas.length === 0) {
    msgVacio.style.display = 'block';
    return;
  }

  msgVacio.style.display = 'none';

  consultas.forEach(c => {
    lista.innerHTML += `
      <div class="consulta__item">
        <strong>🎒 ${c.nombre} · ${c.curso} · ${c.fecha}</strong>
        <p>${c.mensaje}</p>
      </div>
    `;
  });
}

/**
 * Renderiza las consultas del estudiante actual.
 */
function renderizarMisConsultas() {
  const lista = document.getElementById('lista-mis-consultas');
  lista.innerHTML = '';

  const misConsultas = consultas.filter(
    c => c.nombre === (usuarioActual ? usuarioActual.nombre : '')
  );

  if (misConsultas.length === 0) {
    lista.innerHTML = '<p class="msg-vacio">Aún no has enviado ninguna consulta.</p>';
    return;
  }

  misConsultas.forEach(c => {
    lista.innerHTML += `
      <div class="consulta__item">
        <strong>📘 Curso: ${c.curso} · ${c.fecha}</strong>
        <p>${c.mensaje}</p>
      </div>
    `;
  });
}

/**
 * Renderiza las consultas en la sección pública de la página de inicio.
 */
function renderizarConsultasPublicas() {
  const lista = document.getElementById('lista-consultas');
  lista.innerHTML = '';

  consultas.slice(-5).reverse().forEach(c => {
    lista.innerHTML += `
      <div class="consulta__item">
        <strong>✏️ ${c.nombre} – ${c.curso} · ${c.fecha}</strong>
        <p>${c.mensaje}</p>
      </div>
    `;
  });
}

// ================================================================
// NAVEGACIÓN DE TABS (Docente y Estudiante)
// ================================================================

/**
 * Cambia la pestaña activa en el panel del docente.
 * @param {string} tabId - ID del tab a mostrar
 * @param {HTMLElement} link - Enlace del sidebar presionado
 */
function cambiarTabDocente(tabId, link) {
  // Desactivar todos los tabs del panel docente
  document.querySelectorAll('#vista-docente .tab-contenido').forEach(t => t.classList.remove('activo'));
  document.querySelectorAll('#vista-docente .sidebar__link').forEach(l => l.classList.remove('activo'));

  document.getElementById(tabId).classList.add('activo');
  link.classList.add('activo');
}

/**
 * Cambia la pestaña activa en el panel del estudiante.
 * @param {string} tabId - ID del tab a mostrar
 * @param {HTMLElement} link - Enlace del sidebar presionado
 */
function cambiarTabEstudiante(tabId, link) {
  document.querySelectorAll('#vista-estudiante .tab-contenido').forEach(t => t.classList.remove('activo'));
  document.querySelectorAll('#vista-estudiante .sidebar__link').forEach(l => l.classList.remove('activo'));

  document.getElementById(tabId).classList.add('activo');
  link.classList.add('activo');

  // Si abre la pestaña de consultas, actualizar lista
  if (tabId === 'tab-consulta-est') renderizarMisConsultas();
}

// ================================================================
// HELPERS – Funciones auxiliares
// ================================================================

/**
 * Genera el HTML de una tarjeta de material educativo.
 * @param {Object} mat - Objeto del material
 * @param {number|null} indice - Índice en el arreglo global (para eliminar)
 * @param {boolean} esDocente - Si es true, muestra botón eliminar
 * @returns {string} HTML de la tarjeta
 */
function crearTarjetaMaterial(mat, indice, esDocente) {
  const btnEliminar = esDocente && indice !== null
    ? `<button class="material__btn material__btn--eliminar" onclick="eliminarMaterial(${indice})">🗑️ Eliminar</button>`
    : '';

  return `
    <div class="material__card">
      <div class="material__tipo-badge">${mat.tipo}</div>
      <div class="material__titulo">${mat.titulo}</div>
      <div class="material__curso">📚 ${mat.curso}</div>
      <div class="material__desc">${mat.desc}</div>
      <small style="color:#9BAECE;font-size:0.78rem;">👨‍🏫 ${mat.docente}</small>
      <button class="material__btn" onclick="verMaterial('${mat.enlace}', '${mat.titulo}')">
        🔍 Ver material
      </button>
      ${btnEliminar}
    </div>
  `;
}

/**
 * Simula el acceso a un material educativo.
 * En una versión con backend real abriría el archivo o URL.
 * @param {string} enlace - URL o ruta del recurso
 * @param {string} titulo - Nombre del material
 */
function verMaterial(enlace, titulo) {
  if (enlace && enlace !== '#') {
    window.open(enlace, '_blank');
  } else {
    mostrarModal('📘', `Abriendo: "${titulo}"\n\nEn la versión con backend, aquí se cargaría el archivo o video educativo.`);
  }
}

/**
 * Expande o colapsa una pregunta del FAQ.
 * @param {HTMLElement} btn - Botón de la pregunta
 */
function toggleFaq(btn) {
  const respuesta = btn.nextElementSibling;
  const estaAbierta = respuesta.classList.contains('visible');

  // Cerrar todas las respuestas abiertas
  document.querySelectorAll('.faq__respuesta').forEach(r => r.classList.remove('visible'));
  document.querySelectorAll('.faq__pregunta').forEach(b => b.classList.remove('abierta'));

  // Abrir la seleccionada si estaba cerrada
  if (!estaAbierta) {
    respuesta.classList.add('visible');
    btn.classList.add('abierta');
  }
}

/**
 * Muestra el modal de notificaciones.
 * @param {string} icono - Emoji del ícono del modal
 * @param {string} mensaje - Texto a mostrar
 */
function mostrarModal(icono, mensaje) {
  document.getElementById('modal-icono').textContent = icono;
  document.getElementById('modal-msg').textContent = mensaje;
  document.getElementById('modal-overlay').style.display = 'flex';
}

/**
 * Cierra el modal de notificaciones.
 */
function cerrarModal() {
  document.getElementById('modal-overlay').style.display = 'none';
}

/**
 * Retorna la fecha y hora actual formateada.
 * @returns {string} Fecha en formato DD/MM/YYYY HH:MM
 */
function obtenerFechaActual() {
  const ahora = new Date();
  const dia  = String(ahora.getDate()).padStart(2, '0');
  const mes  = String(ahora.getMonth() + 1).padStart(2, '0');
  const anio = ahora.getFullYear();
  const hora = String(ahora.getHours()).padStart(2, '0');
  const min  = String(ahora.getMinutes()).padStart(2, '0');
  return `${dia}/${mes}/${anio} ${hora}:${min}`;
}

// ================================================================
// INICIALIZACIÓN
// Se ejecuta cuando la página termina de cargar
// ================================================================

document.addEventListener('DOMContentLoaded', () => {
  // Renderizar el repositorio público con los materiales de ejemplo
  filtrarRepositorio('todos', document.querySelector('.repositorio__filtros .filtro-btn'));

  // Cerrar modal al hacer clic fuera de él
  document.getElementById('modal-overlay').addEventListener('click', function (e) {
    if (e.target === this) cerrarModal();
  });

  console.log('✅ EducaTech cargado correctamente.');
  console.log(`📚 Materiales precargados: ${materiales.length}`);
});
