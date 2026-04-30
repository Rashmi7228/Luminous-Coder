import { useState, useEffect, useCallback, useRef } from 'react';

// Extend window for webkit speech
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      resolve([]);
      return;
    }
    const existing = window.speechSynthesis.getVoices();
    if (existing && existing.length > 0) {
      resolve(existing);
      return;
    }
    const handler = () => {
      const voices = window.speechSynthesis.getVoices();
      window.speechSynthesis.removeEventListener('voiceschanged', handler);
      resolve(voices);
    };
    window.speechSynthesis.addEventListener('voiceschanged', handler);
    // Fallback in case the event never fires
    setTimeout(() => {
      const voices = window.speechSynthesis.getVoices();
      resolve(voices || []);
    }, 1500);
  });
}

function pickVoice(voices: SpeechSynthesisVoice[], lang: string): SpeechSynthesisVoice | null {
  if (!voices.length) return null;
  const lower = lang.toLowerCase();
  const prefix = lower.split('-')[0];
  // 1. Exact match (e.g. "hi-IN" === "hi-IN")
  const exact = voices.find(v => v.lang.toLowerCase() === lower);
  if (exact) return exact;
  // 2. Same prefix, India variant if available (e.g. "hi-IN" matches any "hi-*")
  const prefixIN = voices.find(v => {
    const vl = v.lang.toLowerCase();
    return vl.startsWith(prefix + '-') && vl.endsWith('-in');
  });
  if (prefixIN) return prefixIN;
  // 3. Same prefix any region
  const prefixAny = voices.find(v => v.lang.toLowerCase().startsWith(prefix));
  if (prefixAny) return prefixAny;
  return null;
}

// Chunk long text into sentence-sized pieces. Chrome speechSynthesis silently
// cuts off utterances longer than ~200 characters, especially for non-English
// scripts, so we split by sentence terminators and queue them sequentially.
function chunkText(text: string, maxLen = 180): string[] {
  const cleaned = text.replace(/\s+/g, ' ').trim();
  if (!cleaned) return [];
  // Split on sentence-ending punctuation, including Devanagari danda (।)
  const sentences = cleaned.split(/(?<=[.!?।])\s+/).filter(Boolean);
  const chunks: string[] = [];
  for (const sentence of sentences) {
    if (sentence.length <= maxLen) {
      chunks.push(sentence);
    } else {
      // Hard-split overly long sentences on commas / spaces
      let remaining = sentence;
      while (remaining.length > maxLen) {
        let cut = remaining.lastIndexOf(',', maxLen);
        if (cut < maxLen / 2) cut = remaining.lastIndexOf(' ', maxLen);
        if (cut < maxLen / 2) cut = maxLen;
        chunks.push(remaining.slice(0, cut).trim());
        remaining = remaining.slice(cut).trim();
      }
      if (remaining) chunks.push(remaining);
    }
  }
  return chunks;
}

export function useSpeech(language: string = 'en-IN', ttsEnabled: boolean = true) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [recognition, setRecognition] = useState<any>(null);
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);
  const cancelledRef = useRef(false);

  // Load voices once on mount and refresh on voiceschanged
  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    let mounted = true;
    loadVoices().then(v => {
      if (mounted) voicesRef.current = v;
    });
    const refresh = () => {
      voicesRef.current = window.speechSynthesis.getVoices();
    };
    window.speechSynthesis.addEventListener('voiceschanged', refresh);
    return () => {
      mounted = false;
      window.speechSynthesis.removeEventListener('voiceschanged', refresh);
    };
  }, []);

  // Set up speech recognition for the current language
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const reco = new SpeechRecognition();
      reco.continuous = false;
      reco.interimResults = false;
      reco.lang = language;
      setRecognition(reco);
    } else {
      setIsSupported(false);
    }
  }, [language]);

  // When language changes, cancel any in-flight speech so it doesn't keep
  // talking in the previous language.
  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [language]);

  const listen = useCallback((onResult: (text: string) => void, onError?: () => void) => {
    if (!recognition) return;
    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript;
      onResult(text);
      setIsListening(false);
    };
    recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
      if (onError) onError();
    };
    recognition.onend = () => setIsListening(false);
    setIsListening(true);
    try {
      recognition.start();
    } catch (e) {
      console.error(e);
      setIsListening(false);
    }
  }, [recognition]);

  const stopListening = useCallback(() => {
    if (recognition && isListening) {
      recognition.stop();
      setIsListening(false);
    }
  }, [recognition, isListening]);

  const stopSpeaking = useCallback(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    cancelledRef.current = true;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  const speak = useCallback(async (text: string) => {
    if (!ttsEnabled || typeof window === 'undefined' || !window.speechSynthesis) return;
    if (!text || !text.trim()) return;

    // Cancel any ongoing speech and reset cancel flag
    window.speechSynthesis.cancel();
    cancelledRef.current = false;

    // Make sure voices are loaded — Chrome loads them lazily
    let voices = voicesRef.current;
    if (!voices || voices.length === 0) {
      voices = await loadVoices();
      voicesRef.current = voices;
    }
    const voice = pickVoice(voices, language);

    const chunks = chunkText(text);
    if (chunks.length === 0) return;

    setIsSpeaking(true);

    // Speak chunks sequentially. We rely on each utterance's onend to start
    // the next one, but also enqueue them into speechSynthesis at once for
    // engines that handle their own queue.
    for (const chunk of chunks) {
      if (cancelledRef.current) break;
      const utterance = new SpeechSynthesisUtterance(chunk);
      utterance.lang = language;
      if (voice) utterance.voice = voice;
      utterance.rate = 0.95;
      utterance.pitch = 1;
      utterance.volume = 1;
      window.speechSynthesis.speak(utterance);
    }

    // Track when the queue empties so isSpeaking flips off
    const watcher = setInterval(() => {
      if (typeof window === 'undefined' || !window.speechSynthesis) {
        clearInterval(watcher);
        return;
      }
      // Chrome has a known bug where speechSynthesis pauses itself after ~15s.
      // Keep it awake by calling resume periodically while still speaking.
      if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
        // no-op
      } else if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
      if (!window.speechSynthesis.speaking && !window.speechSynthesis.pending) {
        clearInterval(watcher);
        setIsSpeaking(false);
      }
    }, 250);
  }, [ttsEnabled, language]);

  return {
    isSupported,
    isListening,
    isSpeaking,
    listen,
    stopListening,
    speak,
    stopSpeaking,
  };
}
