import React, { Component } from 'react'
import {NavLink,Route,Routes,Navigate} from 'react-router-dom'

import Resume from '../../pages/Resume'
import Blogs from '../../pages/Blogs'

export default class Header extends Component {
  
  render() {
    return (
      <div>
        <header className="bg-white shadow flex justify-between items-end px-6 py-4 h-20">
          <div className="flex items-center space-x-3">
            <img src="/title.jpg" alt="Logo" className="w-10 h-10 rounded-full" />
            <span className="text-xl font-bold text-gray-800">光之梦想（Ray Dream）</span>
          </div>
          <div className="flex space-x-6 mb-1">
            <NavLink to="/resume" >Home</NavLink>
            <NavLink to="/blogs" >Blogs</NavLink>
          </div>
        </header>

        <Routes>
          <Route path="/" element={<Resume />} />
          <Route path="/resume" element={<Resume />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    )
  }
}