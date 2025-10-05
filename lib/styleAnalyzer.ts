export interface StyleProfile {
  commonWords: { word: string; count: number }[];
  commonPhrases: { phrase: string; count: number }[];
  emojiUsage: { emoji: string; count: number }[];
  hashtagUsage: { hashtag: string; count: number }[];
  averageLength: number;
  sentenceStructure: string;
  topics: string[];
  writingStyle: string;
}

export function analyzeStyle(tweets: any[]): StyleProfile {
  if (!tweets || tweets.length === 0) {
    throw new Error('No tweets to analyze');
  }

  const texts = tweets.map(t => t.text || '');
  
  // Analyze word frequency
  const wordCounts = new Map<string, number>();
  const phraseCounts = new Map<string, number>();
  const emojiCounts = new Map<string, number>();
  const hashtagCounts = new Map<string, number>();
  
  let totalLength = 0;
  
  // Emoji regex
  const emojiRegex = /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu;
  
  texts.forEach(text => {
    totalLength += text.length;
    
    // Extract emojis
    const emojis = text.match(emojiRegex) || [];
    emojis.forEach((emoji: string) => {
      emojiCounts.set(emoji, (emojiCounts.get(emoji) || 0) + 1);
    });
    
    // Extract hashtags
    const hashtags = text.match(/#\w+/g) || [];
    hashtags.forEach((tag: string) => {
      hashtagCounts.set(tag, (hashtagCounts.get(tag) || 0) + 1);
    });
    
    // Clean text for word analysis
    const cleanText = text
      .replace(emojiRegex, '')
      .replace(/#\w+/g, '')
      .replace(/@\w+/g, '')
      .replace(/https?:\/\/\S+/g, '')
      .toLowerCase();
    
    // Extract words (filter out common stop words)
    const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'is', 'was', 'are', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'it', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'we', 'they', 'my', 'your', 'his', 'her', 'our', 'their']);
    
    const words = cleanText.match(/\b\w+\b/g) || [];
    words.forEach((word: string) => {
      if (word.length > 2 && !stopWords.has(word)) {
        wordCounts.set(word, (wordCounts.get(word) || 0) + 1);
      }
    });
    
    // Extract 2-3 word phrases
    for (let i = 0; i < words.length - 1; i++) {
      const phrase = `${words[i]} ${words[i + 1]}`;
      if (!stopWords.has(words[i]) || !stopWords.has(words[i + 1])) {
        phraseCounts.set(phrase, (phraseCounts.get(phrase) || 0) + 1);
      }
    }
  });
  
  // Sort and get top items
  const sortedWords = Array.from(wordCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([word, count]) => ({ word, count }));
  
  const sortedPhrases = Array.from(phraseCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .filter(([_, count]) => count > 1)
    .slice(0, 15)
    .map(([phrase, count]) => ({ phrase, count }));
  
  const sortedEmojis = Array.from(emojiCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([emoji, count]) => ({ emoji, count }));
  
  const sortedHashtags = Array.from(hashtagCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([hashtag, count]) => ({ hashtag, count }));
  
  // Calculate average length
  const averageLength = Math.round(totalLength / texts.length);
  
  // Analyze sentence structure
  const hasQuestions = texts.some(t => t.includes('?'));
  const hasExclamations = texts.some(t => t.includes('!'));
  const shortTweets = texts.filter(t => t.length < 100).length;
  const longTweets = texts.filter(t => t.length > 200).length;
  
  let sentenceStructure = '';
  if (shortTweets > texts.length * 0.6) {
    sentenceStructure = 'Prefers short, concise tweets';
  } else if (longTweets > texts.length * 0.4) {
    sentenceStructure = 'Often writes longer, detailed tweets';
  } else {
    sentenceStructure = 'Balanced mix of short and medium-length tweets';
  }
  
  // Determine writing style
  let writingStyle = '';
  if (hasQuestions && hasExclamations) {
    writingStyle = 'Engaging and interactive, uses questions and exclamations';
  } else if (hasQuestions) {
    writingStyle = 'Thoughtful and inquisitive, often asks questions';
  } else if (hasExclamations) {
    writingStyle = 'Enthusiastic and expressive';
  } else {
    writingStyle = 'Direct and informative';
  }
  
  // Extract topics from top words
  const topics = sortedWords.slice(0, 5).map(w => w.word);
  
  return {
    commonWords: sortedWords,
    commonPhrases: sortedPhrases,
    emojiUsage: sortedEmojis,
    hashtagUsage: sortedHashtags,
    averageLength,
    sentenceStructure,
    topics,
    writingStyle,
  };
}

export function generateStylePrompt(profile: StyleProfile, userPrompt?: string): string {
  const basePrompt = userPrompt || 'Write a tweet';
  
  const styleContext = `
Style Guide:
- Common vocabulary: ${profile.commonWords.slice(0, 10).map(w => w.word).join(', ')}
- Typical phrases: ${profile.commonPhrases.slice(0, 5).map(p => p.phrase).join('; ')}
- Emoji usage: ${profile.emojiUsage.length > 0 ? profile.emojiUsage.slice(0, 5).map(e => e.emoji).join(' ') : 'minimal'}
- Average length: ${profile.averageLength} characters
- Writing style: ${profile.writingStyle}
- Sentence structure: ${profile.sentenceStructure}
- Common topics: ${profile.topics.join(', ')}

Task: ${basePrompt}

Write a tweet that matches this style:`;
  
  return styleContext;
}
