import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom'; // Para matchers como toBeInTheDocument y toHaveClass

// Asegúrate de que esta ruta de importación sea correcta para tu estructura de archivos.
import Button from '../../components/atoms/Button';

// Las pruebas de estado (state) no son aplicables a este componente, ya que es puramente
// funcional (stateless). Las pruebas se centrarán en Props, Renderizado y Eventos.

describe('Pruebas del Componente <Button />', () => {
  const buttonText = 'Hacer Clic Aquí';
  const mockOnClick = jest.fn();

  // =========================================================================
  // ❖ Pruebas de Renderizado y Propiedades (Props) - Valores por Defecto
  // =========================================================================
  test('1. Debe renderizar el texto (children) y usar clases por defecto', () => {
    // ACT: Renderizar el componente
    render(<Button>{buttonText}</Button>);

    // ASSERT 1: Verificar el renderizado correcto del contenido (children)
    const buttonElement = screen.getByText(buttonText);
    expect(buttonElement).toBeInTheDocument();

    // ASSERT 2: Verificar clases y propiedades por defecto (as='button', variant='primary', size='md')
    expect(buttonElement).toHaveClass('ms-button');
    expect(buttonElement).toHaveClass('ms-button--primary');
    expect(buttonElement).toHaveClass('ms-button--md');
    
    // Verificar propiedad nativa (as='button' -> type='button' por defecto)
    expect(buttonElement).toHaveAttribute('type', 'button');
  });

  // =========================================================================
  // ❖ Pruebas de Propiedades (Props) y Renderizado Condicional
  // =========================================================================
  
  // Tarea: Asegúrate de que el componente de botón recibe correctamente las props.
  test('2. Debe aplicar las clases para variant="secondary" y size="lg"', () => {
    render(
      <Button variant="secondary" size="lg">
        {buttonText}
      </Button>
    );

    const buttonElement = screen.getByText(buttonText);
    
    // Verifica que las clases de las props específicas se apliquen
    expect(buttonElement).toHaveClass('ms-button--secondary');
    expect(buttonElement).toHaveClass('ms-button--lg');

    // Verifica que las clases por defecto no se apliquen
    expect(buttonElement).not.toHaveClass('ms-button--primary');
    expect(buttonElement).not.toHaveClass('ms-button--md');
  });

  // Tarea: Renderizado condicional - Verifica que un elemento se muestre/oculte según las condiciones.
  test('3. Debe renderizar la clase condicional "ms-button--full" cuando fullWidth es true', () => {
    render(<Button fullWidth={true}>{buttonText}</Button>);

    const buttonElement = screen.getByText(buttonText);
    
    // La clase condicional debe estar presente
    expect(buttonElement).toHaveClass('ms-button--full');
    
    // Pruebas de Renderizado condicional negativo
    render(<Button fullWidth={false}>{buttonText} 2</Button>);
    const buttonElement2 = screen.getByText(`${buttonText} 2`);
    expect(buttonElement2).not.toHaveClass('ms-button--full');
  });
  
  test('4. Debe concatenar la prop className con las clases base', () => {
    const customClass = 'mi-clase-personalizada';
    render(<Button className={customClass}>{buttonText}</Button>);

    const buttonElement = screen.getByText(buttonText);
    
    // Debe tener la clase personalizada Y las clases base
    expect(buttonElement).toHaveClass(customClass);
    expect(buttonElement).toHaveClass('ms-button'); 
  });

  // =========================================================================
  // ❖ Pruebas de Eventos (Eventos)
  // =========================================================================

  // Tarea: Simula un clic en un botón y comprueba que se ejecute una función específica (onClick).
  test('5. Debe llamar a la función onClick cuando el usuario hace clic', () => {
    // 1. Arrange: Renderizar con el mock function
    render(<Button onClick={mockOnClick}>{buttonText}</Button>);

    // 2. Act: Simular el evento (en este caso, un clic)
    const buttonElement = screen.getByText(buttonText);
    fireEvent.click(buttonElement);

    // 3. Assert: Verificar que la función mock fue llamada
    expect(mockOnClick).toHaveBeenCalled();
    expect(mockOnClick).toHaveBeenCalledTimes(1);

    // Limpiar el mock después de la prueba si fuera necesario (aunque Jest lo hace automáticamente entre tests)
    mockOnClick.mockClear(); 
  });
  
  // =========================================================================
  // ❖ Pruebas de la prop 'as' y Propiedades Nativas
  // =========================================================================
  
  test('6. Debe renderizar como una etiqueta <a> cuando se usa as="a"', () => {
    const linkText = 'Ir a inicio';
    const href = '/home';
    
    render(
      <Button as="a" href={href}>
        {linkText}
      </Button>
    );

    // Usamos getByRole('link') para buscar la etiqueta <a>
    const linkElement = screen.getByRole('link', { name: linkText });

    // Assert 1: Verificar que es una etiqueta <a> (rol 'link')
    expect(linkElement).toBeInTheDocument();
    expect(linkElement.tagName).toBe('A');

    // Assert 2: Verificar que props nativas (como href) se pasan
    expect(linkElement).toHaveAttribute('href', href);
    
    // Assert 3: Verificar que la prop 'type' NO se pasa, ya que as !== 'button'
    expect(linkElement).not.toHaveAttribute('type');
  });
  
  test('7. Debe aplicar el type="submit" cuando se le pasa y as es el default "button"', () => {
    render(<Button type="submit">{buttonText}</Button>);

    const buttonElement = screen.getByRole('button', { name: buttonText });
    
    // Assert: Verificar que el atributo type es 'submit'
    expect(buttonElement).toHaveAttribute('type', 'submit');
  });
});