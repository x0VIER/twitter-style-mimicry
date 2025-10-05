// Only import Transformers.js in the browser
let pipeline: any = null;
let env: any = null;

if (typeof window !== 'undefined') {
  // Dynamic import only in browser
  import('@xenova/transformers').then((module) => {
    pipeline = module.pipeline;
    env = module.env;
    env.allowLocalModels = false;
    env.useBrowserCache = true;
  });
}

let generator: any = null;

export async function initializeGenerator(onProgress?: (progress: any) => void) {
  if (generator) {
    return generator;
  }

  try {
    // Ensure we're in the browser
    if (typeof window === 'undefined') {
      throw new Error('Generator can only be initialized in the browser');
    }

    // Wait for the dynamic import to complete if needed
    if (!pipeline) {
      const module = await import('@xenova/transformers');
      pipeline = module.pipeline;
      env = module.env;
      env.allowLocalModels = false;
      env.useBrowserCache = true;
    }

    // Use DistilGPT-2 for faster inference
    generator = await pipeline(
      'text-generation',
      'Xenova/distilgpt2',
      {
        progress_callback: onProgress,
      }
    );
    return generator;
  } catch (error) {
    console.error('Failed to initialize generator:', error);
    throw error;
  }
}

export interface GenerationOptions {
  prompt: string;
  maxLength?: number;
  temperature?: number;
  topK?: number;
  topP?: number;
  numReturn?: number;
}

export async function generateTweet(options: GenerationOptions): Promise<string[]> {
  if (!generator) {
    throw new Error('Generator not initialized. Call initializeGenerator() first.');
  }

  const {
    prompt,
    maxLength = 280,
    temperature = 0.8,
    topK = 50,
    topP = 0.95,
    numReturn = 3,
  } = options;

  try {
    const results = await generator(prompt, {
      max_new_tokens: Math.min(maxLength, 100),
      temperature,
      top_k: topK,
      top_p: topP,
      num_return_sequences: numReturn,
      do_sample: true,
      repetition_penalty: 1.2,
    });

    // Extract generated text and clean it up
    const tweets = results.map((result: any) => {
      let text = result.generated_text;
      
      // Remove the prompt from the beginning
      text = text.replace(prompt, '').trim();
      
      // Clean up the text
      text = cleanGeneratedText(text);
      
      return text;
    });

    return tweets.filter((t: string) => t.length > 0 && t.length <= 280);
  } catch (error) {
    console.error('Generation error:', error);
    throw error;
  }
}

function cleanGeneratedText(text: string): string {
  // Remove incomplete sentences at the end
  const sentences = text.split(/[.!?]\s+/);
  
  // If the last sentence doesn't end with punctuation, remove it
  if (sentences.length > 1 && !text.match(/[.!?]$/)) {
    sentences.pop();
    text = sentences.join('. ') + '.';
  }
  
  // Remove any text after newlines
  text = text.split('\n')[0];
  
  // Trim whitespace
  text = text.trim();
  
  // Ensure it's not too long
  if (text.length > 280) {
    text = text.substring(0, 277) + '...';
  }
  
  return text;
}

export function getGeneratorStatus(): boolean {
  return generator !== null;
}
