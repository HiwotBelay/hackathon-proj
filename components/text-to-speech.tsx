"use client";

import { useEffect, useState } from "react";

interface TextToSpeechProps {
  text: string;
  onSpeakingChange?: (isSpeaking: boolean) => void;
}

export function TextToSpeech({ text, onSpeakingChange }: TextToSpeechProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    if (!text) return;

    const speak = async () => {
      try {
        setIsSpeaking(true);
        onSpeakingChange?.(true);

        // Use the Web Speech API
        const utterance = new SpeechSynthesisUtterance(text);

        // Set voice properties
        utterance.rate = 0.9; // Slightly slower for more natural speech
        utterance.pitch = 1.0;
        utterance.volume = 1.0;

        // Get available voices and select a suitable one
        const voices = window.speechSynthesis.getVoices();
        const preferredVoices = voices.filter(
          (voice) => voice.name.includes("English") || voice.lang.includes("en")
        );

        if (preferredVoices.length > 0) {
          utterance.voice = preferredVoices[0];
        }

        // Handle speech end
        utterance.onend = () => {
          setIsSpeaking(false);
          onSpeakingChange?.(false);
        };

        // Handle speech error
        utterance.onerror = (error) => {
          console.error("Speech synthesis error:", error);
          setIsSpeaking(false);
          onSpeakingChange?.(false);
        };

        // Start speaking
        window.speechSynthesis.speak(utterance);
      } catch (error) {
        console.error("Error in text-to-speech:", error);
        setIsSpeaking(false);
        onSpeakingChange?.(false);
      }
    };

    speak();

    // Cleanup function
    return () => {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      onSpeakingChange?.(false);
    };
  }, [text, onSpeakingChange]);

  return null; // This component doesn't render anything
}
