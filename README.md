# 💬 Next.js Chat Application

A full-featured real-time chat application built with **Next.js**, **TypeScript**, and **TailwindCSS**. This app allows users to add friends by email, send/receive friend requests, and chat in real time with blazing-fast performance via **Redis**.

---

## 🚀 Features

- 🔁 **Realtime Messaging** — Powered by WebSockets for instant communication.
- 👥 **Friend System** — Add friends and manage friend requests via email.
- ⚡ **High Performance** — Optimized queries using **Redis** for low latency.
- 💻 **Responsive UI** — Built with TailwindCSS to work seamlessly across all devices.
- 🔐 **Secure Routing** — Protects sensitive pages and routes for authenticated users.
- 🔑 **Google Authentication** — Sign in easily using your Google account.
- 🛠 **TypeScript Support** — Ensures safer and predictable code with static typing.

---

## 🧰 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Authentication**: NextAuth with Google
- **Real-time**: WebSockets / Pusher / Redis PubSub (choose your stack)
- **Database**: Redis (for chat performance)

---

## 🎨 UI & Styling Tools

- 🎨 **TailwindCSS** — Utility-first CSS framework
- 🎯 **clsx** — Conditional className merging
- 🧩 **tailwind-merge** — Merge Tailwind classes safely
- 🎭 **class-variance-authority (CVA)** — Create reusable Tailwind class variants
- 🧱 **Lucide Icons** — Clean and modern icons

---

## 🧪 Getting Started

```bash
# Clone the repository
git clone https://github.com/your-username/your-chat-app.git

# Navigate to the project directory
cd your-chat-app

# Install dependencies
npm install

# Create .env.local and add your environment variables
cp .env.example .env.local

# Run the development server
npm run dev
