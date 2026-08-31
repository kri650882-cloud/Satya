import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  MapPin,
  ExternalLink,
  Bot,
  User,
  Phone,
  Calendar,
  Trash2,
  Minimize2,
  Maximize2,
  RefreshCw,
  Compass,
  ArrowRight,
  ShieldCheck,
  Zap,
  Brain
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ChatMessage, GroundingMapSource, ModelMode } from '../types';

interface GeminiChatbotProps {
  isOpen?: boolean;
  onClose?: () => void;
  initialPrompt?: string;
}

export const GeminiChatbot: React.FC<GeminiChatbotProps> = ({
  isOpen: controlledIsOpen,
  onClose: controlledOnClose,
  initialPrompt,
}) => {
  const { settings, openSiteVisitModal, language } = useApp();
  
  // Internal open state if not externally controlled
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
  
  const [isExpanded, setIsExpanded] = useState(false);
  const [modelMode, setModelMode] = useState<ModelMode>('general');
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Initial welcome message
  const defaultMessages: ChatMessage[] = [
    {
      id: 'welcome_1',
      role: 'model',
      content: language === 'hi' 
        ? `नमस्ते! 🙏 मैं **स्मृति विहार AI प्लॉट सलाहकार** (Smriti Vihar AI Advisor) हूँ।\n\nमैं आपको दरभंगा, मधुबनी, पंडौल और झंझारपुर में उपलब्ध आवासीय प्लॉट, जमीन की कीमतें, कट्ठा-धुर गणना, दाखिल-खारिज और गूगल मैप्स द्वारा वास्तविक दूरी व रास्तों की जानकारी दे सकता हूँ।\n\nआप मुझसे क्या पूछना चाहते हैं?`
        : `Hello! 🙏 I am your **Smriti Vihar AI Plot Advisor**.\n\nI can help you explore verified residential plots in **Darbhanga, Madhubani, Pandaul & Jhanjharpur**, calculate land prices (Kattha, Dhur, Sq.Ft.), explain registry/mutation rules, and give you real-time distance & location details via **Google Maps Grounding**.\n\nHow can I help you today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      modelUsed: 'gemini-3.7-flash',
    }
  ];

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('smriti_vihar_chat_history');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return defaultMessages;
  });

  // Save conversation history to local storage
  useEffect(() => {
    try {
      localStorage.setItem('smriti_vihar_chat_history', JSON.stringify(messages));
    } catch {
      // ignore
    }
  }, [messages]);

  // Scroll to bottom on new message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      // Focus input
      setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
    }
  }, [isOpen, messages]);

  // Handle initial prompt injection
  useEffect(() => {
    if (initialPrompt && isOpen) {
      handleSendMessage(initialPrompt);
    }
  }, [initialPrompt, isOpen]);

  // Request browser geolocation once for precise distance grounding
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          });
        },
        () => {
          // fallback to default Mithila center
          setUserLocation({
            latitude: 26.1542,
            longitude: 85.8918,
          });
        },
        { timeout: 5000 }
      );
    }
  }, []);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: 'usr_' + Date.now(),
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Convert to server payload
      const payloadMessages = newHistory.map(m => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: payloadMessages,
          modelMode,
          userLocation,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.message || data.error || 'Failed to reach AI service');
      }

      const botMsg: ChatMessage = {
        id: 'bot_' + Date.now(),
        role: 'model',
        content: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: data.modelUsed || (modelMode === 'fast' ? 'gemini-3.1-flash-lite' : modelMode === 'complex' ? 'gemini-3.1-pro-preview' : 'gemini-3.7-flash'),
        groundingMaps: data.groundingMaps || [],
        groundingWeb: data.groundingWeb || [],
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err: any) {
      console.error('Chat error:', err);
      const errorMsg: ChatMessage = {
        id: 'err_' + Date.now(),
        role: 'model',
        content: `⚠️ ${err.message || 'Unable to connect to AI server.'}\n\nYou can also contact **${settings.ownerName}** directly at **${settings.phone}** for immediate assistance.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isError: true,
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages(defaultMessages);
    localStorage.removeItem('smriti_vihar_chat_history');
  };

  const toggleOpen = () => {
    if (controlledOnClose) {
      controlledOnClose();
    } else {
      setInternalIsOpen(!internalIsOpen);
    }
  };

  // Quick suggestions
  const suggestedQuestions = [
    { label: '✈️ Distance to Darbhanga Airport?', query: 'What is the distance and route from Smriti Vihar plots to Darbhanga Airport?' },
    { label: '📐 Calculate 2 Kattha Price', query: 'Calculate the total price for 2 Kattha plot in Darbhanga at ₹1,800 per sq.ft.' },
    { label: '📜 Registry & Mutation (दाखिल-खारिज)', query: 'What is the registry and mutation process for residential land in Madhubani & Darbhanga?' },
    { label: '📍 Plots in Madhubani & Pandaul', query: 'Tell me about the available plot sizes, facing, and road width in Madhubani and Pandaul.' },
    { label: '📅 How to schedule Site Visit?', query: 'How can I schedule a free on-site visit with Satya Yadav?' },
  ];

  // Helper to render basic Markdown formatting (bold, lists, links, paragraphs)
  const renderFormattedContent = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, idx) => {
      // Empty line
      if (!line.trim()) {
        return <div key={idx} className="h-2" />;
      }

      // Check for bullet line
      const isBullet = line.trim().startsWith('•') || line.trim().startsWith('- ') || line.trim().startsWith('* ');
      let cleanLine = isBullet ? line.trim().replace(/^[-*•]\s+/, '') : line;

      // Parse bold **text**
      const parts: React.ReactNode[] = [];
      const boldRegex = /\*\*(.*?)\*\*/g;
      let lastIndex = 0;
      let match;

      while ((match = boldRegex.exec(cleanLine)) !== null) {
        if (match.index > lastIndex) {
          parts.push(cleanLine.substring(lastIndex, match.index));
        }
        parts.push(
          <strong key={`${idx}-${match.index}`} className="font-bold text-stone-900">
            {match[1]}
          </strong>
        );
        lastIndex = match.index + match[0].length;
      }
      if (lastIndex < cleanLine.length) {
        parts.push(cleanLine.substring(lastIndex));
      }

      if (isBullet) {
        return (
          <div key={idx} className="flex items-start gap-2 my-1 text-sm leading-relaxed">
            <span className="text-amber-500 font-bold mt-1 text-xs">•</span>
            <div className="flex-1">{parts}</div>
          </div>
        );
      }

      return (
        <p key={idx} className="my-1 text-sm leading-relaxed text-stone-800">
          {parts}
        </p>
      );
    });
  };

  return (
    <>
      {/* Floating Trigger Button (Bottom Right) */}
      {!isOpen && (
        <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-40">
          <button
            onClick={() => {
              if (controlledOnClose) {
                // If externally controlled, trigger toggle
                controlledOnClose();
              } else {
                setInternalIsOpen(true);
              }
            }}
            id="open-gemini-chatbot-btn"
            className="group relative flex items-center gap-2.5 px-4 py-3 sm:px-5 sm:py-3.5 rounded-full bg-stone-900 text-white shadow-2xl hover:bg-stone-800 border-2 border-amber-400/80 transition-all transform hover:scale-105 active:scale-95"
            aria-label="Open AI Plot Advisor"
          >
            {/* Sparkle Icon */}
            <div className="relative flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            </div>

            <div className="text-left">
              <div className="text-xs font-extrabold tracking-wide text-amber-300 uppercase">
                AI Plot Advisor
              </div>
              <div className="text-[10px] text-stone-300 hidden sm:block">
                Smart Gemini + Google Maps
              </div>
            </div>

            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30">
              Live
            </span>
          </button>
        </div>
      )}

      {/* Main Chat Window */}
      {isOpen && (
        <div
          id="gemini-chatbot-container"
          className={`fixed z-50 transition-all duration-300 flex flex-col bg-white shadow-2xl border border-stone-300 overflow-hidden ${
            isExpanded
              ? 'inset-2 sm:inset-6 rounded-2xl'
              : 'bottom-0 right-0 sm:bottom-6 sm:right-6 w-full sm:w-[440px] md:w-[480px] h-[92vh] sm:h-[640px] sm:max-h-[85vh] sm:rounded-2xl'
          }`}
        >
          {/* Header */}
          <div className="bg-stone-900 text-white px-4 py-3.5 border-b border-stone-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-bold shadow-md">
                <Sparkles className="w-5 h-5 text-stone-950" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm sm:text-base text-stone-100 flex items-center gap-1.5">
                    Smriti Vihar AI Advisor
                  </h3>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                    Gemini 3.7
                  </span>
                </div>
                <div className="text-[11px] text-stone-300 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span>Google Maps Grounded • Satya Yadav</span>
                </div>
              </div>
            </div>

            {/* Window Controls */}
            <div className="flex items-center gap-1">
              <button
                onClick={handleClearChat}
                title="Clear Chat History"
                id="clear-chat-btn"
                className="p-1.5 text-stone-400 hover:text-stone-200 rounded-lg hover:bg-stone-800 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                title={isExpanded ? 'Collapse' : 'Expand'}
                id="expand-chat-btn"
                className="p-1.5 text-stone-400 hover:text-stone-200 rounded-lg hover:bg-stone-800 transition-colors hidden sm:block"
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={toggleOpen}
                title="Close"
                id="close-chat-btn"
                className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Model & Mode Selector Bar */}
          <div className="bg-stone-100 px-3 py-1.5 border-b border-stone-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1 text-[11px] text-stone-600 font-medium">
              <span>Model Mode:</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setModelMode('general')}
                id="mode-general-btn"
                className={`px-2 py-1 rounded-md text-[10px] font-bold transition-all flex items-center gap-1 ${
                  modelMode === 'general'
                    ? 'bg-amber-500 text-stone-950 shadow-sm'
                    : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                }`}
                title="Gemini 3.7 Flash with Google Maps Grounding"
              >
                <Compass className="w-3 h-3" />
                <span>Maps + Smart</span>
              </button>

              <button
                onClick={() => setModelMode('fast')}
                id="mode-fast-btn"
                className={`px-2 py-1 rounded-md text-[10px] font-bold transition-all flex items-center gap-1 ${
                  modelMode === 'fast'
                    ? 'bg-amber-500 text-stone-950 shadow-sm'
                    : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                }`}
                title="Gemini 3.1 Flash Lite for fast responses"
              >
                <Zap className="w-3 h-3" />
                <span>Fast Lite</span>
              </button>

              <button
                onClick={() => setModelMode('complex')}
                id="mode-complex-btn"
                className={`px-2 py-1 rounded-md text-[10px] font-bold transition-all flex items-center gap-1 ${
                  modelMode === 'complex'
                    ? 'bg-amber-500 text-stone-950 shadow-sm'
                    : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                }`}
                title="Gemini 3.1 Pro for deep reasoning"
              >
                <Brain className="w-3 h-3" />
                <span>Deep Pro</span>
              </button>
            </div>
          </div>

          {/* Quick CTA banner */}
          <div className="bg-amber-50 px-3 py-1.5 border-b border-amber-200 flex items-center justify-between text-[11px] text-amber-900">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
              <span>Direct connect with Satya Yadav:</span>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={`tel:${settings.phone}`}
                className="font-bold underline text-stone-950 hover:text-amber-700 flex items-center gap-0.5"
              >
                <Phone className="w-3 h-3" /> {settings.phone}
              </a>
              <button
                onClick={() => openSiteVisitModal()}
                className="px-2 py-0.5 rounded bg-stone-900 text-amber-300 font-bold text-[10px] hover:bg-stone-800"
              >
                Book Visit
              </button>
            </div>
          </div>

          {/* Scrollable Messages Thread */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-stone-50/50">
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-start gap-2 max-w-[92%] sm:max-w-[85%]">
                    {/* Bot Icon */}
                    {!isUser && (
                      <div className="w-7 h-7 rounded-lg bg-stone-900 text-amber-400 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                        <Bot className="w-4 h-4" />
                      </div>
                    )}

                    {/* Message Bubble */}
                    <div
                      className={`rounded-2xl px-4 py-3 text-sm shadow-sm ${
                        isUser
                          ? 'bg-amber-500 text-stone-950 font-medium rounded-tr-none'
                          : msg.isError
                          ? 'bg-rose-50 border border-rose-200 text-rose-900 rounded-tl-none'
                          : 'bg-white border border-stone-200 text-stone-900 rounded-tl-none'
                      }`}
                    >
                      {/* Formatted Content */}
                      <div>{renderFormattedContent(msg.content)}</div>

                      {/* Google Maps Grounding Cards if returned */}
                      {msg.groundingMaps && msg.groundingMaps.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-stone-200/80">
                          <div className="flex items-center gap-1 text-[11px] font-bold text-stone-700 mb-2">
                            <MapPin className="w-3.5 h-3.5 text-rose-600" />
                            <span>Google Maps Grounded Locations:</span>
                          </div>
                          <div className="flex flex-col gap-1.5">
                            {msg.groundingMaps.map((mapItem, mIdx) => (
                              <a
                                key={mIdx}
                                href={mapItem.uri}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center justify-between p-2 rounded-xl bg-stone-100 hover:bg-amber-100/70 border border-stone-200 text-xs text-stone-900 transition-colors"
                              >
                                <div className="flex items-center gap-2 pr-2">
                                  <div className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center flex-shrink-0">
                                    <MapPin className="w-3 h-3" />
                                  </div>
                                  <div>
                                    <div className="font-semibold text-stone-900 group-hover:text-amber-900 leading-tight">
                                      {mapItem.title}
                                    </div>
                                    {mapItem.snippets && mapItem.snippets[0] && (
                                      <div className="text-[10px] text-stone-500 line-clamp-1">
                                        {mapItem.snippets[0]}
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded bg-white text-[10px] font-bold text-stone-700 group-hover:bg-amber-500 group-hover:text-stone-950 shadow-xs flex-shrink-0">
                                  <span>View Map</span>
                                  <ExternalLink className="w-2.5 h-2.5" />
                                </span>
                              </a>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Web Grounding Sources if returned */}
                      {msg.groundingWeb && msg.groundingWeb.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-stone-200/60 flex flex-wrap gap-1 items-center">
                          <span className="text-[10px] text-stone-400 font-medium">References:</span>
                          {msg.groundingWeb.map((w, wIdx) => (
                            <a
                              key={wIdx}
                              href={w.uri}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-stone-100 text-[10px] text-stone-600 hover:text-stone-900 border border-stone-200"
                            >
                              <span>{w.title}</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          ))}
                        </div>
                      )}

                      {/* Timestamp and Model badge */}
                      <div className="flex items-center justify-between mt-1.5 pt-1 text-[10px] text-stone-400">
                        <span>{msg.timestamp}</span>
                        {!isUser && msg.modelUsed && (
                          <span className="text-[9px] text-stone-400 font-medium">
                            {msg.modelUsed}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* User Icon */}
                    {isUser && (
                      <div className="w-7 h-7 rounded-lg bg-amber-600 text-white flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                        <User className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex items-start gap-2">
                <div className="w-7 h-7 rounded-lg bg-stone-900 text-amber-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white border border-stone-200 rounded-2xl rounded-tl-none px-4 py-3 text-xs text-stone-600 shadow-sm flex items-center gap-2">
                  <RefreshCw className="w-3.5 h-3.5 text-amber-500 animate-spin" />
                  <span>
                    Consulting Gemini {modelMode === 'complex' ? 'Pro' : 'Flash'} & retrieving Google Maps data...
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions Suggestions */}
          <div className="bg-stone-50 px-3 py-2 border-t border-stone-200 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-1.5 whitespace-nowrap">
              <span className="text-[11px] font-bold text-stone-500 flex items-center gap-1 flex-shrink-0">
                <Sparkles className="w-3 h-3 text-amber-500" />
                Quick:
              </span>
              {suggestedQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(q.query)}
                  disabled={isLoading}
                  className="px-2.5 py-1 rounded-full bg-white hover:bg-amber-100 text-[11px] font-medium text-stone-700 border border-stone-200 hover:border-amber-400 transition-colors flex-shrink-0 disabled:opacity-50"
                >
                  {q.label}
                </button>
              ))}
            </div>
          </div>

          {/* Message Input Form */}
          <div className="p-3 bg-white border-t border-stone-200">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask about plots, price per sq.ft., airport distance, registry..."
                disabled={isLoading}
                id="gemini-chat-input"
                className="flex-1 px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:bg-white text-stone-900 placeholder:text-stone-400 disabled:bg-stone-100"
              />

              <button
                type="submit"
                disabled={!inputMessage.trim() || isLoading}
                id="gemini-send-btn"
                className="px-4 py-2.5 bg-stone-900 hover:bg-stone-800 disabled:bg-stone-300 text-amber-300 disabled:text-stone-500 rounded-xl font-semibold text-sm transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <span>Send</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>

            <div className="flex justify-between items-center mt-1.5 text-[10px] text-stone-400 px-1">
              <span>Powered by Gemini 3.7 & Google Maps</span>
              <span>Satya Yadav: {settings.phone}</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
