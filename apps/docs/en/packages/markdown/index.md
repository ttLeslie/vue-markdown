# Markdown Component

This is a `Vue3` component based on `markdownIt`, specifically designed for rendering `markdown` content in front - end application scenarios of large models. It perfectly supports **incremental rendering & implementation of interactive components**.

## Basic Usage

In basic usage, the component will render all standard `markdown` syntax by default, including headings, text styles, lists, links, images, tables, code blocks, formulas, etc.

<demo vue="markdown/enbasic.vue"  />

## Customize General Code Blocks

The `code` slot can be used to customize the rendering of all code blocks, and it supports obtaining the code language (`lang`) and the original code (`rawCode`).

<demo vue="markdown/enbasicCode.vue" />

For relevant code block styles, you can refer to [highlight.js](https://highlightjs.org/) or [shiki](https://shiki.tmrs.site/).

## Customize Special Code Blocks

For special types of code blocks (such as mermaid flowcharts), you can use the slot matched by the language name (such as `#mermaid`) to customize the rendering logic separately.

<demo vue="markdown/enbasicMermaid.vue" />

### Mermaid Component Example

```vue
<script lang="ts" setup>
import { throttle } from 'es-toolkit/compat';
import mermaid from 'mermaid';
import { nextTick, ref, useId, watch } from 'vue';

const props = defineProps({
  content: {
    type: String,
    default: '',
  },
  dev: {
    type: Boolean,
    default: false,
  },
});
const domId1 = useId();
const domId2 = useId();
const currentDomId = ref(domId1);
function toggleDomId() {
  const oId = currentDomId.value;
  const oDom = document.getElementById(oId);
  currentDomId.value = oId === domId1 ? domId2 : domId1;
  if (oDom) {
    oDom.innerHTML = '';
  }
}

const htmlString = ref('');

const throttledRender = throttle(render, 400);

watch(
  () => props.content,
  async () => {
    await nextTick();
    throttledRender();
  },
  { immediate: true },
);

function render() {
  mermaid
    .render(currentDomId.value, props.content)
    .then(({ svg, bindFunctions }) => {
      htmlString.value = svg;
      const dom = document.getElementById(currentDomId.value);
      dom && bindFunctions?.(dom);
      toggleDomId();
    })
    .catch(() => {
      props.dev && console.error('Mermaid render error:', props.content);
    });
}
</script>
<template>
  <div class="">
    <div :id="domId1" />
    <div :id="domId2" />
    <div class="template-mermaid" v-html="htmlString" />
  </div>
</template>

<style>
/* Hide the pop - up window when Mermaid has an error */
body > [id^='dv-'] svg {
  position: fixed;
  top: 0;
  left: -9999px;
}
</style>
```

## Customize In - line Interactive Components

The `htmlInline` slot can be used to capture in - line `HTML` tagName (such as `span`) in `markdown` and customize the interactive logic based on the tag attributes (`attrs`). This is suitable for implementing functions such as reference annotations and dynamic prompts.

<demo vue="markdown/enbasicInline.vue"  />

## Customize Block - level Interactive Components

The `htmlBlock` slot can be used to handle block - level `HTML` tagName (such as `div`). By combining the tag attributes, complex block - level interactive components can be implemented, such as custom cards with titles and metadata.

<demo vue="markdown/enbasicBlock.vue"  />

## Customize Image Components

The `image` slot can be used to customize the image rendering method. It supports obtaining the image address (`src`), alternative text (`alt`), and title (`title`), and can be extended to implement functions such as image preview and lazy loading.

<demo vue="markdown/enbasicImage.vue" />

## Hyperlink Click Event

The `link - click` event can be used to capture the clicked hyperlink. The event parameters are the click event object, the link address, and the link text.

<demo vue="markdown/enbasicLink.vue" />

## API Documentation

### Props

| Parameter Name | Type      | Default Value | Description                                                                                                                                                                  |
| -------------- | --------- | ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| content        | `string`  | `''`          | Required. The markdown text to be rendered.                                                                                                                                  |
| mdOptions      | `Object`  | `{}`          | Optional. Configuration options for markdown - it. See [markdown - it documentation](https://markdown-it.github.io/markdown-it/) for details.                                |
| href           | `boolean` | `false`       | Optional. Whether to enable hyperlink parsing to the `href` attribute. By default, it is not parsed, and click information can be obtained through the `link - click` event. |
| sanitize       | `boolean` | `false`       | Optional. Whether to enable HTML content sanitization (to prevent XSS attacks, depends on `dompurify`).                                                                      |

### Events

| Event Name   | Description                                  | Callback Parameters                                   |
| ------------ | -------------------------------------------- | ----------------------------------------------------- |
| link - click | Triggered when a link in markdown is clicked | `(e: MouseEvent, href: string, text: string) => void` |

### Slots

The component provides flexible custom rendering capabilities through slots. The slot priority is: language - named slot (such as `#mermaid`) > general - type slot (such as `#code`) > default rendering.

| Slot Name  | Description                                                           | Slot Parameters                                                                                        |
| ---------- | --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| code       | General code block slot                                               | `{ lang: string; rawCode: string }`                                                                    |
| [lang]     | Specific language code block slot (such as `#javascript`, `#mermaid`) | `{ lang: string; rawCode: string }`                                                                    |
| image      | Image rendering slot                                                  | `{ src: string; alt: string; title: string }`                                                          |
| text       | Text content slot                                                     | `{ content: string }`                                                                                  |
| emoji      | Emoji rendering slot                                                  | `{ content: string }`                                                                                  |
| htmlInline | In - line HTML tag slot                                               | `{ originalContent: string; content: string; tagName: string; attrs: Array<{[key: string]: string}> }` |
| htmlBlock  | Block - level HTML tag slot                                           | `{ originalContent: string; content: string; tagName: string; attrs: Array<{[key: string]: string}> }` |
| mathInline | In - line formula slot                                                | `{ content: string }`                                                                                  |
| mathBlock  | Block - level formula slot                                            | `{ content: string }`                                                                                  |

## Precautions

1. **Security**: When rendering markdown content entered by users, it is recommended to enable `sanitize: true` to prevent XSS attacks (based on `dompurify`).
2. **Formula Support**: The `katex` plugin is integrated by default to support mathematical formulas. If you need to customize the formula style, it can be achieved through the `mathInline` and `mathBlock` slots.
3. **Extended Configuration**: The `mdOptions` can be used to extend the functions of markdown - it, such as adding custom plugins or modifying parsing rules.
4. **Slot Priority**: Specific language slots (such as `#mermaid`) have a higher priority than the general `#code` slot to ensure that special scenarios are processed first.
