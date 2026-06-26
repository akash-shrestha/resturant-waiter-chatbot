import { formatOrderLabel, formatOrderValue } from '../utils/orderFormatters';

export default function OrderDetails({ order }) {
  if (!order) {
    return <p className="order-empty">No order details available yet.</p>;
  }

  if (typeof order === 'string') {
    return <p className="order-empty">{order}</p>;
  }

  const customerEntries =
    order.customer && typeof order.customer === 'object' ? Object.entries(order.customer) : [];
  const orderItems = Array.isArray(order.order_items) ? order.order_items : [];

  return (
    <>
      <div className="order-summary-grid">
        <div>
          <span>Order ID</span>
          <strong>{order.order_id || 'Not created'}</strong>
        </div>
        <div>
          <span>Status</span>
          <strong>{order.status || 'Not started'}</strong>
        </div>
        <div>
          <span>Total</span>
          <strong>{order.total_amount ? `Rs. ${order.total_amount}` : 'Not calculated'}</strong>
        </div>
      </div>

      <div className="order-modal-section">
        <h3>Customer</h3>
        {customerEntries.length > 0 ? (
          <dl className="order-detail-list">
            {customerEntries.map(([key, value]) => (
              <div key={key}>
                <dt>{formatOrderLabel(key)}</dt>
                <dd>{formatOrderValue(value)}</dd>
              </div>
            ))}
          </dl>
        ) : (
          <p className="order-empty">Customer details not provided yet.</p>
        )}
      </div>

      <div className="order-modal-section">
        <h3>Items</h3>
        {orderItems.length > 0 ? (
          <ul className="order-item-list">
            {orderItems.map((item, index) => (
              <li
                key={`${item && typeof item === 'object' && item.name ? item.name : 'item'}-${index}`}
              >
                {item && typeof item === 'object' ? (
                  <>
                    <strong>{item.name || `Item ${index + 1}`}</strong>
                    <span>
                      {Object.entries(item)
                        .filter(([key]) => key !== 'name')
                        .map(([key, value]) => `${formatOrderLabel(key)}: ${formatOrderValue(value)}`)
                        .join(' • ')}
                    </span>
                  </>
                ) : (
                  <strong>{item}</strong>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="order-empty">No items selected yet.</p>
        )}
      </div>
    </>
  );
}
