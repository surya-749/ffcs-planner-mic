# Environment Setup Guide

This guide explains how to set up the required environment variables for the FFCS Planner application.

## Overview

The FFCS Planner uses several services that require secret keys and credentials:

- **MongoDB**: Database for storing user data and timetables
- **NextAuth**: Authentication and session management
- **OAuth Providers**: GitHub and Google login (optional)
- **Email Service**: For sending notifications (optional)

## Files

- `.env.example` - Template showing all available environment variables
- `secret.env` - Template for secret/sensitive environment variables
- `.env.local` - Your local configuration (create this from the templates above)

## Setup Instructions

### 1. Create Your Local Environment File

```bash
# Copy the example file
cp .env.example .env.local

# Edit with your actual values
# On Windows:
copy .env.example .env.local
```

### 2. Configure MongoDB

#### Option A: Local MongoDB
```env
MONGODB_URI=mongodb://localhost:27017/ffcs
```

#### Option B: MongoDB Atlas (Cloud)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account and cluster
3. Get your connection string
4. Replace `<password>` with your actual password

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ffcs?retryWrites=true&w=majority
```

### 3. Configure NextAuth

Generate a secure secret:

```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Or using OpenSSL (if available)
openssl rand -hex 32

# Or use the NextAuth CLI
npx auth secret
```

Add to `.env.local`:
```env
NEXTAUTH_SECRET=your_generated_secret
NEXTAUTH_URL=http://localhost:3000
```

### 4. Configure OAuth (Optional)

#### GitHub OAuth
1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Click "New OAuth App"
3. Fill in the application details:
   - Application name: FFCS Planner
   - Homepage URL: http://localhost:3000
   - Authorization callback URL: http://localhost:3000/api/auth/callback/github
4. Copy the Client ID and Client Secret

```env
GITHUB_ID=your_github_client_id
GITHUB_SECRET=your_github_client_secret
```

#### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials (Desktop application)
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`

```env
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### 5. Configure Email (Optional)

For Gmail:
1. Enable 2-Factor Authentication on your Google account
2. Generate an App Password: https://myaccount.google.com/apppasswords
3. Use that password instead of your actual password

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your_app_password
EMAIL_FROM=noreply@ffcsplanner.com
```

### 6. Verify Your Setup

Run the development server:
```bash
npm run dev
```

Visit http://localhost:3000 to test the application.

## Security Best Practices

1. **Never commit `.env.local` to version control** - It's already in .gitignore
2. **Use strong secrets** - Generate using cryptographic methods (minimum 32 characters)
3. **Rotate secrets regularly** - Especially if compromised
4. **Use environment-specific values** - Different secrets for development, staging, and production
5. **Keep backups** - Store important credentials securely (password manager)
6. **Limit permissions** - OAuth apps should only have necessary scopes

## Production Deployment

For production deployment (Vercel, AWS, etc.):

1. Add environment variables through the platform's dashboard:
   - Vercel: Settings → Environment Variables
   - AWS: Systems Manager → Parameter Store
   - Other platforms: Follow their documentation

2. Use production versions of external services:
   - MongoDB Atlas production cluster
   - Production OAuth apps
   - Production email service

3. Ensure NEXTAUTH_URL matches your production domain

## Troubleshooting

### MongoDB Connection Issues
- Verify connection string format
- Check MongoDB is running (local) or network is accessible (Atlas)
- Ensure IP whitelist includes your IP (Atlas)

### NextAuth Errors
- Verify NEXTAUTH_SECRET is set
- Check NEXTAUTH_URL matches your domain
- Clear cookies and try again

### OAuth Redirect Errors
- Verify callback URLs exactly match in OAuth provider settings
- Check Client ID and Client Secret are correct
- Ensure your domain is whitelisted in OAuth settings

## Additional Resources

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [MongoDB Atlas Guide](https://docs.atlas.mongodb.com/)
- [Environment Variables in Next.js](https://nextjs.org/docs/basic-features/environment-variables)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
