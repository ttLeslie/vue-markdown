import { Fragment, type Slots, type VNode, defineAsyncComponent, h } from 'vue';
import type { ExtendedToken, RendererToken, TagAttribute, TagToken } from './types';
import {
  generateClosingTag,
  getAAttribute,
  getHtmlAttribute,
  getImgAttribute,
  identifyBlockTag,
  sanitizeHtml,
} from './utils';
import type MarkdownIt from 'markdown-it';

const processChildren = (
  children: RendererToken[],
  mdIt: MarkdownIt,
  slots: Slots,
  sanitize: boolean,
  href: boolean,
  customInlineTags: string[] = [],
  customBlockTags: string[] = [],
): (VNode | string)[] => {
  return children
    .map((child, index) =>
      createVNode(child, index, mdIt, slots, sanitize, href, customInlineTags, customBlockTags),
    )
    .filter(Boolean) as (VNode | string)[];
};

const handleSlot = (slotName: string, slots: Slots, props: Record<string, any>) => {
  const slot = slots[slotName];
  if (slot) {
    const result = slot(props);
    return Array.isArray(result) ? result[0] : result;
  }
  return null;
};

const handleFenceNode = (
  node: RendererToken,
  index: number,
  ComponentType: string,
  slots: Slots,
) => {
  const lang = ComponentType.split(':')[1] || 'plaintext';
  const rawCode = (node as ExtendedToken)?.content || '';

  const namedSlotResult = handleSlot(lang, slots, { lang, rawCode });
  if (namedSlotResult) return namedSlotResult;

  const codeSlotResult = handleSlot('code', slots, { lang, rawCode });
  if (codeSlotResult) return codeSlotResult;

  return h(
    'div',
    {
      key: index,
      class: `markdown-code-block language-${lang}`,
      'data-lang': lang,
    },
    h('pre', { class: 'pre' }, [h('code', rawCode)]),
  );
};

const handleHtmlLine = (
  node: RendererToken,
  index: number,
  slots: Slots,
  sanitize: boolean,
  customInlineTags: string[] = [],
  customBlockTags: string[] = [],
) => {
  const tagNode = node as TagToken;
  const tagAttrs: TagAttribute[] = [];
  let content = '';

  const { completeTag, isOpenTag, isSelfClosing, tagName } = generateClosingTag(
    tagNode.content || '',
    customInlineTags,
    customBlockTags,
  );

  console.log(completeTag, isOpenTag, isSelfClosing, tagName);

  const defaultRender = h('span', {
    key: index,
    innerHTML: completeTag || '',
    style: { display: 'contents' },
  });

  if (isSelfClosing) return defaultRender;

  if (isOpenTag) {
    try {
      const { content: parsedContent, tagAttrs: parsedTagAttrs } = getHtmlAttribute(
        completeTag,
        tagName,
        false,
        customBlockTags,
      );
      content = parsedContent;
      tagAttrs.push(...parsedTagAttrs);
    } catch (error) {
      console.error('Failed to parse HTML content:', error);
      return defaultRender;
    }

    const slotParams = {
      originalContent: tagNode.content || '',
      content,
      tagName,
      attrs: tagAttrs,
    };
    const slotResult = handleSlot(
      `Html${tagName.charAt(0).toUpperCase()}${tagName.slice(1)}`,
      slots,
      slotParams,
    );

    if (slotResult) {
      return slotResult;
    }
  }

  if (sanitize) {
    return h(
      defineAsyncComponent(() =>
        sanitizeHtml(tagNode.content || '').then((purifiedHtml) =>
          h('span', {
            key: index,
            innerHTML: purifiedHtml,
            style: { display: 'contents' },
          }),
        ),
      ),
    );
  }

  return defaultRender;
};

const handleHtmlBlock = (
  node: RendererToken,
  index: number,
  slots: Slots,
  sanitize: boolean,
  _customInlineTags: string[] = [],
  customBlockTags: string[] = [],
) => {
  const tagNode = node as TagToken;
  const tagAttrs: TagAttribute[] = [];
  let content = '';
  const defaultRender = h('span', {
    key: index,
    innerHTML: tagNode.content || '',
    style: { display: 'contents' },
  });

  try {
    const {
      content: parsedContent,
      tagAttrs: parsedTagAttrs,
      isSelfClosing,
    } = getHtmlAttribute(tagNode.content || '', '', true, customBlockTags);
    if (isSelfClosing) return defaultRender;
    content = parsedContent;
    tagAttrs.push(...parsedTagAttrs);
    const tagName = identifyBlockTag(tagNode.content || '', customBlockTags);

    const slotParams = {
      originalContent: tagNode.content || '',
      content: content,
      tagName,
      attrs: tagAttrs,
    };

    const slotResult = handleSlot(
      'Html' + tagName.charAt(0).toUpperCase() + tagName.slice(1),
      slots,
      slotParams,
    );

    if (slotResult) {
      return slotResult;
    }

    if (sanitize) {
      return h(
        defineAsyncComponent(() =>
          sanitizeHtml(tagNode.content || '').then((purifiedHtml) =>
            h('div', {
              key: index,
              innerHTML: purifiedHtml,
              style: { display: 'contents' },
            }),
          ),
        ),
      );
    }
  } catch (error) {
    console.error('Failed to parse HTML content:', error);
    return defaultRender;
  }

  return defaultRender;
};

