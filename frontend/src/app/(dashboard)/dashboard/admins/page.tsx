'use client'

import { useEffect, useState, useCallback } from 'react'
import { Shield, Crown, User, UserX, RefreshCw, AlertCircle, Check, Loader2 } from 'lucide-react'
import { adminService } from '@/services/api'
import { getUser } from '@/lib/auth'
import { cn } from '@/lib/utils'

type AdminUser = { id: number; name: string; email: string; role: string; isActive: boolean; createdAt: string }

const ROLE_STYLE: Record<string, string> = {
  superadmin: 'bg-purple-100 text-purple-700 border-purple-200',
  admin:      'bg-primary-100 text-primary-700 border-primary-200',
  user:       'bg-gray-100 text-gray-600 border-gray-200',
}
const ROLE_ICON: Record<string, React.ElementType> = {
  superadmin: Crown,
  admin:      Shield,
  user:       User,
}

export default function AdminsPage() {
  const me = getUser()
  const isSuperAdmin = me?.role === 'superadmin'

  const [users,   setUsers]   = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState('')
  const [toast,   setToast]   = useState('')
  const [working, setWorking] = useState<number | null>(null)

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000) }

  const load = useCallback(async () => {
    setLoading(true); setError('')
    try { setUsers(await adminService.getUsers()) }
    catch (err: any) { setError(err.message) }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  const handleRoleChange = async (user: AdminUser, role: 'admin' | 'user') => {
    setWorking(user.id)
    try {
      await adminService.setRole(user.id, role)
      showToast(`${user.name} is now ${role}`)
      load()
    } catch (err: any) { setError(err.message) }
    finally { setWorking(null) }
  }

  const handleDeactivate = async (user: AdminUser) => {
    if (!confirm(`Deactivate ${user.name}?`)) return
    setWorking(user.id)
    try {
      await adminService.deactivate(user.id)
      showToast(`${user.name} deactivated`)
      load()
    } catch (err: any) { setError(err.message) }
    finally { setWorking(null) }
  }

  if (!isSuperAdmin) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <Crown className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-gray-900 mb-1">Superadmin Only</h2>
        <p className="text-gray-500 text-sm">Only the superadmin can manage admin roles.</p>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">

      {toast && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-green-600 text-white px-4 py-3 rounded-xl shadow-lg text-sm font-medium">
          <Check className="w-4 h-4" /> {toast}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Crown className="w-6 h-6 text-purple-600" /> Admin Management
          </h1>
          <p className="text-gray-500 mt-1 text-sm">Promote users to admin or revoke access</p>
        </div>
      </div>

      {/* Role legend */}
      <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
        <p className="text-xs font-semibold text-purple-700 mb-2">Role Hierarchy</p>
        <div className="flex flex-wrap gap-3 text-xs">
          <span className="flex items-center gap-1.5 text-purple-700"><Crown className="w-3.5 h-3.5" /> Superadmin — full access + manage admins (only you)</span>
          <span className="flex items-center gap-1.5 text-primary-700"><Shield className="w-3.5 h-3.5" /> Admin — full dashboard access</span>
          <span className="flex items-center gap-1.5 text-gray-600"><User className="w-3.5 h-3.5" /> User — customer account only</span>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
          <button onClick={load} className="ml-auto flex items-center gap-1 text-xs hover:underline">
            <RefreshCw className="w-3.5 h-3.5" /> Retry
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Joined</th>
                <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map(u => {
                const RoleIcon = ROLE_ICON[u.role] ?? User
                const isSelf = u.id === Number(me?.id)                const isSuper = u.role === 'superadmin'
                const busy = working === u.id

                return (
                  <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <p className="font-medium text-gray-900">{u.name} {isSelf && <span className="text-xs text-gray-400">(you)</span>}</p>
                      <p className="text-xs text-gray-500">{u.email}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold', ROLE_STYLE[u.role] ?? ROLE_STYLE.user)}>
                        <RoleIcon className="w-3 h-3" />
                        {u.role}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full', u.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600')}>
                        {u.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs text-gray-500">
                      {new Date(u.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-5 py-4">
                      {!isSelf && !isSuper && (
                        <div className="flex items-center justify-end gap-2">
                          {busy ? <Loader2 className="w-4 h-4 animate-spin text-gray-400" /> : (
                            <>
                              {u.role === 'user' ? (
                                <button onClick={() => handleRoleChange(u, 'admin')}
                                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-xs font-medium transition-colors">
                                  <Shield className="w-3.5 h-3.5" /> Make Admin
                                </button>
                              ) : (
                                <button onClick={() => handleRoleChange(u, 'user')}
                                  className="inline-flex items-center gap-1 px-3 py-1.5 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg text-xs font-medium transition-colors">
                                  <User className="w-3.5 h-3.5" /> Remove Admin
                                </button>
                              )}
                              {u.isActive && (
                                <button onClick={() => handleDeactivate(u)}
                                  className="p-1.5 hover:bg-red-50 rounded-lg transition-colors" title="Deactivate">
                                  <UserX className="w-4 h-4 text-red-500" />
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      )}
                      {isSuper && <span className="text-xs text-gray-400 text-right block">Protected</span>}
                      {isSelf && <span className="text-xs text-gray-400 text-right block">You</span>}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
