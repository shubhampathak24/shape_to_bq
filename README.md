# GIS Processing Web Application

A modern web application for processing and uploading geographic data to Google BigQuery using Google Cloud Storage.

## 🔐 Authentication & Security

### **IMPORTANT: Security Best Practices**

This application supports **two secure authentication methods** for browser-based applications:

#### 1. **Google OAuth 2.0 (Recommended)**
- ✅ **Secure for browser applications**
- ✅ **User-based authentication with proper scopes**
- ✅ **No sensitive credentials in frontend code**
- ✅ **Automatic token refresh**

#### 2. **API Gateway (Alternative)**
- ✅ **Secure when using a proper backend**
- ✅ **API key-based authentication**
- ✅ **Backend handles all GCP operations**

#### ❌ **Service Account Keys (NOT SUPPORTED)**
- **Service account keys are NOT supported in browser applications**
- **This is a fundamental security limitation of web browsers**
- **Private keys cannot be securely stored in frontend code**
- **Anyone with browser access could extract and misuse the keys**

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd project-19760
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Authentication

#### Option A: Google OAuth (Recommended)
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services > Credentials**
3. Create a new **OAuth 2.0 Client ID**
4. Add your domain to authorized origins
5. Copy the Client ID and Client Secret

Create a `.env` file:
```env
# Google OAuth Configuration (Required)
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here.apps.googleusercontent.com
VITE_GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# Google Cloud Configuration
VITE_GCP_PROJECT_ID=your_project_id
VITE_GCS_DEFAULT_BUCKET=your_gcs_bucket
VITE_BIGQUERY_DEFAULT_DATASET=your_dataset

# Application Settings
VITE_ENVIRONMENT=development
VITE_ENABLE_REAL_PROCESSING=true
VITE_MAX_FILE_SIZE=100
```

#### Option B: API Gateway
If you have a backend API that handles GCP operations:
```env
VITE_API_ENDPOINT=https://your-api-gateway.com/api
VITE_API_KEY=your_api_key_here
```

### 4. Start Development Server
```bash
npm run dev
```

## 📋 Features

- **File Upload**: Support for ZIP, SHP, GeoJSON, and KML files
- **Google Cloud Storage**: Secure file storage and processing
- **BigQuery Integration**: Direct data loading to BigQuery tables
- **Real-time Processing**: Live job status updates
- **Schema Management**: Custom schema definition and validation
- **Error Handling**: Comprehensive error reporting and recovery

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth Client ID | Yes (for OAuth) |
| `VITE_GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret | Yes (for OAuth) |
| `VITE_GCP_PROJECT_ID` | Google Cloud Project ID | Yes |
| `VITE_GCS_DEFAULT_BUCKET` | Default GCS bucket | Yes |
| `VITE_BIGQUERY_DEFAULT_DATASET` | Default BigQuery dataset | Yes |
| `VITE_API_ENDPOINT` | API Gateway endpoint | Yes (for API Gateway) |
| `VITE_API_KEY` | API Gateway key | Yes (for API Gateway) |
| `VITE_ENVIRONMENT` | Environment (development/production) | No |
| `VITE_ENABLE_REAL_PROCESSING` | Enable real GCP operations | No |
| `VITE_MAX_FILE_SIZE` | Maximum file size in MB | No |

### Required Google Cloud Permissions

For OAuth authentication, users need these scopes:
- `https://www.googleapis.com/auth/bigquery`
- `https://www.googleapis.com/auth/cloud-platform`
- `https://www.googleapis.com/auth/devstorage.read_write`

## 🛡️ Security Considerations

### What's Secure
- ✅ OAuth 2.0 authentication flow
- ✅ API Gateway with backend validation
- ✅ Environment variable configuration
- ✅ Token-based authentication
- ✅ Automatic token refresh

### What's NOT Secure
- ❌ Service account keys in browser code
- ❌ Hardcoded credentials
- ❌ Client-side JWT signing
- ❌ Exposing private keys to JavaScript

### Best Practices
1. **Always use OAuth for browser applications**
2. **Never store service account keys in frontend code**
3. **Use environment variables for configuration**
4. **Implement proper CORS policies**
5. **Use HTTPS in production**
6. **Regularly rotate API keys and tokens**

## 🚨 Troubleshooting

### Common Issues

#### OAuth Configuration
- **Error**: "Google Client ID is not properly configured"
  - **Solution**: Verify `VITE_GOOGLE_CLIENT_ID` is set correctly
  - **Solution**: Ensure the Client ID ends with `.apps.googleusercontent.com`

#### Permission Errors
- **Error**: "Permission denied" for GCS or BigQuery
  - **Solution**: Check that the user has the required IAM roles
  - **Solution**: Verify OAuth scopes are granted

#### File Upload Issues
- **Error**: "File size exceeds maximum"
  - **Solution**: Increase `VITE_MAX_FILE_SIZE` or compress files
  - **Solution**: Check GCS bucket permissions

## 📚 API Reference

### Job Processing
```typescript
// Create a new processing job
const job = await jobService.createJob(config, userId);

// Get job status
const jobStatus = await jobService.getJob(jobId);

// Subscribe to real-time updates
const unsubscribe = jobService.subscribeToJobUpdates(jobId, (job) => {
  console.log('Job updated:', job.status);
});
```

### File Upload
```typescript
// Upload to GCS
const result = await gcsService.uploadFile(file, bucket, path);

// Test connection
const test = await gcsService.testConnection();
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
1. Check the troubleshooting section
2. Review Google Cloud documentation
3. Open an issue on GitHub

---

**Remember**: Always prioritize security when working with cloud credentials. When in doubt, use OAuth authentication for browser applications.
