'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { signup } from '@/actions/auth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

function SubmitButton() {
  const { pending } = useFormStatus()
 
  return (
    <button className="w-full bg-blue-500 text-white p-2 rounded disabled:opacity-50" aria-disabled={pending}>
      Sign Up
    </button>
  )
}

export default function SignupForm() {
  const [state, dispatch] = useActionState(signup, undefined)
 
  return (
    <form action={dispatch} className="flex flex-col gap-4">
      <div>
        <label className="block text-sm font-medium">Email</label>
        <input name="email" type="email" required className="mt-1 block w-full border rounded p-2 text-black" />
      </div>
      <div>
        <label className="block text-sm font-medium">Username</label>
        <input name="username" type="text" required className="mt-1 block w-full border rounded p-2 text-black" />
      </div>
      <div>
        <label className="block text-sm font-medium">Full Name</label>
        <input name="name" type="text" className="mt-1 block w-full border rounded p-2 text-black" />
      </div>
      <div>
        <label className="block text-sm font-medium">Password</label>
        <input name="password" type="password" required className="mt-1 block w-full border rounded p-2 text-black" />
      </div>
      <div>
          {state && <p className="text-red-500">{state}</p>}
      </div>
      <SubmitButton />
    </form>
  )
}
