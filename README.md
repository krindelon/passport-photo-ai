# 🛂 AI Passport Photo Maker (PWA)

A 100% private, serverless Progressive Web App (PWA) that uses three state-of-the-art AI models directly in your browser to automatically crop, level, and format your passport photos to strict U.S. State Department biometric guidelines.

Because all AI processing happens locally on your device's GPU/CPU, **no images are ever uploaded to a server**. Once loaded, the app can be installed and works completely offline.

## ✨ Features
*   **Triple-AI Architecture:**
    *   **Img.ly Background Removal:** Photoshop-quality salient object detection for flawless alpha-matting around hair and shoulders.
    *   **Google MediaPipe:** Sub-pixel facial geometry tracking to automatically level head-tilt (using the irises) and perfectly center the nose.
    *   **Semantic Face Parsing:** Hugging Face `Transformers.js` isolates the true ear cartilage, completely ignoring obscuring hair for perfect width metrics.
*   **Biometric Compliance Checking:** Real-time geometric validation for US Passport Safe Zones (Head Size 50-68%, Eyes 1 1/8" - 1 3/8" from bottom).
*   **Print-Ready Export:** Generates an exact 4x6" print template at 300 DPI with two mathematically perfect 2x2" squares and tight scissor cut-guides.

## 🚀 How to Run Locally

You don't need a Node.js backend or Webpack bundler. Because it uses ESM imports, you just need a standard local HTTP server to bypass browser CORS restrictions for WASM files.

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ai-passport-maker.git
   cd ai-passport-maker