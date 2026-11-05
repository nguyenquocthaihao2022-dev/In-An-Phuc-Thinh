import { Supabase as sb } from './supabase.js';

const toWebp = (file, max = 1200) => new Promise((ok) => {
  const img = new Image();
  img.onload = () => {
    const s = Math.min(1, max / Math.max(img.width, img.height));
    const c = Object.assign(document.createElement('canvas'), { width: img.width * s, height: img.height * s });
    c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
    c.toBlob(ok, 'image/webp', 0.85);
  };
  img.src = URL.createObjectURL(file);
});

export const upload = async (file, folder) => {
  const blob = await toWebp(file);
  const path = `${folder}/${crypto.randomUUID()}.${blob.type.split('/')[1]}`;
  const { error } = await sb.storage.from('anh').upload(path, blob, { contentType: blob.type, cacheControl: '31536000' });
  if (error) throw error;
  return sb.storage.from('anh').getPublicUrl(path).data.publicUrl;
};