import { useState } from "react";
import { Instagram, Download, Loader, Link, User, Circle, AlertCircle } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import StatusPanel from "./status-panel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function InstagramDownloader() {
  const [formData, setFormData] = useState({
    downloadType: 'url',
    value: ''
  });
  const [currentDownloadId, setCurrentDownloadId] = useState<string | null>(null);
  const { toast } = useToast();

  const downloadMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest('POST', '/api/downloads', {
        platform: 'instagram',
        downloadType: data.downloadType,
        value: data.value,
        limit: 10
      });
      return response.json();
    },
    onSuccess: (data) => {
      setCurrentDownloadId(data.downloadId);
      toast({
        title: "Download Started",
        description: "Your Instagram download has been initiated.",
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
        description: "Please enter a valid URL or username.",
        variant: "destructive",
      });
      return;
    }
    downloadMutation.mutate(formData);
  };

  const downloadTypes = [
    { value: 'url', label: 'Single URL', icon: Link, placeholder: 'https://instagram.com/p/...' },
    { value: 'username', label: 'User Profile', icon: User, placeholder: '@username' },
    { value: 'story', label: 'Story Highlights', icon: Circle, placeholder: 'Story highlight name' }
  ];

  const selectedType = downloadTypes.find(type => type.value === formData.downloadType);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3 mb-2" data-testid="instagram-title">
          <Instagram className="h-8 w-8 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent" />
          Instagram Downloader
        </h2>
        <p className="text-gray-600">Download Instagram posts, reels, stories, and user profiles</p>
      </div>

      {/* Main Form */}
      <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Download Type Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold text-gray-700">Download Type</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
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
                        ? 'border-pink-500 bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                        : 'border-gray-200 hover:border-pink-500 hover:bg-gray-50'
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
                className="pr-12 focus:ring-pink-500 focus:border-pink-500"
                data-testid="input-value"
                required
              />
              {selectedType && (
                <selectedType.icon className="absolute right-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              )}
            </div>
          </div>

          {/* Warning */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-yellow-800">
                <strong>Note:</strong> Private accounts require authentication. Public content only for guest downloads.
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={downloadMutation.isPending}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 px-6 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all flex items-center justify-center gap-3 font-semibold shadow-lg"
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
                Start Instagram Download
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
