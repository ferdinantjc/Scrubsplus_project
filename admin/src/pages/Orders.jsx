import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'
import AdminLayout from '../components/AdminLayout'

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([])

  const fetchAllOrders = async () => {
    if (!token) return
    try {
      const response = await axios.post(
        backendUrl + '/api/order/list',
        {},
        { headers: { token } }
      )
      if (response.data.success) {
        setOrders(response.data.orders.reverse())
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(
        backendUrl + '/api/order/status',
        { orderId, status: event.target.value },
        { headers: { token } }
      )
      if (response.data.success) {
        await fetchAllOrders()
      }
    } catch (error) {
      console.log(error)
      toast.error('Could not update order status')
    }
  }

  useEffect(() => {
    fetchAllOrders()
  }, [token])

  return (
    <AdminLayout title="Orders">
      <div className="flex flex-col gap-4">
        {orders.map((order, index) => (
          <div
            key={index}
            className="grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-3 items-start border border-gray-200 rounded-xl p-4 bg-white shadow-sm"
          >
            {/* Parcel icon */}
            <img className="w-10 h-10 object-contain" src={assets.parcel_icon} alt="parcel" />

            {/* Item details and address */}
            <div>
              <div className="mb-2">
                {order.items.map((item, index) => (
                  <p className="text-sm" key={index}>
                    {item.name} x {item.quantity} <span>{item.size}</span>
                    {index !== order.items.length - 1 && <span>,</span>}
                  </p>
                ))}
              </div>
              <p className="font-semibold mt-2">
                {order.address.firstName} {order.address.lastName}
              </p>
              <p className="text-sm">{order.address.street}</p>
              <p className="text-sm">
                {order.address.city}, {order.address.state}, {order.address.country}, {order.address.zipcode}
              </p>
              <p className="text-sm">{order.address.phone}</p>
            </div>

            {/* Payment and date */}
            <div className="text-sm flex flex-col gap-1">
              <p>Items: {order.items.length}</p>
              <p>Method: {order.paymentMethod}</p>
              <p>Payment: {order.payment ? '✅ Done' : '❌ Pending'}</p>
              <p>Date: {new Date(order.date).toLocaleDateString()}</p>
            </div>

            {/* Amount */}
            <div className="text-sm font-semibold text-blue-700">{currency}{order.amount}</div>

            {/* Status dropdown */}
            <select
              onChange={(event) => statusHandler(event, order._id)}
              value={order.status}
              className="p-2 text-sm border rounded font-medium bg-gray-50"
            >
              <option value="Order Placed">Order Placed</option>
              <option value="Packing">Packing</option>
              <option value="Shipped">Shipped</option>
              <option value="Out for delivery">Out for delivery</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
        ))}
      </div>
    </AdminLayout>
  )
}

export default Orders
