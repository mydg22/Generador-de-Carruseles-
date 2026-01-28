import React, { useState, useCallback, useEffect } from 'react';
import type { CarouselData } from '../types';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';
import { ArrowRightIcon } from './icons/ArrowRightIcon';

interface CarouselPreviewProps {
  slides: CarouselData;
  onReset: () => void;
}

const Slide: React.FC<{ slide: CarouselData[0]; isActive: boolean }> = ({ slide, isActive }) => {
    return (
        <div className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${isActive ? 'opacity-100' : 'opacity-0'}`}>
            <div className="bg-base-300 rounded-lg p-6 h-full flex flex-col justify-between">
                <div>
                    <h3 className="text-xl font-bold text-brand-light mb-2">{slide.title} {slide.emojis}</h3>
                    <p className="text-text-secondary whitespace-pre-wrap">{slide.content}</p>
                </div>
                <div className="mt-4 pt-4 border-t border-base-100">
                    <p className="text-sm text-gray-400">
                        <span className="font-semibold text-gray-300">Sugerencia Visual:</span> {slide.visualSuggestion}
                    </p>
                </div>
            </div>
        </div>
    );
};


export const CarouselPreview: React.FC<CarouselPreviewProps> = ({ slides, onReset }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = useCallback(() => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  }, [currentIndex, slides.length]);

  const goToNext = useCallback(() => {
    const isLastSlide = currentIndex === slides.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  }, [currentIndex, slides.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'ArrowLeft') {
            goToPrevious();
        } else if (e.key === 'ArrowRight') {
            goToNext();
        }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
        window.removeEventListener('keydown', handleKeyDown);
    };
  }, [goToPrevious, goToNext]);


  if (!slides || slides.length === 0) return null;

  return (
    <div className="w-full max-w-2xl mx-auto mt-8">
      <h2 className="text-2xl font-bold text-center text-text-primary mb-4">Resultado Generado</h2>
      <div className="relative h-80 mb-4">
        {slides.map((slide, index) => (
            <Slide key={index} slide={slide} isActive={index === currentIndex} />
        ))}
      </div>
      <div className="flex items-center justify-between text-text-primary">
        <button onClick={goToPrevious} className="p-2 rounded-full bg-base-300 hover:bg-brand-primary transition-colors">
          <ArrowLeftIcon className="w-6 h-6" />
        </button>
        <span className="font-mono">{currentIndex + 1} / {slides.length}</span>
        <button onClick={goToNext} className="p-2 rounded-full bg-base-300 hover:bg-brand-primary transition-colors">
          <ArrowRightIcon className="w-6 h-6" />
        </button>
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