
export class ObfuscationEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor() {
    this.canvas = document.createElement('canvas');
    const context = this.canvas.getContext('2d', { willReadFrequently: true });
    if (!context) throw new Error('Could not get canvas context');
    this.ctx = context;
  }

  async process(imageFile: File, level: number): Promise<string> {
    const img = await this.loadImage(imageFile);
    this.canvas.width = img.width;
    this.canvas.height = img.height;
    this.ctx.drawImage(img, 0, 0);

    switch (level) {
      case 1: // CNN Deception (PGD Attack)
        this.applyNoise(this.ctx, this.canvas, 0.05);
        this.applyFrequencyGlitch(this.ctx, this.canvas, 10);
        break;
      case 2: // Pixelation
        this.applyPixelation(this.ctx, this.canvas, 6);
        break;
      case 3: // Hybrid (CNN + Pixelation)
        this.applyPixelation(this.ctx, this.canvas, 4);
        this.applyNoise(this.ctx, this.canvas, 0.08);
        break;
      default:
        this.applyNoise(this.ctx, this.canvas, 0.02);
    }

    return this.canvas.toDataURL('image/png');
  }

  private applyFrequencyGlitch(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, intensity: number) {
    const w = canvas.width;
    const h = canvas.height;
    const imageData = ctx.getImageData(0, 0, w, h);
    const data = imageData.data;
    for (let y = 0; y < h; y++) {
      const offset = Math.sin(y * 0.1) * intensity;
      for (let x = 0; x < w; x++) {
        const idx = (y * w + x) * 4;
        if (Math.random() < 0.05) {
          const val = data[idx] + offset;
          data[idx] = data[idx + 1] = data[idx + 2] = val;
        }
      }
    }
    ctx.putImageData(imageData, 0, 0);
  }

  private loadImage(file: File): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  private applyPixelation(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, pixelSize: number) {
    const w = canvas.width;
    const h = canvas.height;
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d')!;
    tempCanvas.width = Math.max(1, Math.floor(w / pixelSize));
    tempCanvas.height = Math.max(1, Math.floor(h / pixelSize));
    tempCtx.drawImage(canvas, 0, 0, tempCanvas.width, tempCanvas.height);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(tempCanvas, 0, 0, tempCanvas.width, tempCanvas.height, 0, 0, w, h);
  }

  private applyNoise(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, intensity: number) {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      if (Math.random() < intensity) {
        const noiseVal = (Math.random() - 0.5) * 40;
        data[i] = Math.max(0, Math.min(255, data[i] + noiseVal));
        data[i+1] = Math.max(0, Math.min(255, data[i+1] + noiseVal));
        data[i+2] = Math.max(0, Math.min(255, data[i+2] + noiseVal));
      }
    }
    ctx.putImageData(imageData, 0, 0);
  }
}
