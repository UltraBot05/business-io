import './PropertyCard.css';

export default function PropertyCard({ property, owner, onClose }) {
  if (!property) return null;
  
  // Only show cards for purchasable spaces
  const isPurchasable = ['property', 'railroad', 'utility'].includes(property.type);
  if (!isPurchasable) return null;

  const isProperty = property.type === 'property';
  const isRailroad = property.type === 'railroad';
  const isUtility = property.type === 'utility';

  return (
    <div className="property-card">
      <button className="btn-close" onClick={onClose}>×</button>
      
      <div 
        className="property-header"
        style={{ 
          backgroundColor: isProperty ? property.color : isRailroad ? '#1e293b' : '#0891b2'
        }}
      >
        <h3>{property.name}</h3>
      </div>

      <div className="property-details">
        <div className="property-price">
          <span>Price:</span>
          <strong>${property.price}</strong>
        </div>

        {owner && (
          <div className="property-owner">
            <span>Owner:</span>
            <strong>{owner.username}</strong>
          </div>
        )}

        {/* Property Rent */}
        {isProperty && property.rent && (
          <div className="property-rent">
            <h4>Rent:</h4>
            <div className="rent-list">
              <div className="rent-item">
                <span>Base:</span>
                <span>${property.rent[0]}</span>
              </div>
              <div className="rent-item">
                <span>1 House:</span>
                <span>${property.rent[1]}</span>
              </div>
              <div className="rent-item">
                <span>2 Houses:</span>
                <span>${property.rent[2]}</span>
              </div>
              <div className="rent-item">
                <span>3 Houses:</span>
                <span>${property.rent[3]}</span>
              </div>
              <div className="rent-item">
                <span>4 Houses:</span>
                <span>${property.rent[4]}</span>
              </div>
              <div className="rent-item">
                <span>Hotel:</span>
                <span>${property.rent[5]}</span>
              </div>
            </div>
          </div>
        )}

        {/* Railroad Rent */}
        {isRailroad && (
          <div className="property-rent">
            <h4>Rent:</h4>
            <div className="rent-list">
              <div className="rent-item">
                <span>1 Railroad:</span>
                <span>$25</span>
              </div>
              <div className="rent-item">
                <span>2 Railroads:</span>
                <span>$50</span>
              </div>
              <div className="rent-item">
                <span>3 Railroads:</span>
                <span>$100</span>
              </div>
              <div className="rent-item">
                <span>4 Railroads:</span>
                <span>$200</span>
              </div>
            </div>
          </div>
        )}

        {/* Utility Rent */}
        {isUtility && (
          <div className="property-rent">
            <h4>Rent:</h4>
            <div className="rent-list">
              <div className="rent-item">
                <span>1 Utility:</span>
                <span>4× dice roll</span>
              </div>
              <div className="rent-item">
                <span>2 Utilities:</span>
                <span>10× dice roll</span>
              </div>
            </div>
            <p style={{ fontSize: '0.85em', marginTop: '10px', color: '#94a3b8' }}>
              Rent is based on the dice roll
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
