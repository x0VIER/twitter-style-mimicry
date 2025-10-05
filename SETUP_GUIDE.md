# Twitter Style Mimicry Tool - Complete Setup Guide

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Twitter API Setup](#twitter-api-setup)
4. [Local Development Setup](#local-development-setup)
5. [Deployment to Vercel](#deployment-to-vercel)
6. [Using the Application](#using-the-application)
7. [Automation & Webhooks](#automation--webhooks)
8. [Troubleshooting](#troubleshooting)

## Overview

This guide will walk you through setting up the Twitter Style Mimicry Tool from scratch. The tool analyzes Twitter accounts and generates tweets in their style using AI, all running in your browser for free.

**What You'll Build:**
- A responsive web application that fetches tweets from Twitter API v2
- Client-side AI text generation using Transformers.js
- Style analysis based on vocabulary, syntax, and patterns
- Secure API key management
- Free hosting on Vercel

## Prerequisites

Before you begin, ensure you have:

- **Node.js** (v18.x or later) - [Download here](https://nodejs.org/)
- **pnpm** - Install with `npm install -g pnpm`
- **Git** - [Download here](https://git-scm.com/)
- **A Twitter Developer Account** - [Sign up here](https://developer.x.com/)
- **A Vercel Account** (for deployment) - [Sign up here](https://vercel.com/)

## Twitter API Setup

### Step 1: Create a Twitter Developer Account

1. Go to the [Twitter Developer Portal](https://developer.x.com/en/portal/dashboard)
2. Sign in with your Twitter account
3. Apply for a developer account (if you don't have one)
4. Complete the application form explaining your use case

### Step 2: Create a Project and App

1. Once approved, click **"Create Project"**
2. Enter a project name (e.g., "Twitter Style Mimicry")
3. Select your use case (e.g., "Making a bot" or "Exploring the API")
4. Provide a description of your app
5. Click **"Create App"** within your project

### Step 3: Generate a Bearer Token

1. Navigate to your App's **"Keys and tokens"** tab
2. Under **"Authentication Tokens"**, find **"Bearer Token"**
3. Click **"Generate"** to create a new Bearer Token
4. **IMPORTANT:** Copy and save this token immediately - you won't be able to see it again!
5. Store it securely (you'll need it later)

### Step 4: Configure API Access Level

1. Go to your App's **"Settings"** tab
2. Ensure your access level is at least **"Free"** or **"Basic"**
3. The Free tier allows:
   - 500,000 tweets per month
   - 1,500 requests per 15 minutes (with Bearer Token)
   - Access to user timeline endpoint

**Note:** For reading public tweets, you only need a Bearer Token (OAuth 2.0 App-Only). For posting tweets, you would need OAuth 1.0a credentials.

## Local Development Setup

### Step 1: Clone the Repository

```bash
git clone https://github.com/your-username/twitter-style-mimicry.git
cd twitter-style-mimicry
```

### Step 2: Install Dependencies

```bash
pnpm install
```

This will install all required packages including:
- Next.js 15
- React 19
- Transformers.js
- Tailwind CSS
- Lucide React (icons)

### Step 3: Configure Environment Variables (Optional)

You can provide your Bearer Token in two ways:

**Option A: In-App Configuration (Recommended for personal use)**
- You'll enter the token directly in the app's Settings panel
- It will be stored in your browser's localStorage

**Option B: Environment Variable**
1. Create a `.env.local` file in the project root:
   ```bash
   touch .env.local
   ```

2. Add your Bearer Token:
   ```
   TWITTER_BEARER_TOKEN=your_bearer_token_here
   ```

3. Restart your development server if it's running

### Step 4: Run the Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. You should see the Twitter Style Mimicry Tool interface.

### Step 5: Test the Application

1. Click the **Settings** icon (gear) in the top right
2. Enter your Twitter Bearer Token
3. Click **"Save Token"**
4. Enter a Twitter username (e.g., "elonmusk")
5. Click **"Fetch & Analyze Tweets"**
6. Wait for the analysis to complete
7. Optionally enter a prompt and click **"Train & Generate"**

## Deployment to Vercel

### Step 1: Push to GitHub

1. Create a new repository on GitHub
2. Push your code:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/your-username/twitter-style-mimicry.git
   git push -u origin main
   ```

### Step 2: Import to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Vercel will automatically detect it's a Next.js project

### Step 3: Configure Environment Variables (Optional)

If you want to use environment variables for the Bearer Token:

1. In the Vercel project settings, go to **"Environment Variables"**
2. Add a new variable:
   - **Name:** `TWITTER_BEARER_TOKEN`
   - **Value:** Your Bearer Token
   - **Environment:** Production, Preview, Development

### Step 4: Deploy

1. Click **"Deploy"**
2. Wait for the build to complete (usually 1-2 minutes)
3. Your app will be live at `https://your-project-name.vercel.app`

### Step 5: Configure Custom Domain (Optional)

1. In Vercel project settings, go to **"Domains"**
2. Add your custom domain
3. Follow the DNS configuration instructions

## Using the Application

### Analyzing a Twitter Account

1. **Enter Username:** Type the Twitter username (without @) in the input field
2. **Fetch Tweets:** Click "Fetch & Analyze Tweets"
3. **View Analysis:** The app will display:
   - Common words and phrases
   - Emoji usage patterns
   - Hashtag frequency
   - Writing style characteristics
   - Average tweet length

### Generating Tweets

1. **Optional Prompt:** Enter a topic or prompt (e.g., "Write about AI")
2. **Generate:** Click "Train & Generate"
3. **Wait for Model:** The first time, it will download the AI model (~40MB)
4. **View Results:** Multiple tweet suggestions will appear
5. **Copy:** Click "Copy" to copy any generated tweet to your clipboard

### Tips for Best Results

- **Analyze accounts with many tweets:** More data = better style analysis
- **Use specific prompts:** "Write about space exploration" works better than "Write something"
- **Regenerate if needed:** Click "Train & Generate" again for new suggestions
- **Edit generated tweets:** The AI suggestions are starting points - feel free to edit them

## Automation & Webhooks

The application includes a webhook endpoint for scheduling posts. **Note:** Posting tweets requires OAuth 1.0a credentials, not just a Bearer Token.

### Webhook Endpoint

**URL:** `https://your-app.vercel.app/api/twitter/post`
**Method:** POST

**Request Body:**
```json
{
  "text": "Your tweet content here",
  "accessToken": "your_oauth_access_token",
  "accessTokenSecret": "your_oauth_access_token_secret"
}
```

### Integration Options

#### Option 1: Zapier
1. Create a new Zap
2. Choose a trigger (e.g., "Every day at 9 AM")
3. Add an action: "Webhooks by Zapier" → "POST"
4. Enter your webhook URL and JSON body
5. Test and activate

#### Option 2: Make (formerly Integromat)
1. Create a new scenario
2. Add a schedule trigger
3. Add an HTTP module
4. Configure POST request to your webhook
5. Activate scenario

#### Option 3: Vercel Cron Jobs
1. Create a `vercel.json` file with cron configuration
2. Add a cron endpoint in your Next.js app
3. Deploy to Vercel
4. Cron jobs will run automatically

### Getting OAuth 1.0a Credentials for Posting

1. Go to Twitter Developer Portal
2. Navigate to your App's "Keys and tokens" tab
3. Generate "Access Token and Secret"
4. Use these credentials in your webhook requests

## Troubleshooting

### Issue: "Failed to fetch tweets"

**Possible Causes:**
- Invalid Bearer Token
- Username doesn't exist
- Account is private
- Rate limit exceeded

**Solutions:**
- Verify your Bearer Token is correct
- Check the username spelling
- Wait 15 minutes if rate limited
- Ensure the account is public

### Issue: "Model loading failed"

**Possible Causes:**
- Slow internet connection
- Browser compatibility issues
- Insufficient memory

**Solutions:**
- Wait longer (first load can take 1-2 minutes)
- Try a different browser (Chrome/Edge recommended)
- Close other tabs to free up memory
- Clear browser cache and reload

### Issue: "Build failed on Vercel"

**Possible Causes:**
- TypeScript errors
- Missing dependencies
- Configuration issues

**Solutions:**
- Run `pnpm build` locally first
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify `next.config.ts` is correct

### Issue: "Generated tweets are nonsensical"

**Possible Causes:**
- Insufficient training data
- Model limitations
- Poor prompt engineering

**Solutions:**
- Analyze accounts with more tweets (100+)
- Use more specific prompts
- Try generating multiple times
- Edit the output manually

### Issue: "CORS errors in browser"

**Possible Causes:**
- Transformers.js security headers

**Solutions:**
- The `vercel.json` includes necessary CORS headers
- Ensure you're using the latest version
- Check browser console for specific errors

## Rate Limits & Best Practices

### Twitter API Rate Limits

- **User Timeline:** 1,500 requests per 15 minutes (Bearer Token)
- **Monthly Cap:** 500,000 tweets per month (Free tier)

**Best Practices:**
- Cache fetched tweets in localStorage
- Don't repeatedly fetch the same account
- Respect rate limits to avoid temporary bans

### AI Model Usage

- **First Load:** ~40MB download, takes 1-2 minutes
- **Subsequent Loads:** Cached in browser, instant
- **Generation Time:** 5-30 seconds depending on device

**Best Practices:**
- Use on desktop/laptop for best performance
- Ensure stable internet connection for first load
- Close unnecessary tabs to free up memory

## Security Considerations

### API Key Storage

- **localStorage:** Keys stored in browser, not on server
- **Environment Variables:** Keys stored securely in Vercel
- **Never commit:** `.env.local` is in `.gitignore`

### Personal Use Only

This tool is designed for personal use and educational purposes. Do not:
- Use it for spam or automated posting at scale
- Impersonate others
- Violate Twitter's Terms of Service
- Share your API credentials

## Support & Contributing

### Getting Help

- Check the [README.md](README.md) for overview
- Review this setup guide thoroughly
- Check GitHub Issues for known problems
- Open a new issue if you find a bug

### Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

---

**Built with ❤️ using Next.js, React, and Transformers.js**
