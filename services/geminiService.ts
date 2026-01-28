import { GoogleGenAI, Type, Modality } from "@google/genai";
import { TemplateId } from '../types';
import type { CarouselData, ImageEditResult } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    slides: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: 'Un título corto y atractivo o un gancho para la diapositiva.' },
          content: { type: Type.STRING, description: 'El contenido principal de texto para la diapositiva.' },
          visualSuggestion: { type: Type.STRING, description: 'Una sugerencia visual descriptiva que podría usarse como prompt para una herramienta de generación de imágenes (ej. "Un icono minimalista que representa el crecimiento", "Un patrón de fondo abstracto vibrante").' },
          emojis: { type: Type.STRING, description: 'Algunos emojis relevantes, como una sola cadena de texto.' },
        },
        required: ['title', 'content', 'visualSuggestion']
      }
    }
  },
  required: ['slides']
};


const buildPrompt = (templateId: TemplateId, formData: Record<string, string>): string => {
  switch (templateId) {
    case TemplateId.BASIC:
      return `
        Genera un carrusel de ${formData.slides} diapositivas para ${formData.platform}.
        Tema: ${formData.topic}
        Objetivo: ${formData.objective}

        Sigue estrictamente esta estructura:
        - Diapositiva 1: Portada llamativa (título + imagen/icono).
        - Diapositiva 2: Contexto o problema.
        - Diapositiva 3: Consecuencia o "dolor" del problema.
        - Diapositiva 4: Solución propuesta.
        - Diapositivas intermedias: Desarrollo de beneficios, ejemplos o pasos.
        - Diapositiva final: Un claro CTA (call to action).

        Para cada diapositiva, proporciona un título, contenido, emojis, y una sugerencia visual muy descriptiva que pueda servir como prompt para un generador de imágenes (ej: "Icono minimalista de un cohete despegando", "Foto de primer plano de un teclado con iluminación de neón").
      `;
    case TemplateId.STORYTELLING:
      return `
        Crea un carrusel narrativo de ${formData.slides} diapositivas sobre ${formData.topic}.
        Usa el patrón "Curiosidad -> Historia -> Solución -> Acción".

        Sigue estrictamente esta guía para cada diapositiva:
        - Slide 1: Frase intrigante + visual fuerte (gancho).
        - Slide 2-3: Microhistoria con datos o curiosidad.
        - Slide 4-5: Conexión con el problema del lector.
        - Slide 6-7: Presenta la solución con claridad.
        - Slide final: CTA directo con verbo de acción.

        Para cada diapositiva, proporciona un título, contenido, emojis, y una sugerencia visual muy descriptiva que pueda servir como prompt para un generador de imágenes (ej: "Una lupa enfocando un pequeño detalle en un mapa antiguo", "Diagrama de flujo que muestra la transformación de una idea a un producto").
      `;
    case TemplateId.EDITABLE:
      return `
        Genera una plantilla de carrusel genérica y editable sobre el tema de "${formData.topic}". El objetivo es crear un esqueleto que un usuario pueda adaptar fácilmente.
        El contenido debe ser en formato de pregunta o placeholder para que el usuario lo complete.

        Sigue estrictamente esta estructura y genera contenido de plantilla para cada sección:
        1. Gancho / Título (ej. "¿Sabías que...? o "El error #1 en [tema] es...")
        2. Problema / Contexto (ej. "Muchos luchan con [problema común]...")
        3. Dolor / Impacto (ej. "Esto lleva a [consecuencia negativa]...")
        4. Solución (ej. "La clave está en [concepto de solución]...")
        5. Beneficios / Pasos (ej. "Paso 1: [Acción], Beneficio: [Resultado]...")
        6. CTA final (ej. "Guarda este post" o "¿Listo para empezar?")

        Para cada diapositiva, proporciona un título de plantilla, contenido de plantilla, emojis apropiados, y una sugerencia visual genérica pero descriptiva, que pueda servir como prompt para un generador de imágenes (ej: "Fondo degradado con formas geométricas suaves", "Icono de línea fina de un gráfico de barras ascendente").
      `;
    case TemplateId.UNIVERSAL:
      return `
        Quiero que generes un carrusel de ${formData.slides} diapositivas para ${formData.platform}.

        🎯 Tema: ${formData.topic}
        🎯 Objetivo: ${formData.objective}.
        🎯 Público: ${formData.audience}.

        Sigue estrictamente esta estructura esperada:
        1️⃣ Diapositiva 1: Gancho muy llamativo (título corto, directo, con intriga o dato curioso).
        2️⃣ Diapositiva 2: Presenta el contexto o el problema de forma sencilla.
        3️⃣ Diapositiva 3: Explica la consecuencia o dolor del problema con emoción.
        4️⃣ Diapositiva 4: Muestra la solución o propuesta de valor.
        5️⃣ Diapositiva 5 en adelante: Expande con pasos, beneficios, ejemplos o datos clave.
        🚀 Última diapositiva: CTA (Call To Action) claro y motivador, como “Descubre más”, “Inscríbete ahora” o “Escríbeme”.

        Formato de salida para cada diapositiva:
        - Texto breve y claro para cada diapositiva (máx. 25 palabras).
        - Sugerencia visual descriptiva para acompañar cada diapositiva que pueda servir como prompt para un generador de imágenes (ejemplo: "Ilustración de un cerebro con engranajes", "Foto de una persona alcanzando la cima de una montaña").
        - Emojis opcionales para hacerlo más visual y atractivo.

        Usa un tono ${formData.tone} según el objetivo.
      `;
    default:
      throw new Error("Invalid template ID");
  }
};

export const generateCarouselContent = async (templateId: TemplateId, formData: Record<string, string>): Promise<CarouselData> => {
  const prompt = buildPrompt(templateId, formData);

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.8,
      },
    });

    const jsonText = response.text.trim();
    const parsedData = JSON.parse(jsonText);
    
    if (parsedData && Array.isArray(parsedData.slides)) {
      return parsedData.slides as CarouselData;
    } else {
      throw new Error("Respuesta de la API con formato inesperado.");
    }
  } catch (error) {
    console.error("Error al generar contenido:", error);
    throw new Error("No se pudo generar el contenido. Por favor, inténtalo de nuevo.");
  }
};

export const editImage = async (base64ImageData: string, mimeType: string, prompt: string): Promise<ImageEditResult> => {
  if (!base64ImageData || !mimeType || !prompt) {
    throw new Error("Se requieren una imagen, su tipo y un prompt para la edición.");
  }
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      // FIX: Corrected the structure of the `contents` property to be an object with a `parts` array for multimodal input.
      contents: {
        parts: [
          {
            inlineData: {
              data: base64ImageData,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
          responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    const result: ImageEditResult = { imageUrl: null, text: null };

    if (response.candidates && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.text) {
          result.text = part.text;
        } else if (part.inlineData) {
          const base64ImageBytes: string = part.inlineData.data;
          result.imageUrl = `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
        }
      }
    }

    if (!result.imageUrl) {
        throw new Error("El modelo no devolvió una imagen. Intenta con un prompt diferente.");
    }
    
    return result;
  } catch (error) {
    console.error("Error al editar la imagen:", error);
    if (error instanceof Error && error.message.includes('400')) {
         throw new Error("Hubo un problema con la solicitud. Asegúrate de que la imagen sea válida y el prompt sea claro.");
    }
    throw new Error("No se pudo editar la imagen. Por favor, inténtalo de nuevo.");
  }
};
