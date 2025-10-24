import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'; 

// Ajusta la ruta de importación a donde se encuentre tu componente
import SectionTitle from '../../components/atoms/SectionTitle'; 

describe('Pruebas del Componente <SectionTitle />', () => {
  const titleText = 'Nuestros Productos Destacados';

  // =========================================================================
  // ❖ Pruebas de Renderizado y Propiedades (Valores por Defecto)
  // =========================================================================
  
  test('1. Debe renderizar el texto (children) y usar la etiqueta y alineación por defecto', () => {
    // ACT: Renderizar el componente
    render(<SectionTitle>{titleText}</SectionTitle>);

    // ASSERT 1: Verificar el contenido renderizado
    const titleElement = screen.getByText(titleText);
    expect(titleElement).toBeInTheDocument();

    // ASSERT 2: Verificar la etiqueta por defecto (as='h2')
    expect(titleElement.tagName).toBe('H2');

    // ASSERT 3: Verificar la clase de alineación por defecto (align='center')
    expect(titleElement).toHaveClass('section-title');
    expect(titleElement).toHaveClass('section-title--center');
  });

  // =========================================================================
  // ❖ Pruebas de Propiedades Dinámicas ('as' y 'align')
  // =========================================================================

  test('2. Debe renderizar la etiqueta correcta cuando se especifica la prop "as"', () => {
    // Caso A: Renderizar como h1
    const { rerender } = render(<SectionTitle as="h1">{titleText}</SectionTitle>);
    const h1Element = screen.getByText(titleText);
    expect(h1Element.tagName).toBe('H1'); // Verificar que es un H1
    expect(h1Element).toHaveClass('section-title--center'); // Alineación por defecto sigue ahí

    // Caso B: Renderizar como p
    rerender(<SectionTitle as="p">{titleText}</SectionTitle>);
    const pElement = screen.getByText(titleText);
    expect(pElement.tagName).toBe('P'); // Verificar que es un P
  });

  test('3. Debe aplicar la clase correcta según la prop "align"', () => {
    // Caso A: Alineación a la derecha
    const { rerender } = render(<SectionTitle align="right">{titleText}</SectionTitle>);
    const rightElement = screen.getByText(titleText);
    
    expect(rightElement).toHaveClass('section-title--right');
    expect(rightElement).not.toHaveClass('section-title--center');

    // Caso B: Alineación a la izquierda
    rerender(<SectionTitle align="left">{titleText}</SectionTitle>);
    const leftElement = screen.getByText(titleText);

    expect(leftElement).toHaveClass('section-title--left');
    expect(leftElement).not.toHaveClass('section-title--right');
  });
  
  // =========================================================================
  // ❖ Pruebas de Props Adicionales (Spread Props)
  // =========================================================================

  test('4. Debe pasar props adicionales al elemento renderizado', () => {
    const dataTestId = 'titulo-secundario';
    
    render(
      <SectionTitle data-testid={dataTestId} id="my-title">
        {titleText}
      </SectionTitle>
    );

    const element = screen.getByTestId(dataTestId);

    // Verificar que el data-testid y el id fueron pasados correctamente
    expect(element).toBeInTheDocument();
    expect(element).toHaveAttribute('id', 'my-title');
  });
});