export default function createVNode(
  node: RendererToken,
  index: number,
  mdIt: MarkdownIt,
  slots: Slots,
  sanitize: boolean,
  href: boolean,
  customInlineTags: string[] = [],
  customBlockTags: string[] = [],
): VNode | string | null {
  const { ComponentType } = node;

  console.log(node);

  if (!ComponentType) return null;

  if (ComponentType.startsWith('fence:')) {
    return handleFenceNode(node, index, ComponentType, slots);
  }

  switch (ComponentType) {
    case 'text':
      return (
        handleSlot('text', slots, {
          content: (node as ExtendedToken)?.content,
        }) ||
        (node as ExtendedToken)?.content ||
        ''
      );

    case 'emoji':
      return (
        handleSlot('emoji', slots, {
          content: (node as ExtendedToken)?.content,
        }) ||
        (node as ExtendedToken)?.content ||
        ''
      );

    case 'softbreak':
      return h('br', { key: index });

    case 'inline': {
      const children = processChildren(
        (node as TagToken).children,
        mdIt,
        slots,
        sanitize,
        href,
        customInlineTags,
        customBlockTags,
      );
      return h(Fragment, { key: index }, children);
    }

    case 'image': {
      const imgNode = node as ExtendedToken;

      return (
        handleSlot('image', slots, {
          src: getImgAttribute(imgNode, 'src'),
          alt: getImgAttribute(imgNode, 'alt') || node.content,
          title: getImgAttribute(imgNode, 'title'),
        }) ||
        h('img', {
          key: index,
          class: 'markdown-image',
          src: getImgAttribute(imgNode, 'src'),
          alt: getImgAttribute(imgNode, 'alt') || node.content,
          title: getImgAttribute(imgNode, 'title'),
        })
      );
    }
    case 'code_inline':
      return (
        handleSlot('codeInline', slots, {
          content: (node as ExtendedToken)?.content,
        }) ||
        h('code', {
          key: index,
          class: 'code-inline',
          innerHTML: (node as ExtendedToken)?.content || '',
        })
      );

    case 'math_inline': {
      const formula = (node as ExtendedToken)?.content || '';
      const html = mdIt.render(
        `${(node as ExtendedToken).markup}${formula}${(node as ExtendedToken).markup}`,
      );

      if (html.includes('katex-error')) {
        return h('span', {
          key: index,
          class: 'math-default-inline',
        });
      }

      return (
        handleSlot('mathInline', slots, {
          content: (node as ExtendedToken)?.content,
        }) ||
        h('span', {
          key: index,
          class: 'math-inline',
          innerHTML: html,
        })
      );
    }

    case 'math_block': {
      const blockFormula = (node as ExtendedToken)?.content || '';
      const blockHtml = mdIt.render(
        `${(node as ExtendedToken).markup}${blockFormula}${(node as ExtendedToken).markup}`,
      );

      if (blockHtml.includes('katex-error')) {
        return h('div', {
          key: index,
          class: 'math-default-block',
        });
      }

      return (
        handleSlot('mathBlock', slots, {
          content: (node as ExtendedToken)?.content,
        }) ||
        h('div', {
          key: index,
          class: 'math-block',
          innerHTML: blockHtml,
        })
      );
    }

    case 'html_inline': {
      return handleHtmlLine(node, index, slots, sanitize, customInlineTags, customBlockTags);
    }

    case 'html_block': {
      return handleHtmlBlock(node, index, slots, sanitize, customInlineTags, customBlockTags);
    }

    case 'default': {
      const tagNode = node as TagToken;
      const { tag, children } = tagNode;
      const childNodes = processChildren(
        children,
        mdIt,
        slots,
        sanitize,
        href,
        customInlineTags,
        customBlockTags,
      );
      const baseProps: Record<string, string | number> = { key: index, class: `markdown-${tag}` };

      if (tag === 'a') {
        !href && (baseProps.href = 'javascript:void(0)');
        baseProps.title = getAAttribute(tagNode, 'title');
        baseProps['data-href'] = getAAttribute(tagNode, 'href');
      }

      if (tag === 'table') {
        baseProps.class = 'markdown-table-container';
        return h('div', baseProps, [h(tag, { class: 'markdown-table' }, childNodes)]);
      }

      return h(tag, baseProps, childNodes);
    }

    default:
      return null;
  }
}
