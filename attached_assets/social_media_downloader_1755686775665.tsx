import React, { useState } from 'react';
import { Download, Video, Instagram, Music, Users, AlertCircle, CheckCircle, Loader } from 'lucide-react';

const SocialMediaDownloader = () => {
  const [activeTab, setActiveTab] = useState('tiktok');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [downloadData, setDownloadData] = useState(null);

  const tools = [
    { id: 'tiktok', name: 'TikTok', icon: Video, color: 'bg-black hover:bg-gray-800' },
    { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600' },
    { id: 'youtube', name: 'YouTube', icon: Music, color: 'bg-red-500 hover:bg-red-600' },
    { id: 'twitter', name: 'Twitter', icon: Users, color: 'bg-blue-500 hover:bg-blue-600' }
  ];

  const handleDownload = async (formData) => {
    setLoading(true);
    setStatus('Processing your request...');
    setDownloadData(null);

    try {
      // Simulate API call - replace with actual API endpoint
      const endpoint = activeTab === 'tiktok' ? '/api/tools/tiktok/download' : '/api/tools/instagram/download';
      
      // Mock response for demonstration
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const mockResponse = {
        success: true,
        files: [
          { name: 'video_1.mp4', url: '#', size: '2.3 MB' },
          { name: 'video_2.mp4', url: '#', size: '1.8 MB' }
        ],
        excel_url: '#',
        total_count: 2
      };

      setDownloadData(mockResponse);
      setStatus('Download completed successfully!');
    } catch (error) {
      setStatus('Error occurred during download. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const TikTokDownloader = () => {
    const [formData, setFormData] = useState({
      type: 'username',
      value: '',
      limit: 10
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      if (!formData.value.trim()) return;
      handleDownload(formData);
    };

    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Video className="text-black" />
            TikTok Downloader
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Download Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
              >
                <option value="username">By Username</option>
                <option value="keyword">By Keyword</option>
                <option value="hashtag">By Hashtag</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {formData.type === 'username' ? 'Username' : 
                 formData.type === 'keyword' ? 'Search Keyword' : 'Hashtag'}
              </label>
              <input
                type="text"
                value={formData.value}
                onChange={(e) => setFormData({...formData, value: e.target.value})}
                placeholder={formData.type === 'username' ? '@username' : 
                           formData.type === 'keyword' ? 'Enter keyword' : '#hashtag'}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Download Limit
              </label>
              <select
                value={formData.limit}
                onChange={(e) => setFormData({...formData, limit: parseInt(e.target.value)})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
              >
                <option value={5}>5 videos</option>
                <option value={10}>10 videos</option>
                <option value={20}>20 videos</option>
                <option value={50}>50 videos</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-3 px-4 rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
            >
              {loading ? (
                <>
                  <Loader className="animate-spin" size={20} />
                  Processing...
                </>
              ) : (
                <>
                  <Download size={20} />
                  Start Download
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    );
  };

  const InstagramDownloader = () => {
    const [formData, setFormData] = useState({
      type: 'url',
      value: ''
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      if (!formData.value.trim()) return;
      handleDownload(formData);
    };

    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Instagram className="text-pink-500" />
            Instagram Downloader
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Download Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              >
                <option value="url">Single Post/Reel URL</option>
                <option value="username">User Profile</option>
                <option value="story">Story Highlights</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {formData.type === 'url' ? 'Instagram URL' : 
                 formData.type === 'username' ? 'Username' : 'Story Highlights'}
              </label>
              <input
                type="text"
                value={formData.value}
                onChange={(e) => setFormData({...formData, value: e.target.value})}
                placeholder={formData.type === 'url' ? 'https://instagram.com/p/...' : 
                           formData.type === 'username' ? '@username' : 'Story highlight name'}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                required
              />
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="text-yellow-600 mt-0.5" size={16} />
                <div className="text-sm text-yellow-800">
                  <strong>Note:</strong> Private accounts require authentication. Public content only for guest downloads.
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-4 rounded-lg hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
            >
              {loading ? (
                <>
                  <Loader className="animate-spin" size={20} />
                  Processing...
                </>
              ) : (
                <>
                  <Download size={20} />
                  Start Download
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    );
  };

  const ComingSoonTool = ({ toolName }) => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{toolName} Downloader</h2>
        <div className="text-gray-500 text-lg mb-4">Coming Soon!</div>
        <p className="text-gray-600">
          We're working hard to bring you {toolName} download capabilities. 
          Stay tuned for updates!
        </p>
      </div>
    </div>
  );

  const StatusPanel = () => {
    if (!status && !downloadData) return null;

    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Download Status</h3>
        
        {status && (
          <div className={`flex items-center gap-3 p-4 rounded-lg mb-4 ${
            status.includes('Error') ? 'bg-red-50 text-red-800' : 
            status.includes('completed') ? 'bg-green-50 text-green-800' : 
            'bg-blue-50 text-blue-800'
          }`}>
            {status.includes('Error') ? <AlertCircle size={20} /> :
             status.includes('completed') ? <CheckCircle size={20} /> :
             <Loader className="animate-spin" size={20} />}
            {status}
          </div>
        )}

        {downloadData && downloadData.success && (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-800 mb-3">Downloaded Files ({downloadData.total_count})</h4>
              <div className="space-y-2">
                {downloadData.files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-white p-3 rounded border">
                    <div className="flex items-center gap-3">
                      <Video size={16} className="text-gray-500" />
                      <span className="font-medium">{file.name}</span>
                      <span className="text-sm text-gray-500">({file.size})</span>
                    </div>
                    <button className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600">
                      Download
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 flex items-center justify-center gap-2">
                <Download size={16} />
                Download All (ZIP)
              </button>
              <button className="flex-1 bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 flex items-center justify-center gap-2">
                <Download size={16} />
                Download Excel Report
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg h-screen sticky top-0">
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-xl font-bold text-gray-800">Social Downloader</h1>
            <p className="text-sm text-gray-600">Multi-platform content downloader</p>
          </div>
          
          <nav className="p-4">
            <div className="space-y-2">
              {tools.map((tool) => {
                const IconComponent = tool.icon;
                return (
                  <button
                    key={tool.id}
                    onClick={() => setActiveTab(tool.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                      activeTab === tool.id 
                        ? `${tool.color} text-white shadow-md transform scale-105` 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <IconComponent size={20} />
                    <span className="font-medium">{tool.name}</span>
                  </button>
                );
              })}
            </div>
          </nav>

          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-gray-100 rounded-lg p-3 text-center">
              <p className="text-xs text-gray-600">
                Free tier: 10 downloads/day
              </p>
              <button className="text-xs text-blue-500 hover:text-blue-600 mt-1">
                Upgrade to Pro
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {activeTab === 'tiktok' && <TikTokDownloader />}
            {activeTab === 'instagram' && <InstagramDownloader />}
            {activeTab === 'youtube' && <ComingSoonTool toolName="YouTube" />}
            {activeTab === 'twitter' && <ComingSoonTool toolName="Twitter" />}
            
            <StatusPanel />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialMediaDownloader;