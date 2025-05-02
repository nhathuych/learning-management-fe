import Link from 'next/link'
import React from 'react'

const Footer = () => {
  return (
    <div className='footer'>
      <p>&copy; 2025 Shadcn. All Rights Reseved.</p>
      <div className='footer__links'>
        {['About', 'Privacy Policy', 'Licensing', 'Contract'].map((item, index) => (
          <Link
            key={index}
            href={`/${item.toLowerCase().replace(' ', '-')}`}
            className='footer__link'
          >
            {item}
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Footer
