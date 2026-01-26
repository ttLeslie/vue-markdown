<script lang="ts">
import { type VNode, defineComponent, h } from 'vue';
import MarkdownIt, { type Options } from 'markdown-it';
import { katex } from '@mdit/plugin-katex';
import { full as emoji } from 'markdown-it-emoji';
import { getCompontentTree } from './tokens-to-tree';
import createVNode from './createVNode';

const MarkdownRenderer = defineComponent({
  name: 'MarkdownRenderer',
  emit: ['link-click'],
  props: {
    content: {
      type: String,
      default: '',
      required: true,
    },
    mdOptions: {
      type: Object as () => Options,
      default: () => ({}),
      required: false,
    },
    href: {
      type: Boolean,
      default: false,
      required: false,
    },
    sanitize: {
      type: Boolean,
      default: false,
      required: false,
    },
    inlineTags: {
      type: Array as () => string[],
      default: () => [],
      required: false,
    },
  },
  setup(props, { emit, slots }) {
    return (): VNode => {
      const mdIt = getMarkdownItInstance(props.mdOptions);
      const tree = getCompontentTree(props.content, mdIt);

      const vNodes = tree.map((node, index) => {
        return createVNode(
          node,
          index,
          mdIt,
          slots,
          props.sanitize,
          props.href,
          props.inlineTags,
          [],
        );
      });

      return h(
        'div',
        {
          class: 'markdown-body',
          onClick: (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (target.tagName === 'A') {
              const anchor = target as HTMLAnchorElement;
              emit('link-click', e, anchor.dataset.href, anchor.title);
            }
          },
        },
        vNodes,
      );
    };
  },
});

const getMarkdownItInstance = (options: Options) => {
  const markdownParser = MarkdownIt({
    ...options,
  })
    .use(katex)
    .use(emoji);
  return markdownParser;
};
export default MarkdownRenderer;
</script>
<style scoped></style>
