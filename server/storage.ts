import { type Download, type InsertDownload, type DownloadFile, type InsertDownloadFile } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Download operations
  createDownload(download: InsertDownload): Promise<Download>;
  getDownload(id: string): Promise<Download | undefined>;
  updateDownloadStatus(id: string, status: string, progress?: number): Promise<void>;
  updateDownloadUrls(id: string, zipUrl?: string, excelUrl?: string): Promise<void>;
  getAllDownloads(): Promise<Download[]>;
  
  // Download file operations
  createDownloadFile(file: InsertDownloadFile): Promise<DownloadFile>;
  getDownloadFiles(downloadId: string): Promise<DownloadFile[]>;
  updateDownloadProgress(downloadId: string, completedFiles: number, totalFiles: number): Promise<void>;
}

export class MemStorage implements IStorage {
  private downloads: Map<string, Download>;
  private downloadFiles: Map<string, DownloadFile>;

  constructor() {
    this.downloads = new Map();
    this.downloadFiles = new Map();
  }

  async createDownload(insertDownload: InsertDownload): Promise<Download> {
    const id = randomUUID();
    const download: Download = {
      ...insertDownload,
      id,
      status: 'pending',
      progress: 0,
      totalFiles: 0,
      completedFiles: 0,
      zipUrl: null,
      excelUrl: null,
      createdAt: new Date(),
    };
    this.downloads.set(id, download);
    return download;
  }

  async getDownload(id: string): Promise<Download | undefined> {
    return this.downloads.get(id);
  }

  async updateDownloadStatus(id: string, status: string, progress?: number): Promise<void> {
    const download = this.downloads.get(id);
    if (download) {
      download.status = status;
      if (progress !== undefined) {
        download.progress = progress;
      }
      this.downloads.set(id, download);
    }
  }

  async updateDownloadUrls(id: string, zipUrl?: string, excelUrl?: string): Promise<void> {
    const download = this.downloads.get(id);
    if (download) {
      if (zipUrl) download.zipUrl = zipUrl;
      if (excelUrl) download.excelUrl = excelUrl;
      this.downloads.set(id, download);
    }
  }

  async getAllDownloads(): Promise<Download[]> {
    return Array.from(this.downloads.values()).sort((a, b) => 
      new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
  }

  async createDownloadFile(insertFile: InsertDownloadFile): Promise<DownloadFile> {
    const id = randomUUID();
    const file: DownloadFile = {
      ...insertFile,
      id,
    };
    this.downloadFiles.set(id, file);
    return file;
  }

  async getDownloadFiles(downloadId: string): Promise<DownloadFile[]> {
    return Array.from(this.downloadFiles.values()).filter(
      file => file.downloadId === downloadId
    );
  }

  async updateDownloadProgress(downloadId: string, completedFiles: number, totalFiles: number): Promise<void> {
    const download = this.downloads.get(downloadId);
    if (download) {
      download.completedFiles = completedFiles;
      download.totalFiles = totalFiles;
      download.progress = totalFiles > 0 ? Math.round((completedFiles / totalFiles) * 100) : 0;
      this.downloads.set(downloadId, download);
    }
  }
}

export const storage = new MemStorage();
