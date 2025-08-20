import { LucideIcon, Clock } from "lucide-react";

interface ComingSoonToolProps {
  toolName: string;
  icon: LucideIcon;
  color: string;
  expectedDate: string;
}

export default function ComingSoonTool({ toolName, icon: IconComponent, color, expectedDate }: ComingSoonToolProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-12 text-center border border-gray-100">
        <div className="mb-6">
          <IconComponent className={`mx-auto h-16 w-16 mb-4 ${color === 'bg-red-500' ? 'text-red-500' : 'text-blue-500'}`} />
          <h2 className="text-3xl font-bold text-gray-800 mb-2" data-testid="tool-title">
            {toolName} Downloader
          </h2>
          <div className="text-xl text-gray-500 mb-4">Coming Soon!</div>
        </div>
        <p className="text-gray-600 text-lg mb-6">
          We're working hard to bring you {toolName} download capabilities with enhanced features, 
          quality selection, and comprehensive metadata extraction.
        </p>
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
          color === 'bg-red-500' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
        }`}>
          <Clock className="h-4 w-4" />
          <span className="font-medium" data-testid="expected-date">Expected: {expectedDate}</span>
        </div>
      </div>
    </div>
  );
}
