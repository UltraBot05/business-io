import './PropertyCard.css';

export default function PropertyCard({ property, owner, onClose }) {
  if (!property || property.type !== 'property') return null;

  return (
    <div className="property-card">
      <button className="btn-close" onClick={onClose}>×</button>
      
      <div 
        className="property-header"
        style={{ backgroundColor: property.color }}
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
      </div>
    </div>
  );
}
