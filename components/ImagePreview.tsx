import React from 'react';
import type { ImageEditResult } from '../types';

interface ImagePreviewProps {
  result: ImageEditResult;
  onReset: () => void;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({ result, onReset }) => {
  return (
    <div className="w-full max-w-2xl mx-auto mt-8 animate-fade-in">
      <h2 className="text-2xl font-bold text-center text-text-primary mb-4">Resultado de la Edición</h2>
      <div className="bg-base-200 rounded-lg p-4 shadow-lg">
        {result.imageUrl && (
          <img src={result.imageUrl} alt="Imagen editada" className="rounded-lg w-full h-auto object-contain max-h-[60vh]" />
        )}
        {result.text && (
          <div className="mt-4 pt-4 border-t border-base-300">
            <p className="text-text-secondary whitespace-pre-wrap">{result.text}</p>
          </div>
        )}
      </div>
      <div className="text-center mt-8">
        <button
          onClick={onReset}
          className="bg-brand-secondary text-white font-bold py-2 px-6 rounded-lg hover:bg-opacity-80 transition-all duration-300"
        >
          Regresar al Inicio
        </button>
      </div>
    </div>
  );
};