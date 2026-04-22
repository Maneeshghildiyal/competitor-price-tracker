import { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from './ProductCard';
import { Search, Filter, TrendingUp, Package, Activity } from 'lucide-react';

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [minRating, setMinRating] = useState('');

  useEffect(() => {
    fetchProducts();
  }, [search, minRating]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      // In a real app, URL would come from env
      let url = 'http://localhost:5000/api/products';
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (minRating) params.append('minRating', minRating);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await axios.get(url);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate some stats
  const totalProducts = products.length;
  const avgPrice = products.length 
    ? (products.reduce((acc, curr) => acc + curr.current_price, 0) / products.length).toFixed(2)
    : 0;
  const productsWithPredictions = products.filter(p => p.predicted_price).length;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Market Overview</h2>
        <p>Real-time insights and competitor pricing trends</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Products</h3>
          <div className="stat-value">{totalProducts}</div>
          <Package className="absolute right-6 top-6 text-indigo-500 opacity-20" size={48} style={{position: 'absolute', right: '1.5rem', top: '1.5rem', opacity: 0.2, color: 'var(--accent-primary)'}} />
        </div>
        <div className="stat-card" style={{borderLeftColor: 'var(--success)'}}>
          <h3>Average Price</h3>
          <div className="stat-value">£{avgPrice}</div>
          <Activity className="absolute right-6 top-6 text-indigo-500 opacity-20" size={48} style={{position: 'absolute', right: '1.5rem', top: '1.5rem', opacity: 0.2, color: 'var(--success)'}}/>
        </div>
        <div className="stat-card" style={{borderLeftColor: 'var(--warning)'}}>
          <h3>Active Predictions</h3>
          <div className="stat-value">{productsWithPredictions}</div>
          <TrendingUp className="absolute right-6 top-6 text-indigo-500 opacity-20" size={48} style={{position: 'absolute', right: '1.5rem', top: '1.5rem', opacity: 0.2, color: 'var(--warning)'}}/>
        </div>
      </div>

      <div className="filters">
        <div className="filter-group">
          <label>Search Products</label>
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '10px', top: '12px', color: 'var(--text-secondary)' }} />
            <input 
              type="text" 
              className="filter-input" 
              placeholder="e.g., Data Science" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: '100%', paddingLeft: '35px' }}
            />
          </div>
        </div>
        <div className="filter-group">
          <label>Minimum Rating</label>
          <div style={{ position: 'relative' }}>
            <Filter size={18} style={{ position: 'absolute', left: '10px', top: '12px', color: 'var(--text-secondary)' }} />
            <select 
              className="filter-input" 
              value={minRating}
              onChange={(e) => setMinRating(e.target.value)}
              style={{ width: '100%', paddingLeft: '35px', appearance: 'none' }}
            >
              <option value="">Any Rating</option>
              <option value="3">3+ Stars</option>
              <option value="4">4+ Stars</option>
              <option value="5">5 Stars</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loader-container">
          <div className="loader"></div>
        </div>
      ) : (
        <div className="products-grid">
          {products.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
          {products.length === 0 && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
              No products found matching your criteria.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
