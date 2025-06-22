# GitHub OAuth Setup Guide for Auth.js

This guide walks you through setting up GitHub OAuth with Auth.js for the TODO application.

## Prerequisites

- GitHub account

## Step 1: Create GitHub OAuth App

1. **Log in to GitHub**
   - Go to GitHub.com and log in to your account
   - Navigate to Settings → Developer settings → OAuth Apps

2. **Create a New OAuth App**
   - Click "New OAuth App"
   - Fill in the application details:
     - **Application name**: `TODO App`
     - **Homepage URL**: `http://localhost:5173`
     - **Application description**: `Todo application with Auth.js authentication`
     - **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`
   - Click "Register application"

3. **Get OAuth App Credentials**
   - Note down the **Client ID** from the app page
   - Click "Generate a new client secret" and note down the **Client Secret**
   - Keep these values safe - you'll need them for environment configuration

## Step 2: Configure Environment Variables

1. **Create backend `.env` file**
   ```bash
   cp packages/backend/.env.example packages/backend/.env
   ```

2. **Update the backend `.env` file**
   ```env
   # Database
   DATABASE_URL=postgresql://postgres:password@localhost:5432/todoapp

   # Server
   PORT=3000
   NODE_ENV=development

   # Auth.js Configuration
   AUTH_SECRET=your-super-secret-32-character-key-for-jwt-signing
   GITHUB_ID=your-github-oauth-app-client-id
   GITHUB_SECRET=your-github-oauth-app-client-secret
   ```

   Replace:
   - `your-super-secret-32-character-key-for-jwt-signing` with a secure random string (32+ characters)
   - `your-github-oauth-app-client-id` with your GitHub OAuth App Client ID
   - `your-github-oauth-app-client-secret` with your GitHub OAuth App Client Secret

3. **Create frontend `.env` file**
   ```bash
   cp packages/frontend/.env.example packages/frontend/.env
   ```

4. **Update the frontend `.env` file**
   ```env
   # Backend API URL
   VITE_API_URL=http://localhost:3000/api
   ```

## Step 3: Test the Configuration

1. **Start the backend server**
   ```bash
   cd packages/backend
   bun run dev
   ```

2. **Start the frontend server**
   ```bash
   cd packages/frontend
   bun run dev
   ```

3. **Test authentication flow**
   - Visit http://localhost:5173 (frontend login page)
   - Click "Sign in with GitHub" (redirects to GitHub)
   - Authorize the application in GitHub
   - After successful GitHub login, you should be redirected to the dashboard

## Step 4: Production Configuration

For production deployment, update the following:

1. **GitHub OAuth App**
   - Update the Authorization callback URL to your production domain:
     `https://your-domain.com/api/auth/callback/github`
   - Update the Homepage URL to your production frontend

2. **Environment Variables**
   - Set `NODE_ENV=production`
   - Update API URLs to production URLs
   - Use secure secrets and proper SSL certificates
   - Ensure AUTH_SECRET is cryptographically secure for production

## Troubleshooting

### Common Issues

1. **"Invalid Callback URL"**
   - Ensure the callback URL in GitHub OAuth settings matches your application
   - Check that the GitHub OAuth app callback URL is correct: `http://localhost:3000/api/auth/callback/github`

2. **"Access Denied"**
   - Verify that your GitHub OAuth application has the correct permissions
   - Check that the GitHub OAuth app is properly configured

3. **"Invalid Client"**
   - Double-check your GitHub Client ID and Client Secret in environment variables
   - Ensure the Client Secret is correctly copied (no extra spaces)

4. **CORS Issues**
   - Verify CORS settings in your backend application allow your frontend domain
   - Check that credentials are being sent with requests

### Debug Mode

To enable debug logging:
1. Set `DEBUG=hono:*` in your environment
2. Check browser network tab for detailed request/response information
3. Check backend console logs for Auth.js debug information

## Security Best Practices

1. **Use HTTPS in production**
2. **Implement proper CORS policies**
3. **Use secure session cookies**
4. **Regularly rotate secrets**
5. **Monitor authentication logs for suspicious activity**
6. **Implement rate limiting on authentication endpoints**

## Next Steps

After successful setup:
1. Implement frontend login/logout UI
2. Add user session management
3. Implement protected routes
4. Add user profile management