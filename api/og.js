/**
 * Vercel Serverless Function for Dynamic OpenGraph & Twitter Card previews.
 * When social media crawlers (Facebook, WhatsApp, Twitter/X, LinkedIn, Telegram, Discord, etc.)
 * request a blog article link, this handler dynamically looks up the blog post from Firebase Firestore
 * and returns server-rendered HTML with the exact post title, excerpt, and featured image.
 */

// Fallback seed posts in case Firestore is unreachable
const FALLBACK_POSTS = [
  {
    slug: 'exploring-future-renewable-energy-innovations-healthy-environments',
    title: 'Exploring Future Renewable Energy Innovations & Healthy Environments',
    excerpt: 'Embark on a journey with us as we delve into the realms of environmental health, clean energy, and sustainable living for longevity.',
    featuredImageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&h=630&q=85'
  },
  {
    slug: 'from-ideas-to-impact-in-a-personal-wellness-journey',
    title: 'From Ideas to Impact in a Personal Wellness Journey',
    excerpt: 'How micro-habits and consistent daily intentions translate into profound, compounding health improvements over time.',
    featuredImageUrl: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1200&h=630&q=85'
  },
  {
    slug: 'navigating-the-nutritional-landscape-with-clinical-insights',
    title: 'Navigating the Nutritional Landscape with Clinical Insights',
    excerpt: 'Demystifying dietary myths with peer-reviewed nutritional biochemistry: what really feeds human cell longevity.',
    featuredImageUrl: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?auto=format&fit=crop&w=1200&h=630&q=85'
  },
  {
    slug: 'behind-the-scenes-of-crafting-restorative-daily-habits',
    title: 'Behind the Scenes of Crafting Restorative Daily Habits',
    excerpt: 'An inside look into behavioral psychology and nervous system recovery techniques used by elite wellness researchers.',
    featuredImageUrl: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=1200&h=630&q=85'
  },
  {
    slug: 'empowering-cardiovascular-health-prevention-unveiled',
    title: 'Empowering Cardiovascular Health: Prevention Unveiled',
    excerpt: 'Proactive cardiac metrics, arterial stiffness tests, and exercise interventions that keep heart muscle youthful.',
    featuredImageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&h=630&q=85'
  },
  {
    slug: 'thriving-in-a-high-stress-world-neuroscience-of-calm',
    title: 'Thriving in a High-Stress World: Neuroscience of Calm',
    excerpt: 'Targeting vagal nerve activation to switch from chronic sympathetic fight-or-flight to deep restorative recovery.',
    featuredImageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&h=630&q=85'
  },
  {
    slug: 'strategies-propelling-athletic-recovery-and-joint-mobility',
    title: 'Strategies Propelling Athletic Recovery and Joint Mobility',
    excerpt: 'Biomechanical principles, collagen synthesis protocols, and active recovery routines for sustainable pain-free movement.',
    featuredImageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1200&h=630&q=85'
  },
  {
    slug: 'pioneering-the-future-in-preventative-cellular-nutrition',
    title: 'Pioneering the Future in Preventative Cellular Nutrition',
    excerpt: 'Mitochondrial health, polyphenols, and micronutrient density that defend human DNA against accelerated oxidation.',
    featuredImageUrl: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1200&h=630&q=85'
  },
  {
    slug: 'healthy-eating-habits-for-a-demanding-professional-routine',
    title: 'Healthy Eating Habits for a Demanding Professional Routine',
    excerpt: 'Practical, low-friction strategies to maintain blood glucose stability and high cognitive stamina throughout intense workdays.',
    featuredImageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&h=630&q=85'
  }
];

// Neutral, brand-level HealthInsight editorial fallback banner (NOT an image belonging to another blog article)
const DEFAULT_BRAND_IMAGE = 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1200&h=630&q=85';
const DEFAULT_TITLE = 'HealthInsight - Editorial Health & Wellness Blog';
const DEFAULT_DESC = 'A production-grade editorial health and wellness blog with evidence-based nutrition, fitness, and lifestyle articles.';

