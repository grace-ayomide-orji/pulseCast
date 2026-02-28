# PulseCast 🌤️📰

A modern, responsive web application that brings you real-time weather updates and the latest news headlines from around the world, all in one place.

![Next.js](https://img.shields.io/badge/Next.js-15.5.12-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![React](https://img.shields.io/badge/React-19.1.0-61DAFB?style=flat-square&logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.17-38B2AC?style=flat-square&logo=tailwind-css)

## ✨ Features

- 📰 **Real-time News**: Fetches latest headlines from multiple trusted sources
- 🌤️ **Weather Updates**: Get current weather and forecasts with automatic geolocation
- 🔍 **Smart Search**: Search news articles with intelligent suggestions
- 📄 **Pagination**: Browse through news with smooth server-side pagination
- 📱 **Fully Responsive**: Optimized for desktop, tablet, and mobile devices
- ⚡ **Server-Side Rendering**: Fast page loads with Next.js App Router
- 🎨 **Modern UI**: Clean, intuitive interface built with Tailwind CSS
- 🌐 **SEO Optimized**: Proper meta tags and Open Graph support

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [React Icons](https://react-icons.github.io/react-icons/)
- **APIs**: 
  - [NewsAPI](https://newsapi.org/) - News articles
  - [OpenWeatherMap API](https://openweathermap.org/api) - Weather data

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/), [yarn](https://yarnpkg.com/), [pnpm](https://pnpm.io/), or [bun](https://bun.sh/)
- API Keys:
  - [NewsAPI Key](https://newsapi.org/register) (Free tier available)
  - [OpenWeatherMap API Key](https://home.openweathermap.org/api_keys) (Free tier available)

## 🚀 Installation & Setup

1. **Clone the repository**
   
   git clone https://github.com/yourusername/pulseCast.git
   cd pulseCast
   2. **Install dependencies**
   npm install
   # or
   yarn install
   # or
   pnpm install
   3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   NEWSAPI_KEY=your_newsapi_key_here
   OPENWEATHER_API_KEY=your_openweather_key_here
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
      > **Note**: See `.env.example` for reference

4. **Run the development server**
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Project Structure
