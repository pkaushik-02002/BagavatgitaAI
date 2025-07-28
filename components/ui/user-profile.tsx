"use client"

import { useState, useRef, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { User, Settings, LogOut, HelpCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"

export function UserProfile() {
  const { user, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])
  
  const handleLogout = async () => {
    await logout()
    router.push("/login")
  }
  
  if (!user) return null
  
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 rounded-full hover:bg-gray-100 transition-colors"
      >
        {user.photoURL ? (
          <Image 
            src={user.photoURL} 
            alt="User profile" 
            width={32} 
            height={32} 
            className="rounded-full"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white">
            {user.displayName ? user.displayName[0].toUpperCase() : user.email ? user.email[0].toUpperCase() : "U"}
          </div>
        )}
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              {user.photoURL ? (
                <Image 
                  src={user.photoURL} 
                  alt="User profile" 
                  width={40} 
                  height={40} 
                  className="rounded-full"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center text-white text-lg font-medium">
                  {user.displayName ? user.displayName[0].toUpperCase() : user.email ? user.email[0].toUpperCase() : "U"}
                </div>
              )}
              <div className="flex-1 min-w-0">
                {user.displayName && (
                  <p className="font-medium text-gray-900 truncate">{user.displayName}</p>
                )}
                <p className="text-sm text-gray-500 truncate">{user.email}</p>
              </div>
            </div>
          </div>
          
          <div className="p-2">
            <button className="flex items-center gap-3 w-full p-2 text-left text-sm rounded-md hover:bg-gray-100">
              <User size={16} className="text-gray-500" />
              <span>Profile</span>
            </button>
            <button className="flex items-center gap-3 w-full p-2 text-left text-sm rounded-md hover:bg-gray-100">
              <Settings size={16} className="text-gray-500" />
              <span>Settings</span>
            </button>
            <button className="flex items-center gap-3 w-full p-2 text-left text-sm rounded-md hover:bg-gray-100">
              <HelpCircle size={16} className="text-gray-500" />
              <span>Help & FAQ</span>
            </button>
          </div>
          
          <div className="p-2 border-t border-gray-200">
            <button 
              onClick={handleLogout}
              className="flex items-center gap-3 w-full p-2 text-left text-sm rounded-md hover:bg-gray-100 text-red-600"
            >
              <LogOut size={16} />
              <span>Sign out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}