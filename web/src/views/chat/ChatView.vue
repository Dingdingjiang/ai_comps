<template>
  <div class="chat-view-container">
    <div class="body">
      <!-- {{ msg }} -->
      <div :class="`acc_type-${item.type}`" v-for="(item, inx) in msgArr" :key="item.msg + inx">
        <div class="msg-content" :class="item.type">
          <span class="title">{{ item.type }}</span>
          <span class="msg">
            <template v-if="item.status === 'loading'">
              loading...
            </template>
            <template v-else>
              {{ item.msg }}
            </template>
          </span>
        </div>
      </div>
    </div>
    <div class="footer">
      <el-input v-model="input" placeholder="请输入内容" style="margin-bottom: 10px;"></el-input>
      <el-button @click="submitHandle">提交</el-button>
    </div>
  </div>
</template>

<script>

export default {
  components: {},
  data () {
    return {
      msg: '',
      msgArr: [
        {
          type: 'user',
          msg: 'hello',
        },
        {
          type: 'assist',
          msg: 'Hello, how can I help you?'
        },
      ],
      input: '', // added input property
      accountInfo: {
        assist: {
          name: 'assist',
        },
        user: {
          name: 'user',
        }
      }
    }
  },
  computed: {},
  watch: {},
  created () {

  },
  mounted () {

  },
  methods: {
    submitHandle(){
      let source = new this.$sse('http://localhost:3000/sse', {
        headers: {
          'Content-Type': 'application/json'
        },
        methods: 'POST',
        payload: JSON.stringify({
          msg: this.input
        })  
      })

      if(this.input) {
        this.msgArr.push({
          type: 'user',
          msg: this.input
        })
      }

      source.addEventListener('message', (e) => {
        let payload = JSON.parse(e.data)
        if(payload && payload.state === "done") {
          source.close()
          return
        }

        this.$nextTick(()=>{
          const lastMsg = this.msgArr[this.msgArr.length - 1]
          this.$set(lastMsg, 'msg', (lastMsg.msg || '') + payload.msg)
          this.$set(lastMsg, 'status', payload.state)
        })
      })

      source.addEventListener("open", (e) => {
        console.log("Connection was opened", e)
        const lastMsg = this.msgArr[this.msgArr.length - 1]
        if(lastMsg.type === 'user'){
          this.msgArr.push({
              type: 'assist',
              msg: '',
              status: 'loading'
            })
        }
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
        }
      }
    });
    source.stream();
    },
  }
}
</script>

<style lang='scss' scoped>
.chat-view-container {
  display: flex;
  flex-direction: column;
  height: 80%;
  width: 80%;
  margin: auto;
  .body {
    display: flex;
    overflow-y: auto;
    border: 1px solid #ccc;
    padding: 10px;
    min-height: 200px;
    flex-direction: column;
    margin-bottom: 20px;
  }
  .footer{
  }
}

.acc_type-assist {
  .msg-content .msg{
    background-color: #f0f0f0;
    padding: 10px;
    margin: 10px 0;
    border-radius: 5px;  
  }
  width: 30%;
  align-self: flex-start;
}

.acc_type-user {
  .msg-content .msg{
    background-color: #ccc;
    padding: 10px;
    margin: 10px 0;
    border-radius: 5px;  
  }
  width: 30%;
  align-self: flex-end;
}

.msg-content.assist{
  display: flex;
  flex-direction: column;
  align-items: start;
}
.msg-content.user{
  display: flex;
  flex-direction: column;
  align-items: end;
  .msg{
    align-self: end;
  }
}
</style>
