import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Input from '../ui/Input'
import Button from '../ui/Button'
import ErrorMessage from '../ui/ErrorMessage'

export default function LoginForm() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // Checking for error message from route state (e.g., unauthorized access)
  useEffect(() => {
    if (location.state?.error) {
      setError(location.state.error)
      // Clearing the state to avoid showing the error again on refresh
      window.history.replaceState({}, document.title)
    }
  }, [location])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await login(username, password)

    if (result.success) {
      const roles = result.data.roles || []
      if (roles.includes('AGENT_GUICHET')) {
        navigate('/agent')
      } else if (roles.includes('CLIENT')) {
        navigate('/client')
      } else {
        navigate('/agent')
      }
    } else {
      setError(result.error || 'Login ou mot de passe erronés')
    }
    setLoading(false)
  }

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      <ErrorMessage message={error} />
      
      <div className="space-y-4">
        <Input
          id="username"
          label="Nom d'utilisateur"
          type="text"
          placeholder="Entrez votre nom d'utilisateur"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          variant="light"
        />
        <Input
          id="password"
          label="Mot de passe"
          type="password"
          placeholder="Entrez votre mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          variant="light"
        />
      </div>

      <Button
        type="submit"
        disabled={loading}
        loading={loading}
        className="w-full"
      >
        {loading ? 'Connexion...' : 'Se connecter'}
      </Button>

      <div className="text-center">
        <p className="text-xs text-white/50 mt-4">
          Les clients sont créés par un agent. Contactez votre banque pour obtenir un compte.
        </p>
      </div>
    </form>
  )
}

