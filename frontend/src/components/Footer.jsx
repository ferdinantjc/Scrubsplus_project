import React from 'react'
import { assets } from '../assets/assets'
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

const Footer = () => {
  return (
    <div>
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>

        <div>
            <img src={assets.logo} className='mb-5 w-32' alt="" />
            <p className='w-full md:w-2/3 text-gray-600'>
            Whether you're a nurse, doctor, or medical professional, we invite you to join the ScrubsPlus family and experience the difference our scrubs can make. Together, let's continue to bring smiles through care and make a positive impact in the lives of the children we serve.
            </p>
        </div>

        <div>
            <p className='text-xl font-medium mb-5'>COMPANY</p>
            <ul className='flex flex-col gap-1 text-gray-600'>
                <li>Home</li>
                <li>
                  <Link to="/About.jsx" className='text-gray-600 hover:underline'>
                    About us
                  </Link>
                </li>
                <li>Refunds & Returns</li>
                <li>FAQ</li>
            </ul>
        </div>

        <div>
            <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
            <ul className='flex flex-col gap-1 text-gray-600'>
                <li>Instagram: @Scrubsplus.au</li>
                <li>Email us: hello@scrubsplus.com.au</li>
            </ul>
        </div>

      </div>

        <div>
            <hr />
            <p className='py-5 text-sm text-center'>Copyright 2025@ ScrubsPlus.com - All Right Reserved.</p>
        </div>

    </div>
  )
}

export default Footer
