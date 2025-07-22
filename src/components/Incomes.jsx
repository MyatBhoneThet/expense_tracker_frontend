import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
    Legend, ResponsiveContainer
} from 'recharts';

export default function Income() {
    const [incomes, setIncomes] = useState([]);
    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState('');
    const [selectOption, setSelectOption] = useState('');
    const [reference, setReference] = useState('');
    const [loading, setLoading] = useState(true);
    const [chartType, setChartType] = useState('bar'); // 'bar' or 'line'

    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchIncomes = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/income', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setIncomes(res.data);
            } catch (err) {
                console.error('Failed to fetch incomes:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchIncomes();
    }, [token]);

    const handleAddIncome = async () => {
        if (!title || !amount || !date) {
            alert('Please fill in all required fields');
            return;
        }
        try {
            const res = await axios.post('http://localhost:5000/api/income', {
                title,
                amount: parseFloat(amount),
                date,
                selectOption,
                reference
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setIncomes([res.data, ...incomes]);
            setTitle('');
            setAmount('');
            setDate('');
            setSelectOption('');
            setReference('');
        } catch (err) {
            console.error('Failed to add income:', err);
            alert(err.response?.data?.message || "Failed to add income");
        }
    };

    const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);

    // Sort incomes by date for chart (oldest to newest)
    const sortedIncomes = [...incomes].sort((a, b) => new Date(a.date) - new Date(b.date));
    const chartData = sortedIncomes.map((item) => ({
        name: new Date(item.date).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric' 
        }),
        date: item.date, // Keep full date for tooltip
        income: item.amount,
        title: item.title // Add title for tooltip
    }));

    if (loading) {
        return <div className="ml-64 p-6">Loading...</div>;
    }

    return (
        <div className="ml-64 p-6">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-green-700">Income</h1>
                    <div className="text-right">
                        <span className="text-xl font-semibold text-green-600">
                            Total Income: {totalIncome.toLocaleString()}฿
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-8">
                    {/* Add Income Form */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-xl font-bold mb-4">Add New Income</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Title*</label>
                                <input
                                    type="text"
                                    placeholder="Income title"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Amount*</label>
                                <input
                                    type="number"
                                    placeholder="0.00"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Date*</label>
                                <input
                                    type="date"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                                <select
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    value={selectOption}
                                    onChange={(e) => setSelectOption(e.target.value)}
                                >
                                    <option value="">Select Category</option>
                                    <option value="salary">Salary</option>
                                    <option value="freelance">Freelance</option>
                                    <option value="investment">Investment</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Reference</label>
                                <input
                                    type="text"
                                    placeholder="Optional reference"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    value={reference}
                                    onChange={(e) => setReference(e.target.value)}
                                />
                            </div>
                            <button
                                className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                                onClick={handleAddIncome}
                            >
                                Add Income
                            </button>
                        </div>
                    </div>

                    {/* Recent Incomes */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-xl font-bold mb-4">Recent Incomes</h2>
                        <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                        {incomes.map((income) => (
                        <div key={income._id} className="bg-green-50 p-4 rounded-lg">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <h3 className="font-medium text-gray-900">{income.title}</h3>
                                    <p className="text-sm text-gray-600">{income.selectOption}</p>
                                    <p className="text-xs text-gray-500">
                                        {new Date(income.date).toLocaleDateString()}
                                    </p>
                                </div>
                                <span className="text-lg font-semibold text-green-600">
                                    {income.amount.toLocaleString()}฿
                                </span>
                            </div>
                        </div>
                    ))}
                    {incomes.length === 0 && (
                        <p className="text-gray-500 text-center py-8">No income recorded yet.</p>
                    )}
                </div>

                    </div>
                </div>

                {/* Chart Type Switch */}
                <div className="mt-6 flex justify-end gap-4">
                    <button
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg"
                        onClick={() => setChartType(chartType === 'bar' ? 'line' : 'bar')}
                    >
                        Switch to {chartType === 'bar' ? 'Line Chart' : 'Bar Chart'}
                    </button>
                </div>

                {/* Chart */}
                {chartData.length > 0 && (
                    <div className="mt-8 bg-white p-6 rounded-lg shadow">
                        <h2 className="text-xl font-bold mb-4">Income Trend</h2>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                {chartType === 'bar' ? (
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip 
                                        formatter={(value, name) => [
                                            `${value.toLocaleString()}฿`, 
                                            'Income'
                                        ]}
                                        labelFormatter={(label) => `Date: ${label}`}
                                    />
                                    <Legend />
                                    <Bar dataKey="income" fill="#22C55E" radius={[10, 10, 0, 0]} />
                                </BarChart>
                                ) : (
                                    <LineChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip
                                            formatter={(value) => `${value.toLocaleString()}฿`}
                                            labelFormatter={(label) => `Date: ${label}`}
                                        />
                                        <Legend />
                                        <Line type="monotone" dataKey="income" stroke="#22C55E" strokeWidth={3} dot={{ r: 4 }} />
                                    </LineChart>
                                )}
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
