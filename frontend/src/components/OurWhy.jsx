import React from 'react'
import { assets } from '../assets/assets'

const OurWhy = () => {
  return (
    <div>
      {/* Left side: Image and Text */}
      <div className='flex items-center justify-between gap-12 py-20 text-xs sm:text-sm md:text-base text-gray-700'>
        {/* Left side: Larger Image */}
        <div className='flex w-1/2'>
          <img src={assets.quality_icon} className='w-full object-cover' alt="Our Why" />
        </div>
        
        {/* Right side: Text */}
        <div className='text-left w-1/2'>
          <p className='font-semibold text-lg'>Our Why</p>
          <p className='text-gray-400'>
            A recent study about "The Effect of Themed Pediatric Environments on Children's Stress Levels" highlights the importance of the environment the child is in.
            This study explored the impact of themed environments in pediatric wards, such as those featuring familiar characters and superheroes, on children's stress levels.
            It found a significant reduction in anxiety among children exposed to these environments.
            
            Reference:
            Journal of Pediatric Nursing, Volume 50, 2020, Pages 90-98.
          </p>
        </div>
      </div>

      {/* Right side: Image and Text (Reversed order) */}
      <div className='flex items-center justify-between gap-12 py-20 text-xs sm:text-sm md:text-base text-gray-700'>
        {/* Left side: Text */}
        <div className='text-left w-1/2'>
          <p className='font-semibold text-lg'>Bringing Smiles Through Care</p>
          <p className='text-gray-400'>
          Our journey began after spending time at Royal Children's Hospital for our youngest Leo, where we witnessed firsthand the magic that healthcare professionals bring to their work. Whether in pediatric wards, emergency rooms, or specialised units, these healthcare heroes truly work magic to heal children, bringing joy and comfort to their patients' lives.

Our scrubs are designed to make a difference in the lives of both medical professionals and their patients, paying tribute to these heroes with designs that uplift spirits and spread positivity in healthcare settings.
          </p>
        </div>

        {/* Right side: Larger Image */}
        <div className='flex w-1/2'>
          <img src={assets.exchange_icon} className='w-full object-cover' alt="Our Why" />
        </div>
      </div>
    </div>
  )
}

export default OurWhy
