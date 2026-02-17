
import { useRef } from 'react';
import type { Product } from '../utils/constants';
import ProductCard from './ProductCard';
import '../styles/components/ProductSlider.css';

interface ProductSliderProps {
    products: Product[];
}

const ProductSlider = ({ products }: ProductSliderProps) => {
    const sliderRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (sliderRef.current) {
            const { current } = sliderRef;
            const scrollAmount = current.clientWidth; // Scroll one screen width
            current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth',
            });
        }
    };

    return (
        <div className="product-slider-container">
            <button className="slider-btn prev" onClick={() => scroll('left')} aria-label="Previous">
                &#10094;
            </button>
            <div className="product-slider" ref={sliderRef}>
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
            <button className="slider-btn next" onClick={() => scroll('right')} aria-label="Next">
                &#10095;
            </button>
        </div>
    );
};

export default ProductSlider;
