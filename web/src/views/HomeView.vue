<template>
  <div class="home">
    <Chat :chats="msgArr" :hits="msgHits" @msgSend="submitHandle" @msgStopGenerateHandle="msgStopGenerateHandle" @hitClickHandle="hitClickHandle"></Chat>
  </div>
</template>

<script>
// @ is an alias to /src
import Chat from '@/views/chat/ChatView.vue';

export default {
  name: 'HomeView',
  components: {
    Chat
  },
  data() {
    return {
      msgArr: [
        {
          type: 'assist',
          role: 'assist',
          msg: 'Hello, how can I help you?',
          content: 'Hello, how can I help you?',
          status: 'complete'
        },
        {
          type: 'user',
          role: 'user',
          msg: 'hello',
          content: 'hello',
          status: 'complete'
        },
        {
          type: 'assist',
          role: 'assist',
          msg: `以下是一个 Semi 代码的使用示例：\n\`\`\`jsx \nimport React from 'react';\nimport { Button } from '@douyinfe/semi-ui';\n\nconst MyComponent = () => {\n  return (\n    <Button>Click me</Button>\n );\n};\nexport default MyComponent;\n\`\`\`\n`,
          content: `以下是一个 Semi 代码的使用示例：\`\`\`jsx \nimport React from 'react';\nimport { Button } from '@douyinfe/semi-ui';\n\nconst MyComponent = () => {\n  return (\n    <Button>Click me</Button>\n );\n};\nexport default MyComponent;\n\`\`\`\n`,
          status: 'complete'
        }
      ],
      msgHits: [
        {id:1, content: "告诉我更多",},
        {id:2, content: "Semi Design 的组件有哪些？",},
        {id:3, content: "我能够通过 DSM 定制自己的主题吗？",}
      ],
      source: null
    };
  },
  methods: {
    addChat(chat) {
      this.chats.push(chat);
    },
    submitHandle(input) {
      this.source = new this.$sse('http://localhost:3000/sse', {
        headers: {
          'Content-Type': 'application/json'
        },
        methods: 'POST',
        payload: JSON.stringify({
          msg: input,
          content: input
        })  
      })

      const source = this.source

      if(input) {
        this.msgArr.push({
          type: 'user',
          msg: input,
          content: input
        })
      }else{
        return
      }

      source.addEventListener('message', (e) => {
        const lastMsg = this.msgArr[this.msgArr.length - 1]
        if(e.data === '[DONE]') {
          source.close()
          this.$set(lastMsg, 'status', 'complete')
          return
        }

        let payload = JSON.parse(e.data)

        this.$nextTick(()=>{
          this.$set(lastMsg, 'msg', (lastMsg.msg || '') + payload.msg)
          this.$set(lastMsg, 'status', 'incomplete')
        })
      })

      source.addEventListener("open", () => {
        this.msgArr.push({
            type: 'assist',
            msg: '',
            status: 'loading'
          })
      });

      source.addEventListener("error", (e) => {
        console.log("Error", e)
      });

      source.addEventListener("abort", (e) => {
        console.log("Connection was aborted", e)
      });

      source.addEventListener("readystatechange", (e) => {
        if (e.readyState >= 2) {
        if (source.status === undefined) {
          source.close();
          this.$set(this.msgArr[this.msgArr.length - 1], 'status', 'complete')
        }
      }
    });
    source.stream();
    },
    msgStopGenerateHandle() {
      this.source.close()
      this.$set(this.msgArr[this.msgArr.length - 1], 'status', 'complete')
    },
    hitClickHandle({id, content}){
      this.$notify({title: id, message: content})
    }
  },
}
</script>
