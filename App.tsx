import React, { useState, useCallback } from 'react';
import { TEMPLATES } from './constants';
import { Template, TemplateId, CarouselData, ImageEditResult } from './types';
import { generateCarouselContent, editImage } from './services/geminiService';
import { SparklesIcon } from './components/icons/SparklesIcon';
import { LoadingSpinner } from './components/LoadingSpinner';
import { CarouselPreview } from './components/CarouselPreview';
import { ImagePreview } from './components/ImagePreview';

// Helper to convert file to base64
const toBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => {
    if (typeof reader.result === 'string') {
      resolve(reader.result.split(',')[1]);
    } else {
      reject(new Error('Failed to convert file to base64'));
    }
  };
  reader.onerror = error => reject(error);
});

const TemplateSelection: React.FC<{ onSelect: (template: Template) => void }> = ({ onSelect }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {TEMPLATES.map((template) => (
      <button
        key={template.id}
        onClick={() => onSelect(template)}
        className="bg-base-200 p-6 rounded-lg text-left hover:bg-base-300 hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-primary"
      >
        <h3 className="text-xl font-bold text-text-primary">{template.name}</h3>
        <p className="text-text-secondary mt-2">{template.description}</p>
      </button>
    ))}
  </div>
);

const TemplateForm: React.FC<{ template: Template; onSubmit: (data: Record<string, string | File>) => void; onBack: () => void; loading: boolean }> = ({ template, onSubmit, onBack, loading }) => {
  const [formData, setFormData] = useState<Record<string, string | File>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'file') {
        const files = (e.target as HTMLInputElement).files;
        if (files && files.length > 0) {
            setFormData(prev => ({ ...prev, [name]: files[0] }));
        }
    } else {
        setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="w-full max-w-2xl mx-auto animate-fade-in">
        <button onClick={onBack} className="text-brand-light hover:underline mb-4">&larr; Elegir otra plantilla</button>
        <h2 className="text-2xl font-bold text-center text-text-primary mb-2">{template.name}</h2>
        <p className="text-text-secondary text-center mb-6">{template.description}</p>
        <form onSubmit={handleSubmit} className="space-y-4">
            {template.fields.map(field => (
                <div key={field.name}>
                    <label htmlFor={field.name} className="block text-sm font-medium text-text-primary mb-1">{field.label}</label>
                    {field.type === 'select' ? (
                        <select
                            id={field.name}
                            name={field.name}
                            onChange={handleChange}
                            required={field.required}
                            className="w-full bg-base-300 border border-base-100 rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary"
                        >
                            <option value="">{field.placeholder}</option>
                            {field.options?.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
                        </select>
                    ) : field.type === 'file' ? (
                        <input
                            id={field.name}
                            name={field.name}
                            type="file"
                            accept="image/*"
                            onChange={handleChange}
                            required={field.required}
                            className="w-full text-sm text-text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-secondary file:text-white hover:file:bg-opacity-80"
                         />
                    ) : (
                        <input
                            id={field.name}
                            name={field.name}
                            type={field.type}
                            placeholder={field.placeholder}
                            onChange={handleChange}
                            required={field.required}
                            className="w-full bg-base-300 border border-base-100 rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary"
                        />
                    )}
                </div>
            ))}
            <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-opacity-90 transition-all duration-300 flex items-center justify-center disabled:bg-gray-500"
            >
                {loading ? 'Generando...' : (
                    <>
                        <SparklesIcon className="w-5 h-5 mr-2" />
                        Generar Contenido
                    </>
                )}
            </button>
        </form>
    </div>
  );
};


function App() {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [carouselData, setCarouselData] = useState<CarouselData | null>(null);
  const [imageResult, setImageResult] = useState<ImageEditResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFormSubmit = useCallback(async (formData: Record<string, any>) => {
    if (!selectedTemplate) return;

    setLoading(true);
    setError(null);
    setCarouselData(null);
    setImageResult(null);

    try {
        if (selectedTemplate.id === TemplateId.IMAGE_EDITING) {
            const imageFile = formData.image as File;
            if (!imageFile || !formData.prompt) {
                throw new Error("Por favor, sube una imagen y escribe un prompt.");
            }
            const base64Image = await toBase64(imageFile);
            const result = await editImage(base64Image, imageFile.type, formData.prompt);
            setImageResult(result);
        } else {
            const stringFormData = Object.fromEntries(
              Object.entries(formData).map(([key, value]) => [key, String(value)])
            );
            const data = await generateCarouselContent(selectedTemplate.id, stringFormData);
            setCarouselData(data);
        }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocurrió un error inesperado');
    } finally {
      setLoading(false);
    }
  }, [selectedTemplate]);

  const handleReset = () => {
    setSelectedTemplate(null);
    setCarouselData(null);
    setImageResult(null);
    setError(null);
    setLoading(false);
  };
  
  const renderContent = () => {
    if (loading) return <LoadingSpinner />;
    if (error) return <div className="text-center text-red-400 bg-red-900/20 p-4 rounded-lg"><strong>Error:</strong> {error}</div>;
    if (carouselData) return <CarouselPreview slides={carouselData} onReset={handleReset} />;
    if (imageResult) return <ImagePreview result={imageResult} onReset={handleReset} />;
    if (selectedTemplate) return <TemplateForm template={selectedTemplate} onSubmit={handleFormSubmit} onBack={() => setSelectedTemplate(null)} loading={loading} />;
    return <TemplateSelection onSelect={setSelectedTemplate} />;
  };

  return (
    <div className="bg-base-100 min-h-screen text-text-primary font-sans">
      <div className="container mx-auto px-4 py-12">
        <header className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold text-brand-primary">
                Generador de Carruseles IA
            </h1>
            <p className="text-text-secondary mt-2 text-lg">
                Crea contenido atractivo para tus redes sociales en segundos.
            </p>
            <p className="text-sm text-brand-light mt-4">
                Ing.Magda Diaz @eduai.doc 2025
            </p>
        </header>
        <main>
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default App;