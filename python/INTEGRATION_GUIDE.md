# Streamlit App Integration Guide for E-Bank React Application

## Overview

You have three main options for integrating the Streamlit chatbot application with your React Vite frontend:

1. **Iframe Embedding** (Recommended for quick integration)
2. **Direct Botpress Integration** (Best for seamless UX)
3. **Hybrid Approach** (Streamlit for admin, React for users)

---

## Option 1: Iframe Embedding (Easiest)

Embed the Streamlit app as an iframe component in your React app.

### Setup

1. **Run Streamlit on a different port** (since React uses 3002):
   ```bash
   streamlit run app.py --server.port 8501
   ```

2. **Create a React component** for the chatbot:

```jsx
// src/components/features/ChatbotWidget.jsx
import { useEffect, useRef } from 'react'

export default function ChatbotWidget() {
  const iframeRef = useRef(null)

  return (
    <div className="w-full h-full rounded-lg overflow-hidden shadow-lg">
      <iframe
        ref={iframeRef}
        src="http://localhost:8501"
        className="w-full h-[600px] border-0"
        title="E-Bank Chatbot"
        allow="microphone"
      />
    </div>
  )
}
```

3. **Add to ClientDashboard.jsx**:

```jsx
import ChatbotWidget from '../components/features/ChatbotWidget'

// In your ClientDashboard component, add:
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
  <div className="lg:col-span-2">
    {/* Your existing transactions list */}
    <TransactionsList ... />
  </div>
  <div className="lg:col-span-1">
    <Card>
      <h3 className="text-lg font-semibold mb-4">Assistant Virtuel</h3>
      <ChatbotWidget />
    </Card>
  </div>
</div>
```

### Pros:
- ✅ Quick to implement
- ✅ No need to modify Streamlit app
- ✅ Isolated from React app

### Cons:
- ❌ Less seamless UX (iframe border)
- ❌ Potential CORS issues
- ❌ Harder to share authentication state

---

## Option 2: Direct Botpress Integration (Best UX)

Skip Streamlit and integrate Botpress directly into React. This is the most seamless approach.

### Setup

1. **Create a Botpress chat component**:

```jsx
// src/components/features/BotpressChat.jsx
import { useEffect, useRef } from 'react'

export default function BotpressChat() {
  const chatContainerRef = useRef(null)

  useEffect(() => {
    // Load Botpress web chat script
    const script = document.createElement('script')
    script.src = 'http://localhost:3002/assets/modules/channel-web/inject.js'
    script.async = true
    
    script.onload = () => {
      // Initialize Botpress chat
      if (window.botpressWebChat) {
        window.botpressWebChat.init({
          composerPlaceholder: 'Tapez votre message...',
          botConversationDescription: 'Assistant E-Bank',
          botId: 'default',
          hostUrl: 'http://localhost:3002',
          showPoweredBy: false,
          enableTranscriptDownload: true,
          userId: 'user_' + Date.now(), // Use actual user ID from auth context
          userName: 'Client',
          theme: {
            primaryColor: '#4f46e5', // Match your indigo theme
            secondaryColor: '#ffffff',
            textColor: '#333333',
            backgroundColor: '#ffffff'
          }
        })
      }
    }

    document.body.appendChild(script)

    return () => {
      // Cleanup
      if (document.body.contains(script)) {
        document.body.removeChild(script)
      }
    }
  }, [])

  return (
    <div className="w-full h-[600px] rounded-lg overflow-hidden">
      <div id="botpress-webchat" ref={chatContainerRef} className="w-full h-full" />
    </div>
  )
}
```

2. **Add to ClientDashboard**:

```jsx
import BotpressChat from '../components/features/BotpressChat'

// In your component:
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
  <div className="lg:col-span-2">
    <TransactionsList ... />
  </div>
  <div className="lg:col-span-1">
    <Card>
      <h3 className="text-lg font-semibold mb-4">💬 Assistant Virtuel</h3>
      <BotpressChat />
    </Card>
  </div>
</div>
```

3. **Update vite.config.js** to allow Botpress connection:

```js
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Change React port to 3000
    proxy: {
      '/api': {
        target: 'http://localhost:3002', // Proxy Botpress API
        changeOrigin: true,
      }
    }
  }
})
```

### Pros:
- ✅ Best user experience (native integration)
- ✅ No iframe borders
- ✅ Can share authentication state
- ✅ Better mobile experience

### Cons:
- ❌ Requires modifying React app
- ❌ Need to handle Botpress script loading

---

## Option 3: Hybrid Approach

Use Streamlit for admin/analytics dashboard, React for customer-facing chatbot.

### Use Cases:
- **Streamlit**: Admin dashboard, chatbot analytics, conversation logs
- **React**: Customer-facing chatbot widget (using Option 2)

### Implementation:
- Keep Streamlit app for internal use
- Integrate Botpress directly in React for customers
- Streamlit can access same Botpress instance for analytics

---

## Recommended: Option 2 (Direct Integration)

For your e-bank application, I recommend **Option 2** because:

1. **Better UX**: Seamless integration with your Tailwind UI
2. **Authentication**: Can pass user ID from your AuthContext
3. **Performance**: No iframe overhead
4. **Mobile-friendly**: Better responsive behavior

---

## Port Configuration Note

⚠️ **Important**: Your React app and Botpress both use port 3002. You need to change one:

- **Option A**: Change React to port 3000 (recommended)
  ```js
  // vite.config.js
  server: { port: 3000 }
  ```

- **Option B**: Change Botpress to port 3003
  - Update Botpress configuration
  - Update `config.py` in Streamlit app

---

## Authentication Integration

To pass user authentication to Botpress:

```jsx
// In BotpressChat.jsx
import { useAuth } from '../context/AuthContext'

export default function BotpressChat() {
  const { user } = useAuth()
  
  useEffect(() => {
    // ... script loading code ...
    
    window.botpressWebChat.init({
      // ... other config ...
      userId: user?.userId || `user_${Date.now()}`,
      userName: user?.username || 'Client',
      // Pass additional user data
      extraProps: {
        email: user?.email,
        roles: user?.roles
      }
    })
  }, [user])
  
  // ... rest of component
}
```

---

## Next Steps

1. Choose your integration approach
2. Update port configuration to avoid conflicts
3. Create the React component
4. Add to ClientDashboard
5. Test the integration
6. Customize theme colors to match your Tailwind design

Would you like me to implement one of these options for you?




