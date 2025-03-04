<template>
  <div ref="markdown-container">
    <div class="option_bar">
      <span @click="copyCodeHandle">{{ copyBtnText }}</span>
    </div>
    <div :class="`markdown-content ${'markdown-theme-' + theme}`">
       <span v-html="html"> </span>
       <p>以下是一个 Semi 代码的使用示例：</p>
<pre><code class="hljs language-jsx"><span class="hljs-keyword">import</span> <span class="hljs-title class_">React</span> <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;react&#x27;</span>;
<span class="hljs-keyword">import</span> { <span class="hljs-title class_">Button</span> } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;@douyinfe/semi-ui&#x27;</span>;

<span class="hljs-keyword">const</span> <span class="hljs-title function_">MyComponent</span> = (<span class="hljs-params"></span>) =&gt; {
  <span class="hljs-keyword">return</span> (
    <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">Button</span>&gt;</span>Click me<span class="hljs-tag">&lt;/<span class="hljs-name">Button</span>&gt;</span></span>
 );
};
<span class="hljs-keyword">export</span> <span class="hljs-keyword">default</span> <span class="hljs-title class_">MyComponent</span>;
</code></pre>
    </div>
  </div>
</template>

<script>
const {Marked} = require('marked')
import hljs from 'highlight.js';
import { markedHighlight } from "marked-highlight";
import sanitizeHtml from 'sanitize-html';
const marked = new Marked(
  markedHighlight({
	emptyLangClass: 'hljs',
    langPrefix: 'hljs language-',
    highlight(code, lang, info) {
      const language = hljs.getLanguage(lang) ? lang : 'plaintext';
      return hljs.highlightAuto(code).value;
    }
  })
);

export default {
  components: {},
  name: 'markdownBox',
  props: {
    initValue: {
      type: String,
      default: ''
    },
    markedOptions: {
      default: ()=>({})
    },
    theme: {
      type: String,
      default: 'light'
    },
    copyCode: {
      type: Boolean,
      default: true
    },
    copyBtnText: {
      type: String,
      default: 'Copy'
    }
  },
  data () {
    return {
      html: ''
    }
  },
  computed: {},
  watch: {
    initValue() {
      this.translateMarkdown()
    }
  },
  created () {

  },
  mounted () {
    this.translateMarkdown()
  },
  methods: {
    translateMarkdown(){
      let html = marked.parse(this.initValue)
                // if (this.copyCode) {
                //     html = html.replace(/<pre>/g, '<div class="code-block"><span class="copy-code">' + this.copyBtnText + '</span><pre>').replace(/<\/pre>/g, '</pre></div>');
                // }
                this.html = hljs.highlightAuto(html).value;
                // this.html = sanitizeHtml(html)
    },
    copyCodeHandle(code) {
      console.log('copyCode', this.initialValue);
      this.$emit('copy', this.initValue)
    }
  }
}
</script>

<style lang='scss' scoped>
.markdown-container{
  position: relative;
}
.option_bar{
  position: absolute;
  top: 0;
  background-color: transparent;
  display: flex;
  justify-items: end;
  &:hover{
    cursor: pointer;
  }
}

.markdown-content {
  white-space: pre-wrap;
  -webkit-box: inline-block;
  text-align: left;
}
</style>
