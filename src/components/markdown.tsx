import { Fragment } from 'react';

/**
 * Minimal, dependency-free Markdown renderer for CMS page/blog content.
 * Supports: ## / ### headings, - bullet lists, blank-line paragraphs and
 * **bold** / *italic* inline emphasis. Kept intentionally small and safe
 * (no raw HTML injection).
 */
function inline(text: string, keyPrefix: string) {
  const nodes: React.ReactNode[] = [];
  const regex = /(\*\*([^*]+)\*\*|\*([^*]+)\*)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = regex.exec(text))) {
    if (m.index > last) nodes.push(text.slice(last, m.index));
    if (m[2]) nodes.push(<strong key={`${keyPrefix}-b-${i}`}>{m[2]}</strong>);
    else if (m[3]) nodes.push(<em key={`${keyPrefix}-i-${i}`}>{m[3]}</em>);
    last = m.index + m[0].length;
    i++;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

export function Markdown({ content }: { content: string }) {
  const lines = content.replace(/\r\n/g, '\n').split('\n');
  const blocks: React.ReactNode[] = [];
  let list: string[] = [];
  let para: string[] = [];
  let key = 0;

  const flushList = () => {
    if (list.length) {
      blocks.push(
        <ul key={`ul-${key++}`} className="my-4 list-disc space-y-1 pl-6">
          {list.map((li, i) => (
            <li key={i}>{inline(li, `li-${key}-${i}`)}</li>
          ))}
        </ul>,
      );
      list = [];
    }
  };
  const flushPara = () => {
    if (para.length) {
      const text = para.join(' ');
      blocks.push(
        <p key={`p-${key++}`} className="mb-4 leading-relaxed text-ink/80">
          {inline(text, `p-${key}`)}
        </p>,
      );
      para = [];
    }
  };

  for (const raw of lines) {
    const line = raw.trimEnd();
    if (line.startsWith('### ')) {
      flushList();
      flushPara();
      blocks.push(
        <h3 key={`h3-${key++}`} className="mt-6 mb-2 text-lg font-bold">
          {inline(line.slice(4), `h3-${key}`)}
        </h3>,
      );
    } else if (line.startsWith('## ')) {
      flushList();
      flushPara();
      blocks.push(
        <h2 key={`h2-${key++}`} className="mt-8 mb-3 text-2xl font-bold">
          {inline(line.slice(3), `h2-${key}`)}
        </h2>,
      );
    } else if (/^[-*]\s+/.test(line)) {
      flushPara();
      list.push(line.replace(/^[-*]\s+/, ''));
    } else if (line.trim() === '') {
      flushList();
      flushPara();
    } else {
      flushList();
      para.push(line);
    }
  }
  flushList();
  flushPara();

  return <Fragment>{blocks}</Fragment>;
}
