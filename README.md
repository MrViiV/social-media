# Social Media Downloader

A comprehensive social media content downloader with modern UI, multi-platform support, and bulk download capabilities. Features a clean sidebar navigation with platform-specific tools for TikTok, Instagram, YouTube, and X (Twitter).

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node.js](https://img.shields.io/badge/node.js-20+-green.svg)
![TypeScript](https://img.shields.io/badge/typescript-5.0+-blue.svg)

## 🚀 Features

- **Multi-Platform Support**: TikTok, Instagram, YouTube, X (Twitter)
- **Bulk Downloads**: Complete user profile downloads with automatic ZIP packaging
- **Real-time Progress**: Live download status tracking with progress bars
- **Metadata Export**: Excel reports with engagement stats (views, likes, comments)
- **Modern UI**: Clean gradient design with platform-specific styling
- **Dark Mode**: Full dark/light theme support
- **Responsive**: Mobile-friendly interface

## 📋 Prerequisites

- Node.js 20+ 
- npm or yarn package manager
- Git

## 🛠️ Installation

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd social-media-downloader
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory:
```env
NODE_ENV=development
PORT=5000
DATABASE_URL=your_database_url_here
```

### 4. Start Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## 🏗️ Project Architecture

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   └── lib/           # Utilities and configurations
├── server/                # Backend Express.js application
│   ├── index.ts          # Server entry point
│   ├── routes.ts         # API route definitions
│   ├── storage.ts        # Storage interface and implementation
│   └── vite.ts           # Vite development server setup
├── shared/               # Shared types and schemas
│   └── schema.ts         # Database schema and validation
└── package.json          # Dependencies and scripts
```

## 🔧 Backend Implementation Guide

### 1. Replace Mock Storage with Real Database

#### PostgreSQL Setup
```bash
# Install PostgreSQL dependencies
npm install pg @types/pg drizzle-orm drizzle-kit

# Create database migration
npx drizzle-kit generate:pg
npx drizzle-kit push:pg
```

#### Update Storage Implementation
Replace the `MemStorage` class in `server/storage.ts`:

```typescript
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { downloads, downloadFiles } from '@shared/schema';

const sql = postgres(process.env.DATABASE_URL!);
const db = drizzle(sql);

export class PostgresStorage implements IStorage {
  async createDownload(download: InsertDownload): Promise<Download> {
    const [result] = await db.insert(downloads).values(download).returning();
    return result;
  }
  
  async getDownload(id: string): Promise<Download | undefined> {
    const [result] = await db.select().from(downloads).where(eq(downloads.id, id));
    return result;
  }
  
  // Implement other methods...
}
```

### 2. Implement Real Download Logic

#### Install Required Packages
```bash
npm install yt-dlp python-shell archiver xlsx
npm install @types/archiver
```

#### Create Download Service
Create `server/services/downloadService.ts`:

```typescript
import { PythonShell } from 'python-shell';
import archiver from 'archiver';
import XLSX from 'xlsx';

export class DownloadService {
  async downloadTikTokVideos(username: string, limit?: number): Promise<VideoFile[]> {
    const options = {
      mode: 'text' as const,
      pythonOptions: ['-u'],
      scriptPath: './scripts/',
      args: [username, limit?.toString() || '1000']
    };

    return new Promise((resolve, reject) => {
      PythonShell.run('tiktok_downloader.py', options, (err, results) => {
        if (err) reject(err);
        resolve(JSON.parse(results?.[0] || '[]'));
      });
    });
  }

  async createZipArchive(files: VideoFile[], outputPath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const output = fs.createWriteStream(outputPath);
      const archive = archiver('zip', { zlib: { level: 9 } });

      output.on('close', () => resolve(outputPath));
      archive.on('error', reject);

      archive.pipe(output);
      files.forEach(file => archive.file(file.path, { name: file.filename }));
      archive.finalize();
    });
  }

  async generateExcelReport(files: VideoFile[], outputPath: string): Promise<string> {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(files.map(file => ({
      filename: file.filename,
      views: file.views,
      likes: file.likes,
      comments: file.comments,
      duration: file.duration,
      uploadDate: file.uploadDate
    })));

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Downloads');
    XLSX.writeFile(workbook, outputPath);
    return outputPath;
  }
}
```

#### Create Python Download Scripts
Create `scripts/tiktok_downloader.py`:

```python
import yt_dlp
import json
import sys
import os

def download_tiktok_user(username, limit=1000):
    """Download TikTok videos from a user profile"""
    
    ydl_opts = {
        'format': 'best',
        'outtmpl': f'downloads/%(uploader)s/%(title)s.%(ext)s',
        'writeinfojson': True,
        'extract_flat': False,
        'playlistend': int(limit) if limit != '1000' else None
    }
    
    url = f'https://www.tiktok.com/@{username}'
    
    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=True)
            
            videos = []
            if 'entries' in info:
                for entry in info['entries']:
                    videos.append({
                        'filename': f"{entry.get('title', 'video')}.mp4",
                        'views': entry.get('view_count', 0),
                        'likes': entry.get('like_count', 0),
                        'comments': entry.get('comment_count', 0),
                        'duration': entry.get('duration', 0),
                        'uploadDate': entry.get('upload_date', ''),
                        'url': entry.get('webpage_url', '')
                    })
            
            print(json.dumps(videos))
            
    except Exception as e:
        print(json.dumps({'error': str(e)}))

if __name__ == '__main__':
    username = sys.argv[1] if len(sys.argv) > 1 else ''
    limit = sys.argv[2] if len(sys.argv) > 2 else '1000'
    download_tiktok_user(username, limit)
