import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom'; 

// Ajusta la ruta de importación según tu estructura de carpetas
// (Asumiendo que el modal está en src/components/Modal.jsx)
import Modal from '../../components/atoms/Modal'; 

describe('Pruebas del Componente <Modal />', () => {
  const mockOnClose = jest.fn();
  const defaultProps = {
    onClose: mockOnClose,
    title: 'Modal de Prueba',
    children: <p>Contenido del Modal</p>,
    ariaLabel: 'Diálogo de información',
  };

  // Limpiamos la función mock después de cada prueba
  afterEach(() => {
    mockOnClose.mockClear();
  });

  // =========================================================================
  // ❖ Pruebas de Renderizado Condicional
  // =========================================================================

  test('1. No debe renderizar el modal cuando isOpen es false', () => {
    // Renderizamos el componente con isOpen en false
    const { container } = render(<Modal isOpen={false} {...defaultProps} />);

    // El componente debe devolver null, por lo que el contenedor no debe tener hijos.
    expect(container.firstChild).toBeNull();

    // Verificamos que el título y el contenido no estén en el documento.
    expect(screen.queryByText(defaultProps.title)).not.toBeInTheDocument();
  });

  test('2. Debe renderizar el modal cuando isOpen es true, incluyendo título y contenido', () => {
    // Renderizamos el componente con isOpen en true
    render(<Modal isOpen={true} {...defaultProps} />);

    // Verificamos que el rol principal 'dialog' esté presente
    const modalElement = screen.getByRole('dialog', { name: defaultProps.ariaLabel });
    expect(modalElement).toBeInTheDocument();

    // Verificamos el título
    expect(screen.getByText(defaultProps.title)).toBeInTheDocument();

    // Verificamos el contenido
    expect(screen.getByText('Contenido del Modal')).toBeInTheDocument();
  });

  // =========================================================================
  // ❖ Pruebas de Propiedades (Props) y Renderizado
  // =========================================================================

  test('3. Debe aplicar la clase correcta según la prop size (lg)', () => {
    render(<Modal isOpen={true} size="lg" {...defaultProps} />);
    
    // Buscamos el panel del modal (donde se aplica la clase de tamaño)
    const panelElement = screen.getByRole('dialog').querySelector('.ms-modal__panel');

    expect(panelElement).toHaveClass('ms-modal__panel--lg');
    expect(panelElement).not.toHaveClass('ms-modal__panel--md');
  });
  
  test('4. Debe usar el prop "ariaLabel" si está presente, y si no, usar el prop "title"', () => {
    // Caso A: Usando ariaLabel
    render(<Modal isOpen={true} {...defaultProps} />);
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-label', defaultProps.ariaLabel);

    // Caso B: Sin ariaLabel, debe usar el title
    render(<Modal isOpen={true} onClose={mockOnClose} title="Título Único" children={<div />} />);
    expect(screen.getByRole('dialog', { name: 'Título Único' })).toBeInTheDocument();
  });

  // =========================================================================
  // ❖ Pruebas de Eventos (Clic y Teclado)
  // =========================================================================

  // Tarea: Simular un clic en un botón y comprobar que se ejecute una función específica.
  test('5. Debe llamar a onClose al hacer clic en el botón de cerrar (×)', () => {
    render(<Modal isOpen={true} {...defaultProps} />);
    
    // Buscamos el botón de cerrar por su aria-label
    const closeButton = screen.getByRole('button', { name: 'Cerrar' });

    fireEvent.click(closeButton);

    // Verificamos que la función mock fue llamada
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
  
  test('6. Debe llamar a onClose al hacer clic en el fondo (backdrop)', () => {
    render(<Modal isOpen={true} {...defaultProps} />);
    
    // Buscamos el fondo (backdrop) por su clase y simulamos el clic
    // Nota: El backdrop no tiene un rol, así que lo buscamos por el padre o la clase
    const backdrop = screen.getByRole('dialog').querySelector('.ms-modal__backdrop');

    fireEvent.click(backdrop);

    // Verificamos que la función mock fue llamada
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
  
  // Tarea: Simulación de Eventos de Teclado (useEffect)
  test('7. Debe llamar a onClose al presionar la tecla Escape (Escape Key)', () => {
    render(<Modal isOpen={true} {...defaultProps} />);
    
    // Simulamos un evento de teclado 'keydown' en el documento (que es donde está el listener)
    fireEvent.keyDown(window, { key: 'Escape', code: 'Escape' });

    // Verificamos que la función mock fue llamada
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
  
  test('8. NO debe llamar a onClose si se presiona una tecla diferente a Escape', () => {
    render(<Modal isOpen={true} {...defaultProps} />);
    
    // Simulamos una tecla diferente (ej. Enter)
    fireEvent.keyDown(window, { key: 'Enter', code: 'Enter' });

    // Verificamos que la función mock NO fue llamada
    expect(mockOnClose).not.toHaveBeenCalled();
  });
});