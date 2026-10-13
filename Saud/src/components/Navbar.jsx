import React from 'react'
import Header from './Header'
const Navbar = ({ onNavigate }) => {
  return (
    <div className='w-full'>
        <div>
            <Header onNavigate={onNavigate} />
        </div>
    </div>
  )
}
export default Navbar
