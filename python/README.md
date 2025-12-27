# E-Bank Streamlit Application with Botpress Integration

A Python Streamlit application that integrates with Botpress chatbot for an e-bank application. The chatbot runs on localhost:3002 and provides banking assistance through an interactive chat interface.

## Features

- 🤖 **Botpress Chatbot Integration**: Seamless integration with Botpress running on localhost:3002
- 💬 **Interactive Chat Interface**: Both embedded web chat widget and API-based chat
- 📊 **Account Overview**: Display account balance and recent transactions
- 🎨 **Modern UI**: Clean and user-friendly interface with custom styling
- ⚙️ **Connection Status**: Real-time monitoring of Botpress connection
- 🔄 **Session Management**: Persistent chat history and user sessions

## Prerequisites

- Python 3.8 or higher
- Botpress chatbot running on `localhost:3002`
- pip (Python package manager)

## Installation

1. **Clone or navigate to the project directory:**
   ```bash
   cd python
   ```

2. **Install required dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

## Running the Application

1. **Ensure Botpress is running:**
   - Make sure your Botpress chatbot is running on `http://localhost:3002`
   - Verify the Botpress API is accessible

2. **Start the Streamlit application:**
   ```bash
   streamlit run app.py
   ```

3. **Access the application:**
   - The app will automatically open in your default web browser
   - Default URL: `http://localhost:8501`

## Configuration

You can modify the Botpress connection settings in `config.py`:

```python
BOTPRESS_HOST = "localhost"
BOTPRESS_PORT = 3002
```

## Project Structure

```
python/
├── app.py              # Main Streamlit application
├── config.py           # Configuration settings
├── requirements.txt    # Python dependencies
└── README.md          # This file
```

## Usage

### Chat Interface

The application provides two ways to interact with the Botpress chatbot:

1. **Embedded Web Chat Widget**: Interactive chat widget embedded directly in the page
2. **Text Input Chat**: Alternative chat interface using the Botpress API

### Features

- **Account Overview**: View account balance and recent transactions in the sidebar
- **Quick Actions**: Access common banking functions quickly
- **Connection Status**: Monitor Botpress connection in real-time
- **Chat History**: View and manage conversation history

## Troubleshooting

### Botpress Connection Issues

If you see "Botpress not connected":
1. Verify Botpress is running: `http://localhost:3002`
2. Check if the Botpress API is accessible
3. Verify firewall settings allow localhost connections
4. Check Botpress logs for any errors

### Port Conflicts

If port 8501 is already in use:
```bash
streamlit run app.py --server.port 8502
```

## Development

### Adding New Features

- Modify `app.py` to add new Streamlit components
- Update `config.py` for new configuration options
- Add new dependencies to `requirements.txt`

### Customizing the Chat Widget

The Botpress web chat widget can be customized in `app.py` by modifying the `botpress_chat_html` variable, including:
- Theme colors
- Widget size and position
- User information
- Chat behavior settings

## Notes

- The application uses session state to maintain chat history
- User IDs are automatically generated for each session
- The chat widget requires Botpress to be running and accessible
- API-based chat provides a fallback if the widget doesn't load

## License

This project is part of the E-Bank application.





