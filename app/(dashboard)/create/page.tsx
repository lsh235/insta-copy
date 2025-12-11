'use client'

import { createPost } from '@/actions/post'
import { useRouter } from 'next/navigation'
import { useState, useRef } from 'react'
import { Upload, X } from 'lucide-react'
import Image from 'next/image'

export default function CreatePostPage() {
  const router = useRouter()
  const [preview, setPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const objectUrl = URL.createObjectURL(file)
      setPreview(objectUrl)
    }
  }

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true)
    try {
        await createPost(formData)
        router.push('/')
    } catch (e) {
        console.error(e)
        alert('Failed to create post')
    } finally {
        setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-xl font-bold mb-4">Create New Post</h1>
      
      <form action={handleSubmit} className="w-full max-w-md flex flex-col gap-4">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center min-h-[300px] relative bg-gray-50">
          {preview ? (
            <div className="relative w-full h-full">
              <Image 
                src={preview} 
                alt="Preview" 
                width={400} 
                height={400} 
                className="w-full h-full object-contain rounded-md"
              />
              <button 
                type="button"
                onClick={() => {
                    setPreview(null);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                }}
                className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 hover:bg-black/70"
              >
                <X size={20} />
              </button>
            </div>
          ) : (
            <div 
                className="flex flex-col items-center cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
            >
              <Upload size={48} className="text-gray-400 mb-2" />
              <p className="text-gray-500 font-medium">Select from computer</p>
            </div>
          )}
          <input 
            type="file" 
            name="file" 
            accept="image/*" 
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden" 
            required
          />
        </div>

        <div>
            <textarea 
                name="caption" 
                placeholder="Write a caption..." 
                className="w-full border border-gray-300 rounded-lg p-3 min-h-[100px] resize-none focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
        </div>

        <button 
            type="submit" 
            disabled={!preview || isSubmitting}
            className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg disabled:opacity-50 hover:bg-blue-600 transition-colors"
        >
            {isSubmitting ? 'Sharing...' : 'Share'}
        </button>
      </form>
    </div>
  )
}
