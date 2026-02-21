import { useState, useEffect } from 'react';

import '../../styles/pages/admin/AdminDashboard.css'; // Reuse dashboard styles for cards
import '../../styles/pages/admin/AdminSettings.css';

export interface HomepageSettings {
    hero: { imageUrl: string; title: string; subtitle: string; };
    side_banner: { imageUrl: string; title: string; subtitle: string; linkUrl: string; };
    categories: {
        sarees: { imageUrl: string; description: string };
        lehengas: { imageUrl: string; description: string };
        suits: { imageUrl: string; description: string };
    };
    category_rail: { name: string; imageUrl: string; linkUrl: string; }[];
}

const fetchHomepageSettings = async (): Promise<HomepageSettings> => {
    const res = await fetch('/api/settings');
    if (!res.ok) throw new Error('Fetch failed');
    return await res.json();
};

const updateHomepageSettings = async (settings: HomepageSettings): Promise<boolean> => {
    try {
        const res = await fetch('/api/settings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(settings)
        });
        return res.ok;
    } catch {
        return false;
    }
};

const ProgressBar = ({ progress }: { progress: number }) => (
    <div className="upload-progress-container" style={{ marginTop: '10px', marginBottom: '10px' }}>
        <p className="uploading-text" style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#666', fontWeight: 500 }}>Uploading image... {progress}%</p>
        <div style={{ width: '100%', backgroundColor: '#eee', height: '6px', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ width: `${progress}%`, backgroundColor: '#dca450', height: '100%', transition: 'width 0.2s ease-out' }}></div>
        </div>
    </div>
);

