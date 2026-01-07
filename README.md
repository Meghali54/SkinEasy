
**Your Pocket Dermatologist** 👩‍⚕️

Skinsey is packed with features to make skincare simple, smart, and personal.

  * **AI-Powered Skin Analysis**: Just snap a photo of a skin concern, and our advanced AI model will analyze it to suggest possible conditions and provide actionable recommendations. It's not magic, it's AI. (But it's close).
  * **Personalized Skincare Routines**: Based on your unique skin type, concerns, and even your local climate, Skinsey generates tailored morning and evening skincare routines. Get the right advice for your skin.
  * **Chat with Chansey AI**: Have a nagging skincare question? Chat with our friendly AI assistant, Chansey\! Trained to provide empathetic and accurate information, it's like having a dermatologist on call 24/7. Our AI won't replace your dermatologist... yet 😉.
  * **Find a Local Pro**: Ready to see a specialist? Skinsey uses geolocation to find and list dermatologists near you, making it easier than ever to book an appointment with a real-life expert.

-----

**The Magic Behind the Pixels** 🧙‍♂️

Skinsey is built with a modern, powerful, and scalable tech stack to deliver a seamless experience.

The **Frontend** is a dynamic and responsive UI built with Next.js and React. The **UI Components** are beautifully crafted and accessible, coming from Shadcn UI and styled with Tailwind CSS.

Server-side logic and communication channels are powered by Next.js API Routes for the **Backend & API**. User management is handled securely by NextAuth.js, and data storage is managed with a flexible MongoDB database.

The **AI Brains** behind the features are Google Gemini, which powers our chatbot and routine generation, and Groq & Llama for lightning-fast image analysis. Location-aware features are enabled by the Browser Geolocation API and OpenStreetMap, with deployment handled on Vultr. With a stack this powerful, the only thing it can't do is make coffee (we're working on that in v2).

-----

**Future Innovating Features** 🚀

We are constantly looking for ways to improve Skinsey. Here are some of the exciting features on our roadmap:

  * **Custom RAG-Powered AI**: To ensure the most accurate and reliable answers, we plan to replace the external AI API with a custom-built model from scratch. By using a Retrieval-Augmented Generation (RAG) framework trained on verified dermatological data, we can eliminate AI hallucinations and provide users with trustworthy information.
  * **Enhanced User Interface**: We will continue to refine and improve the UI/UX to make the app even more intuitive, engaging, and accessible for all users.
  * **Live Camera Scanning**: We are working on a feature to allow users to scan their skin directly from their device's live camera feed, providing instant analysis and feedback without needing to take and upload photos.

-----


-----

**Get Started Locally** 💻

Want to run Skinsey on your own machine? Follow these simple steps.

### Prerequisites

  * Node.js (v18 or later)
  * Git
  * A running MongoDB instance (local or on Atlas)

### 1\. Clone the Repository

```bash
cd skindisease
```

### 2\. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3\. Set Up Environment Variables

Create a file named `.env.local` in the root of the project and add the following variables.

```env
# MongoDB
MONGODB_URI=your_mongodb_connection_string
MONGODB_DB=skindisease

# NextAuth.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_super_secret_key_for_nextauth

# AI Services
GEMINI_API_KEY=your_google_gemini_api_key
GROQ_API_KEY=your_groq_api_key

# Other
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### 4\. Run the Development Server

Start the application and open http://localhost:3000 in your browser to see it in action.

```bash
npm run dev
```
