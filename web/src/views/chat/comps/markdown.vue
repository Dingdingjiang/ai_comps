<template>
  <div ref="markdown-container" class="markdown-container">
    <div :class="`markdown-content ${'markdown-theme-' + theme}`" v-html="html"  v-copy-code>
    </div>
  </div>
</template>

<script>
import { Marked } from 'marked'
import hljs from 'highlight.js';
import DOMPurify from 'dompurify';
import { markedHighlight } from "marked-highlight";

const postprocess = function (code) {
  return DOMPurify.sanitize(code)
}

const marked = new Marked(
  markedHighlight({
    emptyLangClass: 'hljs',
    langPrefix: 'hljs language-',
    highlight(code, lang) {
      const language = hljs.getLanguage(lang) ? lang : 'plaintext';
      return hljs.highlight(code, { language }).value;
    }
  })
);
// 代码块增加复制按钮
const renderer = {
  code({text, lang}) {
    return `<div class='code-block'><div class="code-header"><span class="code-lang">${lang}</span><span class="copy-code">copy</span></div><div class='code-content'><pre style="margin: 0px"><code class="hljs language-${lang}">${text}</code></pre></div></div>` }
};

marked.use({ hooks: { postprocess } , renderer });

export default {
  components: {},
  name: 'MarkdownBox',
  props: {
    initValue: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      html: ''
    }
  },
  watch: {
    initValue:{
      handler(newValue, oldValue){
        this.$nextTick(()=>{
          if(newValue){
            this.html = this.translateMarkdown(newValue+(oldValue || ''))
          }
        })
      },
      immediate: true
    }
  },
  created() {

  },
  mounted() {
  },
  methods: {
    translateMarkdown(markdTxt) {
      if(!markdTxt){ return markdTxt }
      return marked.parse(markdTxt)
    }
  }
}
</script>

<style lang='scss' scoped>
.markdown-container {
  position: relative;
  padding-top: 10px;

  &:hover {
    .option_bar {
      .copy_btn {
        visibility: visible;
      }
    }
  }
}

.option_bar {
  position: absolute;
  top: 0;
  right: 0;
  background-color: transparent;
  display: flex;
  justify-items: end;

  &:hover {
    cursor: pointer;
  }

  .copy_btn {
    font-size: 12px;
    visibility: hidden;

    &:hover {
      color: blue;
    }
  }
}

.markdown-content {
  white-space: pre-wrap;
  -webkit-box: inline-block;
  text-align: left;
}

</style>
<style lang="scss">
.code-block{
  display: flex;
  flex-direction: column;
  position: relative;
  border-radius: 8px;
  height: fit-content;
  .code-header{
    display: flex;
    justify-content: space-between;
    width: calc(100% - 10px);
    font-size: 12px;
    padding: 5px;
    background-color: #24262b;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
  }
  .code-content{
    code{
      border-bottom-left-radius: 8px;
      border-bottom-right-radius: 8px;
    }
  }
  .code-lang{
    color: #FFF;
  }
  .copy-code {
    color: red;
    &:hover{
      color: blue;
      cursor: pointer;
    }
  }
}
</style>
