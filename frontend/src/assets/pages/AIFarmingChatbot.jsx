import React, { useState, useRef, useEffect } from 'react';
import { 
  FiMessageCircle, 
  FiSend, 
  FiUser, 
  FiBookOpen, 
  FiTrendingUp,
  FiThermometer,
  FiDroplet,
  FiSun,
  FiClock,
  FiAlertCircle,
  FiCheckCircle,
  FiX
} from 'react-icons/fi';

const AIFarmingChatbot = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('general');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Pre-defined farming advice categories
  const adviceCategories = [
    { id: 'general', name: 'General Farming', icon: '🌾', color: 'bg-green-500' },
    { id: 'pest-control', name: 'Pest Control', icon: '🐛', color: 'bg-red-500' },
    { id: 'soil-health', name: 'Soil Health', icon: '🌱', color: 'bg-brown-500' },
    { id: 'crop-rotation', name: 'Crop Rotation', icon: '🔄', color: 'bg-blue-500' },
    { id: 'weather', name: 'Weather Impact', icon: '🌤️', color: 'bg-yellow-500' },
    { id: 'disease', name: 'Disease Management', icon: '🦠', color: 'bg-purple-500' }
  ];

  // Mock AI responses based on categories
  const getAIResponse = (message, category) => {
    const responses = {
      'general': [
        "Based on your question, I recommend starting with soil testing to understand your current conditions. This will help determine the best crops for your area.",
        "Consider implementing crop diversification to improve soil health and reduce pest pressure naturally.",
        "Regular monitoring of your crops is essential. Check for early signs of stress, pests, or disease at least twice a week."
      ],
      'pest-control': [
        "For natural pest control, consider companion planting. Marigolds can deter nematodes, and basil repels tomato hornworms.",
        "Introduce beneficial insects like ladybugs and lacewings to control aphid populations naturally.",
        "Use row covers to protect young plants from flying pests. Remove them when plants begin flowering for pollination."
      ],
      'soil-health': [
        "Test your soil pH and nutrient levels annually. Most vegetables prefer pH 6.0-7.0.",
        "Add organic matter like compost or aged manure to improve soil structure and water retention.",
        "Practice no-till or minimal tillage to preserve soil structure and beneficial microorganisms."
      ],
      'crop-rotation': [
        "Rotate crops by family groups. Don't plant the same family in the same spot for 3-4 years.",
        "Follow heavy feeders (like corn) with nitrogen-fixing crops (like beans) to restore soil nutrients.",
        "Include cover crops in your rotation to prevent soil erosion and add organic matter."
      ],
      'weather': [
        "Monitor local weather forecasts and adjust planting schedules accordingly.",
        "Use mulch to regulate soil temperature and retain moisture during dry periods.",
        "Consider using cold frames or row covers to extend your growing season."
      ],
      'disease': [
        "Remove and destroy infected plant material immediately to prevent disease spread.",
        "Ensure proper spacing between plants for good air circulation.",
        "Water at the base of plants to keep foliage dry and reduce fungal disease risk."
      ]
    };

    const categoryResponses = responses[category] || responses['general'];
    return categoryResponses[Math.floor(Math.random() * categoryResponses.length)];
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString(),
      category: selectedCategory
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse = getAIResponse(inputMessage, selectedCategory);
      const aiMessage = {
        id: Date.now() + 1,
        text: aiResponse,
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString(),
        category: selectedCategory
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickQuestion = (question, category) => {
    setSelectedCategory(category);
    setInputMessage(question);
  };

  const quickQuestions = [
    { text: "How do I control aphids naturally?", category: 'pest-control' },
    { text: "What's the best way to improve soil fertility?", category: 'soil-health' },
    { text: "When should I plant tomatoes?", category: 'general' },
    { text: "How do I prevent blossom end rot?", category: 'disease' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-all duration-300">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4">
            🤖 AI Farming Assistant
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            24/7 AI-powered farming consultant for pest control, soil health, crop rotation, and more
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar - Categories and Quick Questions */}
          <div className="space-y-6">
            {/* Advice Categories */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                <FiBookOpen className="mr-2 text-blue-500" />
                Farming Advice Categories
              </h2>
              <div className="space-y-3">
                {adviceCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full p-3 rounded-xl border-2 transition-all duration-200 text-left ${
                      selectedCategory === category.id
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-600 hover:border-blue-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{category.icon}</span>
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        {category.name}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Questions */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                <FiTrendingUp className="mr-2 text-green-500" />
                Quick Questions
              </h2>
              <div className="space-y-3">
                {quickQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickQuestion(question.text, question.category)}
                    className="w-full p-3 text-left text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-all duration-200"
                  >
                    {question.text}
                  </button>
                ))}
              </div>
            </div>

            {/* Farming Tips */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                <FiSun className="mr-2 text-green-500" />
                Today's Farming Tip
              </h2>
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-sm text-green-800 dark:text-green-200">
                  <strong>Tip:</strong> Water your plants early in the morning to reduce evaporation and fungal disease risk. 
                  This allows foliage to dry quickly as temperatures rise.
                </p>
              </div>
            </div>
          </div>

          {/* Main Chat Area */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg h-[600px] flex flex-col">
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <FiUser className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 dark:text-white">AI Farming Assistant</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {selectedCategory === 'general' ? 'General Farming' : 
                         adviceCategories.find(c => c.id === selectedCategory)?.name} Expert
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">Online</span>
                  </div>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 && (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FiMessageCircle className="w-8 h-8 text-blue-500" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">
                      Welcome to AI Farming Assistant!
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      Ask me anything about farming, pest control, soil health, or crop management.
                    </p>
                  </div>
                )}

                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md p-3 rounded-2xl ${
                        message.sender === 'user'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white'
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                      <p className={`text-xs mt-2 ${
                        message.sender === 'user' ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {message.timestamp}
                      </p>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-2xl">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex space-x-3">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Ask about farming, pests, soil health..."
                    className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim()}
                    className="px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white rounded-xl font-medium transition-all duration-200 disabled:cursor-not-allowed"
                  >
                    <FiSend className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Chat Button for Mobile */}
        <button
          onClick={() => setChatOpen(!chatOpen)}
          className="fixed bottom-6 right-6 lg:hidden w-14 h-14 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 z-50"
        >
          {chatOpen ? <FiX className="w-6 h-6" /> : <FiMessageCircle className="w-6 h-6" />}
        </button>

        {/* Mobile Chat Overlay */}
        {chatOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden">
            <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-800 rounded-t-2xl h-96">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-800 dark:text-white">AI Farming Assistant</h3>
                  <button
                    onClick={() => setChatOpen(false)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <FiX className="w-6 h-6" />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <div className="flex space-x-3">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Ask about farming..."
                    className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim()}
                    className="px-4 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white rounded-xl font-medium"
                  >
                    <FiSend className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIFarmingChatbot;
