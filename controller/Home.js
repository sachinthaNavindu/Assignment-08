document.addEventListener("DOMContentLoaded", function() {
    function updateDashboardCounts() {
        const customers = JSON.parse(localStorage.getItem('customerDB')) || [];
        const items = JSON.parse(localStorage.getItem('itemDB')) || [];
        const orders = JSON.parse(localStorage.getItem('ordersDB')) || [];
        
        document.querySelector('.cust-count').textContent = customers.length;
        
        document.querySelector('.item-count').textContent = items.length;
        
        document.querySelector('.orders-count').textContent = orders.length;
        
        const today = new Date().toISOString().split('T')[0];
        const todaysOrders = orders.filter(order => order.date && order.date.split('T')[0] === today);
    }

    window.refreshDashboardCounts = function() {
        updateDashboardCounts();
    };

    updateDashboardCounts();
});