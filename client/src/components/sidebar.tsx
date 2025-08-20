import { Video, Instagram, Music, X, Download, TrendingUp } from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const tools = [
  { 
    id: 'tiktok', 
    name: 'TikTok', 
    icon: Video, 
    color: 'btn-tiktok'
  },
  { 
    id: 'instagram', 
    name: 'Instagram', 
    icon: Instagram, 
    color: 'btn-instagram'
  },
  { 
    id: 'youtube', 
    name: 'YouTube', 
    icon: Music, 
    color: 'btn-youtube',
    badge: 'Soon'
  },
  { 
    id: 'twitter', 
    name: 'X (Twitter)', 
    icon: X, 
    color: 'btn-twitter',
    badge: 'Soon'
  }
];

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  return (
    <div className="w-64 bg-white shadow-xl h-screen sticky top-0 border-r border-gray-100">
      {/* Header */}
      <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-600 to-purple-600">
        <h1 className="text-xl font-bold text-white flex items-center gap-2" data-testid="app-title">
          <Download className="h-6 w-6" />
          Social Downloader
        </h1>
        <p className="text-sm text-blue-100 mt-1">Multi-platform content tool</p>
      </div>
      
      {/* Navigation */}
      <nav className="p-4">
        <div className="space-y-2">
          {tools.map((tool) => {
            const IconComponent = tool.icon;
            const isActive = activeTab === tool.id;
            
            return (
              <button
                key={tool.id}
                onClick={() => setActiveTab(tool.id)}
                data-testid={`nav-${tool.id}`}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 font-medium ${
                  isActive 
                    ? `${tool.color} text-white shadow-md transform scale-105` 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                }`}
              >
                <IconComponent size={20} />
                <span className="flex-1 text-left">{tool.name}</span>
                {tool.badge && (
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    isActive 
                      ? 'bg-white bg-opacity-20' 
                      : tool.badge === 'Soon' 
                        ? 'text-gray-400' 
                        : 'bg-green-100 text-green-700'
                  }`}>
                    {tool.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
        
        {/* Stats */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
            <TrendingUp size={16} />
            Today's Downloads
          </h3>
          <div className="space-y-1 text-sm text-gray-600">
            <div className="flex justify-between" data-testid="stats-tiktok">
              <span>TikTok</span>
              <span>247</span>
            </div>
            <div className="flex justify-between" data-testid="stats-instagram">
              <span>Instagram</span>
              <span>156</span>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
