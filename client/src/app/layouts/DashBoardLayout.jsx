import React from 'react'
import { Outlet } from 'react-router'

const DashBoardLayout = () => {
  return (
    <div>
      This is Dashboard Layout
      <Outlet/>
    </div>
  )
}

export default DashBoardLayout
