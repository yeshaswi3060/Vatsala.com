import { Link } from 'react-router-dom';
import '../styles/components/CategoryRail.css';

interface CategoryRailProps {
    data?: any;
}

const CategoryRail = ({ data }: CategoryRailProps) => {
    // Determine the categories: fallback to a default array if api hasn't responded or has no category_rail
    const railItems = data?.category_rail || [
        { name: 'Sarees', imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&auto=format&fit=crop&q=60', linkUrl: '/shop?category=Sarees' },
        { name: 'Lehengas', imageUrl: 'https://images.unsplash.com/photo-1583391733958-377742e970a9?w=400&auto=format&fit=crop&q=60', linkUrl: '/shop?category=Lehengas' },
        { name: 'Suits', imageUrl: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=400&auto=format&fit=crop&q=60', linkUrl: '/shop?category=Suits' },
        { name: 'Jewelry', imageUrl: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&auto=format&fit=crop&q=60', linkUrl: '/shop?category=Jewelry' },
        { name: 'New In', imageUrl: 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=400&auto=format&fit=crop&q=60', linkUrl: '/shop?sort=newest' },
        { name: 'Sale', imageUrl: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=400&auto=format&fit=crop&q=60', linkUrl: '/shop?sort=price_asc' }
    ];

    return (
        <div className="category-rail-container">
            <div className="category-rail">
                {railItems.map((cat: any, index: number) => (
                    <Link to={cat.linkUrl} key={index} className="category-item">
                        <div className="category-image-wrapper">
                            <img src={cat.imageUrl} alt={cat.name} className="category-image" />
                        </div>
                        <span className="category-name">{cat.name}</span>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default CategoryRail;
