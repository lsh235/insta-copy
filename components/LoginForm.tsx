'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { authenticate } from '@/actions/auth'

function SubmitButton() {
  const { pending } = useFormStatus()
 
  return (
    <button className="w-full bg-blue-500 text-white p-2 rounded disabled:opacity-50" aria-disabled={pending}>
      Log In
    </button>
  )
}

export default function LoginForm() {
  const [errorMessage, dispatch] = useActionState(authenticate, undefined)
 
  return (
    <form action={dispatch} className="flex flex-col gap-4">
      <div>
        <label className="block text-sm font-medium">Email</label>
        <input name="email" type="email" required className="mt-1 block w-full border rounded p-2 text-black" />
      </div>
      <div>
        <label className="block text-sm font-medium">Password</label>
        <input name="password" type="password" required className="mt-1 block w-full border rounded p-2 text-black" />
      </div>
      <div className="flex items-center justify-between">
         <div className="text-sm">
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
         </div>
      </div>
      <SubmitButton />
    </form>
  )
}
