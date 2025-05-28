import React, { useState } from 'react'
import { assets } from '../assets/assets'
import axios from 'axios'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'
import AdminLayout from '../components/AdminLayout'
import Button from '../components/Button'

const Add = ({ token }) => {
  const [image1, setImage1] = useState(false)
  const [image2, setImage2] = useState(false)
  const [image3, setImage3] = useState(false)
  const [image4, setImage4] = useState(false)

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [category, setCategory] = useState("Men")
  const [subCategory, setSubCategory] = useState("Topwear")
  const [bestseller, setBestseller] = useState(false)
  const [sizes, setSizes] = useState([])

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    try {
      const formData = new FormData()
      formData.append("name", name)
      formData.append("description", description)
      formData.append("price", price)
      formData.append("category", category)
      formData.append("subCategory", subCategory)
      formData.append("bestseller", bestseller)
      formData.append("sizes", JSON.stringify(sizes))
      image1 && formData.append("image1", image1)
      image2 && formData.append("image2", image2)
      image3 && formData.append("image3", image3)
      image4 && formData.append("image4", image4)

      const response = await axios.post(backendUrl + "/api/product/add", formData, {
        headers: { token }
      })

      if (response.data.success) {
        toast.success(response.data.message)
        setName('')
        setDescription('')
        setImage1(false)
        setImage2(false)
        setImage3(false)
        setImage4(false)
        setPrice('')
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  return (
    <AdminLayout title="Add New Product">
      <form onSubmit={onSubmitHandler} className='flex flex-col w-full items-start gap-4'>

        {/* Upload Images */}
        <div>
          <p className='mb-2 font-medium'>Upload Images</p>
          <div className='flex gap-3'>
            {[{ image: image1, setter: setImage1, id: 'image1' },
              { image: image2, setter: setImage2, id: 'image2' },
              { image: image3, setter: setImage3, id: 'image3' },
              { image: image4, setter: setImage4, id: 'image4' }].map(({ image, setter, id }) => (
              <label key={id} htmlFor={id}>
                <img className='w-20 h-20 object-cover border rounded cursor-pointer' src={!image ? assets.upload_area : URL.createObjectURL(image)} alt="" />
                <input type="file" id={id} hidden onChange={(e) => setter(e.target.files[0])} />
              </label>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className='w-full'>
          <p className='mb-2 font-medium'>Product Name</p>
          <input onChange={(e) => setName(e.target.value)} value={name} className='w-full max-w-md px-3 py-2 border rounded' type="text" placeholder='Type here' required />
        </div>

        <div className='w-full'>
          <p className='mb-2 font-medium'>Product Description</p>
          <textarea onChange={(e) => setDescription(e.target.value)} value={description} className='w-full max-w-md px-3 py-2 border rounded' placeholder='Write content here' required />
        </div>

        {/* Category, SubCategory, Price */}
        <div className='flex flex-col sm:flex-row gap-4 w-full'>
          <div>
            <p className='mb-2 font-medium'>Category</p>
            <select onChange={(e) => setCategory(e.target.value)} value={category} className='px-3 py-2 border rounded'>
              <option value="ScrubSet">Scrub Sets</option>
              <option value="ScrubTop">Scrub Tops</option>
              <option value="JumpSuits">Jump Suits</option>
              <option value="NursesBadges">Nurses Badges</option>
              <option value="ClearanceSales">Clearance Sales</option>
              <option value="Bundles">Bundles</option>
            </select>
          </div>

          <div>
            <p className='mb-2 font-medium'>Subcategory</p>
            <select onChange={(e) => setSubCategory(e.target.value)} value={subCategory} className='px-3 py-2 border rounded'>
              <option value="Topwear">Topwear</option>
              <option value="Bottomwear">Bottomwear</option>
              <option value="Set">Set</option>
            </select>
          </div>

          <div>
            <p className='mb-2 font-medium'>Price</p>
            <input onChange={(e) => setPrice(e.target.value)} value={price} type="number" placeholder="25" className='px-3 py-2 border rounded w-[120px]' />
          </div>
        </div>

        {/* Sizes */}
        <div>
          <p className='mb-2 font-medium'>Sizes</p>
          <div className='flex gap-3'>
            {['S', 'M', 'L', 'XL', 'XXL'].map(size => (
              <div key={size} onClick={() => setSizes(prev => prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size])}>
                <p className={`${sizes.includes(size) ? "bg-blue-100 text-blue-800" : "bg-slate-200"} px-3 py-1 rounded cursor-pointer`}>{size}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bestseller Checkbox */}
        <div className='flex items-center gap-2'>
          <input type="checkbox" id="bestseller" checked={bestseller} onChange={() => setBestseller(prev => !prev)} />
          <label htmlFor="bestseller" className='cursor-pointer'>Mark as Bestseller</label>
        </div>

        {/* Submit */}
        <Button type="submit" className="mt-4">Add Product</Button>
      </form>
    </AdminLayout>
  )
}

export default Add
