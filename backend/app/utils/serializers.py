def order_to_dict(order) -> dict:
    return {
        "order_id": order.order_id,
        "status": order.status,
        "created_at": order.created_at.isoformat() if order.created_at else None,
        "total_amount": str(order.total_amount),
        "customer": order.customer,
        "order_items": order.order_items,
    }
