import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'; 

// =========================================================================
// ❖ MOCKING DE COMPONENTES DEPENDIENTES (Button)
// 💡 SOLUCIÓN FINAL: Usamos la RUTA ABSOLUTA/ALIAS que Jest está buscando
//    para forzar la simulación y evitar el error "Cannot find module".
// =========================================================================
jest.mock('src/components/atoms/Button', () => { 
// Si la línea de importación real es '../atoms/Button', esta es la ruta
// absoluta que Jest está intentando encontrar y simular.

    // Retorna una función de componente simple que recibe props y las renderiza
    return (props) => (
        <a 
            data-testid="mock-button" 
            href={props.href} 
            className={`mock-button mock-variant-${props.variant} mock-size-${props.size}`}
            {...props} 
        >
            {props.children}
        </a>
    );
});


// Ajusta la ruta de importación del componente de prueba
import NewsCard from 'src/components/molecules/NewsCard'; 

describe('Pruebas del Componente <NewsCard />', () => {
    const defaultProps = {
        title: 'Nueva Colección de Verano',
        excerpt: 'Descubre los sabores frescos y frutales que hemos preparado para ti en esta temporada.',
        image: '/img/news-summer.jpg',
        href: '/noticia/verano',
    };

// -------------------------------------------------------------------------
    
    test('1. Debe renderizar el título, extracto y la imagen con atributos correctos', () => {
        render(<NewsCard {...defaultProps} />);

        const titleElement = screen.getByRole('heading', { level: 3, name: defaultProps.title });
        expect(titleElement).toBeInTheDocument();
        
        const excerptElement = screen.getByText(defaultProps.excerpt);
        expect(excerptElement).toBeInTheDocument();

        const imageElement = screen.getByRole('img', { name: defaultProps.title });
        expect(imageElement).toBeInTheDocument();
        expect(imageElement).toHaveAttribute('src', defaultProps.image);
        expect(imageElement).toHaveAttribute('loading', 'lazy');
    });

// -------------------------------------------------------------------------

    test('2. Debe renderizar el botón "Leer más" con los atributos de link correctos', () => {
        render(<NewsCard {...defaultProps} />);

        const buttonElement = screen.getByText('Leer más');
        
        expect(buttonElement).toHaveAttribute('href', defaultProps.href);
        
        expect(buttonElement).toHaveClass('mock-size-sm');
        expect(buttonElement).toHaveClass('mock-variant-secondary');
    });

// -------------------------------------------------------------------------

    test('3. Debe usar el valor por defecto "#" si la prop "href" está ausente', () => {
        const propsWithoutHref = { ...defaultProps, href: undefined };
        render(<NewsCard {...propsWithoutHref} />);

        const buttonElement = screen.getByText('Leer más');
        
        expect(buttonElement).toHaveAttribute('href', '#');
    });

// -------------------------------------------------------------------------

    test('4. Debe aplicar la clase CSS principal al elemento article', () => {
        render(<NewsCard {...defaultProps} />);

        const articleElement = screen.getByRole('article');
        
        expect(articleElement).toHaveClass('news-card');
    });
});