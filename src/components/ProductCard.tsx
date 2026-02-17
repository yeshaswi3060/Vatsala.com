import { Link } from 'react-router-dom';
import { type Product, formatPrice } from '../utils/constants';
import '../styles/components/ProductCard.css';

interface ProductCardProps {
    product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
    const discountPercentage = product.originalPrice
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0;

    return (
        <Link to={`/product/${product.handle}`} className="product-card">
            <div className="product-image-wrapper">
                {product.image ? (
                    <img
                        className="product-image"
                        src={product.image}
                        alt={product.name}
                        loading="lazy"
                    />
                ) : (
                    <div
                        className="product-image"
                        style={{
                            background: getGradientForCategory(product.category)
                        }}
                    >
                        <span className="product-image-text">{product.category}</span>
                    </div>
                )}
                {/* Priority: Custom Badge > Discount Badge */}
                {product.badge ? (
                    <span className={`product-badge badge-${product.badge.toLowerCase()}`}>
                        {product.badge}
                    </span>
                ) : discountPercentage > 0 ? (
                    <span className="product-badge badge-sale">
                        {discountPercentage}% Off
                    </span>
                ) : null}
            </div>
            <div className="product-info">
                <p className="product-category">{product.category}</p>
                <h3 className="product-name">{product.name}</h3>
                <div className="product-pricing">
                    {product.originalPrice && (
                        <>
                            <span className="mrp-label">M.R.P:</span>
                            <span className="product-original-price">{formatPrice(product.originalPrice)}</span>
                        </>
                    )}
                    <span className="product-price">{formatPrice(product.price)}</span>
                    {discountPercentage > 0 && (
                        <span className="product-discount-text">{discountPercentage}% OFF</span>
                    )}
                </div>
            </div>
        </Link>
    );
};

// Helper function to get gradient based on category (fallback when no image)
const getGradientForCategory = (category: string): string => {
    const gradients: Record<string, string> = {
        'Sarees': 'linear-gradient(135deg, #C71585 0%, #FF1493 50%, #FFD700 100%)',
        'Lehengas': 'linear-gradient(135deg, #8B0000 0%, #DC143C 50%, #FFD700 100%)',
        'Suits': 'linear-gradient(135deg, #4B0082 0%, #9370DB 50%, #FFB6C1 100%)',
        'Kurtis': 'linear-gradient(135deg, #FF6347 0%, #FF8C00 50%, #FFD700 100%)'
    };
    return gradients[category] || gradients['Sarees'];
};

export default ProductCard;
