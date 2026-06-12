import { ReactNode } from "react";
import Image from "next/image";

/* Renders the markdown subset used by blog posts:
   ## / ### headings, > blockquotes, * lists, ![alt](src) images,
   **bold** and `inline code` spans, plain paragraphs. */

function renderInline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={i}
          className="font-mono text-[0.85em] text-emerald-300 bg-white/5 border border-white/10 rounded-md px-1.5 py-0.5"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

interface Block {
  type: "h2" | "h3" | "quote" | "list" | "image" | "p";
  text?: string;
  items?: string[];
  src?: string;
  alt?: string;
}

function parseBlocks(content: string): Block[] {
  const lines = content.split("\n");
  const blocks: Block[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i].trim();

    if (!line) {
      i++;
      continue;
    }

    if (line.startsWith("## ")) {
      blocks.push({ type: "h2", text: line.slice(3) });
      i++;
    } else if (line.startsWith("### ")) {
      blocks.push({ type: "h3", text: line.slice(4) });
      i++;
    } else if (line.startsWith("> ")) {
      const quote: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith("> ")) {
        quote.push(lines[i].trim().slice(2));
        i++;
      }
      blocks.push({ type: "quote", text: quote.join(" ") });
    } else if (line.startsWith("* ")) {
      const items: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith("* ")) {
        items.push(lines[i].trim().slice(2));
        i++;
      }
      blocks.push({ type: "list", items });
    } else {
      const img = line.match(/^!\[(.*?)\]\((.*?)\)$/);
      if (img) {
        blocks.push({ type: "image", alt: img[1], src: img[2] });
        i++;
      } else {
        blocks.push({ type: "p", text: line });
        i++;
      }
    }
  }

  return blocks;
}

export default function BlogContent({ content }: { content: string }) {
  const blocks = parseBlocks(content);

  return (
    <div className="max-w-none">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "h2":
            return (
              <h2
                key={i}
                className="font-display text-2xl sm:text-3xl font-bold text-white mt-14 mb-5 flex items-baseline gap-3"
              >
                <span className="font-mono text-emerald-400/70 text-lg sm:text-xl select-none">
                  //
                </span>
                <span>{renderInline(block.text!)}</span>
              </h2>
            );
          case "h3":
            return (
              <h3
                key={i}
                className="font-display text-xl sm:text-2xl font-semibold text-white mt-10 mb-4"
              >
                {renderInline(block.text!)}
              </h3>
            );
          case "quote":
            return (
              <blockquote
                key={i}
                className="my-8 border-l-2 border-emerald-400/60 bg-emerald-400/[0.05] rounded-r-2xl px-5 sm:px-7 py-5 text-lg sm:text-xl text-zinc-100 leading-relaxed italic"
              >
                {renderInline(block.text!)}
              </blockquote>
            );
          case "list":
            return (
              <ul key={i} className="my-6 space-y-2.5">
                {block.items!.map((item, j) => (
                  <li key={j} className="flex gap-3 text-zinc-300/90 leading-relaxed">
                    <span className="text-emerald-400/80 font-mono select-none mt-px">
                      ▸
                    </span>
                    <span>{renderInline(item)}</span>
                  </li>
                ))}
              </ul>
            );
          case "image":
            return (
              <figure key={i} className="my-10">
                <div className="rounded-2xl overflow-hidden border border-white/10 bg-white/[0.03]">
                  <Image
                    src={block.src!}
                    alt={block.alt || ""}
                    width={1400}
                    height={900}
                    className="w-full h-auto"
                    sizes="(max-width: 768px) 100vw, 768px"
                  />
                </div>
                {block.alt && (
                  <figcaption className="mt-3 text-center font-mono text-xs text-zinc-500 tracking-wide">
                    {block.alt}
                  </figcaption>
                )}
              </figure>
            );
          default:
            return (
              <p key={i} className="my-5 text-zinc-300/90 text-base sm:text-lg leading-[1.85]">
                {renderInline(block.text!)}
              </p>
            );
        }
      })}
    </div>
  );
}
