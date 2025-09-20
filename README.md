# 📚 Bookshelf Web App

A modern, responsive React application for managing your personal book library. Built with React, TypeScript, Tailwind CSS, and shadcn/ui components.

## ✨ Features

- **📖 Book Management**: Add, view, and organize your books with details like title, author, cover image, notes, and ratings
- **⭐ Interactive Rating System**: Rate books with a 5-star rating system
- **📊 Reading Progress**: Track your reading progress with visual progress bars
- **🔍 Smart Search**: Search books by title or author
- **📑 Filter Tabs**: Filter books by status (All Books, Read, Wish List)
- **📱 Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **🎨 Modern UI**: Clean, card-based layout with smooth animations

## 🚀 Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. **Clone or download the project files**

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to view the application

## 🛠️ Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the project for production
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint to check for code issues

## ☁️ Deploying to Vercel

1. **Push your code to GitHub.** This repository is already configured for Vite, so no extra build files are required.
2. **Create a Vercel project.**
   - Sign in at [vercel.com](https://vercel.com) with your GitHub account.
   - Click *Add New → Project* and import this repository.
   - Accept the detected defaults (`npm run build` as the build command, `dist` as the output directory).
3. **Configure environment variables.** In the Vercel project dashboard open *Settings → Environment Variables* and add:
   - `VITE_SUPABASE_URL` — your Supabase project URL (for example `https://xyz.supabase.co`).
   - `VITE_SUPABASE_ANON_KEY` — the publishable anon key you generated in Supabase.
   Set the scope to **Production** (and optionally *Preview*/*Development* if you want the same values there).
4. **Deploy.** Click *Deploy* (or *Redeploy* after editing env vars). Vercel will install dependencies, run `npm run build`, and host the contents of `dist/`.
5. **Verify.** When the build finishes, open the generated `https://<project>.vercel.app` URL and test:
   - Books load from Supabase.
   - Adding a book (with optional reading lists) succeeds.
   - Reading list management works end to end.
6. **Future updates.** Every push to `main` triggers an automatic redeploy. If you rotate Supabase keys, update the same environment variables in Vercel and redeploy.

> Tip: copy `.env.example` to `.env.local`, populate it with your Supabase values locally, and keep `.env.local` out of version control.

## 📋 How to Use

### Adding a Book
1. Click the "Add Book" button in the navbar
2. Fill in the book details:
   - **Title** and **Author** (required)
   - **Cover Image URL** (optional)
   - **Status**: Choose from "Wish List", "Reading", or "Read"
   - **Rating**: Click stars to rate the book (1-5 stars)
   - **Progress**: Set reading progress for books marked as "Reading"
   - **Notes**: Add personal thoughts or quotes

### Managing Books
- **Currently Reading**: Books in progress are highlighted at the top
- **Filter by Status**: Use tabs to view all books, completed reads, or wish list
- **Search**: Use the search bar to find books by title or author
- **Update Ratings**: Click on stars to change a book's rating

### Book Status Logic
- **Wish List**: New books you want to read (progress automatically set to 0%)
- **Reading**: Books you're currently reading (manual progress tracking)
- **Read**: Completed books (progress automatically set to 100%)

## 🏗️ Project Structure

```
src/
├── components/
│   ├── ui/              # Reusable UI components (buttons, cards, dialogs, etc.)
│   ├── AddBookDialog.tsx
│   ├── BookCard.tsx
│   ├── BookGrid.tsx
│   ├── BookTabs.tsx
│   ├── CurrentlyReading.tsx
│   ├── Navbar.tsx
│   ├── ProgressBar.tsx
│   └── StarRating.tsx
├── lib/
│   └── utils.ts         # Utility functions
├── types/
│   └── book.ts          # TypeScript type definitions
├── App.tsx              # Main application component
├── main.tsx             # Application entry point
└── index.css            # Global styles and Tailwind imports
```

## 🎨 Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Icons**: Lucide React
- **Build Tool**: Vite
- **State Management**: React Hooks (useState, useMemo)

## 🔧 Customization

### Adding New Features
The codebase is designed to be easily extensible. Common areas for enhancement:

- **Edit/Delete Books**: Extend the `BookCard` component with edit/delete functionality
- **Categories/Tags**: Add category support to the `Book` interface
- **Data Persistence**: Integrate with a backend API or local storage
- **Import/Export**: Add functionality to import/export book data
- **Reading Goals**: Add yearly reading goal tracking

### Styling
- Modify `src/index.css` for global styles
- Update component-specific styles in individual component files
- Customize the color scheme by updating CSS custom properties

## 🌟 Sample Data

The app comes with sample books to demonstrate features:
- "The React Handbook" (Currently Reading)
- "Clean Code" (Read)
- "Design Patterns" (Wish List)

## 🤝 Contributing

This is a personal project template, but feel free to fork and modify it for your own use!

## 📄 License

This project is open source and available under the MIT License.
