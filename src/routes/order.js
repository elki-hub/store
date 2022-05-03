const express = require("express");
const router = express.Router();
const viewsOrderPath = "admin/order/";
const adminLayout = "_layouts/admin_layout";
const { OrderWasNotFound } = require("../utils/errors");
const { checkAuthAdmin } = require("../utils/authorization");
const {
  getOrderById,
  getAllOrders,
  updateOrderStatus,
} = require("../utils/orders");

const stats = [
  "Order rejected",
  "Pending for confirmation",
  "Pending for delivery confirmation",
  "Order delivered",
];
const stats2 = ["reject", "confirm", "confirmDelivery"];

router.get("/", checkAuthAdmin, async (req, res) => {
  res.render(viewsOrderPath + "order", {
    layout: adminLayout,
    title: "Orders",
    orders: await getAllOrders(),
    stats: stats,
  });
});

router.get("/view/:id", async (req, res) => {
  const order = await getOrderById(req.params.id);
  if (order === undefined) {
    req.flash(
      "warning",
      `Status: ${OrderWasNotFound.status}! ${OrderWasNotFound.message}`
    );
    return res.redirect("/admin");
  }

  res.render(viewsOrderPath + "show", {
    layout: adminLayout,
    title: "Order's details",
    order: order,
    stats: stats,
  });
});

router.get("/:id/status/:status", checkAuthAdmin, async (req, res) => {
  const order = await getOrderById(req.params.id);

  if (
    (await updateOrderStatus(order, stats2.indexOf(req.params.status))) == null
  ) {
    req.flash(
      "warning",
      `Status: ${OrderWasNotFound.status}! ${OrderWasNotFound.message}`
    );
  }
  //---------------------------------------------------------------------------------------
  if (req.params.status === stats2[1]) {
    req.flash("success", "Order ( nr.: " + req.params.id + ") was confirmed!");
  } else if (req.params.status === stats2[2]) {
    req.flash(
      "success",
      "Order's ( nr.: " + req.params.id + ") delivery was confirmed!"
    );
  } else if (req.params.status === stats2[0]) {
    req.flash("success", "Order ( nr.: " + req.params.id + ") was rejected!");
  } else {
    req.flash(
      "warning",
      "Failed to confirm, reject or confirm order ( nr.: " +
        req.params.id +
        ") !"
    );
  }
  res.redirect("/admin/order");
});

module.exports = router;
