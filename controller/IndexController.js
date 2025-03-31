console.log("IndexController.js loaded");

$(document).ready(function () {
    $("a.nav-link").click(function (e) {
      e.preventDefault();
      let sectionId = $(this).attr("href").substring(1);
      let pageHeader = $("#pageHeader");
      let headerText = "Dashboard";

      switch (sectionId) {
        case "customer-registration":
          headerText = "Customer Manage";
          break;
        case "item-registration":
          headerText = "Item Manage";
          break;
        case "order-management":
          headerText = "Order Manage";
          break;
      }

      pageHeader.text(headerText);

      $("html, body").animate(
        {
          scrollTop: $("#" + sectionId).offset().top,
        },
        500
      );
    });
  });