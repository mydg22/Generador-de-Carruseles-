import { Template, TemplateId } from './types';

export const TEMPLATES: Template[] = [
  {
    id: TemplateId.BASIC,
    name: 'Carrusel Básico',
    description: 'Genera un carrusel simple y efectivo con una estructura clásica: portada, problema, solución y CTA.',
    fields: [
      { name: 'topic', label: 'Tema Principal', type: 'text', placeholder: 'Ej: "Consejos de productividad para freelancers"', required: true },
      { name: 'objective', label: 'Objetivo del Carrusel', type: 'text', placeholder: 'Ej: "Atraer nuevos seguidores y generar guardados"', required: true },
      { name: 'slides', label: 'Número de Diapositivas', type: 'number', placeholder: 'Ej: 7', required: true },
      { name: 'platform', label: 'Plataforma', type: 'select', options: [{ value: 'Instagram', label: 'Instagram' }, { value: 'LinkedIn', label: 'LinkedIn' }], placeholder: 'Selecciona una plataforma', required: true },
    ],
  },
  {
    id: TemplateId.STORYTELLING,
    name: 'Carrusel Narrativo (Storytelling)',
    description: 'Crea un carrusel que cuenta una historia para conectar emocionalmente con tu audiencia.',
    fields: [
        { name: 'topic', label: 'Tema de la Historia', type: 'text', placeholder: 'Ej: "Cómo superé el miedo a hablar en público"', required: true },
        { name: 'slides', label: 'Número de Diapositivas', type: 'number', placeholder: 'Ej: 8', required: true },
    ],
  },
  {
    id: TemplateId.EDITABLE,
    name: 'Plantilla Editable',
    description: 'Genera una plantilla de carrusel con placeholders para que puedas rellenar y adaptar fácilmente.',
    fields: [
      { name: 'topic', label: 'Tema General', type: 'text', placeholder: 'Ej: "Marketing Digital"', required: true },
    ],
  },
  {
    id: TemplateId.UNIVERSAL,
    name: 'Carrusel Universal',
    description: 'Un modelo versátil que se adapta a cualquier tema, ideal para contenido educativo y de valor.',
    fields: [
      { name: 'topic', label: 'Tema Principal', type: 'text', placeholder: 'Ej: "Los beneficios de la meditación"', required: true },
      { 
        name: 'objective', 
        label: 'Objetivo del Carrusel', 
        type: 'select', 
        options: [
            { value: 'educar', label: 'Educar' },
            { value: 'atraer clientes', label: 'Atraer Clientes' },
            { value: 'generar confianza', label: 'Generar Confianza' },
            { value: 'invitar a inscribirse', label: 'Invitar a Inscribirse' },
            { value: 'storytelling', label: 'Storytelling' },
        ], 
        placeholder: 'Selecciona un objetivo', 
        required: true 
      },
      { name: 'audience', label: 'Público Objetivo', type: 'text', placeholder: 'Ej: "Emprendedores ocupados"', required: true },
      { name: 'slides', label: 'Número de Diapositivas', type: 'number', placeholder: 'Ej: 10', required: true },
      { name: 'platform', label: 'Plataforma', type: 'select', options: [{ value: 'Instagram', label: 'Instagram' }, { value: 'LinkedIn', label: 'LinkedIn' }, { value: 'Facebook', label: 'Facebook' }], placeholder: 'Selecciona una plataforma', required: true },
      { name: 'tone', label: 'Tono de Voz', type: 'select', options: [{ value: 'Profesional', label: 'Profesional' }, { value: 'Amistoso', label: 'Amistoso' }, { value: 'Inspirador', label: 'Inspirador' }, { value: 'Humorístico', label: 'Humorístico' }], placeholder: 'Selecciona un tono', required: true },
    ],
  },
  {
    id: TemplateId.IMAGE_EDITING,
    name: 'Edición de Imagen con IA',
    description: 'Sube una imagen y edítala usando un prompt de texto para añadir, quitar o modificar elementos.',
    fields: [
        { name: 'image', label: 'Sube tu imagen', type: 'file', placeholder: '', required: true },
        { name: 'prompt', label: 'Instrucciones de edición', type: 'text', placeholder: 'Ej: "añade un sombrero de fiesta al gato"', required: true },
    ],
  },
];