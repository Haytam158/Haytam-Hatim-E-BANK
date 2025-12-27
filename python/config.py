"""
Configuration file for E-Bank Streamlit application

⚠️ IMPORTANT: You need to configure your actual Botpress instance below!
See BOTPRESS_SETUP.md for instructions on how to get these values.
"""

# Botpress Configuration
# Using Botpress Cloud shareable webchat URL
# Your shareable URL: https://cdn.botpress.cloud/webchat/v3.5/shareable.html?configUrl=https://files.bpcontent.cloud/2025/12/22/16/20251222161552-VB8CIRA4.json

# Option 1: Use shareable URL directly (easiest for iframe embedding)
BOTPRESS_SHAREABLE_URL = "https://cdn.botpress.cloud/webchat/v3.5/shareable.html?configUrl=https://files.bpcontent.cloud/2025/12/22/16/20251222161552-VB8CIRA4.json"

# Option 2: Extract config for direct integration (if needed)
# The config JSON contains the client ID and other settings
BOTPRESS_CONFIG_URL = "https://files.bpcontent.cloud/2025/12/22/16/20251222161552-VB8CIRA4.json"

# Botpress Cloud base URL
BOTPRESS_CLOUD_BASE = "https://cdn.botpress.cloud"

# For API calls (if needed)
BOTPRESS_API_URL = "https://api.botpress.cloud"

# Application Configuration
APP_TITLE = "E-Bank Digital Assistant"
APP_ICON = "🏦"

# Chat Configuration
CHAT_HEIGHT = 600
ENABLE_TRANSCRIPT_DOWNLOAD = True
SHOW_POWERED_BY = False

# Theme Configuration
THEME_PRIMARY_COLOR = "#1f77b4"
THEME_SECONDARY_COLOR = "#ffffff"
THEME_TEXT_COLOR = "#333333"
THEME_BACKGROUND_COLOR = "#ffffff"


