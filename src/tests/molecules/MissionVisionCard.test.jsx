import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'; 

// Ajusta la ruta a donde se encuentre tu componente
import MissionVisionCard from '../../components/molecules/MissionVisionCard'; 

describe('Pruebas del Componente <MissionVisionCard />', () => {
  const defaultProps = {
    title: 'Nuestra Misión',
    description: 'Ser líderes en la repostería artesanal, ofreciendo productos de alta calidad.',
  };

  test('1. Debe renderizar el título y la descripción correctamente', () => {
    // Renderizamos el componente con las propiedades de prueba
    render(<MissionVisionCard {...defaultProps} />);

    // Verificamos que el título esté en el documento (se renderiza como h3)
    const titleElement = screen.getByRole('heading', { level: 3, name: defaultProps.title });
    expect(titleElement).toBeInTheDocument();
    
    // Verificamos que la descripción esté en el documento
    const descriptionElement = screen.getByText(defaultProps.description);
    expect(descriptionElement).toBeInTheDocument();
  });

  test('2. Debe aplicar la clase CSS principal al elemento article', () => {
    render(<MissionVisionCard {...defaultProps} />);

    // Buscamos el elemento principal (el artículo) y verificamos su clase
    // Nota: El elemento article es el único que contiene los roles 'heading' y 'paragraph'
    const articleElement = screen.getByRole('article');
    expect(articleElement).toBeInTheDocument();
    
    // Verificamos la clase CSS
    expect(articleElement).toHaveClass('mv-card');
  });

  test('3. Debe renderizar contenido diferente cuando se cambian las props', () => {
    const newProps = {
        title: 'Nuestra Visión',
        description: 'Expandir nuestra marca a nivel nacional e innovar en sabores.',
    };

    render(<MissionVisionCard {...newProps} />);

    // Verificamos el nuevo título
    expect(screen.getByRole('heading', { level: 3, name: newProps.title })).toBeInTheDocument();
    
    // Verificamos la nueva descripción
    expect(screen.getByText(newProps.description)).toBeInTheDocument();
  });
});