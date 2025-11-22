import { Link } from 'react-router-dom';
import { Product, formatPrice } from '../utils/constants';
import '../styles/components/ProductCard.css';

interface ProductCardProps {
    product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
    return (
        <Link to={`/product/${product.id}`} className="product-card">
            <div className="product-image-wrapper">
                <div
                    className="product-image"
                    style={{
                        background: getGradientForCategory(product.category)
                    }}
                >
                    <span className="product-image-text">{product.category}</span>
                </div>
                {product.badge && (
                    <span className={`product-badge badge-${product.badge.toLowerCase()}`}>
                        {product.badge}
                    </span>
                )}
            </div>
            <div className="product-info">
                <p className="product-category">{product.category}</p>
                <h3 className="product-name">{product.name}</h3>
                <div className="product-pricing">
                    <span className="product-price">{formatPrice(product.price)}</span>
                    {product.originalPrice && (
                        <span className="product-original-price">{formatPrice(product.originalPrice)}</span>
                    )}
                </div>
            </div>
        </Link>
    );
};

// Helper function to get gradient based on category
const getGradientForCategory = (category: string): string => {
    const gradients = {
        'Sarees': 'linear-gradient(135deg, #C71585 0%, #FF1493 50%, #FFD700 100%)',
        'Lehengas': 'linear-gradient(135deg, #8B0000 0%, #DC143C 50%, #FFD700 100%)',
        'Suits': 'linear-gradient(135deg, #4B0082 0%, #9370DB 50%, #FFB6C1 100%)',
        'Kurtis': 'linear-gradient(135deg, #FF6347 0%, #FF8C00 50%, #FFD700 100%)'
    };
    return gradients[category as keyof typeof gradients] || gradients['Sarees'];
};

export default ProductCard;
