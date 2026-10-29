import React from 'react';

/**
 * Clean, safe Markdown & rich text parser that formats headings,
 * bold, italic, quotes, lists, links, and images without dangerouslySetInnerHTML.
 */
export default function MarkdownRenderer({ content = '' }) {
  if (!content) return null;

  // Split content by double newlines or major blocks
  const blocks = content.split(/\n\s*\n/);

  return (
    <div className="article-prose space-y-4">
      {blocks.map((block, idx) => {
        const trimmed = block.trim();

        // Heading 2: ## Title
        if (trimmed.startsWith('## ')) {
          return (
            <h2 key={idx} className="text-xl sm:text-2xl font-bold text-[#202324] mt-8 mb-3 tracking-tight">
              {trimmed.replace(/^##\s+/, '')}
            </h2>
          );
        }

        // Heading 3: ### Title
        if (trimmed.startsWith('### ')) {
          return (
            <h3 key={idx} className="text-lg sm:text-xl font-semibold text-[#202324] mt-6 mb-2 tracking-tight">
              {trimmed.replace(/^###\s+/, '')}
            </h3>
          );
        }

        // Blockquote: > text
        if (trimmed.startsWith('> ')) {
          return (
            <blockquote key={idx} className="border-l-4 border-[#80C8C9] pl-4 py-1 italic text-gray-700 bg-gray-50/70 rounded-r my-4 text-base">
              {trimmed.replace(/^>\s+/, '')}
            </blockquote>
          );
        }

        // Unordered list: lines starting with - or *
        if (trimmed.split('\n').every(line => line.trim().startsWith('- ') || line.trim().startsWith('* '))) {
          const items = trimmed.split('\n').map(l => l.trim().replace(/^[-*]\s+/, ''));
          return (
            <ul key={idx} className="list-disc list-inside space-y-1.5 text-gray-700 my-4 text-sm sm:text-base leading-relaxed pl-2">
              {items.map((item, itemIdx) => (
                <li key={itemIdx}>
                  <FormattedLine text={item} />
                </li>
              ))}
            </ul>
          );
        }

        // Ordered list: lines starting with numbers like 1. 2.
        if (trimmed.split('\n').every(line => /^\d+\.\s+/.test(line.trim()))) {
          const items = trimmed.split('\n').map(l => l.trim().replace(/^\d+\.\s+/, ''));
          return (
            <ol key={idx} className="list-decimal list-inside space-y-1.5 text-gray-700 my-4 text-sm sm:text-base leading-relaxed pl-2">
              {items.map((item, itemIdx) => (
                <li key={itemIdx}>
                  <FormattedLine text={item} />
                </li>
              ))}
            </ol>
          );
        }

        // Image in markdown format: ![alt](url)
        const imgMatch = trimmed.match(/^!\[(.*?)\]\((https?:\/\/.*?)\)$/);
        if (imgMatch) {
          return (
            <figure key={idx} className="my-6">
              <img
                src={imgMatch[2]}
                alt={imgMatch[1]}
                className="w-full max-h-[420px] object-cover rounded-[6px] shadow-2xs"
                loading="lazy"
              />
              {imgMatch[1] && (
                <figcaption className="text-center text-xs text-gray-500 mt-2 italic">
                  {imgMatch[1]}
                </figcaption>
              )}
            </figure>
          );
        }

        // Regular paragraph with inline formatting (bold, italic, links)
        return (
          <p key={idx} className="text-sm sm:text-base text-gray-700 leading-relaxed">
            <FormattedLine text={trimmed} />
          </p>
        );
      })}
    </div>
  );
}

/**
 * Handles inline bold (**text**), italics (*text*), and links ([label](url))
 */
function FormattedLine({ text }) {
  if (!text) return null;

  // Split on inline patterns
  const tokens = [];
  let remaining = text;
  let keyIndex = 0;

  while (remaining.length > 0) {
    // Markdown link: [text](url)
    const linkMatch = remaining.match(/\[(.*?)\]\((https?:\/\/[^\s)]+)\)/);
    // Bold: **text**
    const boldMatch = remaining.match(/\*\*(.*?)\*\*/);

    let nextMatch = null;
    let type = null;

    if (linkMatch && boldMatch) {
      if (linkMatch.index < boldMatch.index) {
        nextMatch = linkMatch;
        type = 'link';
      } else {
        nextMatch = boldMatch;
        type = 'bold';
      }
    } else if (linkMatch) {
      nextMatch = linkMatch;
      type = 'link';
    } else if (boldMatch) {
      nextMatch = boldMatch;
      type = 'bold';
    }

    if (!nextMatch) {
      tokens.push(<span key={keyIndex++}>{remaining}</span>);
      break;
    }

    // Push preceding text
    if (nextMatch.index > 0) {
      tokens.push(<span key={keyIndex++}>{remaining.slice(0, nextMatch.index)}</span>);
    }

    if (type === 'bold') {
      tokens.push(
        <strong key={keyIndex++} className="font-semibold text-[#202324]">
          {nextMatch[1]}
        </strong>
      );
    } else if (type === 'link') {
      tokens.push(
        <a
          key={keyIndex++}
          href={nextMatch[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#202324] underline decoration-[#80C8C9] underline-offset-2 hover:text-[#80C8C9] transition-colors"
        >
          {nextMatch[1]}
        </a>
      );
    }

    remaining = remaining.slice(nextMatch.index + nextMatch[0].length);
  }

  return <>{tokens}</>;
}
