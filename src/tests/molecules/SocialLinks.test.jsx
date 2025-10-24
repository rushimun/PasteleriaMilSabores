import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom'; 

// Ajusta la ruta de importación a donde se encuentre tu componente
import SocialLinks from 'src/components/molecules/SocialLinks'; 

describe('Pruebas del Componente <SocialLinks />', () => {
    // Definimos un array de links de prueba con todos los tipos de íconos
    const mockLinks = [
        { 
            id: 'f1', 
            icon: 'facebook', 
            href: 'https://fb.com/bakery', 
            label: 'Síguenos en Facebook',
            color: '#3b5998'
        },
        { 
            id: 'i2', 
            icon: 'instagram', 
            href: 'https://instagram.com/bakery', 
            label: 'Síguenos en Instagram',
            color: '#c32aa3'
        },
        { 
            id: 'w3', 
            icon: 'whatsapp', 
            href: 'https://wa.me/56912345678', 
            label: 'Contáctanos por WhatsApp',
            color: '#25d366'
        },
    ];

    const defaultProps = {
        links: mockLinks,
    };

    // -------------------------------------------------------------------------

    test('1. Debe renderizar la lista completa de enlaces con la estructura correcta', () => {
        render(<SocialLinks {...defaultProps} />);

        // 1. Verificar la lista contenedora (ul)
        const listElement = screen.getByRole('list');
        expect(listElement).toBeInTheDocument();
        expect(listElement).toHaveClass('social-links');

        // 2. Verificar que haya 3 elementos de lista (li)
        const listItems = screen.getAllByRole('listitem');
        expect(listItems).toHaveLength(mockLinks.length);
    });

    // -------------------------------------------------------------------------

    test('2. Cada enlace debe tener los atributos de accesibilidad y seguridad correctos', () => {
        render(<SocialLinks {...defaultProps} />);

        mockLinks.forEach(link => {
            // Buscamos cada enlace usando su aria-label
            const anchor = screen.getByRole('link', { name: link.label });

            // 1. Atributo href
            expect(anchor).toHaveAttribute('href', link.href);

            // 2. Atributos de seguridad y apertura en nueva pestaña
            expect(anchor).toHaveAttribute('target', '_blank');
            expect(anchor).toHaveAttribute('rel', 'noreferrer');
            
            // 3. Clase CSS
            expect(anchor).toHaveClass('social-links__anchor');

            // 4. Estilo inline (color)
            expect(anchor).toHaveStyle(`background-color: ${link.color}`);
        });
    });

    // -------------------------------------------------------------------------

    test('3. Debe renderizar el ícono SVG correspondiente a cada red social', () => {
        render(<SocialLinks {...defaultProps} />);

        // 1. Ícono de Facebook
        const facebookLink = screen.getByRole('link', { name: /facebook/i });
        // Buscamos el SVG dentro del enlace. Los SVGs son gráficos genéricos.
        const facebookIcon = facebookLink.querySelector('svg');
        expect(facebookIcon).toBeInTheDocument();
        expect(facebookIcon).toHaveAttribute('viewBox', '0 0 24 24');
        expect(facebookIcon).toHaveAttribute('aria-hidden', 'true'); // Oculto para lectores
        
        // 2. Ícono de Instagram
        const instagramLink = screen.getByRole('link', { name: /instagram/i });
        expect(instagramLink.querySelector('svg')).toBeInTheDocument();
        
        // 3. Ícono de WhatsApp
        const whatsappLink = screen.getByRole('link', { name: /whatsapp/i });
        expect(whatsappLink.querySelector('svg')).toBeInTheDocument();
    });

    // -------------------------------------------------------------------------

    test('4. Debe renderizar correctamente si la lista de links está vacía', () => {
        render(<SocialLinks links={[]} />);

        // Verifica que la lista contenedora (ul) existe
        expect(screen.getByRole('list')).toBeInTheDocument();

        // Verifica que no hay elementos de lista (li)
        expect(screen.queryAllByRole('listitem')).toHaveLength(0);
        
        // Verifica que no hay enlaces (a)
        expect(screen.queryAllByRole('link')).toHaveLength(0);
    });
});