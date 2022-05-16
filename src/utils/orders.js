const Orders = require("../models/order");
const Order = require("../models/order");

async function getAllOrders() {
  try {
    return await Orders.find().sort({ data: "desc" });
  } catch (error) {
    console.log(error);
    return [];
  }
}

async function getAllOrdersByUserId(id) {
  try {
    return await Orders.find({ userid: id });
  } catch (error) {
    console.log(error);
    return [];
  }
}

async function createNewOrder(cart, user) {
  let order = new Order();
  let price = 0;

  await cart.forEach(
    (product) => (price += parseFloat(product.price) * product.quantity)
  );

  order.userid = user.email;
  order.price = price;
  order.details = [user.name, user.surname, user.phone, user.address];
  order.products = cart;

  return await order.save();
}

async function getOrderById(id) {
  try {
    return await Orders.findById(id);
  } catch (error) {
    console.log(error);
    return [];
  }
}

async function updateOrderStatus(order, status) {
  try {
    if (status === 1 && order.status === 1) {
      order.status = 2;
    } else if (status === 2 && order.status === 2) {
      order.status = 3;
    } else if (status === 0 && order.status === 1) {
      order.status = 0;
    } else {
      return null;
    }
    return await order.save();
  } catch (error) {
    console.log(error);
    return [];
  }
}

async function rejectDetails(orderId, detailsReject) {
  let order = await Order.findById(orderId);
  order.statusDetails = detailsReject;
  order.status = 0;
  await order.save();
}

module.exports = {
  rejectDetails,
  createNewOrder,
  getAllOrdersByUserId,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
};
