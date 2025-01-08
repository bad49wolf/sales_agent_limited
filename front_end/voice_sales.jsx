import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SalesList = () => {
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSales = async () => {
            try {
                const response = await axios.get('/api/get_sales');
                setSales(response.data.sales);
                setLoading(false);
            } catch (err) {
                setError('Error fetching sales');
                setLoading(false);
            }
        };

        fetchSales();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-lg text-gray-600">Loading sales...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-lg text-red-600">{error}</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Sales List</h1>
            <div className="grid gap-4">
                {sales.map((sale) => (
                    <div
                        key={sale.id}
                        className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200"
                    >
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">
                            {sale.full_name}
                        </h2>
                        <p className="text-gray-600">
                            {sale.description}
                        </p>
                    </div>
                ))}
                {sales.length === 0 && (
                    <div className="text-center text-gray-600">
                        No sales found
                    </div>
                )}
            </div>
        </div>
    );
};

export default SalesList;