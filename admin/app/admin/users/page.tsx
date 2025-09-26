
"use client"

import { Suspense } from 'react'
import UsersContent from './UsersContent'

export default function AdminUsersPage() {
  return (
    <Suspense fallback={<div className="text-white">Loading...</div>}>
      <UsersContent />
    </Suspense>
  )
}
