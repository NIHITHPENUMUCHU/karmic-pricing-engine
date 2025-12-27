Karmic Seed | Pricing Control Center

An advanced, data-driven operational dashboard designed to optimize pricing strategies for the eco-friendly tableware sector. This tool transitions e-commerce pricing from reactive, manual adjustments to a systematic, algorithmic framework based on unit economics and inventory health.

🚀 Live Demo
https://dashboard-karmic-seed.netlify.app/


📊 The Strategic Framework: DIMP

The core engine of this application utilizes the Dynamic Inventory-Margin Pricing (DIMP) framework. Unlike standard cost-plus models, DIMP integrates three critical operational pillars:

The Economic Floor (Profitability): Automates the calculation of the absolute minimum price per SKU by aggregating FBA fees, storage costs, handling, and base COGS.

The Inventory Throttle (Health): Uses "Days of Supply" (DOS) as a real-time pricing lever.

Stock Protection Mode: Increases prices when DOS < 15 to slow velocity and preserve organic search ranking.

Liquidation Mode: Triggers automated discounts when DOS > 120 to recover capital and eliminate storage fees.

Market Alignment (Competition): Benchmarks recommendations against competitor averages to ensure brand positioning remains within a sustainable 15-20% premium range.

✨ Key Features

Assignment Mode: Pre-loaded with the Round 3 Case Study results for immediate review of core SKU performance (MN-01 to MN-15).

Dynamic Workspace: A "Create New Dashboard" feature allowing users to upload their own Pricing, Inventory, and Competitor CSV files.

Live Simulation Engine: Real-time sliders to perform "What-if" analysis on margin boosts and scarcity thresholds.

Interactive Visualizations: High-fidelity charts (Recharts) showing price variance distributions and strategy logic mixes.

Responsive Architecture: A mobile-first, professional UI built with Tailwind CSS that adapts from smartphones to ultra-wide laptop monitors without section overlap.

🛠️ Technical Stack

Framework: React 18 (Vite)

Styling: Tailwind CSS

Icons: Lucide React

Charts: Recharts

Deployment: Netlify

⚙️ Installation & Local Setup

Clone the repository:

git clone [https://github.com/NIHITHPENUMUCHU/karmic-pricing-engine.git](https://github.com/NIHITHPENUMUCHU/karmic-pricing-engine.git)
cd pricing-control-center


Install dependencies:

npm install


Install additional libraries:

npm install lucide-react recharts
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p


Run the development server:

npm run dev


📁 Project Structure

src/App.jsx: The central intelligence of the app, containing the logic engine and UI components.

src/index.css: Global styles and Tailwind directives.

tailwind.config.js: Configuration for the design tokens and responsive breakpoints.

👨‍💼 Author

Operations Analyst Candidate This project was developed as a technical artifact for the Karmic Seed Round 3 Case Study.
