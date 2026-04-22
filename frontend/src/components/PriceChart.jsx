import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const PriceChart = ({ history, predicted, current }) => {
  // Format data for Recharts
  const data = history.map(item => {
    const date = new Date(item.timestamp);
    return {
      name: `${date.getDate()}/${date.getMonth() + 1}`,
      price: item.price
    };
  });

  // If there's a prediction, add a dummy data point for the visual
  if (predicted) {
    const nextDay = new Date();
    nextDay.setDate(nextDay.getDate() + 1);
    data.push({
      name: `${nextDay.getDate()}/${nextDay.getMonth() + 1} (est)`,
      price: current, // Line connects from current
      predicted: predicted // To predicted
    });
  }

  // Custom Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          background: 'rgba(26, 29, 45, 0.9)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '8px 12px',
          borderRadius: '8px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
          fontSize: '0.85rem'
        }}>
          <p style={{ margin: 0, color: 'var(--text-secondary)', marginBottom: '4px' }}>{label}</p>
          <p style={{ margin: 0, color: 'var(--accent-primary)', fontWeight: 'bold' }}>
            £{payload[0].value.toFixed(2)}
          </p>
          {payload[1] && (
            <p style={{ margin: 0, color: 'var(--warning)', fontWeight: 'bold' }}>
              Est: £{payload[1].value.toFixed(2)}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
        <XAxis 
          dataKey="name" 
          stroke="rgba(255, 255, 255, 0.2)" 
          tick={{ fill: 'var(--text-secondary)', fontSize: 10 }}
          tickMargin={5}
        />
        <YAxis 
          domain={['dataMin - 5', 'dataMax + 5']} 
          stroke="rgba(255, 255, 255, 0.2)" 
          tick={{ fill: 'var(--text-secondary)', fontSize: 10 }}
        />
        <Tooltip content={<CustomTooltip />} />
        
        {/* Actual Price Line */}
        <Line 
          type="monotone" 
          dataKey="price" 
          stroke="var(--accent-primary)" 
          strokeWidth={2}
          dot={{ r: 3, fill: 'var(--bg-color)', stroke: 'var(--accent-primary)', strokeWidth: 2 }}
          activeDot={{ r: 5, fill: 'var(--accent-primary)' }}
        />
        
        {/* Predicted Price Line (Dashed) */}
        {predicted && (
          <Line 
            type="monotone" 
            dataKey="predicted" 
            stroke="var(--warning)" 
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={{ r: 3, fill: 'var(--bg-color)', stroke: 'var(--warning)', strokeWidth: 2 }}
          />
        )}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default PriceChart;
