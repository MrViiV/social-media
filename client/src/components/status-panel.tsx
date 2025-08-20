import { useQuery } from "@tanstack/react-query";
import { CheckCircle, Loader, AlertCircle, Video, Download, Archive, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface StatusPanelProps {
  downloadId: string;
}

export default function StatusPanel({ downloadId }: StatusPanelProps) {
  const { data: downloadData, isLoading } = useQuery({
    queryKey: ['/api/downloads', downloadId],
    refetchInterval: 2000, // Poll every 2 seconds while processing
    enabled: !!downloadId,
  });

  if (isLoading || !downloadData) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center justify-center py-8">
          <Loader className="animate-spin h-8 w-8 text-blue-600" />
          <span className="ml-3 text-gray-600">Loading download status...</span>
        </div>
      </div>
    );
  }

  const { download, files } = downloadData;
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-800 bg-green-50 border-green-200';
      case 'processing': return 'text-blue-800 bg-blue-50 border-blue-200';
      case 'failed': return 'text-red-800 bg-red-50 border-red-200';
      default: return 'text-gray-800 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-5 w-5" />;
      case 'processing': return <Loader className="h-5 w-5 animate-spin" />;
      case 'failed': return <AlertCircle className="h-5 w-5" />;
      default: return <Loader className="h-5 w-5" />;
    }
  };

  const formatFileSize = (files: any[]) => {
    const totalMB = files.reduce((sum, file) => {
      const size = parseFloat(file.size?.replace(' MB', '') || '0');
      return sum + size;
    }, 0);
    return totalMB.toFixed(1);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2" data-testid="status-title">
        <CheckCircle className="h-5 w-5 text-blue-600" />
        Download Status & Results
      </h3>
      
      {/* Progress Indicator */}
      {download.status === 'processing' && (
        <div className="mb-6">
          <div className={`flex items-center gap-3 p-4 rounded-lg border ${getStatusColor(download.status)}`}>
            <div className="flex-shrink-0">
              {getStatusIcon(download.status)}
            </div>
            <div className="flex-1">
              <div className="font-medium">
                Processing {download.downloadType} download for "{download.value}"
              </div>
              <div className="text-sm mt-1">
                Downloaded {download.completedFiles} of {download.totalFiles} videos
                {download.totalFiles > 0 && ` • ${Math.round((download.completedFiles / download.totalFiles) * 100)}% complete`}
              </div>
              {download.totalFiles > 0 && (
                <Progress 
                  value={(download.completedFiles / download.totalFiles) * 100} 
                  className="mt-2"
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Completed Status */}
      {download.status === 'completed' && (
        <div className="mb-6">
          <div className={`flex items-center gap-3 p-4 rounded-lg border ${getStatusColor(download.status)}`}>
            {getStatusIcon(download.status)}
            <div>
              <div className="font-medium">Download completed successfully!</div>
              <div className="text-sm mt-1">
                {files.length} files downloaded • Total size: {formatFileSize(files)} MB
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Download Results */}
      {files.length > 0 && (
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Downloaded Files ({files.length})
            </h4>
            
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {files.map((file: any, index: number) => (
                <div key={index} className="flex items-center justify-between bg-white p-3 rounded border hover:shadow-sm transition-all" data-testid={`file-${index}`}>
                  <div className="flex items-center gap-3">
                    <Video className="h-4 w-4 text-gray-500" />
                    <div>
                      <div className="font-medium text-sm">{file.filename}</div>
                      <div className="text-xs text-gray-500">
                        {file.size} 
                        {file.views && ` • ${(file.views / 1000000).toFixed(1)}M views`}
                        {file.likes && ` • ${(file.likes / 1000).toFixed(0)}K likes`}
                      </div>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" data-testid={`download-${index}`}>
                    <Download className="h-3 w-3 mr-1" />
                    Download
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Bulk Download Actions */}
          {download.status === 'completed' && (
            <div className="grid md:grid-cols-2 gap-3">
              <Button 
                className="bg-green-500 hover:bg-green-600 text-white flex items-center justify-center gap-2 font-medium"
                data-testid="download-zip"
              >
                <Archive className="h-4 w-4" />
                Download All (ZIP - {formatFileSize(files)} MB)
              </Button>
              <Button 
                className="bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center gap-2 font-medium"
                data-testid="download-excel"
              >
                <FileText className="h-4 w-4" />
                Download Excel Report
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
