import { Element, htmlToDOM, type DOMNode } from 'html-react-parser';

export function headingText(node: DOMNode): string {
  if (node.type === 'text') return node.data;
  return 'children' in node ? (node.children as DOMNode[]).map(headingText).join('') : '';
}

export function headingId(node: Element): string {
  return node.attribs.id || headingText(node).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export function articleHeadings(content: string) {
  const result: { id: string; text: string; level: number }[] = [];
  function visit(nodes: DOMNode[]) {
    for (const node of nodes) {
      if (!(node instanceof Element)) continue;
      if (/^h[2-4]$/.test(node.name)) {
        const text = headingText(node).trim();
        if (text) result.push({ id: headingId(node), text, level: Number(node.name[1]) });
      }
      visit(node.children as DOMNode[]);
    }
  }
  visit(htmlToDOM(content));
  return result;
}
