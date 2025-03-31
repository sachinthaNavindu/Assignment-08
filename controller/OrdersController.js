document.addEventListener("DOMContentLoaded", function () {
    // DOM Elements
    let customerSelect = document.getElementById("customerSelect");
    let itemSelect = document.getElementById("itemSelect");
    let orderTable = document.querySelector("#orderItemsTable tbody");
    let totalDisplay = document.getElementById("total");
    let subTotalDisplay = document.getElementById("subTotal");
    let cashInput = document.getElementById("cash");
    let discountInput = document.getElementById("discount");
    let balanceInput = document.getElementById("balance");
    let orderButton = document.querySelector("#btn-addorder");
    let purchaseButton = document.querySelector(".btn-success");

    // State variables
    let totalAmount = 0;
    let orderItems = [];
   

    // Initialize form
    generateOrderId();
    document.getElementById("orderDate").valueAsDate = new Date();
    document.getElementById("discount").value = "0";

    // Generate order ID function
    function generateOrderId() {
        let nextNumber;
        
        if (ordersDB.length > 0) {
            const lastId = ordersDB[ordersDB.length - 1].id;
            const numericPart = lastId.replace(/\D/g, ''); // Remove non-digits
            nextNumber = parseInt(numericPart) + 1;
        } else {
            nextNumber = 1;
        }
        
        const formattedNumber = nextNumber.toString().padStart(3, '0');
        document.getElementById("orderID").value = formattedNumber;
    }

    // Update all totals (total, subtotal, balance)
    function updateTotals() {
        const discount = parseFloat(discountInput.value) || 0;
        const subtotal = totalAmount - discount;
        const cash = parseFloat(cashInput.value) || 0;
        const balance = cash - subtotal;

        totalDisplay.textContent = `Total: ${totalAmount.toFixed(2)} Rs/=`;
        subTotalDisplay.textContent = `SubTotal: ${subtotal.toFixed(2)} Rs/=`;
        balanceInput.value = balance >= 0 ? balance.toFixed(2) : "Insufficient Cash";
    }

    // Populate customer dropdown
    customerSelect.addEventListener("click", function() {
        for(let i = customerSelect.options.length - 1; i > 0; i--) {
            customerSelect.remove(i);
        }
        customerDB.forEach((customer) => {
            let option = document.createElement("option");
            option.value = customer.id;
            option.textContent = customer.id;
            customerSelect.append(option);
        });
    });

    // Populate item dropdown
    itemSelect.addEventListener("click", function() {
        for(let i = itemSelect.options.length - 1; i > 0; i--) {
            itemSelect.remove(i);
        }
        itemDB.forEach((item) => {
            let option = document.createElement("option");
            option.value = item.itemCode;
            option.textContent = item.itemCode;
            itemSelect.append(option);
        });
    });

    // Customer selection handler
    customerSelect.addEventListener("change", function() {
        let selectedCustomer = customerDB.find(c => c.id === this.value);
        if (selectedCustomer) {
            document.getElementById("ordercustomerID").value = selectedCustomer.id;
            document.getElementById("ordercustomerName").value = selectedCustomer.name;
            document.getElementById("ordercustomerAddress").value = selectedCustomer.address;
            document.getElementById("ordercustomerSalary").value = selectedCustomer.salary;
        }
    });

    // Item selection handler
    itemSelect.addEventListener("change", function() {
        let selectedItem = itemDB.find(i => i.itemCode === this.value);
        if (selectedItem) {
            document.getElementById("orderitemCode").value = selectedItem.itemCode;
            document.getElementById("orderitemName").value = selectedItem.itemName;
            document.getElementById("orderitemPrice").value = selectedItem.unitPrice;
            document.getElementById("QtyOnH").value = selectedItem.qty;
            document.getElementById("orderQuantity").value = "";
        }
    });

    // Add to order button handler
    orderButton.addEventListener("click", function() {
        let itemCode = document.getElementById("orderitemCode").value;
        let itemName = document.getElementById("orderitemName").value;
        let itemPrice = parseFloat(document.getElementById("orderitemPrice").value);
        let qtyOnHand = parseInt(document.getElementById("QtyOnH").value);
        let orderQty = parseInt(document.getElementById("orderQuantity").value);
        
        // Validation
        if (!itemCode) {
            alert("Please select an item first!");
            return;
        }
        
        if (isNaN(orderQty) || orderQty <= 0) {
            alert("Please enter a valid quantity (must be greater than 0)!");
            return;
        }
        
        if (orderQty > qtyOnHand) {
            alert(`Not enough stock! Only ${qtyOnHand} items available.`);
            return;
        }
        
        // Check if item exists in order
        let existingItemIndex = orderItems.findIndex(item => item.code === itemCode);
        
        if (existingItemIndex >= 0) {
            let newQty = orderItems[existingItemIndex].qty + orderQty;
            
            if (newQty > qtyOnHand) {
                alert(`Cannot add more items! Total quantity (${newQty}) exceeds available stock (${qtyOnHand}).`);
                return;
            }
            
            orderItems[existingItemIndex].qty = newQty;
            orderItems[existingItemIndex].total = itemPrice * newQty;
        } else {
            let total = itemPrice * orderQty;
            orderItems.push({
                code: itemCode,
                name: itemName,
                price: itemPrice,
                qty: orderQty,
                total: total
            });
        }
        
        // Update totals
        totalAmount = orderItems.reduce((sum, item) => sum + item.total, 0);
        updateOrderTable();
        updateTotals();
        document.getElementById("orderQuantity").value = "";
    });

    // Update order table function
    function updateOrderTable() {
        orderTable.innerHTML = "";
        orderItems.forEach(item => {
            let row = document.createElement("tr");
            row.innerHTML = `
                <td>${item.code}</td>
                <td>${item.name}</td>
                <td>${item.price.toFixed(2)}</td>
                <td>${item.qty}</td>
                <td>${item.total.toFixed(2)}</td>
            `;
            orderTable.appendChild(row);
        });
    }

    // Input event listeners for real-time updates
    cashInput.addEventListener("input", updateTotals);
    discountInput.addEventListener("input", updateTotals);

    // Purchase button handler
    purchaseButton.addEventListener("click", function() {
        if (orderItems.length === 0) {
            alert("Please add items to the order before purchasing!");
            return;
        }
        
        let cash = parseFloat(cashInput.value) || 0;
        let discount = parseFloat(discountInput.value) || 0;
        let subtotal = totalAmount - discount;
        
        if (cash < subtotal) {
            alert("Insufficient cash provided!");
            return;
        }
    
        // Get current order details
        const currentOrderId = document.getElementById("orderID").value;
    
        // Update inventory
        orderItems.forEach(orderedItem => {
            const itemIndex = itemDB.findIndex(item => item.itemCode === orderedItem.code);
            if (itemIndex !== -1) {
                itemDB[itemIndex].qty -= orderedItem.qty;
            }
        });
    
        // Create and save order
        const newOrder = {
            id: currentOrderId,
            date: new Date().toISOString(),
            customer: customerSelect.value,
            items: [...orderItems],
            total: totalAmount,
            discount: discount,
            cash: cash,
            balance: cash - subtotal
        };
        ordersDB.push(newOrder);
        
        // Persist data
        localStorage.setItem('itemDB', JSON.stringify(itemDB));
        localStorage.setItem('ordersDB', JSON.stringify(ordersDB));
        
        alert(`Purchase successful! Order ID: ${currentOrderId}\nBalance: Rs. ${(cash - subtotal).toFixed(2)}`);
    
        // Reset form
        orderItems = [];
        totalAmount = 0;
        orderTable.innerHTML = "";
        totalDisplay.textContent = `Total: 00.00 Rs/=`;
        subTotalDisplay.textContent = `SubTotal: 00.00 Rs/=`;
        cashInput.value = "";
        discountInput.value = "0";
        balanceInput.value = "";
        
        // Clear selections
        customerSelect.value = "select customer";
        document.getElementById("ordercustomerID").value = "";
        document.getElementById("ordercustomerName").value = "";
        document.getElementById("ordercustomerAddress").value = "";
        document.getElementById("ordercustomerSalary").value = "";
        
        itemSelect.value = "select customer";
        document.getElementById("orderitemCode").value = "";
        document.getElementById("orderitemName").value = "";
        document.getElementById("orderitemPrice").value = "";
        document.getElementById("QtyOnH").value = "";
        
        // Generate new order ID
        generateOrderId();
    });
});