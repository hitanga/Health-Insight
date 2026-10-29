/**
 * SEO and Social Media OpenGraph / Twitter Cards helper
 * Dynamically updates <title>, <meta property="og:*">, and <meta name="twitter:*">
 * so social sharing cards and browser history always display the article title and image.
 */

export const DEFAULT_SEO = {
  title: 'HealthInsight - Editorial Health & Wellness Blog',
  description: 'Evidence-based insights, nutrition guides, and sustainable health practices to support your everyday vitality.',
  image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1200&h=630&q=85',
  type: 'website',
  siteName: 'HealthInsight'
};

function setMetaTag(attributeName, attributeValue, content) {
  if (!content) return;
  let element = document.querySelector(`meta[${attributeName}="${attributeValue}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attributeName, attributeValue);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

function setLinkTag(rel, href) {
  if (!href) return;
  let element = document.querySelector(`link[rel="${rel}"]`);
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', rel);
    document.head.appendChild(element);
  }
  element.setAttribute('href', href);
}

/**
 * Updates all relevant social media meta tags on the page
 */
export function updatePageSEO({
  title,
  description,
  image,
  url,
  type = 'article',
  publishedTime,
  author
}) {
  if (typeof document === 'undefined') return;

  const resolvedTitle = title ? `${title} | HealthInsight` : DEFAULT_SEO.title;
  const resolvedDesc = description || DEFAULT_SEO.description;
  const resolvedImage = image || DEFAULT_SEO.image;
  const resolvedUrl = url || (typeof window !== 'undefined' ? window.location.href : '');

  // 1. Browser Title
  document.title = resolvedTitle;

  // 2. Standard Meta Description
  setMetaTag('name', 'description', resolvedDesc);

  // 3. OpenGraph Tags (Facebook, WhatsApp, LinkedIn, Discord, Telegram)
  setMetaTag('property', 'og:title', title || DEFAULT_SEO.title);
  setMetaTag('property', 'og:description', resolvedDesc);
  setMetaTag('property', 'og:type', type);
  setMetaTag('property', 'og:site_name', DEFAULT_SEO.siteName);
  setMetaTag('property', 'og:url', resolvedUrl);
  setMetaTag('property', 'og:image', resolvedImage);
  setMetaTag('property', 'og:image:secure_url', resolvedImage);
  setMetaTag('property', 'og:image:type', 'image/jpeg');
  setMetaTag('property', 'og:image:width', '1200');
  setMetaTag('property', 'og:image:height', '630');
  setMetaTag('property', 'og:image:alt', title || 'HealthInsight Article');

  if (publishedTime) {
    setMetaTag('property', 'article:published_time', publishedTime);
  }
  if (author) {
    setMetaTag('property', 'article:author', author);
  }

  // 4. Twitter / X Card Tags
  setMetaTag('name', 'twitter:card', 'summary_large_image');
  setMetaTag('name', 'twitter:site', '@HealthInsight');
  setMetaTag('name', 'twitter:title', title || DEFAULT_SEO.title);
  setMetaTag('name', 'twitter:description', resolvedDesc);
  setMetaTag('name', 'twitter:image', resolvedImage);
  setMetaTag('name', 'twitter:image:alt', title || 'HealthInsight Article');

  // 5. Fallback link rel image_src & canonical
  setLinkTag('image_src', resolvedImage);
  setLinkTag('canonical', resolvedUrl);
}

/**
 * Reset meta tags back to default homepage values
 */
export function resetDefaultSEO() {
  updatePageSEO({
    title: '',
    description: DEFAULT_SEO.description,
    image: DEFAULT_SEO.image,
    url: typeof window !== 'undefined' ? window.location.origin : '',
    type: 'website'
  });
}
