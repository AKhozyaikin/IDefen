# IDefender Lite — Local Image Privacy

**IDefender Lite** is a simplified, high-performance version of the IDefender image protection tool. It is designed for users who need a fast, local-only solution to protect their privacy by obfuscating images before sharing them online.

## Key Features

- **100% Local Processing**: Your images never leave your device. All processing happens in your browser.
- **PNG Support**: Optimized specifically for PNG files to ensure maximum quality and protection.
- **Adversarial Algorithms**:
  - **CNN Deception**: Introduces subtle noise to confuse neural network filters.
  - **Pixelation**: Classic obfuscation to hide sensitive details.
  - **Hybrid Guard**: Combines both methods for maximum security.
- **Privacy First**: No tracking, no cookies, no server-side storage.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/idefender-lite.git
   ```
2. Navigate to the project directory:
   ```bash
   cd idefender-lite
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### Development

Run the development server:
```bash
npm run dev
```

### Build

Build the project for production:
```bash
npm run build
```
The production-ready files will be in the `dist` folder.

## Technical Details

IDefender Lite uses the HTML5 Canvas API to manipulate image data at the pixel level. By applying adversarial perturbations and structural modifications, it makes it significantly harder for automated systems (like facial recognition or AI training crawlers) to accurately identify or categorize your images.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Disclaimer

While IDefender Lite provides a strong layer of privacy, no tool can guarantee 100% protection against all forms of digital surveillance. Use it as part of a broader privacy strategy.
