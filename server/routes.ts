import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertDownloadSchema, insertDownloadFileSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Create a new download request
  app.post("/api/downloads", async (req, res) => {
    try {
      const downloadData = insertDownloadSchema.parse(req.body);
      const download = await storage.createDownload(downloadData);
      
      // Start processing in background (simulate async processing)
      processDownload(download.id);
      
      res.json({ success: true, downloadId: download.id });
    } catch (error) {
      res.status(400).json({ success: false, error: "Invalid download request" });
    }
  });

  // Get download status
  app.get("/api/downloads/:id", async (req, res) => {
    try {
      const download = await storage.getDownload(req.params.id);
      if (!download) {
        return res.status(404).json({ success: false, error: "Download not found" });
      }

      const files = await storage.getDownloadFiles(download.id);
      res.json({
        success: true,
        download,
        files,
      });
    } catch (error) {
      res.status(500).json({ success: false, error: "Server error" });
    }
  });

  // Get all downloads
  app.get("/api/downloads", async (req, res) => {
    try {
      const downloads = await storage.getAllDownloads();
      res.json({ success: true, downloads });
    } catch (error) {
      res.status(500).json({ success: false, error: "Server error" });
    }
  });

  // Simulate download processing
  async function processDownload(downloadId: string) {
    try {
      await storage.updateDownloadStatus(downloadId, 'processing', 0);
      
      // Simulate processing time and file creation
      const download = await storage.getDownload(downloadId);
      if (!download) return;

      const mockFiles = generateMockFiles(download);
      let completedFiles = 0;

      for (const fileData of mockFiles) {
        // Simulate processing delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        await storage.createDownloadFile({
          downloadId,
          ...fileData,
        });
        
        completedFiles++;
        await storage.updateDownloadProgress(downloadId, completedFiles, mockFiles.length);
      }

      // Generate ZIP and Excel URLs (mock)
      await storage.updateDownloadUrls(
        downloadId,
        `/api/downloads/${downloadId}/zip`,
        `/api/downloads/${downloadId}/excel`
      );

      await storage.updateDownloadStatus(downloadId, 'completed', 100);
    } catch (error) {
      await storage.updateDownloadStatus(downloadId, 'failed');
    }
  }

  function generateMockFiles(download: any) {
    const count = Math.min(download.limit || 10, 50);
    const files = [];
    
    for (let i = 1; i <= count; i++) {
      const fileTypes = ['dance', 'comedy', 'tutorial', 'music', 'trending'];
      const type = fileTypes[Math.floor(Math.random() * fileTypes.length)];
      
      files.push({
        filename: `${type}_video_${String(i).padStart(3, '0')}.mp4`,
        url: `/downloads/${download.id}/${type}_video_${String(i).padStart(3, '0')}.mp4`,
        size: `${(Math.random() * 3 + 1).toFixed(1)} MB`,
        views: Math.floor(Math.random() * 2000000) + 100000,
        likes: Math.floor(Math.random() * 100000) + 1000,
        comments: Math.floor(Math.random() * 10000) + 100,
        metadata: JSON.stringify({
          duration: `${Math.floor(Math.random() * 60) + 15}s`,
          quality: '720p',
          uploadDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        }),
      });
    }
    
    return files;
  }

  const httpServer = createServer(app);
  return httpServer;
}
