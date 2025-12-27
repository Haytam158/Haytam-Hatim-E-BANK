import { useState } from 'react'

/**
 * Botpress Chat Component - Floating Icon that Expands into Chatbot
 * The icon transforms into the chatbot with smooth animation
 */
export default function BotpressChat() {
  const [isOpen, setIsOpen] = useState(false)

  // Botpress Cloud shareable URL
  const shareableUrl = "https://cdn.botpress.cloud/webchat/v3.5/shareable.html?configUrl=https://files.bpcontent.cloud/2025/12/22/16/20251222161552-VB8CIRA4.json"

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Chatbot Container - Transforms from icon to full widget */}
      <div
        className={`
          bg-white rounded-2xl shadow-2xl overflow-hidden
          transition-all duration-500 ease-in-out
          ${isOpen 
            ? 'w-[380px] h-[600px] opacity-100' 
            : 'w-16 h-16 opacity-100'
          }
        `}
      >
        {/* Header with close button - Only visible when open */}
        {isOpen && (
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3 flex items-center justify-between animate-fadeIn">
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <h3 className="text-sm font-semibold text-white">Assistant Virtuel</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-lg"
              aria-label="Fermer le chatbot"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Chat Icon / Chatbot Content */}
        <div className="relative w-full h-full">
          {!isOpen ? (
            // Icon State - Clickable button
            <button
              onClick={() => setIsOpen(true)}
              className="w-full h-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-2xl shadow-2xl transform transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center group"
              aria-label="Ouvrir l'assistant virtuel"
            >
               <svg 
                 className="h-7 w-7 transition-transform group-hover:rotate-12" 
                 fill="none" 
                 viewBox="0 0 24 24" 
                 stroke="currentColor"
               >
                 <path 
                   strokeLinecap="round" 
                   strokeLinejoin="round" 
                   strokeWidth={2} 
                   d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" 
                 />
               </svg>
               {/* Notification badge - Plus visible avec ombre et taille augmentée */}
               <span className="absolute -top-0.5 -right-0.5 h-5 w-5 bg-red-500 rounded-full border-2 border-white shadow-lg shadow-red-500/50 animate-pulse flex items-center justify-center ring-2 ring-red-500/30">
                 <span className="h-2 w-2 bg-white rounded-full"></span>
               </span>
            </button>
          ) : (
            // Chatbot Widget State - Iframe
            <div className="h-[calc(100%-56px)] animate-fadeIn">
              <iframe
                src={shareableUrl}
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  border: 'none',
                }}
                allow="microphone"
                title="Haytam & Hatim Bank Chatbot"
                className="w-full h-full"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
