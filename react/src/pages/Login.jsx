import AuthCard from '../components/layout/AuthCard'
import LoginForm from '../components/features/LoginForm'
import BotpressChat from '../components/features/BotpressChat'

export default function Login() {
  const icon = (
    <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  )

  return (
    <>
      <AuthCard
        icon={icon}
        title="Bon retour"
        subtitle="Connectez-vous à votre compte Haytam & Hatim Bank"
      >
        <LoginForm />
      </AuthCard>
      <BotpressChat />
    </>
  

  )
}