const AdminSettings = () => {
    const [settings, setSettings] = useState<HomepageSettings | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });
    const [uploadingImage, setUploadingImage] = useState<string | null>(null); // path key of uploading image
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const [imageWarning, setImageWarning] = useState<{ path: string, text: string } | null>(null);

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        setLoading(true);
        const data = await fetchHomepageSettings();
        setSettings(data);
        setLoading(false);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!settings) return;

        setSaving(true);
        setMessage({ text: '', type: '' });

        const success = await updateHomepageSettings(settings);
        if (success) {
            setMessage({ text: 'Settings updated successfully!', type: 'success' });
            setTimeout(() => setMessage({ text: '', type: '' }), 3000);
        } else {
            setMessage({ text: 'Failed to update settings. Please try again.', type: 'error' });
        }
        setSaving(false);
    };

    const handleImageUpload = (
        e: React.ChangeEvent<HTMLInputElement>,
        objectPath: string,
        setterFn: (url: string) => void,
        recommendedW: number,
        recommendedH: number
    ) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Clear previous warnings for this specific input
        if (imageWarning?.path === objectPath) setImageWarning(null);

        // Validate image dimensions locally before uploading
        const objectUrl = URL.createObjectURL(file);
        const img = new Image();
        img.onload = () => {
            URL.revokeObjectURL(objectUrl);
            if (img.width !== recommendedW || img.height !== recommendedH) {
                setImageWarning({
                    path: objectPath,
                    text: `⚠️ Warning: Uploaded image is ${img.width}x${img.height}px. For optimal layout, the exact recommended size is ${recommendedW}x${recommendedH}px.`
                });
            }
        };
        img.src = objectUrl;

        setUploadingImage(objectPath);
        setMessage({ text: '', type: '' });
        setUploadProgress(0);

        const formData = new FormData();
        formData.append('image', file);

        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/api/upload', true);

        xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
                const percentComplete = Math.round((event.loaded / event.total) * 100);
                setUploadProgress(percentComplete);
            }
        };

        xhr.onload = () => {
            if (xhr.status === 200) {
                try {
                    const data = JSON.parse(xhr.responseText);
                    setterFn(data.url);
                } catch (err) {
                    setMessage({ text: 'Failed to upload image. Please try again.', type: 'error' });
                }
            } else {
                setMessage({ text: 'Failed to upload image. Please try again.', type: 'error' });
            }
            setUploadingImage(null);
            e.target.value = '';
            setUploadProgress(0);
        };

        xhr.onerror = () => {
            setMessage({ text: 'Failed to upload image. Network error.', type: 'error' });
            setUploadingImage(null);
            e.target.value = '';
            setUploadProgress(0);
        };

        xhr.send(formData);
    };

    if (loading || !settings) return <div className="loading-spinner">Loading settings...</div>;

    return (
        <div className="admin-dashboard admin-settings">
            <div className="dashboard-header">
                <div>
                    <h1>CMS Settings</h1>
                    <p>Manage homepage banners, text, and images.</p>
                </div>
            </div>

            {message.text && (
                <div className={`alert alert-${message.type}`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSave} className="settings-form">

                {/* 1. MAIN HERO BANNER */}
                <div className="table-section mb-2">
                    <div className="card-header">
                        <h3>Main Hero Banner</h3>
                    </div>
                    <div className="form-group-row">
                        <div className="form-group mb-1">
                            <label>Title</label>
                            <input
                                type="text"
                                className="form-control"
                                value={settings.hero.title}
                                onChange={(e) => setSettings({ ...settings, hero: { ...settings.hero, title: e.target.value } })}
                                required
                            />
                        </div>
                        <div className="form-group mb-1">
                            <label>Subtitle</label>
                            <input
                                type="text"
                                className="form-control"
                                value={settings.hero.subtitle}
                                onChange={(e) => setSettings({ ...settings, hero: { ...settings.hero, subtitle: e.target.value } })}
                                required
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Upload Hero Image <span style={{ fontSize: '0.85rem', color: '#888', fontWeight: 400 }}>(Recommended: 1440x900 px)</span></label>
                        <input
                            type="file"
                            accept="image/*"
                            className="form-control file-input"
                            onChange={(e) => handleImageUpload(e, 'hero', (url) => setSettings({ ...settings, hero: { ...settings.hero, imageUrl: url } }), 1440, 900)}
                        />
                        {imageWarning?.path === 'hero' && <p style={{ color: '#d9534f', fontSize: '0.9rem', margin: '5px 0' }}>{imageWarning.text}</p>}
                        {uploadingImage === 'hero' && <ProgressBar progress={uploadProgress} />}
                        {settings.hero.imageUrl && (
                            <img src={settings.hero.imageUrl} alt="Hero Preview" className="img-preview" />
                        )}
                    </div>
                </div>

                {/* 2. SIDE BANNER */}
                <div className="table-section mb-2">
                    <div className="card-header">
                        <h3>Side Banner (Hero Grid)</h3>
                    </div>
                    <div className="form-group-row">
                        <div className="form-group mb-1">
                            <label>Title</label>
                            <input
                                type="text"
                                className="form-control"
                                value={settings.side_banner?.title || ''}
                                onChange={(e) => setSettings({ ...settings, side_banner: { ...settings.side_banner, title: e.target.value } })}
                                required
                            />
                        </div>
                        <div className="form-group mb-1">
                            <label>Subtitle</label>
                            <input
                                type="text"
                                className="form-control"
                                value={settings.side_banner?.subtitle || ''}
                                onChange={(e) => setSettings({ ...settings, side_banner: { ...settings.side_banner, subtitle: e.target.value } })}
                                required
                            />
                        </div>
                    </div>
                    <div className="form-group mb-1">
                        <label>Link Default URL</label>
                        <input
                            type="text"
                            className="form-control"
                            value={settings.side_banner?.linkUrl || ''}
                            onChange={(e) => setSettings({ ...settings, side_banner: { ...settings.side_banner, linkUrl: e.target.value } })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Upload Side Banner Image <span style={{ fontSize: '0.85rem', color: '#888', fontWeight: 400 }}>(Recommended: 800x1000 px)</span></label>
                        <input
                            type="file"
                            accept="image/*"
                            className="form-control file-input"
                            onChange={(e) => handleImageUpload(e, 'side_banner', (url) => setSettings({ ...settings, side_banner: { ...settings.side_banner, imageUrl: url } }), 800, 1000)}
                        />
                        {imageWarning?.path === 'side_banner' && <p style={{ color: '#d9534f', fontSize: '0.9rem', margin: '5px 0' }}>{imageWarning.text}</p>}
                        {uploadingImage === 'side_banner' && <ProgressBar progress={uploadProgress} />}
                        {settings.side_banner?.imageUrl && (
                            <img src={settings.side_banner.imageUrl} alt="Side Banner Preview" className="img-preview" />
                        )}
                    </div>
                </div>

                {/* 3. COLLECTION IMAGES & TEXT */}
                <div className="table-section mb-2">
                    <div className="card-header">
                        <h3>Shop By Category Images</h3>
                    </div>

                    {/* Sarees */}
                    <div className="category-edit-block">
                        <h4>Sarees Category</h4>
                        <div className="form-group-row">
                            <div className="form-group">
                                <label>Description</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={settings.categories.sarees.description}
                                    onChange={(e) => setSettings({
                                        ...settings,
                                        categories: { ...settings.categories, sarees: { ...settings.categories.sarees, description: e.target.value } }
                                    })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Upload Saree Category Image <span style={{ fontSize: '0.85rem', color: '#888', fontWeight: 400 }}>(Recommended: 800x1200 px)</span></label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="form-control file-input"
                                    onChange={(e) => handleImageUpload(e, 'saree', (url) => setSettings({ ...settings, categories: { ...settings.categories, sarees: { ...settings.categories.sarees, imageUrl: url } } }), 800, 1200)}
                                />
                                {imageWarning?.path === 'saree' && <p style={{ color: '#d9534f', fontSize: '0.9rem', margin: '5px 0' }}>{imageWarning.text}</p>}
                                {uploadingImage === 'saree' && <ProgressBar progress={uploadProgress} />}
                                {settings.categories.sarees.imageUrl && (
                                    <img src={settings.categories.sarees.imageUrl} alt="Preview" className="img-preview sm-preview" />
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Lehengas */}
                    <div className="category-edit-block mt-2">
                        <h4>Lehengas Category</h4>
                        <div className="form-group-row">
                            <div className="form-group">
                                <label>Description</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={settings.categories.lehengas.description}
                                    onChange={(e) => setSettings({
                                        ...settings,
                                        categories: { ...settings.categories, lehengas: { ...settings.categories.lehengas, description: e.target.value } }
                                    })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Upload Lehenga Category Image <span style={{ fontSize: '0.85rem', color: '#888', fontWeight: 400 }}>(Recommended: 800x1200 px)</span></label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="form-control file-input"
                                    onChange={(e) => handleImageUpload(e, 'lehenga', (url) => setSettings({ ...settings, categories: { ...settings.categories, lehengas: { ...settings.categories.lehengas, imageUrl: url } } }), 800, 1200)}
                                />
                                {imageWarning?.path === 'lehenga' && <p style={{ color: '#d9534f', fontSize: '0.9rem', margin: '5px 0' }}>{imageWarning.text}</p>}
                                {uploadingImage === 'lehenga' && <ProgressBar progress={uploadProgress} />}
                                {settings.categories.lehengas.imageUrl && (
                                    <img src={settings.categories.lehengas.imageUrl} alt="Preview" className="img-preview sm-preview" />
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Suits */}
                    <div className="category-edit-block mt-2">
                        <h4>Suits Category</h4>
                        <div className="form-group-row">
                            <div className="form-group">
                                <label>Description</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={settings.categories.suits.description}
                                    onChange={(e) => setSettings({
                                        ...settings,
                                        categories: { ...settings.categories, suits: { ...settings.categories.suits, description: e.target.value } }
                                    })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Upload Suits Category Image <span style={{ fontSize: '0.85rem', color: '#888', fontWeight: 400 }}>(Recommended: 800x1200 px)</span></label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="form-control file-input"
                                    onChange={(e) => handleImageUpload(e, 'suit', (url) => setSettings({ ...settings, categories: { ...settings.categories, suits: { ...settings.categories.suits, imageUrl: url } } }), 800, 1200)}
                                />
                                {imageWarning?.path === 'suit' && <p style={{ color: '#d9534f', fontSize: '0.9rem', margin: '5px 0' }}>{imageWarning.text}</p>}
                                {uploadingImage === 'suit' && <ProgressBar progress={uploadProgress} />}
                                {settings.categories.suits.imageUrl && (
                                    <img src={settings.categories.suits.imageUrl} alt="Preview" className="img-preview sm-preview" />
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 4. HOME CATEGORY RAIL */}
                <div className="table-section mb-2">
                    <div className="card-header">
                        <h3>Homepage Link Rail</h3>
                        <p style={{ marginTop: '0.2rem', color: '#666', fontSize: '0.9rem' }}>The 6 circular linked categories on the homepage.</p>
                    </div>
                    {settings.category_rail?.map((railItem, index) => (
                        <div className="category-edit-block mt-2" key={index}>
                            <h4>Rail Item {index + 1}: {railItem.name}</h4>
                            <div className="form-group-row">
                                <div className="form-group">
                                    <label>Display Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={railItem.name}
                                        onChange={(e) => {
                                            const newRail = [...settings.category_rail];
                                            newRail[index].name = e.target.value;
                                            setSettings({ ...settings, category_rail: newRail });
                                        }}
                                        required
                                    />
                                    <label style={{ marginTop: '1rem' }}>Link URL</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={railItem.linkUrl}
                                        onChange={(e) => {
                                            const newRail = [...settings.category_rail];
                                            newRail[index].linkUrl = e.target.value;
                                            setSettings({ ...settings, category_rail: newRail });
                                        }}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Upload Rail Image <span style={{ fontSize: '0.85rem', color: '#888', fontWeight: 400 }}>(Recommended: 400x400 px)</span></label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="form-control file-input"
                                        onChange={(e) => handleImageUpload(e, `rail_${index}`, (url) => {
                                            const newRail = [...settings.category_rail];
                                            newRail[index].imageUrl = url;
                                            setSettings({ ...settings, category_rail: newRail });
                                        }, 400, 400)}
                                    />
                                    {imageWarning?.path === `rail_${index}` && <p style={{ color: '#d9534f', fontSize: '0.9rem', margin: '5px 0' }}>{imageWarning.text}</p>}
                                    {uploadingImage === `rail_${index}` && <ProgressBar progress={uploadProgress} />}
                                    {railItem.imageUrl && (
                                        <img src={railItem.imageUrl} alt="Preview" className="img-preview sm-preview" style={{ width: '100px', height: '100px', borderRadius: '50%' }} />
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="form-actions">
                    <button type="submit" className="btn btn-primary btn-lg" disabled={saving}>
                        {saving ? 'Saving...' : 'Save Settings'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AdminSettings;
