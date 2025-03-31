function setOrder(orderId, date, customerId, items, discount = 0) {
    // Calculate totals
    const subTotal = items.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const total = subTotal - discount;
    
    return {
        orderId: orderId,
        date: date,
        customerId: customerId,
        items: items,
        discount: discount,
        subTotal: subTotal,
        total: total
    };
}