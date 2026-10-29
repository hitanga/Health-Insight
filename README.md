# HealthInsight — Editorial Health & Wellness Blog with Firebase Admin Dashboard

A production-ready, responsive health and wellness blog website inspired by minimal editorial design principles. Built with React (Vite), Cloud Firestore, Firebase Authentication, and Lucide React.

## Features

- **Pixel-Accurate Editorial Design**:
  - Centered heading with subtle turquoise accent (`#80C8C9`).
  - Featured section: Large 58% card on left with dark gradient overlay, 3 stacked compact cards on right.
  - Explore Our Latest Articles: Heading and description aligned horizontally, responsive 3-column x 2-row card grid.
  - Centered "View all articles" button.
  - 4-column full-width dark charcoal footer (`#1C1F21`) with working newsletter subscription and social links.
- **Dedicated Health Articles Page (`/health`)**:
  - Live search across titles, excerpts, topics, and tags.
  - Category filtering pills with real-time post counts.
  - Dynamic pagination ("Load More Articles").
- **Individual Article Reading Page (`/health/:slug`)**:
  - Clean breadcrumbs navigation.
  - Category badge, author, publication date, reading time calculation.
  - Safe formatted content renderer (supports headings, lists, blockquotes, bold/italics, and embedded images).
  - Educational health disclaimer box.
  - Related health publications recommendations.
- **Secure Administrator Console (`/admin`)**:
  - Email/Password authentication verified strictly against the authorized administrator email (`VITE_ADMIN_EMAIL`).
  - **Featured Image URL Input & Live Preview**: paste any direct image URL (Unsplash, CDN, S3) with instant visual aspect ratio preview, error fallbacks, and clear action.
  - Comprehensive post editor with Markdown formatting toolbar, reading time calculator, SEO titles, and draft/published toggle.
  - Category manager with article-count deletion safeguards.
  - Website Settings: customize site name, text logo, logo image URL with preview, tagline, contact information, social URLs, and footer text.
  - Pages & Policies editor: customize About Us mission and Privacy Policy directly from the dashboard.
  - Reader inquiries inbox: review, toggle read status, and reply to messages submitted via `/contact`.
  - One-Click Database Seeder: instantly populates Firestore with initial evidence-based health articles and categories.

---

## Getting Started

### 1. Prerequisites
- Node.js 18+ and npm.

### 2. Installation
```bash
npm install
```

### 3. Running Locally
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

---

## Firebase Setup Instructions

Follow these steps to connect your own Cloud Firestore database and Firebase Authentication:

### Step 1: Create a Firebase Project
1. Navigate to the [Firebase Console](https://console.firebase.google.com/).
2. Click **Add project** and name it (e.g., `health-insight-blog`).
3. Google Analytics is optional; complete creation.

### Step 2: Register a Web Application
1. In project overview, click the **Web** icon (`</>`) to add an app.
2. Enter an app nickname (e.g., `Health Blog Web`).
3. Copy the configuration object keys (`apiKey`, `projectId`, etc.).

### Step 3: Enable Email/Password Authentication
1. Go to **Build** > **Authentication** > **Get started**.
2. Under the **Sign-in method** tab, click **Email/Password**.
3. Toggle **Enable** (leave Email link disabled) and click **Save**.

### Step 4: Create the Administrator Account
1. Under the **Users** tab in Authentication, click **Add user**.
2. Enter your desired administrator email (e.g., `admin@healthinsight.com`) and a strong password.
3. Note this email: only this authorized address will be allowed into the dashboard.

### Step 5: Create Cloud Firestore Database
1. Go to **Build** > **Firestore Database** > **Create database**.
2. Choose a nearby cloud region (e.g., `us-central1` or `asia-southeast1`).
3. Start in **Production mode** (rules will be applied in the next step).

### Step 6: Publish Firestore Security Rules
1. In Firestore Database, click the **Rules** tab.
2. Copy the contents of `firestore.rules` from this repository and paste them into the editor.
3. Update the administrator email check to match your admin email:
   ```javascript
   function isAdmin() {
     return isAuthenticated() && request.auth.token.email.lower() == 'your-admin-email@example.com';
   }
   ```
4. Click **Publish**.

### Step 7: Configure Environment Variables
Create a `.env` file in the root folder with your values:
```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-app
VITE_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:...
VITE_ADMIN_EMAIL=your-admin-email@example.com
```

### Step 8: Seed Initial Content
1. Log into `/admin/login` using your administrator email and password.
2. On the Overview screen, click **Seed Health Content**.
3. This creates all initial categories, initial health articles, and settings in Firestore automatically!

---

## Deployment

### Deploy to Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
# Specify 'dist' as your public directory and configure single-page app as 'Yes'
npm run build
firebase deploy
```

### Deploy to Vercel
1. Push your repository to GitHub.
2. Import the project in Vercel.
3. Add the `VITE_*` environment variables in the Vercel project settings.
4. Deploy!
