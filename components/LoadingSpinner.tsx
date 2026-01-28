
import React from 'react';

export const LoadingSpinner: React.FC = () => (
    <div className="flex flex-col items-center justify-center space-y-4">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-brand-primary"></div>
        <p className="text-text-secondary">Generando contenido...</p>
    </div>
);
