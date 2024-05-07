import React from 'react'

const Footer = () => {

    const date = new Date()
    const year = date.getFullYear()
    
  return (
    <footer className='w-full border-t py-6'>
        <div className='container mx-auto flex justify-around'>
            <p>&copy; {year} Blog Site. All Rights Reserved.</p>
        </div>
    </footer>
  )
}

export default Footer