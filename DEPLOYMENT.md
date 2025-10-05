# Deployment Guide for Vercel

This guide provides step-by-step instructions for deploying the Twitter Style Mimicry Tool to Vercel.

## Prerequisites

- A GitHub account with the repository pushed
- A Vercel account (sign up at [vercel.com](https://vercel.com))
- Your Twitter API Bearer Token

## Deployment Steps

### 1. Push Code to GitHub

If you haven't already, push your code to GitHub:

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/twitter-style-mimicry.git
git branch -M main
git push -u origin main
```

### 2. Import Project to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Select **"Import Git Repository"**
4. Choose your GitHub repository
5. Click **"Import"**

### 3. Configure Project Settings

Vercel will automatically detect this as a Next.js project. The default settings should work:

- **Framework Preset:** Next.js
- **Build Command:** `pnpm build` (or `npm run build`)
- **Output Directory:** `.next`
- **Install Command:** `pnpm install` (or `npm install`)

### 4. Add Environment Variables (Optional)

If you want to use environment variables for your Twitter Bearer Token:

1. In the project configuration screen, expand **"Environment Variables"**
2. Add the following variable:
   - **Name:** `TWITTER_BEARER_TOKEN`
   - **Value:** Your Twitter API Bearer Token
   - **Environment:** Select all (Production, Preview, Development)
3. Click **"Add"**

**Note:** This is optional. Users can also enter their Bearer Token directly in the app's Settings panel.

### 5. Deploy

1. Click **"Deploy"**
2. Wait for the build process to complete (typically 1-2 minutes)
3. Once complete, you'll see a success message with your deployment URL

### 6. Access Your Deployed App

Your app will be available at:
```
https://your-project-name.vercel.app
```

Or a custom domain if you configure one.

## Post-Deployment Configuration

### Custom Domain (Optional)

1. Go to your project in Vercel Dashboard
2. Navigate to **"Settings"** → **"Domains"**
3. Click **"Add"**
4. Enter your custom domain
5. Follow the DNS configuration instructions provided by Vercel

### Environment Variables Management

To update environment variables after deployment:

1. Go to **"Settings"** → **"Environment Variables"**
2. Edit or add new variables
3. Redeploy your app for changes to take effect

### Automatic Deployments

Vercel automatically deploys:
- **Production:** When you push to the `main` branch
- **Preview:** When you create a pull request

## Vercel Configuration

The project includes a `vercel.json` file with the following configuration:

```json
{
  "buildCommand": "pnpm build",
  "framework": "nextjs",
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Cross-Origin-Embedder-Policy",
          "value": "require-corp"
        },
        {
          "key": "Cross-Origin-Opener-Policy",
          "value": "same-origin"
        }
      ]
    }
  ]
}
```

These headers are required for Transformers.js to work properly in the browser.

## Troubleshooting Deployment Issues

### Build Fails

**Error:** TypeScript compilation errors

**Solution:**
- Run `pnpm build` locally first to catch errors
- Fix any TypeScript errors before pushing
- Check the build logs in Vercel for specific errors

### App Loads but Features Don't Work

**Error:** Transformers.js fails to load

**Solution:**
- Ensure the `vercel.json` headers are configured correctly
- Check browser console for CORS errors
- Verify the build completed successfully

### API Routes Return 500 Errors

**Error:** Twitter API calls fail

**Solution:**
- Verify your Bearer Token is correct
- Check that environment variables are set properly
- Ensure your Twitter Developer App has the correct permissions

## Performance Optimization

### Edge Functions

Vercel automatically optimizes API routes as Edge Functions for better performance globally.

### Caching

The app uses browser caching for:
- Transformers.js models (cached after first load)
- Twitter API responses (cached in localStorage)

### Bundle Size

The current build produces:
- **First Load JS:** ~119 KB (gzipped)
- **Page Size:** ~5.72 KB

## Monitoring & Analytics

### Vercel Analytics (Optional)

Enable Vercel Analytics for insights:

1. Go to your project settings
2. Navigate to **"Analytics"**
3. Click **"Enable"**

### Error Tracking

Monitor errors in:
- Vercel Dashboard → **"Logs"**
- Browser console for client-side errors

## Cost Considerations

### Vercel Free Tier Includes:

- Unlimited deployments
- 100 GB bandwidth per month
- Serverless function execution
- Automatic HTTPS
- Preview deployments

This project is designed to stay within the free tier limits.

### Twitter API Free Tier Includes:

- 500,000 tweets per month
- 1,500 requests per 15 minutes
- Access to user timeline endpoint

## Updating Your Deployment

To update your deployed app:

1. Make changes locally
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Your update message"
   git push
   ```
3. Vercel will automatically rebuild and redeploy

## Rollback

If a deployment has issues:

1. Go to Vercel Dashboard → **"Deployments"**
2. Find a previous successful deployment
3. Click **"..."** → **"Promote to Production"**

## Security Best Practices

1. **Never commit API keys** to GitHub
2. **Use environment variables** for sensitive data
3. **Enable Vercel's security features** in project settings
4. **Regularly rotate** your Twitter API tokens
5. **Monitor usage** to detect unusual activity

## Support

If you encounter issues:

1. Check Vercel's [documentation](https://vercel.com/docs)
2. Review the [SETUP_GUIDE.md](SETUP_GUIDE.md)
3. Open an issue on GitHub
4. Contact Vercel support for platform-specific issues

---

**Deployment Time:** ~2 minutes
**Free Tier:** ✅ Yes
**Custom Domain:** ✅ Supported
**Automatic HTTPS:** ✅ Included
