import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    LineChart, Line, BarChart, Bar,
    XAxis, YAxis, Tooltip, Legend,
    CartesianGrid, ResponsiveContainer
} from 'recharts';

export default function Expenses() {
    const [expenses, setExpenses] = useState([]);
    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(true);
    const [chartType, setChartType] = useState('bar'); // 'bar' or 'line'
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                const res = await axios.get('https://expense-tracker-backend-zn8v.onrender.com/expenses', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setExpenses(res.data);
            } catch (err) {
                console.error('Failed to fetch expenses:', err);
                } finally {
            setLoading(false);
            }
        };
        fetchExpenses();
    }, [token]);

    const handleAddExpense = async () => {
        if (!title || !amount || !date) {
            alert('Please fill in all required fields');
        return;
        }
        try {
            const res = await axios.post('https://expense-tracker-backend-zn8v.onrender.com/api/expenses', {
                title,
                amount: parseFloat(amount),
                date,
                category,
                description
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setExpenses([res.data, ...expenses]);
            setTitle('');
            setAmount('');
            setDate('');
            setCategory('');
            setDescription('');
        } catch (err) {
            console.error('Failed to add expense:', err);
            alert(err.response?.data?.message || 'Failed to add expense');
        }
    };

    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const sortedExpenses = [...expenses].sort((a, b) => new Date(a.date) - new Date(b.date));
    const chartData = sortedExpenses.map((item) => ({
        name: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        expense: item.amount,
        title: item.title
    }));

    if (loading) return <div className="ml-64 p-6">Loading...</div>;

    return (
        <div className="ml-64 p-6">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-red-700">Expenses</h1>
                    <div className="text-right">
                        <span className="text-xl font-semibold text-red-600">
                            Total Expenses: {totalExpenses.toLocaleString()}฿
                        </span>
                    </div>
                </div>

            <div className="grid grid-cols-2 gap-8">
                {/* Add Expense Form */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-bold mb-4">Add New Expense</h2>
                    <div className="space-y-4">
                        <input
                            type="text"
                            className="w-full p-3 border border-gray-300 rounded-lg"
                            placeholder="Expense title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        <input
                            type="number"
                            className="w-full p-3 border border-gray-300 rounded-lg"
                            placeholder="Amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                        <input
                            type="date"
                            className="w-full p-3 border border-gray-300 rounded-lg"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                        <select
                            className="w-full p-3 border border-gray-300 rounded-lg"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            <option value="">Select Category</option>
                            <option value="food">Food</option>
                            <option value="transport">Transport</option>
                            <option value="entertainment">Entertainment</option>
                            <option value="utilities">Utilities</option>
                            <option value="healthcare">Healthcare</option>
                            <option value="other">Other</option>
                        </select>
                        <textarea
                            className="w-full p-3 border border-gray-300 rounded-lg"
                            rows="3"
                            placeholder="Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                        <button
                            className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-6 rounded-lg"
                            onClick={handleAddExpense}
                        >
                            Add Expense
                        </button>
                    </div>
                </div>

                {/* Recent Expenses */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-bold mb-4">Recent Expenses</h2>
                    <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                        {expenses.map((expense) => (
                            <div key={expense._id} className="bg-red-50 p-4 rounded-lg">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <h3 className="font-medium text-gray-900">{expense.title}</h3>
                                        <p className="text-sm text-gray-600">{expense.selectOption}</p>
                                        <p className="text-xs text-gray-500">
                                            {new Date(expense.date).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <span className="text-lg font-semibold text-red-600">
                                        {expense.amount.toLocaleString()}฿
                                    </span>
                                </div>
                            </div>
                        ))}
                        {expenses.length === 0 && (
                            <p className="text-gray-500 text-center py-8">No expense recorded yet.</p>
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
                        <h2 className="text-xl font-bold mb-4">Expense Trend ({chartType === 'bar' ? 'Bar' : 'Line'} Chart)</h2>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                {chartType === 'bar' ? (
                                    <BarChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="title" />
                                        <YAxis />
                                        <Tooltip
                                            formatter={(value) => `${value.toLocaleString()}฿`}
                                            labelFormatter={(label) => `Date: ${label}`}
                                        />
                                        <Legend />
                                        <Bar dataKey="expense" fill="#EF4444" radius={[15, 15, 0, 0]} />
                                    </BarChart>
                                ) : (
                                    <LineChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="title" />
                                        <YAxis />
                                        <Tooltip
                                            formatter={(value) => `${value.toLocaleString()}฿`}
                                            labelFormatter={(label) => `Date: ${label}`}
                                        />
                                        <Legend />
                                        <Line type="monotone" dataKey="expense" stroke="#EF4444" strokeWidth={3} dot={{ r: 4 }} />
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
