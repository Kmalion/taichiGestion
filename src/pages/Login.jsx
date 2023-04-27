import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';


import React from 'react'
export const Login = () => {
return (
<div>
  <div className="flex align-items-center justify-content-center">
    <div className="surface-card p-4 shadow-2 border-round w-full lg:w-6">
      <div className="text-center mb-5">
        <img src="https://taichi-holdings-colombia.com/img/logotaichi.png" alt="hyper" height={50} className="mb-3" />

      </div>

      <div>
        <label htmlFor="email" className="block text-900 font-medium mb-2">Email</label>
        <InputText id="email" type="text" placeholder="Email address" className="w-full mb-3" />

        <label htmlFor="password" className="block text-900 font-medium mb-2">Password</label>
        <InputText id="password" type="password" placeholder="Password" className="w-full mb-3" />

        <div className="flex align-items-center justify-content-between mb-6">

          <a className="font-medium no-underline ml-2 text-blue-500 text-right cursor-pointer">Forgot your password?</a>
        </div>

        <Button label="Sign In" icon="pi pi-user" className="w-full" />
      </div>
    </div>
  </div>
</div>
)
}

