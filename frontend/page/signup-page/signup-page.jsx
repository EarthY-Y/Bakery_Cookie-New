import React from 'react'
import Layout from '../../components/admin/layOut/layOut'
import Signup from '../../components/signup/signup'
import Footer from '../../components/admin/layOut/footer/footer'

function signup() {
  return (
    <div>
      <Layout>
        <Signup />
        <Footer/>
      </Layout>
    </div>
  )
}

export default signup
