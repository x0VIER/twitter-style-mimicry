# Twitter Style Mimicry Tool

## Overview

This is an open-source, personal Twitter style mimicry tool built as a responsive website using **React.js** and **Next.js**. It integrates with the **Twitter API v2** to fetch user timelines and uses **Transformers.js** for client-side text generation, mimicking a target user's tweet style. The application is designed to be hosted for free on **Vercel**.

**Key Features:**
- Fetch up to 3200 tweets from any public Twitter user's timeline.
- Analyze tweet style based on vocabulary, syntax, emoji usage, and more.
- Generate new tweets in the target user's style using a lightweight AI model (DistilGPT-2) running directly in your browser.
- Clean, intuitive, and minimalist user interface, focusing on direct functionality.
- Secure handling of Twitter API keys (stored in browser localStorage or environment variables).
- Automation hooks for scheduling posts via webhooks (requires OAuth 1.0a for posting).
- Designed for low-cost (free tier only, no servers required for core functionality).

## Disclaimer

**This tool is for personal use and educational purposes only.** Please use it responsibly and ethically. Always respect Twitter's Terms of Service and API usage policies. Do not use this tool for spam, impersonation, or any malicious activities. Ensure you have proper authorization before posting content to any account. The generated content is based on AI models and may not always be accurate or appropriate.

## Table of Contents

1. [Features](#features)
2. [Getting Started](#getting-started)
   - [Prerequisites](#prerequisites)
   - [Installation](#installation)
3. [Twitter API Setup](#twitter-api-setup)
   - [Obtaining a Bearer Token](#obtaining-a-bearer-token)
   - [API Key Input](#api-key-input)
4. [Usage](#usage)
   - [Analyzing a Twitter Account](#analyzing-a-twitter-account)
   - [Generating Tweets](#generating-tweets)
5. [Deployment to Vercel](#deployment-to-vercel)
6. [Automation Hooks (Webhooks)](#automation-hooks-webhooks)
7. [Technical Details](#technical-details)
8. [Contributing](#contributing)
9. [License](#license)

## Features

(See Overview section above for a summary of features.)

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18.x or later)
- pnpm (or npm/yarn, but pnpm is recommended as used in this project)
- Git

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/twitter-style-mimicry.git
   cd twitter-style-mimicry
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Run the development server:**
   ```bash
   pnpm dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Twitter API Setup

This application uses the Twitter API v2 to fetch user timelines. You will need a Bearer Token for authentication.

### Obtaining a Bearer Token

1. Go to the [Twitter Developer Portal](https://developer.x.com/en/portal/dashboard).
2. Create a new Project and App if you don't have one.
3. Navigate to your App's settings and find the **generate a Bearer Token**.

### API Key Input

There are two ways to provide your Twitter API Bearer Token:

1.  **In-App (Recommended for personal use):** Enter your Bearer Token directly into the 

API Settings section of the application. This token will be stored securely in your browser's `localStorage`.
2.  **Environment Variable:** Create a `.env.local` file in the root of your project (or `.env` for production) and add your Bearer Token:
    ```
    TWITTER_BEARER_TOKEN=your_bearer_token_here
    ```
    Remember to restart your development server after adding or changing environment variables.

## Usage

### Analyzing a Twitter Account

1.  Enter the target Twitter `@username` in the input field.
2.  Click the "Fetch & Analyze Tweets" button.
3.  The application will fetch up to 3200 of the user's most recent tweets (excluding retweets and replies) and display a style analysis, including common words, phrases, emoji usage, and overall writing style.

### Generating Tweets

1.  After analyzing an account, you can optionally provide a `user prompt` (e.g., "Write about artificial intelligence") to guide the AI's generation.
2.  Click the "Train & Generate" button. The application will load a lightweight AI model (DistilGPT-2) in your browser and generate several tweet suggestions based on the analyzed style and your prompt.
3.  You can copy the generated tweets to your clipboard.

## Deployment to Vercel

This application is designed for easy deployment to [Vercel](https://vercel.com/).

1.  **Create a Git Repository:** Push your code to a new GitHub repository.
2.  **Import Project to Vercel:** Go to [Vercel Dashboard](https://vercel.com/dashboard) and import your Git repository.
3.  **Configure Environment Variables (Optional):** If you prefer to store your Twitter Bearer Token as an environment variable for deployment, add `TWITTER_BEARER_TOKEN` in your Vercel project settings.
4.  **Deploy:** Vercel will automatically detect that it's a Next.js project and deploy it.

## Automation Hooks (Webhooks)

This tool includes a basic webhook endpoint for scheduling posts to authorized accounts. **Note that posting tweets requires OAuth 1.0a User Context, not the Bearer Token used for fetching timelines.**

**Endpoint:** `/api/twitter/post`
**Method:** `POST`

**Request Body (JSON):**
```json
{
  "text": "Your tweet content here",
  "accessToken": "your_oauth_access_token",
  "accessTokenSecret": "your_oauth_access_token_secret"
}
```

**Usage with Automation Tools:**
-   **Zapier:** Connect this endpoint to Zapier to create automated workflows for scheduling tweets.
-   **Make (formerly Integromat):** Use Make.com to schedule and automate tweets based on various triggers.
-   **Vercel Cron Jobs:** For more advanced scheduling, you can configure [Vercel Cron Jobs](https://vercel.com/docs/cron-jobs) to hit this webhook endpoint at specified intervals.

**Important:** You will need to obtain OAuth 1.0a `accessToken` and `accessTokenSecret` from the Twitter Developer Portal for the account you wish to post from. This is a more complex authentication flow than the Bearer Token. For simplicity, this application focuses on client-side fetching and generation, with the webhook as an advanced option for users familiar with Twitter API posting.

## Technical Details

-   **Frontend:** Next.js, React, Tailwind CSS
-   **Twitter API Integration:** Next.js API Routes for proxying Twitter API v2 calls (to hide API keys and handle server-side logic).
-   **AI Model:** Transformers.js for client-side text generation using a pre-trained DistilGPT-2 model.
-   **Deployment:** Vercel

## Contributing

Contributions are welcome! Please feel free to open issues or submit pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

