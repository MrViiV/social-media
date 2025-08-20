import { useState } from "react";
import Sidebar from "@/components/sidebar";
import TikTokDownloader from "@/components/tiktok-downloader";
import InstagramDownloader from "@/components/instagram-downloader";
import ComingSoonTool from "@/components/coming-soon-tool";
import { Music, X } from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState('tiktok');

  return (
    <div className="min-h-screen flex gradient-bg">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="flex-1 p-8">
        <div className="max-w-5xl mx-auto">
          {activeTab === 'tiktok' && <TikTokDownloader />}
          {activeTab === 'instagram' && <InstagramDownloader />}
          {activeTab === 'youtube' && <ComingSoonTool toolName="YouTube" icon={Music} color="bg-red-500" expectedDate="Q2 2024" />}
          {activeTab === 'twitter' && <ComingSoonTool toolName="X (Twitter)" icon={X} color="bg-blue-500" expectedDate="Q1 2024" />}
        </div>
      </div>
    </div>
  );
}
