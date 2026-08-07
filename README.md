# SmartDrobe | AI-Powered Minimalist Wardrobe Platform

SmartDrobe is an AI-powered wardrobe management platform designed to help users digitize their clothes, curate capsule wardrobes, generate intelligent outfit recommendations based on weather and occasion, and consult an AI fashion assistant.

Built with Next.js 15 App Router, React 19, TypeScript, TailwindCSS, Prisma ORM, and Framer Motion. The UI follows an Apple, Notion, Linear, and Vercel minimalist aesthetic using pure White (`#FFFFFF`), crisp Black (`#111111`), and vibrant Blue (`#2563EB`) accents.

---

## 🌟 Key Features

1. **Digital Wardrobe Vault**: Catalog clothing items by category (Shirts, Pants, Shoes, Jackets, Dresses, Accessories), color, season, occasion, and tags.
2. **AI Outfit Generator**: Algorithmic fashion combination engine matching weather forecast, mood, season, and style silhouette.
3. **AI Fashion Stylist Chat**: Real-time conversational AI for capsule wardrobe advice, color theory guidance (60-30-10 rule), and travel packing matrices.
4. **Admin Control Center**: Monitor active accounts, system health metrics, manage user permissions, and configure AI providers (OpenAI GPT-4o, Google Gemini, Claude, Custom Endpoints).
5. **Interactive OpenAPI / Swagger Documentation**: REST API documentation available directly at `/docs`.
6. **Data Export**: Complete JSON/CSV export capabilities for user privacy and portability.

---

## 🚀 Quick Start & Setup

### Prerequisites
- Node.js 20+
- npm or yarn

### 1. Install Dependencies
```bash
npm install
```

### 2. Database Migration & Seeding
SmartDrobe comes pre-configured with SQLite for instant, zero-dependency local execution.

```bash
# Push database schema
npm run db:push

# Seed demo users & wardrobe items
npm run db:seed
```

### 3. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Pre-populated Demo Credentials

| Role | Email | Password |
|---|---|---|
| **Standard User** | `user@smartdrobe.ai` | `password123` |
| **Platform Admin** | `admin@smartdrobe.ai` | `admin123` |

---

## 🐳 Docker Support

To run SmartDrobe and PostgreSQL in Docker containers:

```bash
docker-compose up --build -d
```

---

## 📚 REST API Overview

- `POST /api/auth/login`: Authenticate and receive JWT cookie
- `POST /api/auth/signup`: Register new account
- `GET /api/wardrobe`: Fetch user's clothing catalog
- `POST /api/wardrobe`: Add new clothing item
- `PUT /api/wardrobe/:id`: Edit item details or toggle favorite status
- `DELETE /api/wardrobe/:id`: Remove clothing item
- `POST /api/outfits/generate`: Generate AI outfit recommendation
- `POST /api/chat`: Send message to AI fashion stylist
- `GET /api/docs`: Interactive OpenAPI 3.0 specification
