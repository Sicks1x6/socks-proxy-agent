# SOCKS Proxy Agent - Web Interface

A web-based frontend and backend application for testing and using SOCKS proxy agents. Supports SOCKS5, SOCKS4, HTTP, and HTTPS proxy protocols.

## Features

- 🌐 **Web Interface**: User-friendly frontend for configuring and testing proxy connections
- 🔒 **Multiple Protocols**: Supports SOCKS5, SOCKS4, HTTP, and HTTPS proxies
- ⚡ **Real-time Testing**: Test proxy connections with instant feedback
- 📊 **Detailed Results**: View response times, status codes, and response data
- 🎨 **Modern UI**: Responsive design with gradient backgrounds and smooth animations

## Supported Proxy Protocols

- **SOCKS5**: Full-featured proxy with authentication support
- **SOCKS4**: Legacy SOCKS protocol
- **HTTP**: Standard HTTP proxy
- **HTTPS**: Secure HTTP proxy with TLS

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Sicks1x6/socks-proxy-agent.git
cd socks-proxy-agent
```

2. Install dependencies:
```bash
npm install
```

## Usage

1. Start the server:
```bash
npm start
```

2. Open your browser and navigate to:
```
http://localhost:3000
```

3. Configure your proxy settings:
   - Select the proxy type (SOCKS5, SOCKS4, HTTP, or HTTPS)
   - Enter the proxy URL (e.g., `socks5://127.0.0.1:1080`)
   - Enter the target URL you want to access through the proxy
   - Click "Test Connection" to verify the proxy works

## Proxy URL Format

The proxy URL should follow this format:
```
protocol://[username:password@]host:port
```

### Examples:

- SOCKS5: `socks5://127.0.0.1:1080`
- SOCKS5 with auth: `socks5://user:pass@proxy.example.com:1080`
- SOCKS4: `socks4://127.0.0.1:1080`
- HTTP: `http://proxy.example.com:8080`
- HTTPS: `https://proxy.example.com:8443`

## API Endpoints

### Test Proxy Connection
```
POST /api/test-proxy
Content-Type: application/json

{
  "proxyType": "socks5",
  "proxyUrl": "socks5://127.0.0.1:1080",
  "targetUrl": "https://api.ipify.org?format=json"
}
```

### Make Request Through Proxy
```
POST /api/request
Content-Type: application/json

{
  "proxyType": "socks5",
  "proxyUrl": "socks5://127.0.0.1:1080",
  "targetUrl": "https://httpbin.org/get",
  "method": "GET"
}
```

### Health Check
```
GET /api/health
```

## Testing URLs

You can use these URLs to test your proxy:

- `https://api.ipify.org?format=json` - Returns your public IP address
- `http://httpbin.org/get` - HTTP test endpoint
- `https://httpbin.org/get` - HTTPS test endpoint

## Project Structure

```
socks-proxy-agent/
├── server.js           # Backend Express server
├── package.json        # Project dependencies
├── README.md          # This file
└── public/            # Frontend files
    ├── index.html     # Main HTML page
    ├── styles.css     # Styling
    └── app.js         # Frontend JavaScript
```

## Dependencies

- **express**: Web server framework
- **socks-proxy-agent**: SOCKS proxy agent for Node.js
- **http-proxy-agent**: HTTP proxy agent
- **https-proxy-agent**: HTTPS proxy agent

## Environment Variables

- `PORT`: Server port (default: 3000)

Example:
```bash
PORT=8080 npm start
```

## Development

To run in development mode:
```bash
npm run dev
```

## License

MIT

## Security Note

⚠️ This application is designed for testing and development purposes. When using proxies:
- Only connect to trusted proxy servers
- Be aware that proxy servers can see your traffic
- Never send sensitive credentials through untrusted proxies
- Use HTTPS for target URLs when possible

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. 
