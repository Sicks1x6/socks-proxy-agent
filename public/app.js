// Handle form submission for testing proxy connection
document.getElementById('proxyForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const proxyType = document.getElementById('proxyType').value;
    const proxyUrl = document.getElementById('proxyUrl').value;
    const targetUrl = document.getElementById('targetUrl').value;
    
    await testProxy(proxyType, proxyUrl, targetUrl);
});

// Function to test proxy connection
async function testProxy(proxyType, proxyUrl, targetUrl) {
    const loadingDiv = document.getElementById('loading');
    const resultDiv = document.getElementById('result');
    
    // Show loading
    loadingDiv.style.display = 'block';
    resultDiv.innerHTML = '';
    
    try {
        const response = await fetch('/api/test-proxy', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                proxyType,
                proxyUrl,
                targetUrl
            })
        });
        
        const data = await response.json();
        
        // Hide loading
        loadingDiv.style.display = 'none';
        
        if (data.success) {
            resultDiv.innerHTML = `
                <div class="result-success">
                    <div class="result-title">✅ Connection Successful!</div>
                    <div class="result-details">
                        <div class="result-item">
                            <strong>Status:</strong> ${escapeHtml(String(data.statusCode))} ${escapeHtml(String(data.statusMessage))}
                        </div>
                        <div class="result-item">
                            <strong>Response Time:</strong> ${escapeHtml(String(data.responseTime))}ms
                        </div>
                        <div class="result-item">
                            <strong>Content Length:</strong> ${escapeHtml(String(data.bodyLength))} bytes
                        </div>
                        <div class="result-item">
                            <strong>Proxy Type:</strong> ${escapeHtml(proxyType.toUpperCase())}
                        </div>
                        <div class="result-item">
                            <strong>Message:</strong> ${escapeHtml(String(data.message))}
                        </div>
                    </div>
                </div>
            `;
        } else {
            resultDiv.innerHTML = `
                <div class="result-error">
                    <div class="result-title">❌ Connection Failed</div>
                    <div class="result-details">
                        <div class="result-item">
                            <strong>Error:</strong> ${escapeHtml(String(data.error))}
                        </div>
                        ${data.details ? `
                        <div class="result-item">
                            <strong>Details:</strong> ${escapeHtml(String(data.details))}
                        </div>
                        ` : ''}
                    </div>
                </div>
            `;
        }
    } catch (error) {
        // Hide loading
        loadingDiv.style.display = 'none';
        
        resultDiv.innerHTML = `
            <div class="result-error">
                <div class="result-title">❌ Request Failed</div>
                <div class="result-details">
                    <div class="result-item">
                        <strong>Error:</strong> ${escapeHtml(String(error.message))}
                    </div>
                    <div class="result-item">
                        <strong>Details:</strong> Failed to communicate with the server
                    </div>
                </div>
            </div>
        `;
    }
}

// Function to make a full request through proxy
async function makeRequest() {
    const proxyType = document.getElementById('proxyType').value;
    const proxyUrl = document.getElementById('proxyUrl').value;
    const targetUrl = document.getElementById('targetUrl').value;
    
    if (!proxyUrl || !targetUrl) {
        alert('Please fill in both Proxy URL and Target URL');
        return;
    }
    
    const loadingDiv = document.getElementById('loading');
    const resultDiv = document.getElementById('result');
    
    // Show loading
    loadingDiv.style.display = 'block';
    resultDiv.innerHTML = '';
    
    try {
        const response = await fetch('/api/request', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                proxyType,
                proxyUrl,
                targetUrl
            })
        });
        
        const data = await response.json();
        
        // Hide loading
        loadingDiv.style.display = 'none';
        
        if (data.success) {
            resultDiv.innerHTML = `
                <div class="result-success">
                    <div class="result-title">✅ Request Successful!</div>
                    <div class="result-details">
                        <div class="result-item">
                            <strong>Status:</strong> ${escapeHtml(String(data.statusCode))} ${escapeHtml(String(data.statusMessage))}
                        </div>
                        <div class="result-item">
                            <strong>Response Time:</strong> ${escapeHtml(String(data.responseTime))}ms
                        </div>
                        <div class="result-item">
                            <strong>Content Length:</strong> ${escapeHtml(String(data.bodyLength))} bytes
                        </div>
                        <div class="result-item">
                            <strong>Proxy Type:</strong> ${escapeHtml(proxyType.toUpperCase())}
                        </div>
                        <div class="result-item">
                            <strong>Response Preview:</strong>
                            <div class="response-body">${escapeHtml(data.body)}</div>
                        </div>
                    </div>
                </div>
            `;
        } else {
            resultDiv.innerHTML = `
                <div class="result-error">
                    <div class="result-title">❌ Request Failed</div>
                    <div class="result-details">
                        <div class="result-item">
                            <strong>Error:</strong> ${escapeHtml(String(data.error))}
                        </div>
                        ${data.details ? `
                        <div class="result-item">
                            <strong>Details:</strong> ${escapeHtml(String(data.details))}
                        </div>
                        ` : ''}
                    </div>
                </div>
            `;
        }
    } catch (error) {
        // Hide loading
        loadingDiv.style.display = 'none';
        
        resultDiv.innerHTML = `
            <div class="result-error">
                <div class="result-title">❌ Request Failed</div>
                <div class="result-details">
                    <div class="result-item">
                        <strong>Error:</strong> ${escapeHtml(String(error.message))}
                    </div>
                    <div class="result-item">
                        <strong>Details:</strong> Failed to communicate with the server
                    </div>
                </div>
            </div>
        `;
    }
}

// Helper function to escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Update proxy URL format based on selected type
document.getElementById('proxyType').addEventListener('change', (e) => {
    const proxyType = e.target.value;
    const proxyUrlInput = document.getElementById('proxyUrl');
    
    switch(proxyType) {
        case 'socks5':
            proxyUrlInput.placeholder = 'socks5://127.0.0.1:1080';
            break;
        case 'socks4':
            proxyUrlInput.placeholder = 'socks4://127.0.0.1:1080';
            break;
        case 'http':
            proxyUrlInput.placeholder = 'http://proxy.example.com:8080';
            break;
        case 'https':
            proxyUrlInput.placeholder = 'https://proxy.example.com:8443';
            break;
    }
});
