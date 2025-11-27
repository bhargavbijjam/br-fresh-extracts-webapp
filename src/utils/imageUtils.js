export const getOptimizedImageUrl = (url, width) => {
  if (!url) return 'https://via.placeholder.com/300'; // Fallback
  if (url.includes('cloudinary')) {
    // Inject the transformation string '/w_{width},c_limit,q_auto,f_auto/' after '/upload/'
    const parts = url.split('/upload/');
    return `${parts[0]}/upload/w_${width},c_limit,q_auto,f_auto/${parts[1]}`;
  }
  return url;
};