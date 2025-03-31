console.log("DB.js loaded");

// Sample customer data
let customerDB = [
    {
        id: "C00-01",
        name: "John Doe",
        address: "123 Main St, Colombo",
        salary: 50000
    },
    {
        id: "C002",
        name: "Jane Smith",
        address: "456 Oak Ave, Kandy",
        salary: 75000
    },
    {
        id: "C003",
        name: "Robert Johnson",
        address: "789 Pine Rd, Galle",
        salary: 60000
    },
    {
        id: "C004",
        name: "Sarah Williams",
        address: "321 Elm Blvd, Negombo",
        salary: 55000
    }
];

// Sample item data
let itemDB = [
    {
        itemCode: "I001",
        itemName: "Laptop",
        qty: 50,
        unitPrice: 120000
    },
    {
        itemCode: "I002",
        itemName: "Mouse",
        qty: 100,
        unitPrice: 2500
    },
    {
        itemCode: "I003",
        itemName: "Keyboard",
        qty: 75,
        unitPrice: 3500
    },
    {
        itemCode: "I004",
        itemName: "Monitor",
        qty: 30,
        unitPrice: 45000
    },
    {
        itemCode: "I005",
        itemName: "Headphones",
        qty: 60,
        unitPrice: 8000
    }
];
let ordersDB = [];
