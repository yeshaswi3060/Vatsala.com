import { Link } from 'react-router-dom';
import '../styles/components/CategoryRail.css';

const categories = [
    { name: 'Sarees', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&auto=format&fit=crop&q=60', path: '/shop?category=Sarees' },
    { name: 'Lehengas', image: 'https://images.unsplash.com/photo-1583391733958-377742e970a9?w=400&auto=format&fit=crop&q=60', path: '/shop?category=Lehengas' },
    { name: 'Suits', image: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=400&auto=format&fit=crop&q=60', path: '/shop?category=Suits' },
    { name: 'Jewelry', image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&auto=format&fit=crop&q=60', path: '/shop?category=Jewelry' },
    { name: 'New In', image: 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=400&auto=format&fit=crop&q=60', path: '/shop?sort=newest' },
    { name: 'Sale', image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=400&auto=format&fit=crop&q=60', path: '/shop?sort=price_asc' },
];

const CategoryRail = () => {
    return (
        <div className="category-rail-container">
            <div className="category-rail">
                {categories.map((cat, index) => (
                    <Link to={cat.path} key={index} className="category-item">
                        <div className="category-image-wrapper">
                            <img src={cat.image} alt={cat.name} className="category-image" />
                        </div>
                        <span className="category-name">{cat.name}</span>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default CategoryRail;
