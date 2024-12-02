import React from 'react'
import LayOut from '../../../components/admin/layOut/layOut'
import Dashboard from '../../../components/admin/dashborad/dashboard'

const dashboard = () => {
  return (
    <LayOut>
      <div className='flex h-screen bg-gray-900 text-gray-100 overflow-hidden'>
        <Dashboard />
      </div>
    </LayOut>
  )
}

export default dashboard