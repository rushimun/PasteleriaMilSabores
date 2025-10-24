import React from 'react';
// 💡 Importamos 'act' para envolver las interacciones asíncronas de React.
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom'; 

// =========================================================================
// ❖ MOCKING DE APIS DEL NAVEGADOR
// =========================================================================

// 1. Simulación de requestAnimationFrame (para animaciones)
global.requestAnimationFrame = jest.fn((cb) => cb());

// 2. Simulación de una CLASE DUMMY para el entorno global
//    La lógica de Jest.fn() se manejará en beforeEach.
class MockResizeObserver {
    constructor(callback) { this.callback = callback; }
    observe() {}
    unobserve() {}
    disconnect() {}
}
global.ResizeObserver = MockResizeObserver;


// Ajusta la ruta de importación
import AccordionItem from '../../components/molecules/AccordionItem'; 

describe('Pruebas del Componente <AccordionItem />', () => {
  const mockOnToggle = jest.fn();
  const defaultProps = {
    id: 'item-1',
    title: 'Pregunta Frecuente',
    children: <div>Respuesta detallada</div>,
    onToggle: mockOnToggle,
  };
  
  // 💡 Variables para el mock controlado y la restauración del DOM
  let mockResizeObserverInstance;
  let originalBoundingClientRect;

  // =========================================================================
  // ❖ SETUP Y CLEANUP GLOBALES
  // =========================================================================

  beforeEach(() => {
    // Limpiamos otros mocks
    mockOnToggle.mockClear();
    global.requestAnimationFrame.mockClear();
    
    // 1. RE-MOCKING CONTROLADO DE ResizeObserver
    // Creamos un objeto de Jest.fn() que rastrearemos directamente.
    mockResizeObserverInstance = {
        observe: jest.fn(),
        unobserve: jest.fn(),
        disconnect: jest.fn(),
    };
    // Reemplazamos el global.ResizeObserver con un SPY que devuelve SIEMPRE la misma instancia rastreable
    global.ResizeObserver = jest.fn(() => mockResizeObserverInstance);
    
    // 2. DOM MOCKING: Simulamos getBoundingClientRect
    originalBoundingClientRect = window.HTMLElement.prototype.getBoundingClientRect;
    window.HTMLElement.prototype.getBoundingClientRect = jest.fn(() => ({
        height: 100, // Forzamos una altura para que el observer se cree
        width: 100,
        x: 0, y: 0, top: 0, left: 0, right: 0, bottom: 0, 
    }));
  });

  afterEach(() => {
    // Restauramos la función original de BoundingClientRect
    window.HTMLElement.prototype.getBoundingClientRect = originalBoundingClientRect;
  });

  // =========================================================================
  // ❖ Pruebas de Renderizado Condicional y Accesibilidad (ARIA)
  // =========================================================================

  test('1. Debe renderizar el título y los atributos ARIA iniciales cuando está cerrado', () => {
    render(<AccordionItem {...defaultProps} isOpen={false} />);

    const button = screen.getByRole('button', { name: defaultProps.title });
    expect(button).toHaveAttribute('aria-expanded', 'false');

    // Usamos { hidden: true } para encontrar el elemento aria-hidden=true
    const content = screen.getByRole('region', { hidden: true });
    expect(content).toHaveAttribute('aria-hidden', 'true');

    const article = screen.getByRole('region', { hidden: true }).closest('article');
    expect(article).not.toHaveClass('is-open');
  });

  test('2. Debe renderizar las clases y atributos ARIA cuando está abierto', () => {
    render(<AccordionItem {...defaultProps} isOpen={true} />);

    const button = screen.getByRole('button', { name: defaultProps.title });
    expect(button).toHaveAttribute('aria-expanded', 'true');

    const content = screen.getByRole('region'); 
    expect(content).toHaveAttribute('aria-hidden', 'false');

    const article = screen.getByRole('region').closest('article');
    expect(article).toHaveClass('is-open');
  });

  // =========================================================================
  // ❖ Pruebas de Eventos (Interacción del Usuario)
  // =========================================================================

  test('3. Debe llamar a la función onToggle cuando el usuario hace clic en el botón', () => {
    render(<AccordionItem {...defaultProps} isOpen={false} />);
    
    const button = screen.getByRole('button', { name: defaultProps.title });
    fireEvent.click(button);

    expect(mockOnToggle).toHaveBeenCalledTimes(1);
  });
  
  // =========================================================================
  // ❖ Pruebas de Lógica de Side Effects (Limpieza de Observers)
  // =========================================================================

  test('4. El observador de redimensionamiento (ResizeObserver) debe ser desconectado al desmontar', () => {
    // Renderizamos el componente ABIERTO dentro de act para resolver los effects
    let unmount;
    act(() => {
        const result = render(<AccordionItem {...defaultProps} isOpen={true} />);
        unmount = result.unmount;
    });
    
    // 1. Verificamos que la clase haya sido llamada
    expect(global.ResizeObserver).toHaveBeenCalledTimes(1); 

    // 2. Obtenemos la instancia *directamente* (ya que la controlamos en beforeEach)
    const observerInstance = mockResizeObserverInstance;

    // Desmontamos el componente para activar la limpieza
    act(() => {
        unmount();
    });
    
    // 3. Verificamos la limpieza
    expect(observerInstance.disconnect).toHaveBeenCalledTimes(1);
  });
  
  test('5. La función handleTransitionEnd y el listener deben ser limpiados al desmontar', () => {
    const removeSpy = jest.spyOn(window.HTMLElement.prototype, 'removeEventListener');

    const { unmount } = render(<AccordionItem {...defaultProps} isOpen={true} />);
    
    unmount();
    
    expect(removeSpy).toHaveBeenCalledWith('transitionend', expect.any(Function));
    
    removeSpy.mockRestore();
  });
});