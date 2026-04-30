const MAX_PX = 1600;
// Firestore field limit: 1 048 487 bytes. Base64 is ASCII so 1 char = 1 byte.
// We target 950 000 chars to leave a safe margin.
const MAX_B64 = 950_000;

export async function compressImage(dataUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, MAX_PX / Math.max(img.width, img.height));
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);
      const canvas = document.createElement('canvas');
      canvas.width = w; canvas.height = h;
      canvas.getContext('2d')!.drawImage(img, 0, 0, w, h);

      // Binary search between quality 0.3 and 0.9 for best quality under limit
      let lo = 0.3, hi = 0.9, result = '';
      for (let i = 0; i < 8; i++) {
        const mid = Math.round(((lo + hi) / 2) * 100) / 100;
        const candidate = canvas.toDataURL('image/jpeg', mid);
        if (candidate.length <= MAX_B64) { lo = mid; result = candidate; }
        else hi = mid;
      }
      // Fallback: if nothing fit (very large image), use lo with forced quality
      if (!result) result = canvas.toDataURL('image/jpeg', lo);
      resolve(result);
    };
    img.onerror = reject;
    img.src = dataUrl;
  });
}
