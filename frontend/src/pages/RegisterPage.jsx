import { useState } from "react";
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { register } from "../services/authService";

export default function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async e => {
        e.preventDefault();
        setError('');
        try {
            await register(name, email, password);
            navigate('/login');
        }   catch (err) {
            setError(err.response?.data?.message || 'Greska pri registraciji');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
            <h1 className="text 2x-1 font-bold mb-6">Registracija</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-80 bg-white p-6 rounded shadow">
                <input
                    type="text"
                    placeholder="Vase ime"
                    className="p-2 borded rounded"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                />
                <input
                    type="email"
                    placeholder="Email adresa"
                    className="p-2 borded rounded"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Lozinka"
                    className="p-2 borded rounded"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                />
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                    Registruj se
                </button>
                <p className="text-sm text-center">
                    Vec imate racun?{' '}
                    <Link to="/login" className="text-blue-500 hover:underline">
                        Prijavite se 
                    </Link>
                </p>
            </form>
        </div>            
    );
}
