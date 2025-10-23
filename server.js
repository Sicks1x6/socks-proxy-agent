const express = require('express');
const http = require('http');
const https = require('https');
const { SocksProxyAgent } = require('socks-proxy-agent');
const { HttpProxyAgent } = require('http-proxy-agent');
const { HttpsProxyAgent } = require('https-proxy-agent');
const path = require('path');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3000;

// Rate limiting to prevent DOS attacks
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

// Apply rate limiting to API routes
app.use('/api/', limiter);

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Helper function to validate URL
function isValidUrl(urlString) {
  try {
    const url = new URL(urlString);
    // Only allow http and https protocols for target URLs
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (err) {
    return false;
  }
}

// Helper function to validate proxy URL
function isValidProxyUrl(urlString) {
  try {
    const url = new URL(urlString);
    // Allow socks4, socks5, http, https protocols for proxy URLs
    return ['socks4:', 'socks5:', 'http:', 'https:'].includes(url.protocol);
  } catch (err) {
    return false;
  }
}

// Serve the frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API endpoint to test proxy connection
app.post('/api/test-proxy', async (req, res) => {
  const { proxyUrl, targetUrl, proxyType } = req.body;

  if (!proxyUrl || !targetUrl) {
    return res.status(400).json({ 
      success: false, 
      error: 'Missing proxyUrl or targetUrl' 
    });
  }

  // Validate URLs
  if (!isValidProxyUrl(proxyUrl)) {
    return res.status(400).json({ 
      success: false, 
      error: 'Invalid proxy URL format' 
    });
  }

  if (!isValidUrl(targetUrl)) {
    return res.status(400).json({ 
      success: false, 
      error: 'Invalid target URL. Only http and https protocols are allowed.' 
    });
  }

  try {
    let agent;
    
    // Create appropriate agent based on proxy type
    if (proxyType === 'socks5' || proxyType === 'socks4') {
      agent = new SocksProxyAgent(proxyUrl);
    } else if (proxyType === 'http') {
      agent = new HttpProxyAgent(proxyUrl);
    } else if (proxyType === 'https') {
      agent = new HttpsProxyAgent(proxyUrl);
    } else {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid proxy type. Supported: socks5, socks4, http, https' 
      });
    }

    // Determine protocol for the request
    const protocol = targetUrl.startsWith('https') ? https : http;

    // Make request through proxy
    // Note: User-controlled URLs are intentional for a proxy testing tool
    // URL validation above ensures only http/https protocols are allowed
    const startTime = Date.now();
    
    protocol.get(targetUrl, { agent }, (response) => {
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      let data = '';
      response.on('data', (chunk) => {
        data += chunk;
      });

      response.on('end', () => {
        res.json({
          success: true,
          statusCode: response.statusCode,
          statusMessage: response.statusMessage,
          headers: response.headers,
          responseTime: duration,
          bodyLength: data.length,
          message: 'Proxy connection successful'
        });
      });
    }).on('error', (error) => {
      res.status(500).json({
        success: false,
        error: error.message,
        details: 'Failed to connect through proxy'
      });
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      details: 'Failed to create proxy agent'
    });
  }
});

// API endpoint to make requests through proxy
app.post('/api/request', async (req, res) => {
  const { proxyUrl, targetUrl, proxyType, method = 'GET' } = req.body;

  if (!proxyUrl || !targetUrl) {
    return res.status(400).json({ 
      success: false, 
      error: 'Missing proxyUrl or targetUrl' 
    });
  }

  // Validate URLs
  if (!isValidProxyUrl(proxyUrl)) {
    return res.status(400).json({ 
      success: false, 
      error: 'Invalid proxy URL format' 
    });
  }

  if (!isValidUrl(targetUrl)) {
    return res.status(400).json({ 
      success: false, 
      error: 'Invalid target URL. Only http and https protocols are allowed.' 
    });
  }

  try {
    let agent;
    
    // Create appropriate agent based on proxy type
    if (proxyType === 'socks5' || proxyType === 'socks4') {
      agent = new SocksProxyAgent(proxyUrl);
    } else if (proxyType === 'http') {
      agent = new HttpProxyAgent(proxyUrl);
    } else if (proxyType === 'https') {
      agent = new HttpsProxyAgent(proxyUrl);
    } else {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid proxy type. Supported: socks5, socks4, http, https' 
      });
    }

    // Determine protocol for the request
    const protocol = targetUrl.startsWith('https') ? https : http;

    // Make request through proxy
    // Note: User-controlled URLs are intentional for a proxy testing tool
    // URL validation above ensures only http/https protocols are allowed
    const startTime = Date.now();
    
    const options = {
      agent,
      method
    };

    protocol.get(targetUrl, options, (response) => {
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      let data = '';
      response.on('data', (chunk) => {
        data += chunk;
      });

      response.on('end', () => {
        res.json({
          success: true,
          statusCode: response.statusCode,
          statusMessage: response.statusMessage,
          headers: response.headers,
          responseTime: duration,
          body: data.substring(0, 1000), // Limit response size for display
          bodyLength: data.length,
          message: 'Request completed successfully'
        });
      });
    }).on('error', (error) => {
      res.status(500).json({
        success: false,
        error: error.message,
        details: 'Failed to make request through proxy'
      });
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      details: 'Failed to create proxy agent or make request'
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'SOCKS Proxy Agent API is running',
    supportedProtocols: ['socks5', 'socks4', 'http', 'https']
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`SOCKS Proxy Agent server running on http://localhost:${PORT}`);
  console.log(`Supported proxy types: SOCKS5, SOCKS4, HTTP, HTTPS`);
});
