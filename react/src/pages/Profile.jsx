import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { authService } from '../services/authService'
import { clientService } from '../services/clientService'
import PageHeader from '../components/layout/PageHeader'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import ErrorMessage from '../components/ui/ErrorMessage'
import LoadingSpinner from '../components/ui/LoadingSpinner'

export default function Profile() {
  const { user } = useAuth()
  const [userDetails, setUserDetails] = useState(null)
  const [loadingDetails, setLoadingDetails] = useState(true)
  const [detailsError, setDetailsError] = useState('')
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Fetch user details on component mount
  useEffect(() => {
    const fetchUserDetails = async () => {
      if (user?.userId) {
        try {
          setLoadingDetails(true)
          setDetailsError('')
          const details = await clientService.getUserDetails(user.userId)
          setUserDetails(details)
        } catch (err) {
          setDetailsError('Échec du chargement des détails utilisateur')
          console.error(err)
        } finally {
          setLoadingDetails(false)
        }
      }
    }

    fetchUserDetails()
  }, [user])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear errors when user starts typing
    if (error) setError('')
    if (success) setSuccess('')
  }

  const validateForm = () => {
    if (!formData.currentPassword) {
      setError('Veuillez saisir votre mot de passe actuel')
      return false
    }
    if (!formData.newPassword) {
      setError('Veuillez saisir un nouveau mot de passe')
      return false
    }
    if (formData.newPassword.length < 6) {
      setError('Le nouveau mot de passe doit contenir au moins 6 caractères')
      return false
    }
    if (formData.newPassword !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas')
      return false
    }
    if (formData.currentPassword === formData.newPassword) {
      setError('Le nouveau mot de passe doit être différent de l\'ancien')
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!validateForm()) {
      return
    }

    try {
      setLoading(true)
      await authService.changePassword(formData.currentPassword, formData.newPassword)
      setSuccess('Mot de passe modifié avec succès')
      // Reset form
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
    } catch (err) {
      setError(err.response?.data?.message || 'Échec de la modification du mot de passe. Vérifiez votre mot de passe actuel.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const icon = (
    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  )

  return (
    <div className="px-4 py-6 sm:px-0">
      <PageHeader
        icon={icon}
        title="Mon Profil"
        description="Gérez vos informations et votre mot de passe"
      />

      <div className="max-w-2xl mx-auto animate-fadeIn">
        {/* User Info Card */}
        <Card className="mb-6">
          {loadingDetails ? (
            <div className="flex justify-center items-center py-8">
              <LoadingSpinner size="md" />
            </div>
          ) : detailsError ? (
            <ErrorMessage message={detailsError} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nom d'utilisateur
                </label>
                <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-gray-900 font-medium">{userDetails?.username || user?.username || 'N/D'}</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email
                </label>
                <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-gray-900 font-medium">{userDetails?.email || user?.email || 'N/D'}</p>
                </div>
              </div>
              {userDetails?.firstname && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Prénom
                  </label>
                  <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-gray-900 font-medium">{userDetails.firstname}</p>
                  </div>
                </div>
              )}
              {userDetails?.lastname && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nom
                  </label>
                  <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-gray-900 font-medium">{userDetails.lastname}</p>
                  </div>
                </div>
              )}
              {userDetails?.birthdate && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Date de naissance
                  </label>
                  <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-gray-900 font-medium">
                      {new Date(userDetails.birthdate).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              )}
              {userDetails?.postalAddress && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Adresse postale
                  </label>
                  <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-gray-900 font-medium">{userDetails.postalAddress}</p>
                  </div>
                </div>
              )}
              {userDetails?.identityRef && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Référence d'identité
                  </label>
                  <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-gray-900 font-medium">{userDetails.identityRef}</p>
                  </div>
                </div>
              )}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Rôle
                </label>
                <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-gray-900 font-medium">{user?.roles?.join(', ') || userDetails?.roles?.join(', ') || 'N/D'}</p>
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* Change Password Card */}
        <Card>
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <svg className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
            Changer le mot de passe
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <ErrorMessage message={error} />}
            {success && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800 text-sm font-medium">{success}</p>
              </div>
            )}

            <div>
              <label htmlFor="currentPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                Mot de passe actuel
              </label>
              <Input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                placeholder="Saisissez votre mot de passe actuel"
                required
              />
            </div>

            <div>
              <label htmlFor="newPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                Nouveau mot de passe
              </label>
              <Input
                type="password"
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="Saisissez votre nouveau mot de passe (min. 6 caractères)"
                required
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                Confirmer le nouveau mot de passe
              </label>
              <Input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirmez votre nouveau mot de passe"
                required
              />
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                variant="primary"
                disabled={loading}
                className="w-full sm:w-auto"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <LoadingSpinner size="sm" />
                    Modification en cours...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Modifier le mot de passe
                  </span>
                )}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}

