import React from 'react'
import { assets } from '../../assets/assets'

const SearchBar = ({ value, onChange }) => {
  return (
    <div className="max-w-xl w-full md:h-14 h-12 flex items-center bg-white border border-gray-500/20 rounded">
      <img className="md:w-auto w-10 px-3" src={assets.search_icon} alt="search_icon" />
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full h-full outline-none text-gray-500/80"
        placeholder="Search for courses"
      />
      {/* Optional: You can keep the button if you want, but it's no longer required */}
      {/* <button type='submit' className="bg-blue-600 rounded text-white md:px-10 px-7 md:py-3 py-2 mx-1">Search</button> */}
    </div>
  )
}

export default SearchBar
