
import React, { useState, useEffect } from 'react';
import '../styles/components/ProductExtendedDetails.css';
import type { Product } from '../utils/constants';

interface ProductExtendedDetailsProps {
    product: Product;
}

const ProductExtendedDetails: React.FC<ProductExtendedDetailsProps> = ({ product }) => {
    const [activeTab, setActiveTab] = useState<'description' | 'specifications' | 'reviews'>('description');

    const [features, setFeatures] = useState<string[]>([
        "Premium Quality Material",
        "Handcrafted Finish",
        "Eco-friendly process",
        "Perfect Fit Guarantee"
    ]);

    const [specs, setSpecs] = useState<{ label: string, value: string }[]>([
        { label: 'Material', value: 'Cotton / Silk Blend' },
        { label: 'Care', value: 'Dry Clean Only' },
        { label: 'Origin', value: 'India' }
    ]);

    const [reviews, setReviews] = useState<{ reviewer: string, rating: number, text: string, date: string }[]>([
        { reviewer: "Sarah Jenkins", rating: 5, text: "The quality is better than anything I've tried. Perfect for my daily wear and special occasions. The gold embroidery is stunning in person!", date: "2024-03-15" },
        { reviewer: "Mark Reynolds", rating: 5, text: "Exactly as advertised. I only buy from Allcloth now. The fit is perfect and the fabric feels incredibly premium.", date: "2024-03-10" }
    ]);

    useEffect(() => {
        if (!product.id) return;

        const loadExtension = async () => {
            try {
                // Remove gid://shopify/Product/ prefix securely
                const cleanId = product.id.replace('gid://shopify/Product/', '');

                const response = await fetch(`/api/product-extensions?productId=${cleanId}`);
                if (!response.ok) return;

                const extension = await response.json();

                if (extension) {
                    if (extension.features && extension.features.length > 0) setFeatures(extension.features);
                    if (extension.specifications && extension.specifications.length > 0) setSpecs(extension.specifications);
                    if (extension.reviews && extension.reviews.length > 0) setReviews(extension.reviews);
                }
            } catch (error) {
                console.error("Failed to load product extensions from MongoDB:", error);
            }
        };

        loadExtension();
    }, [product.id]);

    return (
        <section className="product-extended-details section">
            <div className="container">
                {/* Tabs Header */}
                <div className="details-tabs">
                    <button
                        className={`tab-btn ${activeTab === 'description' ? 'active' : ''}`}
                        onClick={() => setActiveTab('description')}
                    >
                        Description
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'specifications' ? 'active' : ''}`}
                        onClick={() => setActiveTab('specifications')}
                    >
                        Specifications
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
                        onClick={() => setActiveTab('reviews')}
                    >
                        Reviews ({reviews.length > 0 ? reviews.length + 126 : 128})
                    </button>
                </div>

                <div className="tab-content-wrapper">
                    {/* Description Tab */}
                    {activeTab === 'description' && (
                        <div className="tab-pane fade-in">
                            <div className="feature-block-grid">
                                <div className="feature-content">
                                    <h2 className="feature-title">Unrivaled Quality & Craftsmanship</h2>

                                    <ul className="feature-list">
                                        {features.map((feat, i) => (
                                            <li key={i}>
                                                <span className="check-icon">✓</span>
                                                <span>{feat}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="feature-image">
                                    <img src={product.image} alt="Product Detail Shot" />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Specifications Tab */}
                    {activeTab === 'specifications' && (
                        <div className="tab-pane fade-in">
                            <h3 className="specs-title">Product Specifications</h3>
                            <div className="specs-grid">
                                {specs.map((spec, i) => (
                                    <div className="spec-item" key={i}>
                                        <span className="spec-label">{spec.label}</span>
                                        <span className="spec-value">{spec.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Reviews Tab - Static/Mock for now as User didn't ask to edit reviews */}
                    {activeTab === 'reviews' && (
                        <div className="tab-pane fade-in">
                            <div className="reviews-header">
                                <h2 className="reviews-title">Customer Reviews</h2>
                                <button className="btn btn-outline">Write a Review</button>
                            </div>

                            <div className="reviews-layout">
                                {/* Rating Summary Box */}
                                <div className="rating-summary-box">
                                    <div className="rating-big">4.8</div>
                                    <div className="rating-stars">★★★★★</div>
                                    <div className="rating-text">Based on 128 Reviews</div>

                                    <div className="rating-bars">
                                        <div className="rating-bar-row">
                                            <span>5</span>
                                            <div className="bar-track"><div className="bar-fill" style={{ width: '82%' }}></div></div>
                                            <span>82%</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Reviews Grid */}
                                <div className="reviews-grid">
                                    {reviews.map((review, i) => (
                                        <div className="review-card" key={i}>
                                            <div className="reviewer-info">
                                                <div className={`reviewer-avatar ${i % 2 === 0 ? '' : 'blue'}`}>
                                                    {review.reviewer.substring(0, 2).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="reviewer-name">{review.reviewer}</div>
                                                    <div className="review-stars-small">
                                                        {'★'.repeat(Math.floor(review.rating))}
                                                        {'☆'.repeat(5 - Math.floor(review.rating))}
                                                    </div>
                                                </div>
                                            </div>
                                            <p className="review-text">"{review.text}"</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default ProductExtendedDetails;

