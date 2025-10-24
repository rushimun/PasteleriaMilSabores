import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'; 

// Ajusta la ruta de importación a donde se encuentre tu componente
import ReviewCard from 'src/components/molecules/ReviewCard'; 

describe('Pruebas del Componente <ReviewCard />', () => {
    // Definimos un objeto de review con 4 de 5 estrellas
    const mockReview = {
        author: 'Andrea M.',
        stars: 4,
        comment: 'El mejor pastel de tres leches que he probado en mi vida. ¡Felicidades!',
    };

    const defaultProps = {
        review: mockReview,
    };

    // -------------------------------------------------------------------------

    test('1. Debe renderizar el comentario y el autor correctamente', () => {
        render(<ReviewCard {...defaultProps} />);

        // 1. Comentario (Nota: Buscamos el comentario sin las comillas que React agrega)
        expect(screen.getByText(`“${mockReview.comment}”`)).toBeInTheDocument();
        
        // 2. Autor (Buscamos el autor con el prefijo "- ")
        expect(screen.getByText(`- ${mockReview.author}`)).toBeInTheDocument();

        // 3. Clase principal
        expect(screen.getByRole('article')).toHaveClass('review-card');
    });

    // -------------------------------------------------------------------------

    test('2. Debe renderizar la cantidad correcta de estrellas llenas y vacías (4/5)', () => {
        render(<ReviewCard {...defaultProps} />);
        
        // Estrellas llenas (4 de 5): ★★★★
        const filledStarsText = '★★★★'; 
        const filledStarsElement = screen.getByText(filledStarsText);
        expect(filledStarsElement).toBeInTheDocument();
        expect(filledStarsElement).toHaveClass('review-card__stars--filled');

        // Estrellas vacías (1 de 5): ☆
        const emptyStarsText = '☆';
        const emptyStarsElement = screen.getByText(emptyStarsText);
        expect(emptyStarsElement).toBeInTheDocument();
        expect(emptyStarsElement).toHaveClass('review-card__stars--empty');
    });

    // -------------------------------------------------------------------------

    test('3. Debe renderizar 5 estrellas llenas y 0 vacías para una puntuación de 5/5', () => {
        const fiveStarReview = { ...mockReview, stars: 5 };
        render(<ReviewCard review={fiveStarReview} />);
        
        // 5 Estrellas llenas: ★★★★★
        expect(screen.getByText('★★★★★')).toBeInTheDocument();

        // 0 Estrellas vacías: No debe haber texto '☆'
        // Usamos queryByText, que devuelve null si no lo encuentra (lo que esperamos)
        expect(screen.queryByText('☆')).not.toBeInTheDocument(); 
    });

    // -------------------------------------------------------------------------

    test('4. Debe renderizar 0 estrellas llenas y 5 vacías para una puntuación de 0/5', () => {
        const zeroStarReview = { ...mockReview, stars: 0 };
        render(<ReviewCard review={zeroStarReview} />);
        
        // 0 Estrellas llenas: No debe haber texto '★'
        expect(screen.queryByText('★')).not.toBeInTheDocument();

        // 5 Estrellas vacías: ☆☆☆☆☆
        expect(screen.getByText('☆☆☆☆☆')).toBeInTheDocument(); 
    });

    // -------------------------------------------------------------------------

    test('5. El contenedor de estrellas debe tener aria-hidden="true" para accesibilidad', () => {
        render(<ReviewCard {...defaultProps} />);
        
        // Buscamos el div contenedor de las estrellas
        const starsContainer = screen.getByRole('article').querySelector('.review-card__stars');
        
        // La información de las estrellas no debe ser leída por lectores de pantalla
        expect(starsContainer).toHaveAttribute('aria-hidden', 'true');
    });
});