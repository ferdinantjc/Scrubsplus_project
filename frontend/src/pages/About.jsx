import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsletterBox from '../components/NewsletterBox'

const About = () => {
  return (
    <div>

      <div className='text-2xl text-center pt-8 border-t'>
          <Title text1={'ABOUT'} text2={'US'} />
      </div>

      <div className='my-10 flex flex-col md:flex-row gap-16'>
          <img className='w-full md:max-w-[450px]' src={assets.about_img} alt="" />
          <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray-600'>
              <p>At ScrubsPlus, we're inspired by the incredible dedication and compassion of medical staff everywhere. Our journey began after spending time at Royal Children's Hospitals, where we witnessed firsthand the magic that healthcare professionals bring to their work. Whether in pediatric wards, emergency rooms, or specialized units, these healthcare heroes truly work magic to heal children, bringing joy and comfort to their patients' lives. Our scrubs are designed to make a difference in the lives of both medical professionals and their patients, paying tribute to these heroes with designs that uplift spirits and spread positivity in healthcare settings.

Our Products:
Crafted with care and attention to detail, our scrubs are more than just clothing – they're symbols of hope and happiness. Made from high-quality materials and featuring vibrant superhero patterns, our scrubs are specifically designed to bring joy to children. The playful and colorful designs are intended to create a cheerful atmosphere, helping to ease the anxiety of young patients and make their healthcare experience more positive.

Why Choose ScrubsPlus:
Inspiration: Our designs are inspired by the superpowers of healthcare professionals, reminding wearers of their ability to make a difference and bring smiles to every ward. The bright and engaging patterns capture children's imaginations, providing comfort and distraction during medical visits.

Comfort: Designed for comfort and durability, our scrubs are made to support you through long shifts while allowing you to move freely and comfortably. The softness and flexibility of our fabrics ensure that you can provide the best care possible, all while maintaining a joyful presence for your young patients.

Impact: By choosing ScrubsPlus, you're not just purchasing scrubs – you're supporting our mission to spread joy and positivity in healthcare settings. Our scrubs contribute to the healing process by creating a fun and friendly environment for children.

Join the ScrubsPlus Family:
Whether you're a nurse, doctor, or medical professional, we invite you to join the ScrubsPlus family and experience the difference our scrubs can make. Together, let's continue to bring smiles through care and make a positive impact in the lives of the children we serve.</p>
              
              <b className='text-gray-800'>Our Mission</b>
              <p>Our mission at Forever is to empower customers with choice, convenience, and confidence. We're dedicated to providing a seamless shopping experience that exceeds expectations, from browsing and ordering to delivery and beyond.</p>
          </div>
      </div>

      <div className=' text-xl py-4'>
          <Title text1={'WHY'} text2={'CHOOSE US'} />
      </div>

      <div className='flex flex-col md:flex-row text-sm mb-20'>
          <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
            <b>Quality Assurance:</b>
            <p className=' text-gray-600'>We meticulously select and vet each product to ensure it meets our stringent quality standards.</p>
          </div>
          <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
            <b>Convenience:</b>
            <p className=' text-gray-600'>With our user-friendly interface and hassle-free ordering process, shopping has never been easier.</p>
          </div>
          <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
            <b>Exceptional Customer Service:</b>
            <p className=' text-gray-600'>Our team of dedicated professionals is here to assist you the way, ensuring your satisfaction is our top priority.</p>
          </div>
      </div>

      <NewsletterBox/>
      
    </div>
  )
}

export default About
