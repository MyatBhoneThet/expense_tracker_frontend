import { useEffect, useState } from 'react'
import axios from 'axios'

export default function Incomes() {
  const [incomes, setIncomes] = useState([])
  const API = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchIncomes = async () => {
      try {
        const res = await axios.get(`${API}/api/income`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        setIncomes(res.data)
      } catch (err) {
        console.error(err)
      }
    }

    fetchIncomes()
  }, [])

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Your Incomes</h2>
      <ul>
        {incomes.map(income => (
          <li key={income._id}>{income.title} - ${income.amount}</li>
        ))}
      </ul>
    </div>
  )
}
