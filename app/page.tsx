'use client';

import { useState, useEffect } from 'react';
import { analyzeStyle, generateStylePrompt, StyleProfile } from '@/lib/styleAnalyzer';
import { initializeGenerator, generateTweet } from '@/lib/tweetGenerator';

export default function Home() {
  const [bearerToken, setBearerToken] = useState('');
  const [username, setUsername] = useState('');
  const [userPrompt, setUserPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [modelLoading, setModelLoading] = useState(false);
  const [modelProgress, setModelProgress] = useState('');
  const [tweets, setTweets] = useState<any[]>([]);
  const [styleProfile, setStyleProfile] = useState<StyleProfile | null>(null);
  const [generatedTweets, setGeneratedTweets] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Load bearer token from localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem('twitter_bearer_token');
    if (savedToken) {
      setBearerToken(savedToken);
    }
  }, []);

  // Save bearer token to localStorage
  const saveBearerToken = () => {
    if (bearerToken) {
      localStorage.setItem('twitter_bearer_token', bearerToken);
      setSuccess('API token saved');
      setTimeout(() => setSuccess(''), 2000);
    }
  };

  const fetchAndAnalyze = async () => {
    if (!username || !bearerToken) {
      setError('Username and bearer token required');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');
    setTweets([]);
    setStyleProfile(null);
    setGeneratedTweets([]);

    try {
      const response = await fetch('/api/twitter/timeline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, bearerToken }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch tweets');
      }

      setTweets(data.tweets);
      const profile = analyzeStyle(data.tweets);
      setStyleProfile(profile);
      setSuccess(`Analyzed ${data.tweetCount} tweets`);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const generateNewTweet = async () => {
    if (!styleProfile) {
      setError('Analyze a Twitter account first');
      return;
    }

    setModelLoading(true);
    setError('');
    setGeneratedTweets([]);

    try {
      await initializeGenerator((progress) => {
        if (progress.status === 'progress') {
          setModelProgress(`Loading: ${Math.round(progress.progress)}%`);
        } else if (progress.status === 'done') {
          setModelProgress('Loaded');
        }
      });

      const prompt = generateStylePrompt(styleProfile, userPrompt);
      setModelProgress('Generating...');
      
      const results = await generateTweet({
        prompt,
        maxLength: styleProfile.averageLength,
        temperature: 0.9,
        numReturn: 3,
      });

      setGeneratedTweets(results);
      setModelProgress('');
    } catch (err: any) {
      setError(err.message || 'Failed to generate');
      setModelProgress('');
    } finally {
      setModelLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setSuccess('Copied');
    setTimeout(() => setSuccess(''), 1500);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <h1 className="text-2xl font-normal text-gray-900">Twitter Style Mimicry</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Messages */}
        {error && (
          <div className="mb-6 p-4 border border-red-300 bg-red-50 text-red-800 text-sm">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-6 p-4 border border-green-300 bg-green-50 text-green-800 text-sm">
            {success}
          </div>
        )}

        {/* API Token Section */}
        <section className="mb-12">
          <h2 className="text-lg font-medium text-gray-900 mb-4">API Configuration</h2>
          <div className="border border-gray-300 p-6">
            <label className="block text-sm text-gray-700 mb-2">
              Twitter API Bearer Token
            </label>
            <input
              type="password"
              value={bearerToken}
              onChange={(e) => setBearerToken(e.target.value)}
              placeholder="Enter your Bearer Token"
              className="w-full px-3 py-2 border border-gray-300 text-sm mb-3 focus:outline-none focus:border-gray-500"
            />
            <button
              onClick={saveBearerToken}
              className="px-4 py-2 bg-black text-white text-sm hover:bg-gray-800"
            >
              Save Token
            </button>
          </div>
        </section>

        {/* Step 1: Analyze */}
        <section className="mb-12">
          <h2 className="text-lg font-medium text-gray-900 mb-4">1. Analyze Twitter Account</h2>
          <div className="border border-gray-300 p-6">
            <label className="block text-sm text-gray-700 mb-2">
              Twitter Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value.replace('@', ''))}
              placeholder="username"
              className="w-full px-3 py-2 border border-gray-300 text-sm mb-3 focus:outline-none focus:border-gray-500"
            />
            <button
              onClick={fetchAndAnalyze}
              disabled={loading || !bearerToken}
              className="w-full px-4 py-3 bg-black text-white text-sm hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {loading ? 'Fetching...' : 'Fetch & Analyze'}
            </button>
          </div>
        </section>

        {/* Style Analysis Results */}
        {styleProfile && (
          <section className="mb-12">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Style Analysis</h2>
            <div className="border border-gray-300 p-6">
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Common Words</h3>
                <div className="text-sm text-gray-700">
                  {styleProfile.commonWords.slice(0, 10).map((w, i) => (
                    <span key={i} className="mr-3">
                      {w.word} ({w.count})
                    </span>
                  ))}
                </div>
              </div>

              {styleProfile.emojiUsage.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Emoji Usage</h3>
                  <div className="text-sm text-gray-700">
                    {styleProfile.emojiUsage.map((e, i) => (
                      <span key={i} className="mr-3">
                        {e.emoji} ({e.count})
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Writing Style</h3>
                <p className="text-sm text-gray-700">{styleProfile.writingStyle}</p>
                <p className="text-sm text-gray-600 mt-1">Average length: {styleProfile.averageLength} characters</p>
              </div>
            </div>
          </section>
        )}

        {/* Step 2: Generate */}
        {styleProfile && (
          <section className="mb-12">
            <h2 className="text-lg font-medium text-gray-900 mb-4">2. Generate Tweet</h2>
            <div className="border border-gray-300 p-6">
              <label className="block text-sm text-gray-700 mb-2">
                Topic or Prompt (Optional)
              </label>
              <input
                type="text"
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
                placeholder="e.g., Write about technology"
                className="w-full px-3 py-2 border border-gray-300 text-sm mb-3 focus:outline-none focus:border-gray-500"
              />
              <button
                onClick={generateNewTweet}
                disabled={modelLoading}
                className="w-full px-4 py-3 bg-black text-white text-sm hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {modelLoading ? modelProgress || 'Generating...' : 'Generate'}
              </button>
            </div>
          </section>
        )}

        {/* Generated Results */}
        {generatedTweets.length > 0 && (
          <section className="mb-12">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Generated Tweets</h2>
            <div className="space-y-4">
              {generatedTweets.map((tweet, i) => (
                <div key={i} className="border border-gray-300 p-4">
                  <p className="text-sm text-gray-900 mb-3">{tweet}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{tweet.length} / 280</span>
                    <button
                      onClick={() => copyToClipboard(tweet)}
                      className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Disclaimer */}
        <section className="border-t border-gray-200 pt-8">
          <p className="text-xs text-gray-600 leading-relaxed">
            <strong>Disclaimer:</strong> This tool is for personal use and educational purposes only. 
            Respect Twitter's Terms of Service. Do not use for spam or impersonation.
          </p>
        </section>
      </main>
    </div>
  );
}
