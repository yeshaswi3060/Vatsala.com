import React from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../utils/constants';
import ProductSlider from './ProductSlider';

interface ProductRowProps {
    title: string;
    products: Product[];
    viewAllLink: string;
}

const ProductRow = ({ title, products, viewAllLink }: ProductRowProps) => {
    if (products.length === 0) return null;

    return (
        <section className="product-row-section">
            <div className="section-header">
                <h2 className="section-title">{title}</h2>
                <Link to={viewAllLink} className="view-all-link">View All</Link>
            </div>
            <ProductSlider products={products} />
        </section>
    );
};

export default ProductRow;
