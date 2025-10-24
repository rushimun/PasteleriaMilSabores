import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import '@testing-library/jest-dom'; 

// =========================================================================
// ❖ MOCKING DE COMPONENTES DEPENDIENTES (Button)
// 💡 NOTA: Usamos la misma ruta de alias absoluto que resolviste en la prueba anterior.
// =========================================================================
jest.mock('src/components/atoms/Button', () => { 
    return (props) => (
        <button 
            data-testid="mock-button" 
            className={`mock-variant-${props.variant} mock-size-${props.size}`}
            onClick={props.onClick}
            type={props.type} // Es importante pasar el type="button"
            {...props} 
        >
            {props.children}
        </button>
    );
});


// Ajusta la ruta de importación del componente de prueba
import ProductFilters from 'src/components/molecules/ProductFilters'; 

describe('Pruebas del Componente <ProductFilters />', () => {
    const mockCategories = [
        { id: 1, label: 'Cupcakes', value: 'cupcake' },
        { id: 2, label: 'Tortas', value: 'torta' },
    ];

    const mockFilters = {
        category: 'torta',
        query: 'chocolate',
        minPrice: 5000,
        maxPrice: 15000,
    };

    const mockPriceBounds = {
        min: 1000,
        max: 30000,
    };

    const mockOnFiltersChange = jest.fn();
    const mockOnReset = jest.fn();

    const defaultProps = {
        categories: mockCategories,
        filters: mockFilters,
        onFiltersChange: mockOnFiltersChange,
        onReset: mockOnReset,
        priceBounds: mockPriceBounds,
    };

    beforeEach(() => {
        mockOnFiltersChange.mockClear();
        mockOnReset.mockClear();
    });

    // -------------------------------------------------------------------------

    test('1. Debe renderizar todos los elementos de filtro y el estado inicial', () => {
        render(<ProductFilters {...defaultProps} />);

        // 1. Título/Aria-label de la sección
        expect(screen.getByRole('region', { name: 'Filtros de productos' })).toBeInTheDocument();

        // 2. Filtro de Categoría (Select)
        const categorySelect = screen.getByLabelText('Categoría');
        expect(categorySelect).toHaveValue(mockFilters.category); // Valor inicial 'torta'
        expect(within(categorySelect).getByText('Todas las categorías')).toBeInTheDocument();
        expect(within(categorySelect).getByText('Cupcakes')).toBeInTheDocument();
        expect(within(categorySelect).getByText('Tortas')).toBeInTheDocument();

        // 3. Filtro de Búsqueda (Input type="search")
        const queryInput = screen.getByLabelText('Buscar');
        expect(queryInput).toHaveValue(mockFilters.query); // Valor inicial 'chocolate'

        // 4. Filtros de Precio (Input type="number")
        const minInput = screen.getByLabelText('Precio mínimo');
        expect(minInput).toHaveValue(mockFilters.minPrice); // Valor inicial 5000
        expect(minInput).toHaveAttribute('placeholder', 'Desde 1.000 CLP'); // Formato correcto

        const maxInput = screen.getByLabelText('Precio máximo');
        expect(maxInput).toHaveValue(mockFilters.maxPrice); // Valor inicial 15000
        expect(maxInput).toHaveAttribute('placeholder', 'Hasta 30.000 CLP'); // Formato correcto
        
        // 5. Botón de Reset
        expect(screen.getByText('Limpiar filtros')).toBeInTheDocument();
    });

    // -------------------------------------------------------------------------

    test('2. Debe llamar a onFiltersChange al cambiar el campo de búsqueda (query)', () => {
        render(<ProductFilters {...defaultProps} />);

        const queryInput = screen.getByLabelText('Buscar');
        const newQuery = 'frutilla';
        
        fireEvent.change(queryInput, { target: { name: 'query', value: newQuery } });

        // Verifica que la función de callback se llamó correctamente
        expect(mockOnFiltersChange).toHaveBeenCalledTimes(1);
        
        // Verifica que se envió el estado de filtro actualizado (manteniendo category, pero cambiando query)
        expect(mockOnFiltersChange).toHaveBeenCalledWith({
            ...mockFilters,
            query: newQuery,
        });
    });

    // -------------------------------------------------------------------------

    test('3. Debe llamar a onFiltersChange al cambiar la categoría', () => {
        render(<ProductFilters {...defaultProps} />);

        const categorySelect = screen.getByLabelText('Categoría');
        
        // Cambiamos el valor a 'cupcake'
        fireEvent.change(categorySelect, { target: { name: 'category', value: 'cupcake' } });

        // Verifica la función de callback
        expect(mockOnFiltersChange).toHaveBeenCalledTimes(1);
        
        // Verifica que el estado enviado contiene la nueva categoría y mantiene la búsqueda
        expect(mockOnFiltersChange).toHaveBeenCalledWith({
            ...mockFilters,
            category: 'cupcake',
        });
    });

    // -------------------------------------------------------------------------

    test('4. Debe llamar a onFiltersChange al cambiar el precio mínimo', () => {
        render(<ProductFilters {...defaultProps} />);

        const minInput = screen.getByLabelText('Precio mínimo');
        const newMinPrice = 10000;
        
        fireEvent.change(minInput, { target: { name: 'minPrice', value: newMinPrice } });

        expect(mockOnFiltersChange).toHaveBeenCalledTimes(1);
        
        // El valor de los inputs de tipo 'number' en el DOM se devuelve como string, Jest lo recibe así.
        expect(mockOnFiltersChange).toHaveBeenCalledWith({
            ...mockFilters,
            minPrice: newMinPrice.toString(),
        });
    });
    
    // -------------------------------------------------------------------------

    test('5. Debe llamar a onReset cuando se hace clic en el botón "Limpiar filtros"', () => {
        render(<ProductFilters {...defaultProps} />);

        // Buscamos el mock del botón por el texto
        const resetButton = screen.getByText('Limpiar filtros');
        
        fireEvent.click(resetButton);

        // Verifica que la función onReset fue llamada
        expect(mockOnReset).toHaveBeenCalledTimes(1);
        
        // Verifica que onFiltersChange NO fue llamado
        expect(mockOnFiltersChange).not.toHaveBeenCalled();
    });
});