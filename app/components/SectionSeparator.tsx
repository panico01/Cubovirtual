import React from 'react'

const SectionSeparator = () => {
  return (
    // Ajustamos a altura (h-2) e fortalecemos o gradiente
    <div className="bg-white dark:bg-black py-4"> 
        <div className="container mx-auto px-6">
            <div className="w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
        </div>
    </div>
  )
}

export default SectionSeparator