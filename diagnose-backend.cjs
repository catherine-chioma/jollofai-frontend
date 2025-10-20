#!/usr/bin/env node

const axios = require('axios');

// Possible API configurations to test
const API_CONFIGS = [
  {
    name: 'Standard API with /api prefix',
    baseUrl: 'https://jollofapi.onrender.com/api',
    testEndpoints: ['/health', '/status', '/', '/recipes']
  },
  {
    name: 'Root API without /api prefix', 
    baseUrl: 'https://jollofapi.onrender.com',
    testEndpoints: ['/health', '/status', '/api/health', '/api/status', '/api', '/api/recipes']
  },
  {
    name: 'API v1 endpoints',
    baseUrl: 'https://jollofapi.onrender.com',
    testEndpoints: ['/v1/health', '/v1/status', '/v1/recipes', '/api/v1/health']
  }
];

class BackendDiagnostic {
  constructor() {
    this.workingEndpoints = [];
    this.errors = [];
  }

  async testEndpoint(baseUrl, endpoint) {
    try {
      console.log(`🔍 Testing: ${baseUrl}${endpoint}`);
      
      const response = await axios.get(baseUrl + endpoint, {
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'JollofAI-Diagnostic-Tool'
        }
      });
      
      console.log(`   ✅ SUCCESS: ${response.status} ${response.statusText}`.green);
      
      this.workingEndpoints.push({
        url: baseUrl + endpoint,
        status: response.status,
        data: response.data,
        responseTime: Date.now()
      });
      
      return true;
    } catch (error) {
      const statusCode = error.response?.status;
      const errorMessage = error.response?.data || error.message;
      
      if (statusCode === 404) {
        console.log(`   ❌ NOT FOUND: 404`.red);
      } else if (statusCode) {
        console.log(`   ⚠️  ERROR: ${statusCode} - ${errorMessage}`.yellow);
      } else {
        console.log(`   ❌ CONNECTION ERROR: ${error.message}`.red);
      }
      
      this.errors.push({
        url: baseUrl + endpoint,
        error: errorMessage,
        status: statusCode
      });
      
      return false;
    }
  }

  async diagnoseBackend() {
    console.log('🔍 JollofAI Backend Diagnostic Tool'.bold.cyan);
    console.log('====================================='.cyan);
    console.log('Testing different API configurations...\n');

    // Test basic connectivity first
    console.log('📡 Testing Basic Connectivity:'.bold);
    await this.testEndpoint('https://jollofapi.onrender.com', '');
    console.log('');

    // Test each configuration
    for (const config of API_CONFIGS) {
      console.log(`📋 Testing: ${config.name}`.bold);
      console.log(`   Base URL: ${config.baseUrl}`);
      
      for (const endpoint of config.testEndpoints) {
        await this.testEndpoint(config.baseUrl, endpoint);
      }
      console.log('');
    }

    this.printResults();
  }

  printResults() {
    console.log('📊 Diagnostic Results'.bold.cyan);
    console.log('====================================='.cyan);
    
    if (this.workingEndpoints.length > 0) {
      console.log('✅ Working Endpoints Found:'.green.bold);
      this.workingEndpoints.forEach(endpoint => {
        console.log(`   • ${endpoint.url} (${endpoint.status})`.green);
        if (endpoint.data) {
          const preview = JSON.stringify(endpoint.data).substring(0, 100);
          console.log(`     Response: ${preview}...`.gray);
        }
      });
      console.log('');
      
      // Provide recommendations
      console.log('💡 Recommendations:'.bold);
      const healthEndpoint = this.workingEndpoints.find(e => 
        e.url.includes('/health') || e.url.includes('/status')
      );
      
      if (healthEndpoint) {
        const baseUrl = healthEndpoint.url.replace(/\/(health|status)$/, '');
        console.log(`   • Update API_BASE_URL to: "${baseUrl}"`);
        console.log(`   • Health endpoint: ${healthEndpoint.url}`);
      } else {
        const firstWorking = this.workingEndpoints[0];
        const baseUrl = firstWorking.url.replace(/\/[^\/]*$/, '');
        console.log(`   • Update API_BASE_URL to: "${baseUrl}"`);
      }
    } else {
      console.log('❌ No Working Endpoints Found'.red.bold);
      console.log('');
      console.log('🔧 Troubleshooting Steps:'.bold);
      console.log('   1. Check if your backend server is running');
      console.log('   2. Verify the correct domain/URL');
      console.log('   3. Check backend logs for errors');
      console.log('   4. Ensure CORS is properly configured');
      console.log('   5. Try accessing the backend URL directly in browser');
    }
    
    if (this.errors.length > 0) {
      console.log('');
      console.log('🚨 Common Errors Found:'.red.bold);
      const errorSummary = {};
      this.errors.forEach(error => {
        const key = error.status || 'CONNECTION_ERROR';
        errorSummary[key] = (errorSummary[key] || 0) + 1;
      });
      
      Object.entries(errorSummary).forEach(([status, count]) => {
        console.log(`   • ${status}: ${count} occurrences`.red);
      });
    }
    
    console.log('');
    console.log('📝 Next Steps:'.bold);
    console.log('   1. Update your API configuration with working endpoint');
    console.log('   2. Test using the web dashboard at /api-tester');
    console.log('   3. Run "npm run test-api" to verify fixes');
  }
}

// Add colors support check
if (!process.stdout.isTTY) {
  // If not in terminal, disable colors
  require('colors').mode = 'none';
}

// Run diagnostic
async function main() {
  const diagnostic = new BackendDiagnostic();
  await diagnostic.diagnoseBackend();
}

if (require.main === module) {
  main().catch(error => {
    console.error('❌ Fatal error:', error.message);
    process.exit(1);
  });
}

module.exports = BackendDiagnostic;