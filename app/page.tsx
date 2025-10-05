'use client';

import { useState, useEffect } from 'react';
import { Twitter, Sparkles, Download, Settings, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
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
  const [showSettings, setShowSettings] = useState(false);

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
      setSuccess('API token saved successfully!');
      setTimeout(() => setSuccess(''), 3000);
      setShowSettings(false);
    }
  };

  const fetchAndAnalyze = async () => {
    if (!username || !bearerToken) {
      setError('Please provide both username and bearer token');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');
    setTweets([]);
    setStyleProfile(null);
    setGeneratedTweets([]);

    try {
      // Fetch tweets from API
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
      
      // Analyze style
      const profile = analyzeStyle(data.tweets);
      setStyleProfile(profile);
      
      setSuccess(`Analyzed ${data.tweetCount} tweets from @${username}!`);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const generateNewTweet = async () => {
    if (!styleProfile) {
      setError('Please analyze a Twitter account first');
      return;
    }

    setModelLoading(true);
    setError('');
    setGeneratedTweets([]);

    try {
      // Initialize generator if not already done
      await initializeGenerator((progress) => {
        if (progress.status === 'progress') {
          setModelProgress(`Loading model: ${Math.round(progress.progress)}%`);
        } else if (progress.status === 'done') {
          setModelProgress('Model loaded!');
        }
      });

      // Generate prompt based on style
      const prompt = generateStylePrompt(styleProfile, userPrompt);
      
      setModelProgress('Generating tweets...');
      
      // Generate tweets
      const results = await generateTweet({
        prompt,
        maxLength: styleProfile.averageLength,
        temperature: 0.9,
        numReturn: 3,
      });

      setGeneratedTweets(results);
      setModelProgress('');
    } catch (err: any) {
      setError(err.message || 'Failed to generate tweet');
      setModelProgress('');
    } finally {
      setModelLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setSuccess('Copied to clipboard!');
    setTimeout(() => setSuccess(''), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-500 p-2 rounded-xl">
              <Twitter className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Twitter Style Mimicry</h1>
              <p className="text-sm text-gray-500">AI-powered tweet style analyzer & generator</p>
            </div>
          </div>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Settings className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </header>

      {/* Settings Panel */}
      {showSettings && (
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <h2 className="text-lg font-semibold mb-4">API Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Twitter API Bearer Token
                </label>
                <input
                  type="password"
                  value={bearerToken}
                  onChange={(e) => setBearerToken(e.target.value)}
                  placeholder="Enter your Twitter API v2 Bearer Token"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="mt-2 text-xs text-gray-500">
                  Get your Bearer Token from the{' '}
                  <a
                    href="https://developer.x.com/en/portal/dashboard"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    Twitter Developer Portal
                  </a>
                </p>
              </div>
              <button
                onClick={saveBearerToken}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Save Token
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Alerts */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}
        
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <p className="text-green-700 text-sm">{success}</p>
          </div>
        )}

        {/* Input Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-200">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Twitter className="w-5 h-5 text-blue-500" />
            Step 1: Fetch & Analyze Twitter Account
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Twitter Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value.replace('@', ''))}
                placeholder="elonmusk"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <button
              onClick={fetchAndAnalyze}
              disabled={loading || !bearerToken}
              className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 font-medium"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Fetching tweets...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  Fetch & Analyze Tweets
                </>
              )}
            </button>
          </div>
        </div>

        {/* Style Profile */}
        {styleProfile && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-200">
            <h2 className="text-lg font-semibold mb-4">Style Analysis</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Common Words</h3>
                <div className="flex flex-wrap gap-2">
                  {styleProfile.commonWords.slice(0, 10).map((w, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                    >
                      {w.word} ({w.count})
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-2">Common Phrases</h3>
                <div className="flex flex-wrap gap-2">
                  {styleProfile.commonPhrases.slice(0, 5).map((p, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                    >
                      {p.phrase}
                    </span>
                  ))}
                </div>
              </div>

              {styleProfile.emojiUsage.length > 0 && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Emoji Usage</h3>
                  <div className="flex flex-wrap gap-2">
                    {styleProfile.emojiUsage.map((e, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm"
                      >
                        {e.emoji} ({e.count})
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h3 className="font-medium text-gray-900 mb-2">Writing Style</h3>
                <p className="text-gray-700 text-sm">{styleProfile.writingStyle}</p>
                <p className="text-gray-600 text-sm mt-1">{styleProfile.sentenceStructure}</p>
                <p className="text-gray-500 text-sm mt-1">
                  Avg. length: {styleProfile.averageLength} characters
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Generation Section */}
        {styleProfile && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-200">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-500" />
              Step 2: Generate Tweet in Style
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Optional: Provide a topic or prompt
                </label>
                <input
                  type="text"
                  value={userPrompt}
                  onChange={(e) => setUserPrompt(e.target.value)}
                  placeholder="e.g., Write about artificial intelligence"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <button
                onClick={generateNewTweet}
                disabled={modelLoading}
                className="w-full px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 font-medium"
              >
                {modelLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {modelProgress || 'Generating...'}
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Train & Generate
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Generated Tweets */}
        {generatedTweets.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <h2 className="text-lg font-semibold mb-4">Generated Tweets</h2>
            
            <div className="space-y-4">
              {generatedTweets.map((tweet, i) => (
                <div
                  key={i}
                  className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors"
                >
                  <p className="text-gray-800 mb-3">{tweet}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {tweet.length} / 280 characters
                    </span>
                    <button
                      onClick={() => copyToClipboard(tweet)}
                      className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>⚠️ Disclaimer:</strong> This tool is for personal use and educational purposes only. 
            Please respect Twitter's Terms of Service and API usage policies. Do not use this tool for spam, 
            impersonation, or any malicious activities. Always ensure you have proper authorization before 
            posting content to any account.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white/80 backdrop-blur-sm mt-12">
        <div className="max-w-6xl mx-auto px-4 py-6 text-center text-sm text-gray-600">
          <p>
            Open-source Twitter Style Mimicry Tool • Built with Next.js, React, and Transformers.js
          </p>
          <p className="mt-2">
            For personal use only • Respects rate limits and privacy
          </p>
        </div>
      </footer>
    </div>
  );
}
