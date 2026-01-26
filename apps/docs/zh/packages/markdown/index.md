# 进阶

## 自定义通用的代码块

通过code插槽可自定义所有代码块的渲染方式，支持获取代码语言（`lang`）和原始代码（`rawCode`）。

<demo vue="markdown/basicCode.vue" :vueFiles="{'demo': 'markdown/exbasicCode.vue'}" />

相关的代码块样式可以参考 [highlight.js](https://highlightjs.org/) 或者 [shiki](https://shiki.tmrs.site/)

## 自定义特殊的代码块

对于特殊类型的代码块（如`mermaid`流程图），可通过语言名匹配的插槽（如`#mermaid`）单独自定义渲染逻辑。

<demo vue="markdown/basicMermaid.vue" />

### mermaid组件示例

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
/* 隐藏 Mermaid 错误时的弹窗 */
body > [id^='dv-'] svg {
  position: fixed;
  top: 0;
  left: -9999px;
}
</style>
```

## 自定义行内可交互组件

通过 `HtmlSpan`插槽可捕获 `markdown` 中的行内 `HTML` 标签（如`span`），并基于标签属性（`attrs`）自定义交互逻辑，适用于实现引用标注、动态提示等功能。

<demo vue="markdown/basicInline.vue" :vueFiles="{'demo': 'markdown/exbasicInline.vue'}" />

## 自定义行内标签

通过 `inlineTags` prop 可以添加自定义的行内标签列表。默认情况下，组件内置了一些常见的行内标签（如 `span`、`a`、`strong`、`em`、`br`、`img`、`input`、`label`、`code`、`mark`、`small`、`sup`、`sub`、`q`、`card` 等）。当你需要添加新的自定义行内标签时，可以通过 `inlineTags` prop 传入标签名数组，这些标签会被解析为行内标签，并可以通过对应的插槽（如 `HtmlBadge`、`HtmlTag` 等）进行自定义渲染。

<demo vue="markdown/customInlineTags.vue" />

## 自定义块级可交互组件

通过 `HtmlDiv`插槽可处理块级 `HTML` 标签（如`div`），结合标签属性实现复杂的块级交互组件，例如带标题和元数据的自定义卡片。

<demo vue="markdown/basicBlock.vue" :vueFiles="{'demo': 'markdown/exbasicBlock.vue'}" />

## 自定义图片组件

通过 `image`插槽可自定义图片渲染方式，支持获取图片地址（`src`）、替代文本（`alt`）和标题（`title`），可扩展实现图片预览、懒加载等功能。

<demo vue="markdown/basicImage.vue" />

## 超链接点击事件

通过 `link-click`事件可捕获点击的超链接，事件参数为点击事件对象、链接地址、链接文本。

<demo vue="markdown/basicLink.vue" />

## API 文档

### Props

| 参数名     | 类型       | 默认值  | 说明                                                                                             |
| ---------- | ---------- | ------- | ------------------------------------------------------------------------------------------------ |
| content    | `string`   | `''`    | 必选，需要渲染的 markdown 文本                                                                   |
| mdOptions  | `Object`   | `{}`    | 可选，markdown-it 的配置选项，详见[markdown-it 文档](https://markdown-it.github.io/markdown-it/) |
| href       | `boolean`  | `false` | 可选，是否启用超链接解析到href属性上，默认不解析，可通过`link-click`事件获取点击信息             |
| sanitize   | `boolean`  | `false` | 可选，是否启用 HTML 内容 sanitize（防止 XSS 攻击，依赖`dompurify`）                              |
| inlineTags | `string[]` | `[]`    | 可选，自定义行内标签列表，添加的标签会被解析为行内标签，可通过对应的插槽进行自定义渲染           |

### Events

| 事件名     | 说明                           | 回调参数                                              |
| ---------- | ------------------------------ | ----------------------------------------------------- |
| link-click | 当点击 markdown 中的链接时触发 | `(e: MouseEvent, href: string, text: string) => void` |

### Slots

组件通过插槽提供灵活的自定义渲染能力，插槽优先级为：语言名插槽（如`#mermaid`）> 通用类型插槽（如`#code`）> 默认渲染。

| 插槽名       | 说明                                              | 插槽参数                                                                                               |
| ------------ | ------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| code         | 通用代码块插槽                                    | `{ lang: string; rawCode: string }`                                                                    |
| [lang]       | 特定语言代码块插槽（如`#javascript`、`#mermaid`） | `{ lang: string; rawCode: string }`                                                                    |
| image        | 图片渲染插槽                                      | `{ src: string; alt: string; title: string }`                                                          |
| text         | 文本内容插槽                                      | `{ content: string }`                                                                                  |
| emoji        | 表情渲染插槽                                      | `{ content: string }`                                                                                  |
| Html[inline] | 行内 HTML 标签插槽                                | `{ originalContent: string; content: string; tagName: string; attrs: Array<{[key: string]: string}> }` |
| Html[block]  | 块级 HTML 标签插槽                                | `{ originalContent: string; content: string; tagName: string; attrs: Array<{[key: string]: string}> }` |
| mathInline   | 行内公式插槽                                      | `{ content: string }`                                                                                  |
| mathBlock    | 块级公式插槽                                      | `{ content: string }`                                                                                  |

## 注意事项

1.  **安全性**：当需要渲染用户输入的 markdown 内容时，建议开启`sanitize: true`以防止 XSS 攻击（基于`dompurify`）。
2.  **公式支持**：默认集成`katex`插件支持数学公式，如需自定义公式样式可通过`mathInline`和`mathBlock`插槽实现。
3.  **扩展配置**：通过`mdOptions`可扩展 markdown-it 的功能，例如添加自定义插件或修改解析规则。
4.  **插槽优先级**：特定语言插槽（如`#mermaid`）优先级高于通用`#code`插槽，确保特殊场景优先被处理。
5.  **自定义行内标签**：通过`inlineTags` prop 添加的自定义标签会被解析为行内标签，可以通过对应的插槽（如`HtmlBadge`、`HtmlTag`等）进行自定义渲染。插槽命名规则为：`Html` + 标签名首字母大写（如`badge`对应`HtmlBadge`）。
