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
  rejectDetails,
} = require("../utils/orders");

const stats = [
  "Order rejected",
  "Pending for confirmation",
  "Pending for delivery confirmation",
  "Order delivered",
];
const stats2 = ["reject", "confirm", "confirmDelivery"];

router.get("/:page", checkAuthAdmin, async (req, res) => {
  const orders = await getAllOrders();

  //----------------------------

  const currentPage = req.params.page;
  const limit = 5;
  let pages = orders.length / limit;
  console.log("length " + orders.length);
  console.log("pages " + pages);
  console.log("liekana " + (pages % limit));

  if (orders.length % limit !== 0) {
    pages++;
  }

  const startIndex = (currentPage - 1) * limit;
  const endIndex = currentPage * limit;

  const result = orders.slice(startIndex, endIndex);
  //const result = orders.slice(0, 3);
  //console.log(result);
  //----------------------------
  res.render(viewsOrderPath + "order", {
    layout: adminLayout,
    title: "Orders",
    orders: result,
    //orders: orders,
    stats: stats,
    pages: pages,
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

router.put("/reject/:id", async (req, res) => {
  //console.log(req.body.detailsReject);
  try {
    await rejectDetails(req.params.id, req.body.detailsReject);
  } catch (error) {
    req.flash("warning", error.toString().split(`:`)[2] + "!");
    return res.redirect("./");
  }
  res.redirect("/admin/order");
});

router.get("/rejectDetails/:id", async (req, res) => {
  const order = await getOrderById(req.params.id);
  if (order === undefined) {
    req.flash(
      "warning",
      `Status: ${OrderWasNotFound.status}! ${OrderWasNotFound.message}`
    );
    return res.redirect("/admin");
  }

  res.render(viewsOrderPath + "rejectDetails", {
    layout: adminLayout,
    title: "Reject order reason",
    order: order,
    stats: stats,
  });
});

module.exports = router;
