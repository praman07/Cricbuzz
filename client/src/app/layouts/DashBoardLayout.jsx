import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../../features/dashboard/ui/components/Sidebar'
import Header from '../../features/dashboard/ui/components/Header'

const DashBoardLayout = () => {
  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-800">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col h-screen overflow-hidden relative">
        <Header />
        <main className="flex-1 overflow-y-auto p-6 bg-slate-50">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default DashBoardLayout
