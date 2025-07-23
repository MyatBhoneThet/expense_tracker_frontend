import React, { useEffect, useState } from 'react'
import axios from 'axios'

export default function Dashboard() {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const token = localStorage.getItem('token')
  const API = import.meta.env.VITE_API_BASE_URL;

  // Fetch existing incomes on load
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await axios.get(`${API}/api/income`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setTransactions(res.data)
        setLoading(false)
      } catch (err) {
        console.error('Failed to fetch transactions:', err.response?.data || err.message)
        setError(err.response?.data?.message || 'Failed to load transactions')
        setLoading(false)
      }
    }

    fetchTransactions()
  }, [token])

  // Function to add new income
  const addIncome = async () => {
    try {
      const res = await axios.post(`${API}/api/income`,
        { 
          title: 'Salary', 
          amount: 5000, 
          date: new Date().toISOString().split('T')[0],
          selectOption: 'salary'
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      console.log('Added:', res.data)

      // Optionally re-fetch transactions
      setTransactions(prev => [res.data, ...prev])
    } catch (err) {
      console.error(err.response?.data || err.message)
      setError(err.response?.data?.message || 'Failed to add income')
    }
  }

  if (loading) return <div className="ml-64 p-6">Loading...</div>
  if (error) return <div className="ml-64 p-6 text-red-500">Error: {error}</div>

  return (
    <div className="ml-64 p-6">
      <h1 className="text-2xl font-bold mb-4">All Transactions</h1>

      <div className="bg-gray-300 h-64 mb-4 flex justify-center items-center">
        Graph (chart.js or three.js)
      </div>

      <button
        onClick={addIncome}
        className="mb-4 px-4 py-2 bg-green-500 text-white rounded"
      >
        Add $5000 Salary Income
      </button>

      <h2 className="text-xl mb-2">Recent History</h2>
      <div className="space-y-2">
        {transactions.length > 0 ? (
          transactions.map(tx => (
            <div key={tx._id} className="bg-gray-200 p-2 flex justify-between">
              <span>{tx.title}</span>
              <span className={tx.amount < 0 ? "text-red-500" : "text-green-500"}>
                ${tx.amount}
              </span>
            </div>
          ))
        ) : (
          <div>No transactions found.</div>
        )}
      </div>

      <div className="bg-gray-300 mt-6 p-6 text-center">Some calculations...</div>
    </div>
  )
}
