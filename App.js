import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`$http://localhost:3000/products`);
        setProducts(response.data);
        setError('');
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="App">
      <h1>User List</h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <ul>
          {products.map((user) => (
            <li key={user.id}>
              <strong>{user.username}</strong> ({user.email}) - Joined on{' '}
              {new Date(user.created_at).toLocaleDateString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;