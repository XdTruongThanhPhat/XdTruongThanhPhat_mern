/**
 * Trích xuất YouTube Video ID từ nhiều định dạng URL:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 * - https://www.youtube.com/shorts/VIDEO_ID
 * - https://www.youtube.com/v/VIDEO_ID
 */
export const extractYoutubeVideoId = (url) => {
  if (!url) return null;
  const str = url.trim();
  const match = str.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
  return match ? match[1] : null;
};

/**
 * Tự động chuyển đổi các đường link YouTube (dạng thẻ <a>, text thuần trong <p>, hoặc <iframe>)
 * thành khung phát Video nhúng (Responsive Embed Player 16:9)
 */
export const transformYoutubeLinksToEmbed = (htmlContent) => {
  if (!htmlContent) return '';

  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, 'text/html');

  const createVideoContainer = (videoId) => {
    const container = document.createElement('div');
    container.className = 'blog-video-container my-6 rounded-xl overflow-hidden shadow-md aspect-video bg-black';
    container.innerHTML = `
      <iframe
        src="https://www.youtube.com/embed/${videoId}"
        title="YouTube Video"
        class="w-full h-full border-0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen="true"
        loading="lazy"
      ></iframe>
    `;
    return container;
  };

  // 1. Quét các thẻ <a> chứa link YouTube
  const links = doc.querySelectorAll('a');
  links.forEach((a) => {
    const href = a.getAttribute('href') || '';
    const text = a.textContent.trim();
    const videoId = extractYoutubeVideoId(href) || extractYoutubeVideoId(text);

    if (videoId) {
      const parent = a.parentElement;
      const container = createVideoContainer(videoId);

      if (parent && parent.tagName === 'P' && parent.textContent.trim() === text) {
        parent.replaceWith(container);
      } else {
        a.replaceWith(container);
      }
    }
  });

  // 2. Quét các thẻ <p> chứa plain text URL YouTube
  const paragraphs = doc.querySelectorAll('p');
  paragraphs.forEach((p) => {
    const text = p.textContent.trim();
    const videoId = extractYoutubeVideoId(text);
    if (
      videoId &&
      (text.startsWith('http://') ||
        text.startsWith('https://') ||
        text.startsWith('www.youtube') ||
        text.startsWith('youtu.be'))
    ) {
      p.replaceWith(createVideoContainer(videoId));
    }
  });

  // 3. Đảm bảo tất cả iframe (vd: từ Quill ql-video) được bọc trong container responsive
  const iframes = doc.querySelectorAll('iframe');
  iframes.forEach((iframe) => {
    iframe.setAttribute('loading', 'lazy');
    iframe.setAttribute('allowfullscreen', 'true');
    if (!iframe.parentElement.classList.contains('blog-video-container')) {
      const wrapper = document.createElement('div');
      wrapper.className = 'blog-video-container my-6 rounded-xl overflow-hidden shadow-md aspect-video bg-black';
      iframe.parentNode.insertBefore(wrapper, iframe);
      wrapper.appendChild(iframe);
      iframe.className = 'w-full h-full border-0';
    }
  });

  return doc.body.innerHTML;
};
