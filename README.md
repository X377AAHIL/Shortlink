# LinkShor 🔗

A high-performance, serverless URL shortener built for speed and scale.

![LinkShor Dashboard Interface](https://i.imgur.com/example-screenshot.png) <!-- Update this with a real screenshot! -->

## ⚡ Features
- **Lightning Fast Redirects**: Powered by Upstash Redis acting as an ultra-fast read-through cache at the edge.
- **Serverless PostgreSQL**: Persistent source of truth using a Neon database to ensure ACID compliance and scale-to-zero efficiency.
- **Real-time Analytics**: Built with Tinybird to ingest millions of click events in the background asynchronously without slowing down user redirects.
- **Modern UI**: Sleek glassmorphism design with a dynamic slide-out link history dashboard built on Next.js 15 (App Router) & Tailwind CSS.
- **Local Storage Dashboard**: Your generated links are saved instantly in your browser to give you a personalized historical dashboard out-of-the-box.

## 🛠 Tech Stack
- **Framework**: Next.js (App Router, React Server Actions)
- **Language**: TypeScript
- **Database**: Neon (Serverless PostgreSQL)
- **Cache**: Upstash Redis
- **Analytics**: Tinybird
- **Styling**: Tailwind CSS & Lucide Icons

## 🚀 Getting Started

1. Clone the repository:
   ```bash
   git clone git@github.com:X377AAHIL/Shortlink.git
   cd Shortlink
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up your environment variables. Copy `.env.example` to `.env.local` and add your real keys for Neon, Upstash, and Tinybird:
   ```bash
   cp .env.example .env.local
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## 🧠 Architecture Overview

1. **Link Creation (`app/actions/createLink.ts`)**: 
   Next.js Server Actions validate the URL, query PostgreSQL for the next sequence ID, Base62 encode it, store the mapping in Neon, and proactively cache it in Redis.
2. **Redirection Engine (`app/[code]/route.ts`)**: 
   Incoming requests hit the dynamic route handler. It queries Upstash Redis directly. If the short URL is found, a `302 Found` redirect is immediately returned. 
3. **Background Analytics Ingestion**: 
   Using Next.js `waitUntil()`, the redirect does not wait for analytics. A click event is asynchronously fired via HTTP POST to the Tinybird Events API, allowing you to ingest massive amounts of data in real-time.
