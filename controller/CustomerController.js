$(document).ready(function () {
    let selectedCustomerIndex = null;

    // Initialize customer ID and table
    generatedCustomerId();
    updateTable();

    function generatedCustomerId() {
        let nextCustomerId = customerDB.length + 1;
        const generatedCustomerId = "C00-" + ("00" + nextCustomerId).slice(-2);
        $("#customerID").val(generatedCustomerId);
    }

    function setCustomer(id, name, address, salary) {
        return {
            id: id,
            name: name,
            address: address,
            salary: salary
        };
    }

    // Field validation functions
    validateField("#customerName", "#fullNameError", "Please input Customer Full Name!", function(value) {
        return /^[A-Za-z\s]+$/.test(value);
    });

    validateField("#customerAddress", "#addressError", "Please input Customer Address!");

    validateField("#customerSalary", "#salaryError", "Please input valid Customer Salary (positive numbers only)", function(value) {
        return /^\d+(\.\d{1,2})?$/.test(value) && parseFloat(value) > 0;
    });

    function validateField(fieldId, errorId, errorMessage, validationFn) {
        $(fieldId).on("blur", function() {
            validateCurrentField();
        });

        $(fieldId).on("input", function() {
            if ($(this).val().trim() !== "") {
                $(errorId).text("");
            }
            $("#addCustomerBtn").prop("disabled", !isFormValid());
        });

        function validateCurrentField() {
            const value = $(fieldId).val().trim();
            if (value === "") {
                $(errorId).text(errorMessage).css("color", "red");
            } else if (validationFn && !validationFn(value)) {
                $(errorId).text("Invalid input").css("color", "red");
            } else {
                $(errorId).text("");
            }
        }
    }

    // Prevent negative numbers in salary field
    $("#customerSalary").on("keydown", function(e) {
        if (e.key === "-") {
            e.preventDefault();
        }
    });

    $("#customerSalary").on("paste", function(e) {
        const pasteData = e.originalEvent.clipboardData.getData('text');
        if (pasteData.includes("-")) {
            e.preventDefault();
        }
    });

    function isFormValid() {
        const nameValid = $("#customerName").val().trim() !== "" && 
                         /^[A-Za-z\s]+$/.test($("#customerName").val().trim());
        const addressValid = $("#customerAddress").val().trim() !== "";
        const salaryValid = /^\d+(\.\d{1,2})?$/.test($("#customerSalary").val().trim()) && 
                           parseFloat($("#customerSalary").val().trim()) > 0;
        
        return nameValid && addressValid && salaryValid;
    }

    function addToTable(customer) {
        const row = `<tr onclick="selectCustomer(${customerDB.length - 1})">
                        <td>${customer.id}</td>
                        <td>${customer.name}</td>
                        <td>${customer.address}</td>
                        <td>${customer.salary}</td>
                    </tr>`;
        $("#customerTableBody").append(row);
        console.log(customerDB);
    }

    function updateTable() {
        $("#customerTableBody").empty();
        customerDB.forEach((customer, index) => {
            const row = `<tr onclick="selectCustomer(${index})">
                            <td>${customer.id}</td>
                            <td>${customer.name}</td>
                            <td>${customer.address}</td>
                            <td>${customer.salary}</td>
                        </tr>`;
            $("#customerTableBody").append(row);
        });
    }

    // Button event handlers
    $("#addCustomerBtn").click(function () {
        if (!isFormValid()) {
            $("input").trigger("blur");
            return;
        }

        let customerId = $("#customerID").val();
        let name = $("#customerName").val();
        let address = $("#customerAddress").val();
        let salary = $("#customerSalary").val();
        
        const existingCustomer = customerDB.find(customer => customer.id === customerId);
    
        if (existingCustomer) {
            alert("Customer ID already exists! Please generate a new ID.");
            return;
        }
    
        var customer = setCustomer(customerId, name, address, salary);
        customerDB.push(customer);
        addToTable(customer);
        resetForm();
        generatedCustomerId();
    });

    $("#removeCustomerBtn").click(function () {
        if (selectedCustomerIndex !== null) {
            customerDB.splice(selectedCustomerIndex, 1);
            updateTable();
            selectedCustomerIndex = null;
            resetForm();
            generatedCustomerId();
        } else {
            alert("Please select a customer to remove!");
        }
    });

    $("#updateCustomerBtn").click(function () {
        if (selectedCustomerIndex !== null && isFormValid()) {
            const updatedCustomer = {
                id: $("#customerID").val(),
                name: $("#customerName").val(),
                address: $("#customerAddress").val(),
                salary: $("#customerSalary").val(),
            };
            customerDB[selectedCustomerIndex] = updatedCustomer;
            updateTable();
            resetForm();
            selectedCustomerIndex = null;
            generatedCustomerId();
        } else {
            alert("Please select a customer and ensure all fields are valid!");
        }
    });

    $("#clearAllCustomersBtn").click(function () {
        $("#customerName").val("");
        $("#customerAddress").val("");
        $("#customerSalary").val("");
        $("#fullNameError").text("");
        $("#addressError").text("");
        $("#salaryError").text("");
        selectedCustomerIndex = null;
        generatedCustomerId();
    });

    // Global function to select customers
    window.selectCustomer = function (index) {
        selectedCustomerIndex = index;
        const selectedCustomer = customerDB[index];
        $("#customerID").val(selectedCustomer.id);
        $("#customerName").val(selectedCustomer.name);
        $("#customerAddress").val(selectedCustomer.address);
        $("#customerSalary").val(selectedCustomer.salary);
    };

    function resetForm() {
        $("#customerName").val("");
        $("#customerAddress").val("");
        $("#customerSalary").val("");
        $("#fullNameError").text("");
        $("#addressError").text("");
        $("#salaryError").text("");
    }
});

console.log("CustomerController.js loaded");