function parseFirestoreField(field) {
  if (!field) return null;
  if ('stringValue' in field) return field.stringValue;
  if ('integerValue' in field) return parseInt(field.integerValue, 10);
  if ('booleanValue' in field) return field.booleanValue;
  if ('timestampValue' in field) return field.timestampValue;
  return null;
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export default async function handler(req, res) {
  // Extract slug from query parameters or URL path
  let rawSlug = req.query?.slug;
  if (!rawSlug && req.url) {
    try {
      const parsedUrl = new URL(req.url, 'https://healthinsight-sable.vercel.app');
      rawSlug = parsedUrl.searchParams.get('slug');
      if (!rawSlug) {
        const segments = parsedUrl.pathname.split('/').filter(Boolean);
        if (segments.length >= 2 && segments[0] === 'health') {
          rawSlug = segments[1];
        }
      }
    } catch {
      // ignore parsing error
    }
  }

  const slug = rawSlug ? String(rawSlug).replace(/\/+$/, '').trim().toLowerCase() : '';

  let post = null;

  if (slug) {
    // 1. Direct targeted Firestore runQuery for the specific slug
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const queryBody = {
        structuredQuery: {
          from: [{ collectionId: 'posts' }],
          where: {
            fieldFilter: {
              field: { fieldPath: 'slug' },
              op: 'EQUAL',
              value: { stringValue: slug }
            }
          },
          limit: 1
        }
      };

      const fsResp = await fetch(
        'https://firestore.googleapis.com/v1/projects/health-8b16d/databases/(default)/documents:runQuery',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(queryBody),
          signal: controller.signal
        }
      );
      clearTimeout(timeoutId);

      if (fsResp.ok) {
        const results = await fsResp.json();
        if (Array.isArray(results)) {
          for (const item of results) {
            if (item.document && item.document.fields) {
              const fields = item.document.fields;
              const fImage = parseFirestoreField(fields.featuredImageUrl) || parseFirestoreField(fields.socialImageUrl);
              post = {
                title: parseFirestoreField(fields.title),
                excerpt: parseFirestoreField(fields.excerpt) || parseFirestoreField(fields.seoDescription),
                featuredImageUrl: fImage,
                socialImageUrl: parseFirestoreField(fields.socialImageUrl) || fImage,
                slug: parseFirestoreField(fields.slug) || slug,
                updatedAt: parseFirestoreField(fields.updatedAt) || parseFirestoreField(fields.publishedAt)
              };
              break;
            }
          }
        }
      }
    } catch (err) {
      console.warn('Firestore runQuery lookup notice:', err?.message);
    }

    // 2. Collection scan fallback if runQuery didn't find the document
    if (!post || !post.title) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000);
        const fsResp = await fetch(
          'https://firestore.googleapis.com/v1/projects/health-8b16d/databases/(default)/documents/posts',
          { signal: controller.signal }
        );
        clearTimeout(timeoutId);

        if (fsResp.ok) {
          const data = await fsResp.json();
          if (data.documents && Array.isArray(data.documents)) {
            for (const doc of data.documents) {
              const fields = doc.fields || {};
              const docSlug = parseFirestoreField(fields.slug);
              if (docSlug && docSlug.toLowerCase().trim() === slug) {
                const fImage = parseFirestoreField(fields.featuredImageUrl) || parseFirestoreField(fields.socialImageUrl);
                post = {
                  title: parseFirestoreField(fields.title),
                  excerpt: parseFirestoreField(fields.excerpt) || parseFirestoreField(fields.seoDescription),
                  featuredImageUrl: fImage,
                  socialImageUrl: parseFirestoreField(fields.socialImageUrl) || fImage,
                  slug: docSlug,
                  updatedAt: parseFirestoreField(fields.updatedAt) || parseFirestoreField(fields.publishedAt)
                };
                break;
              }
            }
          }
        }
      } catch (err) {
        console.warn('Firestore collection scan notice:', err?.message);
      }
    }

    // 3. Fallback: Seed initial posts
    if (!post || !post.title) {
      post = FALLBACK_POSTS.find(p => p.slug?.toLowerCase().trim() === slug);
    }
  }

  const host = req.headers?.['x-forwarded-host'] || req.headers?.host || 'healthinsight-sable.vercel.app';
  const proto = req.headers?.['x-forwarded-proto'] || 'https';

  // Preserve query string (e.g. ?v=... or ?fbclid=...) in og:url and canonical tag
  let queryStr = '';
  if (req.url && req.url.includes('?')) {
    const rawSearch = req.url.split('?')[1] || '';
    const sp = new URLSearchParams(rawSearch);
    sp.delete('slug'); // remove internal routing param
    const remaining = sp.toString();
    if (remaining) {
      queryStr = `?${remaining}`;
    }
  }

  const currentUrl = slug 
    ? `${proto}://${host}/health/${encodeURIComponent(slug)}${queryStr}`
    : `${proto}://${host}/${queryStr}`;

  const rawTitle = post?.title || DEFAULT_TITLE;
  const pageTitle = post?.title ? `${post.title} | HealthInsight` : DEFAULT_TITLE;
  const description = post?.excerpt || DEFAULT_DESC;
  let image = post?.featuredImageUrl || post?.socialImageUrl || DEFAULT_BRAND_IMAGE;

  // Ensure image URL is absolute HTTPS for social crawlers
  if (image && !image.startsWith('http://') && !image.startsWith('https://')) {
    image = `https://${host}${image.startsWith('/') ? '' : '/'}${image}`;
  }

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(pageTitle)}</title>
  <meta name="description" content="${escapeHtml(description)}" />

  <!-- OpenGraph Metadata (Facebook, WhatsApp, LinkedIn, Discord, Telegram) -->
  <meta property="og:site_name" content="HealthInsight" />
  <meta property="og:type" content="article" />
  <meta property="og:title" content="${escapeHtml(rawTitle)}" />
  <meta property="og:description" content="${escapeHtml(description)}" />
  <meta property="og:image" content="${escapeHtml(image)}" />
  <meta property="og:image:secure_url" content="${escapeHtml(image)}" />
  <meta property="og:image:alt" content="${escapeHtml(rawTitle)}" />
  <meta property="og:url" content="${escapeHtml(currentUrl)}" />

  <!-- Twitter / X Large Summary Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@HealthInsight" />
  <meta name="twitter:title" content="${escapeHtml(rawTitle)}" />
  <meta name="twitter:description" content="${escapeHtml(description)}" />
  <meta name="twitter:image" content="${escapeHtml(image)}" />
  <meta name="twitter:image:alt" content="${escapeHtml(rawTitle)}" />

  <!-- Fallback & Canonical -->
  <link rel="image_src" href="${escapeHtml(image)}" />
  <link rel="canonical" href="${escapeHtml(currentUrl)}" />

  <!-- Fast client redirection if a browser user arrives directly -->
  <meta http-equiv="refresh" content="0;url=${escapeHtml(currentUrl)}" />
  <script>
    if (typeof window !== 'undefined') {
      window.location.replace(${JSON.stringify(currentUrl)});
    }
  </script>
</head>
<body style="font-family: system-ui, sans-serif; padding: 2rem; background: #F7F7F7; color: #202324; text-align: center;">
  <h2>${escapeHtml(rawTitle)}</h2>
  <p>${escapeHtml(description)}</p>
  <p>Loading article... <a href="${escapeHtml(currentUrl)}">Click here if not redirected automatically</a>.</p>
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  // Short cache to allow instant updates when posts are published or modified
  res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=120, stale-while-revalidate=600');
  return res.status(200).send(html);
}
