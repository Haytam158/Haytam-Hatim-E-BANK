import streamlit as st
import requests
import json
from datetime import datetime
import streamlit.components.v1 as components
from config import (
    BOTPRESS_SHAREABLE_URL,
    BOTPRESS_CONFIG_URL,
    BOTPRESS_API_URL,
    APP_TITLE,
    APP_ICON,
    CHAT_HEIGHT,
    THEME_PRIMARY_COLOR,
    THEME_SECONDARY_COLOR,
    THEME_TEXT_COLOR,
    THEME_BACKGROUND_COLOR
)

# Page configuration
st.set_page_config(
    page_title=APP_TITLE,
    page_icon=APP_ICON,
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS for better styling
st.markdown(f"""
    <style>
    .main-header {{
        font-size: 2.5rem;
        font-weight: bold;
        color: {THEME_PRIMARY_COLOR};
        text-align: center;
        padding: 1rem 0;
    }}
    .chat-container {{
        height: {CHAT_HEIGHT}px;
        border: 2px solid #e0e0e0;
        border-radius: 10px;
        padding: 10px;
        background-color: #f9f9f9;
    }}
    .stButton>button {{
        width: 100%;
        background-color: {THEME_PRIMARY_COLOR};
        color: white;
        border-radius: 5px;
        padding: 0.5rem 1rem;
    }}
    .info-box {{
        background-color: #e3f2fd;
        padding: 1rem;
        border-radius: 5px;
        margin: 1rem 0;
    }}
    </style>
""", unsafe_allow_html=True)

# Botpress configuration is imported from config.py

# Initialize session state
if 'messages' not in st.session_state:
    st.session_state.messages = []
if 'user_id' not in st.session_state:
    st.session_state.user_id = f"user_{datetime.now().timestamp()}"

def send_message_to_botpress(message, user_id):
    """Send a message to Botpress chatbot via API"""
    try:
        # Note: Botpress Cloud shareable webchat handles messages through the iframe
        # This function is kept for potential API integration, but the iframe method
        # is recommended for Botpress Cloud
        return {
            "note": "Using iframe-based chat. Messages are handled directly by the Botpress webchat widget.",
            "message": "Please use the chat widget above to interact with the bot."
        }
    except Exception as e:
        return {"error": str(e)}

def check_botpress_connection():
    """Check if Botpress is accessible"""
    try:
        # Try to access Botpress config URL
        response = requests.get(BOTPRESS_CONFIG_URL, timeout=3)
        return response.status_code == 200
    except:
        return False

# Main app
def main():
    # Header
    st.markdown('<h1 class="main-header">🏦 E-Bank Digital Assistant</h1>', unsafe_allow_html=True)
    
    # Sidebar
    with st.sidebar:
        st.header("⚙️ Settings")
        
        # Botpress connection status
        st.subheader("Connection Status")
        if check_botpress_connection():
            st.success("✅ Connected to Botpress")
        else:
            st.error("❌ Botpress not connected")
            st.info("Please check your Botpress Cloud configuration")
        
        st.divider()
        
        # User info
        st.subheader("User Information")
        st.text(f"User ID: {st.session_state.user_id[:20]}...")
        
        # Quick actions
        st.divider()
        st.subheader("Quick Actions")
        if st.button("🔄 Refresh Connection"):
            st.rerun()
        
        if st.button("🗑️ Clear Chat History"):
            st.session_state.messages = []
            st.rerun()
        
        # Bank services info
        st.divider()
        st.subheader("Available Services")
        st.markdown("""
        - 💳 Account Management
        - 💰 Money Transfers
        - 📊 Account Statements
        - 🔒 Security Settings
        - 💵 Loan Information
        - 📈 Investment Options
        """)
    
    # Main content area
    col1, col2 = st.columns([2, 1])
    
    with col1:
        st.header("💬 Chat with Assistant")
        
        # Botpress Web Chat Widget using shareable URL (iframe method)
        st.markdown("### Interactive Chat")
        
        # Use Botpress Cloud shareable URL in an iframe
        # This is the simplest and most reliable method for Botpress Cloud
        botpress_iframe_html = f"""
        <iframe
            src="{BOTPRESS_SHAREABLE_URL}"
            style="width: 100%; height: 550px; border: none; border-radius: 10px;"
            allow="microphone"
            title="E-Bank Chatbot"
        ></iframe>
        """
        
        components.html(botpress_iframe_html, height=550)
        
        # Alternative: Simple chat interface using API
        st.markdown("---")
        st.markdown("### Or use text input below")
        
        # Display chat messages
        chat_container = st.container()
        with chat_container:
            for message in st.session_state.messages:
                with st.chat_message(message["role"]):
                    st.markdown(message["content"])
        
        # Chat input
        if prompt := st.chat_input("Ask me about banking services..."):
            # Add user message
            st.session_state.messages.append({"role": "user", "content": prompt})
            with st.chat_message("user"):
                st.markdown(prompt)
            
            # Get bot response
            with st.chat_message("assistant"):
                with st.spinner("Thinking..."):
                    response = send_message_to_botpress(prompt, st.session_state.user_id)
                    
                    if "error" in response:
                        response_text = f"⚠️ {response['error']}"
                    elif "responses" in response:
                        response_text = "\n".join([r.get("text", "") for r in response["responses"]])
                    elif "text" in response:
                        response_text = response["text"]
                    else:
                        response_text = json.dumps(response, indent=2)
                    
                    st.markdown(response_text)
                    st.session_state.messages.append({"role": "assistant", "content": response_text})
    
    with col2:
        st.header("📋 Account Overview")
        
        # Account summary card
        st.markdown("""
        <div class="info-box">
            <h3>Account Balance</h3>
            <p style="font-size: 1.5rem; font-weight: bold;">$12,450.00</p>
        </div>
        """, unsafe_allow_html=True)
        
        # Recent transactions
        st.subheader("Recent Transactions")
        transactions = [
            {"date": "2024-01-15", "description": "Salary Deposit", "amount": "+$3,500.00"},
            {"date": "2024-01-14", "description": "Electric Bill", "amount": "-$125.50"},
            {"date": "2024-01-13", "description": "Grocery Store", "amount": "-$87.30"},
            {"date": "2024-01-12", "description": "Transfer to Savings", "amount": "-$500.00"},
        ]
        
        for trans in transactions:
            color = "green" if trans["amount"].startswith("+") else "red"
            st.markdown(f"""
            <div style="padding: 0.5rem; border-bottom: 1px solid #e0e0e0;">
                <strong>{trans['description']}</strong><br>
                <small>{trans['date']}</small><br>
                <span style="color: {color}; font-weight: bold;">{trans['amount']}</span>
            </div>
            """, unsafe_allow_html=True)
        
        # Quick links
        st.subheader("Quick Links")
        if st.button("💳 View Cards"):
            st.info("Card management page would open here")
        if st.button("📊 Statements"):
            st.info("Account statements page would open here")
        if st.button("⚙️ Settings"):
            st.info("Account settings page would open here")

if __name__ == "__main__":
    main()

