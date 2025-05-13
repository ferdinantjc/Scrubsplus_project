import React from 'react'
import { assets } from '../assets/assets'

const Hero = () => {
  return (
    <div className='w-full h-low'> {/* Full height for the hero area */}
      <img className='w-full h-full object-contain' src={assets.hero_img} alt="Hero" /> {/* Image fills the whole area */}
    </div>
  )
}

export default Hero
