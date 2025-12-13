import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '../components/layout/AdminLayout';
import { getNextAvailablePageNumber, createPage, getCategories } from '../services/api';
import '../styles/teletext.css';

function AdminPageNew() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    const [formData, setFormData] = useState({
        pageNumber: '',
        title: '',
        category: '',
        content: ''
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [loadingNextNumber, setLoadingNextNumber] = useState(false);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const data = await getCategories();
            setCategories(data);
        } catch (error) {
            setCategories([]);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleFillNextNumber = async () => {
        setLoadingNextNumber(true);
        try {
            const { nextNumber } = await getNextAvailablePageNumber();
            setFormData(prev => ({ ...prev, pageNumber: nextNumber }));

            if (errors.pageNumber) {
                setErrors(prev => ({ ...prev, pageNumber: '' }));
            }
        } catch (error) {
            alert('Nie udało się pobrać wolnego numeru strony');
        } finally {
            setLoadingNextNumber(false);
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.pageNumber) {
            newErrors.pageNumber = 'Numer strony jest wymagany';
        } else {
            const pageNum = parseInt(formData.pageNumber);
            if (isNaN(pageNum) || pageNum < 100 || pageNum > 999) {
                newErrors.pageNumber = 'Numer strony musi być liczbą całkowitą od 100 do 999';
            }
        }

        if (!formData.title || formData.title.trim().length < 3) {
            newErrors.title = 'Tytuł musi zawierać minimum 3 znaki';
        } else if (formData.title.length > 50) {
            newErrors.title = 'Tytuł może zawierać maksymalnie 50 znaków';
        }

        if (!formData.category) {
            newErrors.category = 'Kategoria jest wymagana';
        }

        if (!formData.content || formData.content.trim().length === 0) {
            newErrors.content = 'Treść strony jest wymagana';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);
        try {
            const pageData = {
                pageNumber: parseInt(formData.pageNumber),
                title: formData.title.trim(),
                category: formData.category,
                content: formData.content
            };

            await createPage(pageData);
            setShowSuccess(true);

            setTimeout(() => {
                navigate('/admin/pages');
            }, 2000);

        } catch (error) {
            alert('Wystąpił błąd podczas tworzenia strony. Spróbuj ponownie.');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/admin/pages');
    };

    return (
        <AdminLayout>
            <div className="header">
                <h1>{isEditMode ? 'EDYTUJ STRONĘ' : 'DODAJ NOWĄ STRONĘ'}</h1>
                <p>{isEditMode ? `Edycja strony ID: ${id}` : 'Tworzenie nowej strony telegazety'}</p>
            </div>

            {isEditMode && (
                <div className="info-section" style={{ borderColor: '#ffaa00', marginBottom: '20px' }}>
                    <h3 style={{ color: '#ffaa00' }}>⚠️ Funkcjonalność w budowie</h3>
                    <p>Kontroler admin do zarządzania stronami nie jest jeszcze zaimplementowany w backendzie.</p>
                </div>
            )}

            <div className="info-section">
                <p>Formularz w budowie...</p>
                <p>State management gotowy! ✅</p>
                <pre style={{ fontSize: '10px', color: '#00aa00', marginTop: '10px' }}>
                    {JSON.stringify(formData, null, 2)}
                </pre>
            </div>

        </AdminLayout>
    );
}

export default AdminPageNew;