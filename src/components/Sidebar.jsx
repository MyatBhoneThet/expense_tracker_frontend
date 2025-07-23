import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Sidebar() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const API = import.meta.env.VITE_API_BASE_URL;

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get(`${API}/api/auth/profile`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUser(res.data);
            } catch (err) {
                console.error("Failed to load profile", err);
            }
        };
        fetchProfile();
    }, []);

    return (
        <div className="flex h-screen w-30 flex-col justify-between border-e border-gray-100 bg-white">
            <div>
                <div className="inline-flex size-20 items-center justify-center group relative">
                    <span className="grid size-12 place-content-center rounded-lg bg-gray-100 text-lg font-bold text-gray-600">
                        {user ? user.email[0]?.toUpperCase() : "L"}
                    </span>
                    <span className="invisible absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded-sm bg-gray-900 px-2 py-1.5 text-xs font-medium text-white group-hover:visible">
                        {user ? user.email : "Loading..."}
                    </span>
                </div>

                <div className="border-t border-gray-100">
                    <div className="px-2">
                        <ul className="space-y-1 border-t border-gray-100 pt-4">

                            <li>
                                <Link to="/dashboard" className="group relative flex justify-center rounded-sm px-2 py-1.5 text-gray-500 hover:bg-gray-50 hover:text-gray-700">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="size-5 opacity-75" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                    </svg>
                                    <span className="invisible absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded-sm bg-gray-900 px-2 py-1.5 text-xs font-medium text-white group-hover:visible">
                                        Dashboard
                                    </span>
                                </Link>
                            </li>

                            <li>
  <Link to="/incomes" className="group relative flex justify-center rounded-sm px-2 py-1.5 text-gray-500 hover:bg-gray-50 hover:text-gray-700">
    <svg xmlns="http://www.w3.org/2000/svg" className="size-5 opacity-75" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="9" strokeLinecap="round" strokeLinejoin="round" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v8M9 10h6" />
    </svg>
    <span className="invisible absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded-sm bg-gray-900 px-2 py-1.5 text-xs font-medium text-white group-hover:visible">
      Incomes
    </span>
  </Link>
</li>



  <li>
    <Link to="/expenses" className="group relative flex justify-center rounded-sm px-2 py-1.5 text-gray-500 hover:bg-gray-50 hover:text-gray-700">
      <svg xmlns="http://www.w3.org/2000/svg" className="size-5 opacity-75" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8V4m0 0L8 8m4-4l4 4M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
      </svg>
      <span className="invisible absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded-sm bg-gray-900 px-2 py-1.5 text-xs font-medium text-white group-hover:visible">
        Expenses
      </span>
    </Link>
  </li>

  <li>
    <Link to="/viewhistory" className="group relative flex justify-center rounded-sm px-2 py-1.5 text-gray-500 hover:bg-gray-50 hover:text-gray-700">
      <svg xmlns="http://www.w3.org/2000/svg" className="size-5 opacity-75" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
      </svg>
      <span className="invisible absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded-sm bg-gray-900 px-2 py-1.5 text-xs font-medium text-white group-hover:visible">
        History
      </span>
    </Link>
  </li>

                        </ul>
                    </div>
                </div>
                </div>

                <div className="sticky inset-x-0 bottom-0 border-t border-gray-100 bg-white p-2">
                    <button onClick={() => { localStorage.removeItem("token"); navigate("/"); }}
                        className="group relative flex w-full justify-center rounded-lg px-2 py-1.5 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" className="size-5 opacity-75" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span className="invisible absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded-sm bg-gray-900 px-2 py-1.5 text-xs font-medium text-white group-hover:visible">
                            Logout
                        </span>
                    </button>
                </div>
        </div>
    );  
}
