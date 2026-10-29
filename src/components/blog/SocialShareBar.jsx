import React, { useState } from 'react';
import { Share2, Check, Copy, ExternalLink, Eye, Info } from 'lucide-react';

export default function SocialShareBar({ post, className = '' }) {
  const [copied, setCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  if (!post) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareTitle = post.title || 'HealthInsight Article';
  const shareDesc = post.excerpt || post.seoDescription || 'Read this evidence-based article on HealthInsight.';
  const shareImage = post.featuredImageUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&h=630&q=85';

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareDesc,
          url: currentUrl
        });
      } catch (err) {
        // User cancelled or share failed, fallback silently
      }
    } else {
      handleCopyLink();
    }
  };

  const shareLinks = [
    {
      name: 'WhatsApp',
      url: `https://api.whatsapp.com/send?text=${encodeURIComponent(shareTitle + ' - ' + currentUrl)}`,
      bg: 'hover:bg-[#25D366] hover:text-white',
      border: 'hover:border-[#25D366]',
      icon: (
        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
        </svg>
      )
    },
    {
      name: 'X (Twitter)',
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(currentUrl)}`,
      bg: 'hover:bg-[#000000] hover:text-white',
      border: 'hover:border-black',
      icon: (
        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      )
    },
    {
      name: 'Facebook',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`,
      bg: 'hover:bg-[#1877F2] hover:text-white',
      border: 'hover:border-[#1877F2]',
      icon: (
        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      )
    },
    {
      name: 'LinkedIn',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`,
      bg: 'hover:bg-[#0A66C2] hover:text-white',
      border: 'hover:border-[#0A66C2]',
      icon: (
        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.68 1.68 0 1 0 0-3.36 1.68 1.68 0 0 0 0 3.36zm1.4 9.74v-8.37H5.06v8.37h2.8z"/>
        </svg>
      )
    }
  ];

  return (
    <div className={`bg-white rounded-lg border border-gray-200/80 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-semibold text-[#80C8C9] uppercase tracking-wider block mb-0.5">
            Spread Knowledge
          </span>
          <h4 className="text-sm font-bold text-[#202324]">
            Share this Article with Title & Image
          </h4>
        </div>

        {/* Share Buttons Row */}
        <div className="flex items-center gap-2 flex-wrap">
          {shareLinks.map((item) => (
            <a
              key={item.name}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Share on ${item.name}`}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-[4px] transition-all duration-150 ${item.bg} ${item.border}`}
            >
              {item.icon}
              <span className="hidden xs:inline">{item.name}</span>
            </a>
          ))}

          {/* Copy Link Button */}
          <button
            onClick={handleCopyLink}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-[4px] transition-all duration-150 border ${
              copied
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-black hover:text-white hover:border-black'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-gray-500" />
                <span>Copy Link</span>
              </>
            )}
          </button>

          {/* Native Web Share for Mobile Devices */}
          {typeof navigator !== 'undefined' && navigator.share && (
            <button
              onClick={handleNativeShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[#80C8C9]/20 text-[#1a5b5c] border border-[#80C8C9]/40 rounded-[4px] hover:bg-[#80C8C9]/30 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>More</span>
            </button>
          )}

          {/* Toggle Live Preview */}
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs text-gray-500 hover:text-gray-900 border border-transparent rounded transition-colors"
            title="Toggle social preview card"
          >
            <Eye className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-[11px] underline">
              {showPreview ? 'Hide Preview' : 'Preview Card'}
            </span>
          </button>
        </div>
      </div>

      {/* Interactive Social Media Preview Card */}
      {showPreview && (
        <div className="mt-5 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-500 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-[#80C8C9]" />
              Social Media Preview (Title &amp; Image as displayed on WhatsApp, Facebook, X, &amp; LinkedIn):
            </span>
          </div>

          <div className="max-w-[480px] bg-white border border-gray-200 rounded-lg overflow-hidden shadow-xs">
            {/* 16:9 Image container */}
            <div className="aspect-[16/9] w-full bg-gray-100 overflow-hidden relative">
              <img
                src={shareImage}
                alt={shareTitle}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&h=630&q=85';
                }}
              />
            </div>
            {/* Card Content */}
            <div className="p-3 bg-gray-50/80 border-t border-gray-200">
              <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">
                healthinsight-sable.vercel.app
              </p>
              <h5 className="text-xs font-bold text-gray-900 line-clamp-2 mb-1 leading-snug">
                {shareTitle}
              </h5>
              <p className="text-[11px] text-gray-600 line-clamp-2 leading-relaxed">
                {shareDesc}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
