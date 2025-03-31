console.log("ItemController.js loaded");
$(document).ready(function () {
    let selectedItemIndex = null;

    updateItemTable();
    generatedItemId();

    function generatedItemId() {
        let nextItemId = itemDB.length + 1;
        const generatedItemId = "I00-" + ("00" + nextItemId).slice(-2);
        $("#itemCode").val(generatedItemId);
    }

    function validateField(fieldId, errorId, errorMessage, isNumeric = false) {
        $(fieldId).focus(function () {
            const value = $(this).val().trim();
            if (value === "") {
                $(errorId).text(errorMessage);
            } else if (isNumeric && parseFloat(value) < 0) {
                $(errorId).text("Cannot be negative!");
            }
        });

        $(fieldId).on("input", function () {
            const value = $(this).val().trim();
            if (value === "") {
                $(errorId).text(errorMessage);
            } else if (isNumeric) {
                if (isNaN(value) || parseFloat(value) < 0) {
                    $(errorId).text("Must be a positive number!");
                } else {
                    $(errorId).text("");
                }
            } else {
                $(errorId).text("");
            }
        });
    }

    validateField("#itemName", "#itemNameError", "Please input Item Name!");
    validateField("#itemQty", "#itemQtyError", "Please input Item Quantity!", true);
    validateField("#itemPrice", "#itemPriceError", "Please input Item Price!", true);

    $("#addItemBtn").click(function () {
        let code = $("#itemCode").val();
        let name = $("#itemName").val().trim();
        let quantity = $("#itemQty").val().trim();
        let price = $("#itemPrice").val().trim();

        if (!isItemValidated()) {
            alert("Please fill all required fields with valid data!");
            return;
        }

        if (parseFloat(quantity) <= 0 || parseFloat(price) <= 0) {
            alert("Quantity and Price must be positive numbers!");
            return;
        }

        const itemExists = itemDB.some(item => item.itemCode === code);
        
        if (itemExists) {
            alert("Item with this ID already exists!");
            return;
        }

        var item = {
            itemCode: code,
            itemName: name,
            qty: quantity,
            unitPrice: price,
        };

        itemDB.push(item);
        addItemToTable(item);
        resetItemForm();
        generatedItemId();
    });

    $("#removeItemBtn").click(function () {
        if (selectedItemIndex !== null) {
            if (confirm("Are you sure you want to delete this item?")) {
                itemDB.splice(selectedItemIndex, 1);
                updateItemTable();
                selectedItemIndex = null;
                resetItemForm();
                generatedItemId();
            }
        } else {
            alert("Please select an item to delete!");
        }
    });

    $("#updateItemBtn").click(function () {
        if (selectedItemIndex === null) {
            alert("Please select an item to update!");
            return;
        }

        if (!isItemValidated()) {
            alert("Please fill all required fields with valid data!");
            return;
        }

        let newCode = $("#itemCode").val();
        let quantity = $("#itemQty").val();
        let price = $("#itemPrice").val();

        if (parseFloat(quantity) <= 0 || parseFloat(price) <= 0) {
            alert("Quantity and Price must be positive numbers!");
            return;
        }
        
        const codeExists = itemDB.some((item, index) => 
            index !== selectedItemIndex && item.itemCode === newCode
        );
        
        if (codeExists) {
            alert("Another item with this ID already exists!");
            return;
        }
        
        itemDB[selectedItemIndex] = {
            itemCode: newCode,
            itemName: $("#itemName").val().trim(),
            qty: quantity,
            unitPrice: price,
        };
        
        updateItemTable();
        resetItemForm();
        selectedItemIndex = null;
        generatedItemId();
    });

    $("#clearItemBtn").click(function () {
        resetItemForm();
        $("#itemNameError").text("");
        $("#itemQtyError").text("");
        $("#itemPriceError").text("");
        selectedItemIndex = null;
        generatedItemId();
    });

    function addItemToTable(item) {
        const row = `<tr onclick="selectItem(${itemDB.length - 1})">
                        <td>${item.itemCode}</td>
                        <td>${item.itemName}</td>
                        <td>${item.qty}</td>
                        <td>${item.unitPrice}</td>
                    </tr>`;
        $("#itemTableBody").append(row);
    }

    function updateItemTable() {
        $("#itemTableBody").empty();
        itemDB.forEach((item, index) => {
            const row = `<tr onclick="selectItem(${index})">
                            <td>${item.itemCode}</td>
                            <td>${item.itemName}</td>
                            <td>${item.qty}</td>
                            <td>${item.unitPrice}</td>
                        </tr>`;
            $("#itemTableBody").append(row);
        });
    }

    window.selectItem = function (index) {
        selectedItemIndex = index;
        const selectedItem = itemDB[index];
        $("#itemCode").val(selectedItem.itemCode);
        $("#itemName").val(selectedItem.itemName);
        $("#itemQty").val(selectedItem.qty);
        $("#itemPrice").val(selectedItem.unitPrice);
    };

    function resetItemForm() {
        $("#itemName").val("");
        $("#itemQty").val("");
        $("#itemPrice").val("");
    }

    function isItemValidated() {
        const name = $("#itemName").val().trim();
        const quantity = $("#itemQty").val().trim();
        const price = $("#itemPrice").val().trim();
        
        return (
            name !== "" &&
            quantity !== "" && !isNaN(quantity) && parseFloat(quantity) > 0 &&
            price !== "" && !isNaN(price) && parseFloat(price) > 0
        );
    }
});