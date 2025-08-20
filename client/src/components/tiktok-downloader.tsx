import { useState } from "react";
import { Video, Download, Loader, FileText, Archive, BarChart3, Clock, User, Search, Hash, PackageOpen } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import StatusPanel from "./status-panel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export default function TikTokDownloader() {
  const [formData, setFormData] = useState({
    downloadType: 'username',
    value: '',
    limit: 10
  });
  const [currentDownloadId, setCurrentDownloadId] = useState<string | null>(null);
  const { toast } = useToast();

  const downloadMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest('POST', '/api/downloads', {
        platform: 'tiktok',
        downloadType: data.downloadType,
        value: data.value,
        limit: data.limit
      });
      return response.json();
    },
    onSuccess: (data) => {
      setCurrentDownloadId(data.downloadId);
      toast({
        title: "Download Started",
        description: "Your TikTok download has been initiated.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/downloads'] });
    },
    onError: () => {
      toast({
        title: "Download Failed",
        description: "There was an error starting your download.",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.value.trim()) {
      toast({
        title: "Invalid Input",
        description: "Please enter a valid username, keyword, or hashtag.",
        variant: "destructive",
      });
      return;
    }
    downloadMutation.mutate(formData);
  };

  const downloadTypes = [
    { value: 'username', label: 'Username', icon: User, placeholder: '@username' },
    { value: 'keyword', label: 'Keyword', icon: Search, placeholder: 'Enter keyword' },
    { value: 'hashtag', label: 'Hashtag', icon: Hash, placeholder: '#hashtag' },
    { value: 'bulk', label: 'Bulk Profile', icon: PackageOpen, placeholder: '@username' }
  ];

  const selectedType = downloadTypes.find(type => type.value === formData.downloadType);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3 mb-2" data-testid="tiktok-title">
          <Video className="h-8 w-8" />
          TikTok Downloader
        </h2>
        <p className="text-gray-600">Download TikTok videos by username, keyword, hashtag, or bulk profile download</p>
      </div>

      {/* Main Form */}
      <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Download Type Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold text-gray-700">Download Type</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {downloadTypes.map((type) => {
                const IconComponent = type.icon;
                const isSelected = formData.downloadType === type.value;
                
                return (
                  <button
                    key={type.value}
                    type="button"
                    data-testid={`type-${type.value}`}
                    onClick={() => setFormData(prev => ({ ...prev, downloadType: type.value }))}
                    className={`p-4 border-2 rounded-lg text-center transition-all cursor-pointer ${
                      isSelected 
                        ? 'border-black bg-black text-white' 
                        : 'border-gray-200 hover:border-black hover:bg-gray-50'
                    }`}
                  >
                    <IconComponent className={`mx-auto mb-2 h-5 w-5 ${isSelected ? 'text-white' : 'text-gray-600'}`} />
                    <div className={`text-sm font-medium ${isSelected ? 'text-white' : 'text-gray-700'}`}>
                      {type.label}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Input Value */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700">
                {selectedType?.label}
              </Label>
              <div className="relative">
                <Input
                  type="text"
                  value={formData.value}
                  onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
                  placeholder={selectedType?.placeholder}
                  className="pr-12"
                  data-testid="input-value"
                  required
                />
                {selectedType && (
                  <selectedType.icon className="absolute right-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                )}
              </div>
            </div>

            {/* Download Limit */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700">Download Limit</Label>
              <Select 
                value={formData.limit.toString()} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, limit: parseInt(value) }))}
              >
                <SelectTrigger data-testid="select-limit">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 videos</SelectItem>
                  <SelectItem value="10">10 videos</SelectItem>
                  <SelectItem value="20">20 videos</SelectItem>
                  <SelectItem value="50">50 videos</SelectItem>
                  <SelectItem value="100">100 videos (Bulk)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Bulk Features Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold text-blue-800">Bulk Download Features</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-700">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-green-600" />
                <span>Excel metadata export with engagement stats</span>
              </div>
              <div className="flex items-center gap-2">
                <Archive className="h-4 w-4 text-orange-600" />
                <span>Automatic ZIP file generation</span>
              </div>
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-purple-600" />
                <span>Video analytics and performance data</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-600" />
                <span>Timestamp and date information</span>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={downloadMutation.isPending}
            className="w-full bg-black text-white py-4 px-6 rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 transition-all duration-200 transform hover:scale-[1.02] shadow-lg"
            data-testid="button-submit"
          >
            {downloadMutation.isPending ? (
              <>
                <Loader className="animate-spin h-5 w-5" />
                Processing...
              </>
            ) : (
              <>
                <Download className="h-5 w-5" />
                <span className="font-semibold">Start Enhanced Download</span>
                <span className="bg-white bg-opacity-20 text-xs px-2 py-1 rounded-full">Pro</span>
              </>
            )}
          </Button>
        </form>
      </div>

      {/* Status Panel */}
      {currentDownloadId && <StatusPanel downloadId={currentDownloadId} />}
    </div>
  );
}
