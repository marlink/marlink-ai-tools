# AI Tools Directory

A comprehensive web application for discovering and exploring AI tools. Built with modern web technologies, this directory allows users to browse, filter, and submit AI tools while providing an admin interface for content management.

## Features

- **Tool Discovery**: Browse a curated collection of AI tools across various categories
- **Advanced Filtering**: Filter tools by category, pricing, and other attributes
- **Search Functionality**: Quickly find tools using keyword search
- **Admin Panel**: Manage tools, submissions, and site content
- **Submission Form**: Allow users to submit new AI tools for review
- **Responsive Design**: Optimized for desktop and mobile devices
- **Dark Mode Support**: Toggle between light and dark themes
- **Real-time Updates**: Dynamic content loading and updates

## Tech Stack

- **Frontend**: React 19, TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **AI Integration**: Google Generative AI
- **Deployment**: GitHub Pages compatible

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd ai-tools-directory
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

- `src/App.tsx` - Main application component
- `src/components/` - React components (Header, ToolCard, AdminPanel, etc.)
- `src/types.ts` - TypeScript type definitions
- `public/` - Static assets
- `metadata.json` - Tool metadata and configuration

## Deployment

The application is configured for deployment to GitHub Pages. After building for production, the `dist` folder contains all necessary files for deployment.

## Contributing

Contributions are welcome! Please submit tool suggestions through the in-app submission form or create an issue for feature requests.