import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify'
import AdminLayout from '../components/AdminLayout'
import Button from '../components/Button'

const List = ({ token }) => {
  const [list, setList] = useState([])
  const [editingProduct, setEditingProduct] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    description: '',
  })

  const fetchList = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/product/list')
      if (response.data.success) {
        setList(response.data.products.reverse())
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const removeProduct = async (id) => {
    try {
      const response = await axios.post(
        backendUrl + '/api/product/remove',
        { id },
        { headers: { token } }
      )
      if (response.data.success) {
        toast.success(response.data.message)
        await fetchList()
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const openEditModal = (product) => {
    setEditingProduct(product._id)
    setFormData({
      name: product.name,
      price: product.price,
      category: product.category,
      description: product.description || '',
    })
  }

  const closeModal = () => {
    setEditingProduct(null)
    setFormData({ name: '', price: '', category: '', description: '' })
  }

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleUpdate = async () => {
    try {
      const response = await axios.put(
        backendUrl + '/api/product/update',
        { id: editingProduct, ...formData },
        { headers: { token } }
      )

      if (response.data.success) {
        toast.success('Product updated')
        await fetchList()
        closeModal()
      } else {
        toast.error(response.data.message)
      }
    } catch (err) {
      console.log(err)
      toast.error('Update failed')
    }
  }

  useEffect(() => {
    fetchList()
  }, [])

  return (
    <AdminLayout title="Product List">
      <div className="flex flex-col gap-3">
        <div className="hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr] items-center py-2 px-4 border bg-gray-100 text-sm rounded-md shadow">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Actions</b>
        </div>

        {list.map(product => (
          <div
            key={product._id}
            className="grid grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr] items-center gap-2 border px-4 py-2 text-sm bg-white rounded shadow-sm"
          >
            <img
              src={product.image}
              alt={product.name}
              className="h-10 w-10 object-cover rounded"
            />
            <p>{product.name}</p>
            <p>{product.category}</p>
            <p>{currency}{product.price}</p>
            <div className="flex gap-2">
              <Button onClick={() => openEditModal(product)} className="text-white text-sm">Edit</Button>
              <Button
                onClick={() => removeProduct(product._id)}
                className="bg-red-600 hover:bg-red-700 text-white text-sm"
              >
                Delete
              </Button>
            </div>
          </div>
        ))}

        {editingProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] md:w-[400px]">
              <h2 className="text-lg mb-4 font-semibold">Edit Product</h2>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Name"
                className="w-full mb-2 border p-2 rounded"
              />
              <input
                type="text"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Price"
                className="w-full mb-2 border p-2 rounded"
              />
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="Category"
                className="w-full mb-2 border p-2 rounded"
              />
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Description"
                className="w-full mb-4 border p-2 rounded"
              ></textarea>

              <div className="flex justify-end gap-2">
                <Button
                  onClick={closeModal}
                  className="bg-gray-400 hover:bg-gray-500 text-white"
                >
                  Cancel
                </Button>
                <Button onClick={handleUpdate}>Update</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

export default List
