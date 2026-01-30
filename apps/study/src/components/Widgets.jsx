import React, { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, Loader2, RefreshCw, ExternalLink, ChevronDown, ChevronUp } from "lucide-react";

export default function Widgets() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hello! 👋 I'm your Zetech University assistant. How can I help you find the perfect programme today?"
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [quickActions, setQuickActions] = useState([]);
  const [suggestedProgrammes, setSuggestedProgrammes] = useState([]);
  const [relevantFaqs, setRelevantFaqs] = useState([]);
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [metadata, setMetadata] = useState(null);
  const [connectionError, setConnectionError] = useState(false);
  const messagesEndRef = useRef(null);


  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  useEffect(() => {
    fetchQuickActions();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchQuickActions = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/chatbot/quick-actions`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setQuickActions(data.data);
        setConnectionError(false);
      }
    } catch (error) {
      console.error("Failed to fetch quick actions:", error);
      setConnectionError(true);
      
      setQuickActions([
        { id: 'certificate', text: '📜 Certificate Programmes', query: 'Show me certificate programmes', category: 'browse' },
        { id: 'diploma', text: '🎓 Diploma Programmes', query: 'Show me diploma programmes', category: 'browse' },
        { id: 'degree', text: '🎯 Degree Programmes', query: 'Show me degree programmes', category: 'browse' },
        { id: 'postgraduate', text: '👨‍🎓 Postgraduate', query: 'Show me postgraduate programmes', category: 'browse' },
        { id: 'affordable', text: '💰 Affordable Options', query: 'Show me affordable programmes under 200k', category: 'browse' },
        { id: 'business', text: '💼 Business', query: 'Show me business programmes', category: 'field' },
        { id: 'computing', text: '💻 Computing & IT', query: 'Show me computing programmes', category: 'field' },
        { id: 'engineering', text: '⚙️ Engineering', query: 'Show me engineering programmes', category: 'field' },
        { id: 'apply', text: '📝 How to Apply', query: 'How do I apply to Zetech University?', category: 'action' }
      ]);
    }
  };

  const sendMessage = async (message) => {
    if (!message.trim()) return;

    const userMessage = { role: "user", content: message };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);
    setConnectionError(false);

    try {
      const response = await fetch(`${API_BASE_URL}/chatbot/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message,
          conversationId,
          userId: localStorage.getItem('userId') 
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setMessages(prev => [...prev, {
          role: "assistant",
          content: data.data.response
        }]);

        if (!conversationId) {
          setConversationId(data.data.conversationId);
        }

        if (data.data.suggestedProgrammes?.length > 0) {
          setSuggestedProgrammes(data.data.suggestedProgrammes);
        } else {
          setSuggestedProgrammes([]);
        }

        if (data.data.relevantFaqs?.length > 0) {
          setRelevantFaqs(data.data.relevantFaqs);
        } else {
          setRelevantFaqs([]);
        }

        if (data.data.metadata) {
          setMetadata(data.data.metadata);
        }

        if (data.data.showApplyForm) {
          setShowApplyForm(true);
        }
      } else {
        throw new Error(data.message || 'Unknown error');
      }
    } catch (error) {
      console.error("Chat error:", error);
      setConnectionError(true);
      
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "I'm having trouble connecting to the server. Please try again in a moment, or reach out via:\n\n📧 Email: admissions@zetech.ac.ke\n📞 Phone: +254 746 071 362\n💬 WhatsApp: Click the green button"
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (query) => {
    sendMessage(query);
  };

  const handleWhatsAppClick = () => {
    const phoneNumber = "254746071362";
    const message = encodeURIComponent("Hello! I'm interested in joining Zetech University.");
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  const handleSendClick = () => {
    sendMessage(inputMessage);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputMessage);
    }
  };

  const viewProgrammeDetails = (programmeId) => {
    window.open(`${window.location.origin}/programmes/${programmeId}`, '_blank');
  };

  const toggleFaq = (faqId) => {
    setExpandedFaq(expandedFaq === faqId ? null : faqId);
  };

  const clearConversation = async () => {
    if (conversationId) {
      try {
        await fetch(`${API_BASE_URL}/chatbot/conversation/${conversationId}`, {
          method: 'DELETE'
        });
      } catch (error) {
        console.error('Error clearing conversation:', error);
      }
    }

    setMessages([
      {
        role: "assistant",
        content: "Hello! 👋 I'm your Zetech University assistant. How can I help you find the perfect programme today?"
      }
    ]);
    setConversationId(null);
    setSuggestedProgrammes([]);
    setRelevantFaqs([]);
    setShowApplyForm(false);
    setMetadata(null);
    setExpandedFaq(null);
  };

  const exportConversation = async () => {
    if (!conversationId) return;

    try {
      const response = await fetch(`${API_BASE_URL}/chatbot/export/${conversationId}?format=text`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `zetech-chat-${conversationId}.txt`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Export error:', error);
    }
  };

  const groupedQuickActions = quickActions.reduce((acc, action) => {
    const category = action.category || 'other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(action);
    return acc;
  }, {});

  const categoryLabels = {
    browse: '📚 Browse Programmes',
    field: '🎯 By Field',
    mode: '⏰ Study Mode',
    info: 'ℹ️ Information',
    action: '✨ Actions'
  };

  return (
    <>
      <div className="fixed bottom-6 left-6 z-50">
        <button
          onClick={handleWhatsAppClick}
          className="bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-110 group relative"
          aria-label="Contact us on WhatsApp"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
          </svg>
          <span className="absolute left-full ml-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white px-3 py-1 rounded text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            Chat on WhatsApp
          </span>
        </button>
      </div>

      {/* Chat Widget */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        {isChatOpen && (
          <div className="mb-4 bg-white rounded-lg shadow-2xl w-80 sm:w-96 h-[550px] flex flex-col animate-in slide-in-from-bottom-5 duration-300 overflow-hidden">
            {/* Chat Header */}
            <div className="bg-[#335395] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MessageCircle className="w-5 h-5" />
                <div>
                  <h3 className="font-semibold text-sm">Zetech AI Assistant</h3>
                  <p className="text-[10px] text-indigo-100">
                    {connectionError ? ' Connection issue' : ' Online'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {conversationId && (
                  <button 
                    onClick={exportConversation}
                    className="hover:bg-white/20 p-1 rounded text-xs"
                    title="Export conversation"
                  >
                    ⬇️
                  </button>
                )}
                <button 
                  onClick={clearConversation}
                  className="hover:bg-white/20 p-1 rounded"
                  title="Clear conversation"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setIsChatOpen(false)} 
                  className="hover:bg-white/20 p-1 rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 p-4 overflow-y-auto bg-gray-50 text-sm space-y-3">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`${
                    msg.role === "user"
                      ? "ml-auto bg-[#335395] text-white"
                      : "mr-auto bg-white border border-gray-200"
                  } rounded-lg p-3 max-w-[85%] shadow-sm`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                </div>
              ))}

              {isLoading && (
                <div className="flex items-center gap-2 text-gray-500 text-xs">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Typing...</span>
                </div>
              )}

              
              {metadata && !isLoading && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 text-[10px] text-blue-700">
                  Found {metadata.programmeCount} programme(s)
                  {metadata.faqCount > 0 && ` • ${metadata.faqCount} FAQ(s)`}
                </div>
              )}

              
              {suggestedProgrammes.length > 0 && (
                <div className="space-y-2 mt-4">
                  <p className="text-xs font-semibold text-gray-700 flex items-center gap-1">
                   Recommended Programmes
                  </p>
                  {suggestedProgrammes.map((prog) => (
                    <div 
                      key={prog.id} 
                      className="bg-white border border-indigo-200 rounded-lg p-3 hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer group"
                      onClick={() => viewProgrammeDetails(prog.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-xs text-[#1a2b4c] group-hover:text-[#335395]">
                            {prog.name}
                          </h4>
                          <p className="text-[10px] text-gray-500 mt-0.5">
                            {prog.code}
                          </p>
                        </div>
                        <ExternalLink className="w-3 h-3 text-gray-400 group-hover:text-[#335395]" />
                      </div>
                      
                      <div className="mt-2 space-y-1">
                        <p className="text-[10px] text-gray-600">
                          <span className="font-medium">{prog.level}</span> • {prog.school}
                        </p>
                        <p className="text-[10px] text-gray-600">
                          Duration: {prog.duration}
                        </p>
                        {prog.entryRequirements && prog.entryRequirements !== 'N/A' && (
                          <p className="text-[10px] text-gray-600">
                            Min. Grade: {prog.entryRequirements}
                          </p>
                        )}
                      </div>

                      <p className="text-xs font-bold text-[#335395] mt-2">
                        KES {prog.totalFee?.toLocaleString()}
                      </p>
                      
                      {/* Study Modes */}
                      {prog.studyModes?.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {prog.studyModes.map((mode, i) => (
                            <span 
                              key={i}
                              className="text-[9px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full"
                            >
                              {mode}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Campuses */}
                      {prog.campuses?.length > 0 && (
                        <p className="text-[9px] text-gray-500 mt-2">
                          📍 {prog.campuses.join(', ')}
                        </p>
                      )}

                      {/* Career Paths */}
                      {prog.careerPaths?.length > 0 && (
                        <p className="text-[9px] text-gray-500 mt-1">
                          💼 {prog.careerPaths.slice(0, 3).join(', ')}
                          {prog.careerPaths.length > 3 && '...'}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Relevant FAQs (NEW) */}
              {relevantFaqs.length > 0 && (
                <div className="space-y-2 mt-4">
                  <p className="text-xs font-semibold text-gray-700 flex items-center gap-1">
                    Helpful Information
                  </p>
                  {relevantFaqs.map((faq) => (
                    <div 
                      key={faq.id} 
                      className="bg-white border border-amber-200 rounded-lg overflow-hidden"
                    >
                      <button
                        onClick={() => toggleFaq(faq.id)}
                        className="w-full px-3 py-2 flex items-center justify-between hover:bg-amber-50 transition-colors text-left"
                      >
                        <span className="text-xs font-medium text-gray-800 flex-1 pr-2">
                          {faq.question}
                        </span>
                        {expandedFaq === faq.id ? (
                          <ChevronUp className="w-4 h-4 text-amber-600 flex-shrink-0" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-amber-600 flex-shrink-0" />
                        )}
                      </button>
                      
                      {expandedFaq === faq.id && (
                        <div className="px-3 py-2 bg-amber-50 border-t border-amber-200">
                          <p className="text-[10px] text-gray-700 whitespace-pre-wrap">
                            {faq.answer}
                          </p>
                          {faq.category && (
                            <span className="inline-block mt-2 text-[9px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded">
                              {faq.category}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* show at start*/}
              {messages.length === 1 && quickActions.length > 0 && (
                <div className="space-y-3 mt-4">
                  <p className="text-xs font-semibold text-gray-600">Quick Actions:</p>
                  
                  {Object.entries(groupedQuickActions).map(([category, actions]) => (
                    <div key={category} className="space-y-1.5">
                      {categoryLabels[category] && (
                        <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">
                          {categoryLabels[category]}
                        </p>
                      )}
                      {actions.map((action) => (
                        <button
                          key={action.id}
                          onClick={() => handleQuickAction(action.query)}
                          className="w-full bg-white border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 rounded-lg px-3 py-2 text-left text-xs transition-colors"
                        >
                          {action.text}
                        </button>
                      ))}
                    </div>
                  ))}
                </div>
              )}

              {/* Apply Form Prompt */}
              {showApplyForm && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-4">
                  <p className="text-xs font-semibold text-green-800 mb-2">
                    Ready to apply? 🎓
                  </p>
                  <button
                    onClick={() => window.open('/apply', '_blank')}
                    className="w-full bg-green-600 hover:bg-green-700 text-white text-xs py-2 rounded-lg transition-colors flex items-center justify-center gap-1"
                  >
                    Start Application
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 border-t bg-white">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask anything about programmes..."
                  disabled={isLoading}
                  className="flex-1 px-3 py-2 border rounded-full text-xs focus:outline-none focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
                <button
                  onClick={handleSendClick}
                  disabled={isLoading || !inputMessage.trim()}
                  className="bg-[#4c77ce] text-white p-2 rounded-full hover:bg-[#335395] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label="Send message"
                >
                  <Send size={16} />
                </button>
              </div>
              
              {/* Connection status indicator */}
              {connectionError && (
                <p className="text-[9px] text-red-500 mt-1 text-center">
                  Connection issue - trying to reconnect...
                </p>
              )}
            </div>
          </div>
        )}

        {/* Chat Toggle Button */}
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="bg-indigo-600 hover:bg-[#335395] text-white rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-110 group relative"
          aria-label={isChatOpen ? "Close chat" : "Open chat"}
        >
          {isChatOpen ? <X size={24} /> : <MessageCircle size={24} />}
          {!isChatOpen && (
            <>
              <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white px-3 py-1 rounded text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                Chat with AI Assistant
              </span>
              {/* Notification badge for unread messages */}
              {messages.length > 1 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {messages.length - 1}
                </span>
              )}
            </>
          )}
        </button>
      </div>
    </>
  );
}