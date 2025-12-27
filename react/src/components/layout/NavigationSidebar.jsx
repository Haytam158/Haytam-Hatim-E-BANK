import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function NavigationSidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
    onClose()
  }

  const getDashboardPath = () => {
    if (user?.roles?.includes('AGENT_GUICHET')) {
      return '/agent'
    } else if (user?.roles?.includes('CLIENT')) {
      return '/client'
    }
    return '/agent'
  }

  const handleNavigation = (path) => {
    navigate(path)
    onClose()
  }

  return (
    <>
      {/* Overlay - Only covers body, not header */}
      {isOpen && (
        <div
          className="fixed left-0 top-16 right-0 bottom-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar - Below header */}
      <aside
        className={`fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white/95 backdrop-blur-lg shadow-2xl border-r border-gray-200/50 z-40 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Navigation */}
          <nav className="flex-1 p-4 flex flex-col">
            <div className="space-y-2">
              <button
                onClick={() => handleNavigation(getDashboardPath())}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span>Tableau de bord</span>
              </button>

              <button
                onClick={() => handleNavigation('/profile')}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>Profil</span>
              </button>
            </div>

            {/* Logout button - Always at bottom */}
            <div className="mt-auto pt-4">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg shadow-red-500/30 transform hover:scale-105 active:scale-95"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Déconnexion</span>
              </button>
            </div>
          </nav>
        </div>
      </aside>
    </>
  )
}

