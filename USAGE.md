# SOCKS Proxy Agent - Usage Guide

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the server:**
   ```bash
   npm start
   ```

3. **Open in browser:**
   Navigate to `http://localhost:3000`

## How to Use

### Basic Usage

1. **Select Proxy Type**: Choose from SOCKS5, SOCKS4, HTTP, or HTTPS
2. **Enter Proxy URL**: Format: `protocol://host:port` or `protocol://user:pass@host:port`
3. **Enter Target URL**: The website you want to access through the proxy
4. **Click "Test Connection"**: Verify the proxy works
5. **Click "Make Request"**: See the full response from the target URL

### Example Scenarios

#### Testing a Local SOCKS5 Proxy
```
Proxy Type: SOCKS5
Proxy URL: socks5://127.0.0.1:1080
Target URL: https://api.ipify.org?format=json
```

#### Using HTTP Proxy with Authentication
```
Proxy Type: HTTP
Proxy URL: http://username:password@proxy.company.com:8080
Target URL: https://httpbin.org/get
```

#### Testing SOCKS4 Proxy
```
Proxy Type: SOCKS4
Proxy URL: socks4://192.168.1.100:1080
Target URL: http://httpbin.org/get
```

## API Reference

### POST /api/test-proxy

Test if a proxy connection works.

**Request:**
```json
{
  "proxyType": "socks5",
  "proxyUrl": "socks5://127.0.0.1:1080",
  "targetUrl": "https://api.ipify.org?format=json"
}
```

**Response (Success):**
```json
{
  "success": true,
  "statusCode": 200,
  "statusMessage": "OK",
  "responseTime": 245,
  "bodyLength": 27,
  "message": "Proxy connection successful"
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "ECONNREFUSED",
  "details": "Failed to connect through proxy"
}
```

### POST /api/request

Make a full request through the proxy and see the response.

**Request:**
```json
{
  "proxyType": "http",
  "proxyUrl": "http://proxy.example.com:8080",
  "targetUrl": "https://httpbin.org/get",
  "method": "GET"
}
```

**Response (Success):**
```json
{
  "success": true,
  "statusCode": 200,
  "statusMessage": "OK",
  "responseTime": 523,
  "body": "... response body preview ...",
  "bodyLength": 1234,
  "message": "Request completed successfully"
}
```

### GET /api/health

Check if the server is running.

**Response:**
```json
{
  "status": "ok",
  "message": "SOCKS Proxy Agent API is running",
  "supportedProtocols": ["socks5", "socks4", "http", "https"]
}
```

## Security Features

### Rate Limiting
- Limited to 100 requests per 15 minutes per IP address
- Prevents denial-of-service attacks
- Returns 429 status code when limit exceeded

### URL Validation
- Proxy URLs must use allowed protocols: `socks4://`, `socks5://`, `http://`, `https://`
- Target URLs must use: `http://` or `https://` only
- Prevents SSRF attacks via file:// or other protocols

### XSS Protection
- All user inputs are HTML-escaped before rendering
- Prevents cross-site scripting attacks
- Safe to display error messages and responses

## Troubleshooting

### Connection Refused
**Problem:** Error message "ECONNREFUSED"
**Solution:** 
- Verify the proxy server is running
- Check the proxy host and port are correct
- Ensure firewall allows the connection

### Invalid Proxy URL
**Problem:** Error message "Invalid proxy URL format"
**Solution:**
- Ensure URL starts with correct protocol (socks5://, http://, etc.)
- Verify format: `protocol://host:port`
- Check for typos in the URL

### DNS Resolution Failed
**Problem:** Error message "ENOTFOUND"
**Solution:**
- Check the proxy hostname is correct
- Verify DNS is working
- Try using IP address instead of hostname

### Rate Limited
**Problem:** Error message "Too many requests"
**Solution:**
- Wait 15 minutes before trying again
- Reduce request frequency
- Consider running your own instance

## Environment Variables

### PORT
Set custom server port (default: 3000)

```bash
PORT=8080 npm start
```

## Best Practices

1. **Always use HTTPS for target URLs** when transmitting sensitive data
2. **Test with public endpoints first** (like httpbin.org) before using with real services
3. **Keep proxy credentials secure** - don't commit them to version control
4. **Use trusted proxy servers only** - proxy servers can see your traffic
5. **Monitor rate limits** to avoid being blocked

## Common Use Cases

### 1. Testing Proxy Configuration
Verify your proxy server is correctly configured before using it in applications.

### 2. Debugging Network Issues
Check if a service is accessible through a specific proxy.

### 3. IP Address Verification
Use with `https://api.ipify.org?format=json` to see what IP address the proxy provides.

### 4. Development Testing
Test how your application behaves when accessed through different proxy types.

### 5. Network Troubleshooting
Diagnose connectivity issues in corporate or restricted networks.

## Support

For issues, questions, or contributions, please visit the GitHub repository.

## License

MIT License - see LICENSE file for details.
