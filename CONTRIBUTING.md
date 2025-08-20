# Contributing to Social Media Downloader

## Getting Started

1. **Fork the repository**
2. **Clone your fork**
   ```bash
   git clone https://github.com/your-username/social-media-downloader.git
   cd social-media-downloader
   ```

3. **Run setup script**
   ```bash
   chmod +x scripts/setup.sh
   ./scripts/setup.sh
   ```

4. **Start development**
   ```bash
   npm run dev
   ```

## Project Structure

```
├── client/                 # React frontend
│   ├── src/components/     # UI components
│   ├── src/pages/         # Page components
│   └── src/lib/           # Utilities
├── server/                # Express backend
│   ├── routes.ts          # API endpoints
│   ├── storage.ts         # Data layer
│   └── services/          # Business logic
├── shared/                # Shared types
└── scripts/               # Setup and deployment scripts
```

## Development Guidelines

### Frontend
- Use TypeScript for all components
- Follow React hooks patterns
- Use shadcn/ui components
- Implement proper error boundaries
- Add data-testid attributes for testing

### Backend
- Use Express.js with TypeScript
- Implement proper error handling
- Validate all inputs with Zod
- Follow RESTful API conventions
- Add comprehensive logging

### Code Style
- Use Prettier for formatting
- Follow ESLint rules
- Use semantic commit messages
- Add JSDoc comments for functions
- Keep functions small and focused

## Adding New Platforms

### 1. Update Schema
Add platform to `shared/schema.ts`:
```typescript
export const platforms = ['tiktok', 'instagram', 'youtube', 'twitter', 'newplatform'] as const;
```

### 2. Create UI Component
Create `client/src/components/newplatform-downloader.tsx`:
```typescript
export default function NewPlatformDownloader() {
  // Follow existing patterns from tiktok-downloader.tsx
}
```

### 3. Add to Sidebar
Update `client/src/components/sidebar.tsx`:
```typescript
const tools = [
  // existing tools...
  { 
    id: 'newplatform', 
    name: 'New Platform', 
    icon: YourIcon, 
    color: 'btn-newplatform' 
  }
];
```

### 4. Implement Backend Service
Create `server/services/newplatformService.ts`:
```typescript
export class NewPlatformService {
  async downloadContent(url: string): Promise<VideoFile[]> {
    // Implementation
  }
}
```

### 5. Add CSS Colors
Update `client/src/index.css`:
```css
:root {
  --newplatform: hsl(your, color, here);
  --newplatform-hover: hsl(darker, version, here);
}

.btn-newplatform {
  background: var(--newplatform);
  color: white;
}
```

## Testing

### Running Tests
```bash
npm test
```

### Adding Tests
- Create test files alongside components
- Use Jest and React Testing Library
- Test user interactions and API calls
- Mock external services

### Test Example
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import TikTokDownloader from './tiktok-downloader';

test('submits form with username', () => {
  render(<TikTokDownloader />);
  
  fireEvent.change(screen.getByTestId('input-value'), {
    target: { value: '@testuser' }
  });
  
  fireEvent.click(screen.getByTestId('button-submit'));
  
  expect(screen.getByText('Processing...')).toBeInTheDocument();
});
```

## Backend Implementation

### Real Download Services
When implementing actual download functionality:

1. **Install yt-dlp**
   ```bash
   pip install yt-dlp
   ```

2. **Create service wrapper**
   ```typescript
   import { exec } from 'child_process';
   
   export class DownloadService {
     async downloadVideo(url: string): Promise<string> {
       return new Promise((resolve, reject) => {
         exec(`yt-dlp ${url}`, (error, stdout) => {
           if (error) reject(error);
           else resolve(stdout);
         });
       });
     }
   }
   ```

3. **Handle errors gracefully**
   - Network timeouts
   - Invalid URLs
   - Private content
   - Rate limiting

### Database Integration
Replace MemStorage with PostgreSQL:

1. **Set up Drizzle ORM**
   ```bash
   npm install drizzle-orm @neondatabase/serverless
   ```

2. **Create migrations**
   ```bash
   npx drizzle-kit generate:pg
   ```

3. **Update storage implementation**
   ```typescript
   import { drizzle } from 'drizzle-orm/neon-http';
   
   export class PostgresStorage implements IStorage {
     // Implement all IStorage methods
   }
   ```

## Deployment

### Replit Deployment
1. Configure environment variables in Secrets
2. Use Autoscale deployment for production
3. Monitor resource usage

### Docker Deployment
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## Pull Request Process

1. **Create feature branch**
   ```bash
   git checkout -b feature/new-platform-support
   ```

2. **Make changes**
   - Follow coding standards
   - Add tests
   - Update documentation

3. **Test thoroughly**
   ```bash
   npm test
   npm run lint
   ```

4. **Submit PR**
   - Clear description
   - Link related issues
   - Include screenshots if UI changes

## Issue Guidelines

### Bug Reports
- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Environment details
- Screenshots if applicable

### Feature Requests
- Use case description
- Proposed solution
- Alternative solutions considered
- Additional context

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Help others learn and grow
- Focus on the code, not the person
- Follow project guidelines