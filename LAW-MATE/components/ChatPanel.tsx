import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage, AnalysisResult } from '../types';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Logo } from './ui/Logo';

interface ChatPanelProps {
  messages: ChatMessage[];
  onSendMessage: (message: string, image?: string | null) => void;
  isLoading: boolean;
  analysisResult: AnalysisResult | null;
  onSuggestionClick: (suggestion: string) => void;
}

const UserIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clipRule="evenodd" />
    </svg>
)

const PaperclipIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.122 2.122l7.81-7.81" />
    </svg>
);

export const ChatPanel: React.FC<ChatPanelProps> = ({ messages, onSendMessage, isLoading, analysisResult, onSuggestionClick }) => {
  const [input, setInput] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: 'end' });
  };

  useEffect(scrollToBottom, [messages, isLoading]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSend = () => {
    if (input.trim() || imagePreview) {
      onSendMessage(input, imagePreview);
      setInput('');
      setImagePreview(null);
      if(fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const suggestionPrompts = [
      "Explain my rights in more detail",
      ...analysisResult?.documentSuggestions.slice(0, 1).map(doc => `Help me draft a ${doc}`) ?? [],
  ]

  return (
    <Card className="h-[75vh] flex flex-col p-0">
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.length === 0 && (
            <div className="text-center text-text-secondary h-full flex flex-col justify-center items-center">
                <Logo className="h-16 w-16 text-slate-300 mb-4" />
                <h3 className="font-semibold text-lg text-text">Describe what happened...</h3>
                <p className="max-w-xs text-sm">Provide details and you can also upload an image for context (e.g., a screenshot or photo).</p>
            </div>
        )}
        {messages.map((msg, index) => (
          <div key={index} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.sender === 'ai' && <div className="bg-primary-dark text-white rounded-full p-2 flex-shrink-0 mt-1"><Logo className="h-5 w-5"/></div>}
            <div className={`max-w-xl p-3.5 rounded-2xl shadow-sm ${msg.sender === 'user' ? 'bg-primary-dark text-white rounded-br-none' : 'bg-slate-100 text-text rounded-bl-none'}`}>
              {msg.media && (
                <img src={msg.media.dataUrl} alt="User upload" className="rounded-lg mb-2 max-w-xs max-h-64 object-contain" />
              )}
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
            </div>
             {msg.sender === 'user' && <div className="bg-slate-200 text-slate-600 rounded-full p-2 flex-shrink-0 mt-1"><UserIcon className="h-5 w-5"/></div>}
          </div>
        ))}
        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="bg-primary-dark text-white rounded-full p-2 flex-shrink-0 mt-1"><Logo className="h-5 w-5"/></div>
            <div className="max-w-lg p-4 rounded-2xl bg-slate-100 rounded-bl-none">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-accent rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-accent rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
                <span className="text-sm text-text-secondary ml-2">LawMate is analyzing...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

       {analysisResult && !isLoading && (
        <div className="p-3 border-t border-border flex flex-wrap gap-2">
          {suggestionPrompts.map((prompt, i) => (
             <Button key={i} variant="subtle" className="text-xs py-1.5 px-3" onClick={() => onSuggestionClick(prompt)}>
              {prompt}
            </Button>
          ))}
        </div>
      )}

      <div className="p-4 border-t border-border bg-surface rounded-b-xl">
        {imagePreview && (
          <div className="mb-2 p-2 bg-slate-100 rounded-lg relative w-fit">
            <img src={imagePreview} alt="Preview" className="h-20 w-20 object-cover rounded" />
            <button
              onClick={() => {
                setImagePreview(null);
                if(fileInputRef.current) fileInputRef.current.value = "";
              }}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-6 w-6 flex items-center justify-center text-xs font-bold shadow"
            >
              &times;
            </button>
          </div>
        )}
        <div className="relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Describe your situation here..."
            className="w-full p-3 pr-28 border border-border rounded-lg focus:ring-2 focus:ring-primary-light resize-none transition-shadow bg-white"
            rows={2}
            disabled={isLoading}
          />
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
             <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
                className="p-2 text-text-secondary hover:text-primary-dark disabled:opacity-50 transition-colors"
                aria-label="Attach file"
              >
                <PaperclipIcon className="h-6 w-6" />
              </button>
             <Button onClick={handleSend} disabled={isLoading || (!input.trim() && !imagePreview)} className="py-2 px-4">
                Ask
             </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};