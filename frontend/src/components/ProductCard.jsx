import { Star, TrendingDown, TrendingUp, ExternalLink } from 'lucide-react';
import PriceChart from './PriceChart';

const ProductCard = ({ product }) => {
  const { name, current_price, rating, availability, url, domain, price_history, predicted_price } = product;

  // Determine trend if we have prediction
  const isTrendingDown = predicted_price && predicted_price < current_price;
  const isTrendingUp = predicted_price && predicted_price > current_price;

  return (
    <div className="product-card">
      <div className="product-content">
        <div className="product-header">
          <h3 className="product-title" title={name}>{name}</h3>
          <span className="product-domain">{domain || 'Unknown'}</span>
        </div>
        
        <div className="product-price-section">
          <div className="current-price">£{current_price.toFixed(2)}</div>
          
          {predicted_price && (
            <div className={`predicted-price ${isTrendingDown ? 'down' : 'up'}`}>
              {isTrendingDown ? <TrendingDown size={14} /> : <TrendingUp size={14} />}
              £{predicted_price.toFixed(2)} (est)
            </div>
          )}
        </div>

        {/* Render chart if there's history */}
        {price_history && price_history.length > 0 && (
          <div className="chart-container">
            <PriceChart history={price_history} predicted={predicted_price} current={current_price} />
          </div>
        )}

        <div className="product-meta">
          <div className="rating">
            <Star size={16} fill="var(--warning)" color="var(--warning)" />
            <span>{rating || 0}/5</span>
          </div>
          
          <div className={`availability ${(availability && availability.toLowerCase().includes('in stock')) ? 'instock' : ''}`}>
            {availability || 'Unknown'}
          </div>
          
          <a href={url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)' }} title="View Original">
            <ExternalLink size={16} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
