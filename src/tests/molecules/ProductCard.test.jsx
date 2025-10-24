import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom'; 

// =========================================================================
// ❖ MOCKING DE COMPONENTES DEPENDIENTES (Button)
// 💡 NOTA: Usa la misma ruta absoluta que funcionó en el NewsCard,
// ya que ambos componentes están probablemente en la misma estructura.
// =========================================================================
jest.mock('src/components/atoms/Button', () => { 
    // Retorna una función de componente simple que simula el Button
    return (props) => (
        <button 
            data-testid="mock-button" // Usamos 'button' en el mock para que el stopPropagation funcione
            className={`mock-variant-${props.variant} mock-size-${props.size}`}
            onClick={props.onClick}
            {...props} 
        >
            {props.children}
        </button>
    );
});


// Ajusta la ruta de importación del componente de prueba
import ProductCard from 'src/components/molecules/ProductCard'; 

describe('Pruebas del Componente <ProductCard />', () => {
    // Definimos un objeto de producto de prueba
    const mockProduct = {
        codigo: 'CUPCAKE-001',
        nombre: 'Cupcake de Vainilla',
        categoria: 'Cupcakes',
        precio: 2500, // Precio sin formato
        imagen: '/img/cupcake-vainilla.jpg',
    };

    // Definimos las funciones de callback simuladas
    const mockOnAddToCart = jest.fn();
    const mockOnViewDetails = jest.fn();

    // Propiedades completas para el renderizado
    const defaultProps = {
        producto: mockProduct,
        onAddToCart: mockOnAddToCart,
        onViewDetails: mockOnViewDetails,
    };

    beforeEach(() => {
        // Limpiamos los mocks antes de cada prueba
        mockOnAddToCart.mockClear();
        mockOnViewDetails.mockClear();
    });

// --- PRUEBAS DE RENDERIZADO Y DATOS ---

    test('1. Debe renderizar la información del producto correctamente', () => {
        render(<ProductCard {...defaultProps} />);

        // 1. Título (h3)
        expect(screen.getByRole('heading', { level: 3, name: mockProduct.nombre })).toBeInTheDocument();

        // 2. Categoría
        expect(screen.getByText(mockProduct.categoria)).toBeInTheDocument();

        // 3. Precio (Verificamos el formato chileno: 2.500 CLP)
        expect(screen.getByText('$2.500 CLP')).toBeInTheDocument();

        // 4. Imagen
        const imgElement = screen.getByRole('img', { name: mockProduct.nombre });
        expect(imgElement).toHaveAttribute('src', mockProduct.imagen);
        expect(imgElement).toHaveAttribute('loading', 'lazy');

        // 5. Atributo data-id
        const articleElement = screen.getByRole('article');
        expect(articleElement).toHaveAttribute('data-id', mockProduct.codigo);
    });

// --- PRUEBAS DE INTERACCIÓN (VER DETALLES) ---

    test('2. Debe llamar a onViewDetails cuando se hace clic en la tarjeta (article)', () => {
        render(<ProductCard {...defaultProps} />);

        const cardElement = screen.getByRole('article');
        fireEvent.click(cardElement);

        // Verifica que se llamó la función y se pasó el objeto producto
        expect(mockOnViewDetails).toHaveBeenCalledTimes(1);
        expect(mockOnViewDetails).toHaveBeenCalledWith(mockProduct);
    });

    test('3. No debe fallar si onViewDetails es nulo y se hace clic en la tarjeta', () => {
        const propsWithoutViewDetails = { ...defaultProps, onViewDetails: undefined };
        render(<ProductCard {...propsWithoutViewDetails} />);

        const cardElement = screen.getByRole('article');
        // El test pasa si el fireEvent.click no lanza un error
        expect(() => fireEvent.click(cardElement)).not.toThrow();
    });

// --- PRUEBAS DE INTERACCIÓN (AGREGAR AL CARRITO) ---

    test('4. Debe llamar a onAddToCart cuando se hace clic en el botón', () => {
        render(<ProductCard {...defaultProps} />);

        // Buscamos el mock del botón por su contenido
        const buttonElement = screen.getByText('Agregar al carrito');
        fireEvent.click(buttonElement);

        // Verifica que se llamó la función y se pasó el objeto producto
        expect(mockOnAddToCart).toHaveBeenCalledTimes(1);
        expect(mockOnAddToCart).toHaveBeenCalledWith(mockProduct);
    });
    
    test('5. No debe llamar a onViewDetails si se hace clic en el botón (stopPropagation)', () => {
        render(<ProductCard {...defaultProps} />);

        // Buscamos el mock del botón y simulamos el clic
        const buttonElement = screen.getByText('Agregar al carrito');
        fireEvent.click(buttonElement);

        // Verifica que onAddToCart fue llamado (prueba 4)
        expect(mockOnAddToCart).toHaveBeenCalledTimes(1);
        
        // Verifica que onViewDetails NO fue llamado gracias al stopPropagation()
        expect(mockOnViewDetails).not.toHaveBeenCalled();
    });

    test('6. No debe fallar si onAddToCart es nulo y se hace clic en el botón', () => {
        const propsWithoutAddToCart = { ...defaultProps, onAddToCart: undefined };
        render(<ProductCard {...propsWithoutAddToCart} />);

        const buttonElement = screen.getByText('Agregar al carrito');
        // El test pasa si el fireEvent.click no lanza un error
        expect(() => fireEvent.click(buttonElement)).not.toThrow();
    });
});