import React from 'react'
import LayOut from '../../components/admin/layOut/layOut'
import Login from '../../components/login/login'
import Footer from '../../components/admin/layOut/footer/footer'

function login() {
  return (
    <LayOut>
         <Login /> 
         <Footer/>
    </LayOut>
  )
}

export default login