```

### 3. Update API Routes

Replace mock processing in `server/routes.ts`:

```typescript
import { DownloadService } from './services/downloadService';

const downloadService = new DownloadService();

async function processDownload(downloadId: string) {
  try {
    await storage.updateDownloadStatus(downloadId, 'processing', 0);
    
    const download = await storage.getDownload(downloadId);
    if (!download) return;

    let files: VideoFile[] = [];

    switch (download.platform) {
      case 'tiktok':
        files = await downloadService.downloadTikTokVideos(
          download.value, 
          download.downloadType === 'bulk' ? undefined : download.limit
        );
        break;
      
      case 'instagram':
        files = await downloadService.downloadInstagramContent(download.value);
        break;
    }

    // Save files to database
    for (const file of files) {
      await storage.createDownloadFile({
        downloadId,
        filename: file.filename,
        url: file.url,
        size: file.size,
        views: file.views,
        likes: file.likes,
        comments: file.comments,
        metadata: JSON.stringify(file.metadata)
      });
    }

    // Generate ZIP and Excel
    const zipPath = await downloadService.createZipArchive(files, `downloads/${downloadId}.zip`);
    const excelPath = await downloadService.generateExcelReport(files, `downloads/${downloadId}.xlsx`);

    await storage.updateDownloadUrls(downloadId, zipPath, excelPath);
    await storage.updateDownloadStatus(downloadId, 'completed', 100);

  } catch (error) {
    console.error('Download failed:', error);
    await storage.updateDownloadStatus(downloadId, 'failed');
  }
}
```

## 🚀 Deployment

### Option 1: Replit Deployment (Recommended)

#### Step 1: Configure Environment Variables
1. Go to your Replit workspace
2. Open the "Secrets" tab (lock icon in left sidebar)
3. Add the following secrets:
   ```
   NODE_ENV=production
   DATABASE_URL=your_database_connection_string
   ```

#### Step 2: Configure Run Command
Ensure your `package.json` has the correct start script:
```json
{
  "scripts": {
    "dev": "NODE_ENV=development tsx server/index.ts",
    "start": "NODE_ENV=production tsx server/index.ts"
  }
}
```

#### Step 3: Deploy with Autoscale
1. Click the **"Deploy"** button in your Replit workspace
2. Select **"Autoscale Deployment"** (recommended for web apps)
3. Configure deployment settings:
   - **Machine Power**: Select based on expected traffic
   - **Run Command**: `npm start` (uses the start script)
   - **Build Command**: `npm install` (if needed)
4. Click **"Deploy"** to launch

#### Step 4: Access Your Application
- Your app will be available at: `https://your-deployment-name.replit.app`
- Autoscale automatically handles traffic scaling and cost optimization

#### Important Replit Deployment Notes:
- **Single Port**: Only one external port is supported (the app uses port 5000)
- **No Localhost**: Use `0.0.0.0` instead of `localhost` for server binding
- **No Persistent Storage**: Use Replit Database or external storage for data
- **Cycles Required**: Ensure you have sufficient Cycles for deployment costs

### Option 2: Docker Deployment

Create `Dockerfile`:
```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 5000

CMD ["npm", "start"]
```

Create `docker-compose.yml`:
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
    volumes:
      - ./downloads:/app/downloads

  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: social_downloader
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

Deploy:
```bash
docker-compose up -d
```

### Option 3: Cloud Deployment (Railway/Vercel/Heroku)

1. **Railway**
   ```bash
   npm install -g @railway/cli
   railway login
   railway init
   railway up
   ```

2. **Environment Variables**
   Set in Railway dashboard:
   - `NODE_ENV=production`
   - `DATABASE_URL=postgresql://...`

## 📦 Build Scripts

Add to `package.json`:
```json
{
  "scripts": {
    "dev": "NODE_ENV=development tsx server/index.ts",
    "build": "tsc && vite build",
    "start": "NODE_ENV=production node dist/server/index.js",
    "preview": "vite preview",
    "db:generate": "drizzle-kit generate:pg",
    "db:migrate": "drizzle-kit push:pg"
  }
}
```

## 🔒 Security Considerations

1. **Rate Limiting**
   ```bash
   npm install express-rate-limit
   ```

2. **Input Validation**
   - Always validate user inputs
   - Sanitize usernames and URLs
   - Implement request size limits

3. **File Storage**
   - Use secure file paths
   - Implement file cleanup
   - Set storage quotas

4. **API Keys**
   - Store in environment variables
   - Rotate regularly
   - Use least privilege access

## 📝 API Documentation

### Endpoints

#### POST `/api/downloads`
Start a new download
```json
{
  "platform": "tiktok",
  "downloadType": "bulk",
  "value": "@username",
  "limit": 50
}
```

#### GET `/api/downloads/:id`
Get download status and files
```json
{
  "success": true,
  "download": {
    "id": "uuid",
    "status": "completed",
    "progress": 100
  },
  "files": [...]
}
```

## 🐛 Troubleshooting

### Common Issues

1. **yt-dlp not found**
   ```bash
   pip install yt-dlp
   ```

2. **Permission errors**
   ```bash
   chmod +x scripts/*.py
   ```

3. **Database connection issues**
   - Check DATABASE_URL format
   - Verify network connectivity
   - Check firewall settings

## 📄 License

MIT License - see LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📞 Support

For issues and questions:
- Create an issue on GitHub
- Check the troubleshooting section
- Review the API documentation