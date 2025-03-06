<template>
  <div class="chat-view-container">
    <div class="body">
      <div class="msg-content" ref="msgContentRef">
        <div :class="`acc_type-${item.type}`" v-for="(item, inx) in msgArr" :key="item.msg + inx">
          <div :class="item.type">
            <span class="title">{{ item.type }}</span>
            <span class="msg">
              <template v-if="item.status === 'loading'">
                loading...
              </template>
              <template v-else>
                <!-- {{ item.msg }} -->
                <chatContant :content="item.msg"></chatContant>
              </template>
              <template v-if="item.type === 'assist' && item.status === 'incomplete'">
                <i class="el-icon-loading"></i>
              </template>
            </span>
            <span class="msg-option">
              <i class="el-icon-copy-document"></i>
              <i class="el-icon-caret-top"></i>
              <i class="el-icon-caret-bottom"></i>
              <i class="el-icon-refresh"></i>
              <el-popconfirm title="确定删除该对话吗？" @confirm="msgDeleteHandle(item, inx)" >
              <i slot="reference" class="el-icon-delete"></i>
              </el-popconfirm>
            </span>
            <span class="msg-hits" v-if="isShowHits" v-show="item.type === 'assist' && inx === msgLength - 1">
              <template name="hits" :item="hitItem">
                <div class="hit-item" :key="hitItem.id+inx" v-for="(hitItem, inx) in hits" @click="hitClickHandle(hitItem)">
                  <div class="hit-item_content">
                    {{hitItem.content}}
                  </div>
                  <div class="hit-item_arrow">
                    <i class="el-icon-right"></i>
                  </div>
                </div>
              </template>
            </span>
          </div>
        </div>
      </div>
      <div class="scroll-btn" v-if="isShowScrollBtn && !isAtBottom" @click="scrollToBottom">
        <i class="el-icon-caret-bottom"></i>
      </div>
      <div class="stop-generate-btn" v-if="isShowStopGenerate && lastChat.status === 'incomplete'">
        <i class="el-icon-video-pause"  @click="msgStopGenerateHandle"></i>
      </div>
    </div>
    <div class="footer">
      <div class="delete-btn" v-if="isShowClearChat">
        <el-popconfirm title="确定清空整个对话吗？" @confirm="msgClearHandle" >
          <i slot="reference" class="el-icon-delete"></i>
        </el-popconfirm>
      </div>

      <div class="input-container">
        <slot name="customInput">
          <el-upload action="https://jsonplaceholder.typicode.com/posts/">
            <div class="upload-btn"> <i class="el-icon-link"></i> </div>
          </el-upload>
          <el-input type="textarea" :autosize="{ minRows: 1, maxRows: 4}" @keyup.shift.enter.exact.native="hotKeyHandle('shiftEnter', $event)" @keyup.enter.exact.native="hotKeyHandle('enter', $event)" v-model="input" placeholder="请输入内容" style="margin-bottom: 10px;" >
          </el-input>
          <div :class="{'btn_disable': sumbitDisable}" class="submit-btn" >
            <i class="el-icon-smoking" @click="submitHandle" ></i> 
          </div>
        </slot>
      </div>
    </div>
<!-- <chatContant></chatContant> -->

  </div>
</template>

<script>
import chatContant from './comps/chatContant.vue'

export default {
  components: {chatContant},
  props: {
    chats: {
      type: Array,
      default: () => []
    },
    roleConfig: {
      type: Object,
      default: () => ({
        assist: {
          name: 'assist',
          avatar: '',
          color: 'green'
        },
        user: {
          name: 'user',
          avatar: '',
          color: 'grey'
        },
        system: {
          name: 'system',
          avatar: '',
          color: 'blue'
        }
      })  
    },
    inputBoxCls: {
      type: String,
      default: ''
    },
    inputBoxStyle: {
      type: Object,
      default: () => ({})
    },
    sendHotKey: {
      type: String, 
      default: 'enter'
    },
    markdownRenderProps: {
      type: Object,
      default: () => ({})
    },
    hits: {
      type: Array,
      default: ()=> ([])
    },
    isShowHits: {
      type: Boolean,
      default: true
    },
    isShowClearChat: {
      type: Boolean,
      default: true
    },
    isShowStopGenerate: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      msg: '',
      input: '', // added input property
      accountInfo: {
        assist: {
          name: 'assist',
        },
        user: {
          name: 'user',
        }
      },
      isAtBottom: false,
      isShowScrollBtn: false,
    }
  },
  computed: {
    msgArr:{
      get(){
        return this.chats
      },
      set(val){
        this.$emit('update:chats', val)
      }
    },
    msgLength() {
      return this.msgArr.length
    },
    sumbitDisable() {
      return this.input.trim() === ''
    },
    lastChat(){
      return this.chats[this.chats.length - 1] || {}
    }
  },
  watch: {},
  created () {

  },
  mounted () {
    this.setScroolHandle()
  },
  beforeDestroy(){
    this.unsetScroolHandle()
  },  
  methods: {
    scrollToBottom() {
      const scrollContainer = this.$refs.msgContentRef;
      const scrollHeight = scrollContainer.scrollHeight;
      scrollContainer.scrollTo({ top: scrollHeight, behavior: 'smooth' });
    },
    scrollHandle() {
      const scrollContainer = this.$refs.msgContentRef;
      const scrollTop = scrollContainer.scrollTop;
      const clientHeight = scrollContainer.clientHeight;
      const scrollHeight = scrollContainer.scrollHeight;
      // const offsetHeight = scrollContainer.offsetHeight;

      // 判断是否滚动到底部
      this.isAtBottom = (scrollTop + clientHeight) >= (scrollHeight-10); // 10 为误差值

      // 判断是否显示“返回底部”按钮
      this.isShowScrollBtn = scrollTop >= 0; // 滚动超过 100px 时显示
    },
    setScroolHandle(){
      this.$nextTick(()=>{
        this.$refs.msgContentRef.addEventListener('scroll', this.scrollHandle)
      })
    },
    unsetScroolHandle(){
      this.$refs.msgContentRef.removeEventListener('scroll', this.scrollHandle)
    },
    submitHandle(){
      if(this.input.trim() === '') return
      this.$emit('msgSend', this.input)
      this.input = ''
      this.$nextTick(()=>{
        this.scrollToBottom()
      })
    },

    msgCopyHandle() {
      console.log('msgCopyHandle');
      this.$emit('msgCopyHandle')
    },
    msgDeleteHandle(item, inx) {
      console.log('msgDeleteHandle');
      this.msgArr.splice(inx, 1)
      this.$emit('msgDeleteHandle')
    },
    msgRefreshHandle() {
      console.log('msgRefreshHandle');
      this.$emit('msgRefreshHandle')
    },
    msgLikeHandle() {
      console.log('msgLikeHandle');
      this.$emit('msgLikeHandle')
    },
    msgDislikeHandle() {
      console.log('msgDislikeHandle');
      this.$emit('msgDislikeHandle')
    },
    msgClearHandle() {
      this.$nextTick(()=>{
        this.msgArr.splice(0, this.msgArr.length)
      })
      console.log('msgClearHandle');
      this.$emit('msgClearHandle')
    },
    msgStopGenerateHandle() {
      console.log('msgStopGenerateHandle');
      this.$emit('msgStopGenerateHandle')
    }, 
    hitClickHandle(item) {
      console.log('hitClickHandle');
      this.$emit('hitClickHandle', item)
    },
    hotKeyHandle(type) {
      if(this.lastChat.status && ['loading', 'incomplete'].includes(this.lastChat.status)) {return}

      if(type === 'enter') {
        this.submitHandle()
      }else if(type === 'shiftEnter') {
        // this.input += '\n'
      }

    },
  }
}
</script>

<style lang='scss' scoped>
.chat-view-container {
  display: flex;
  flex-direction: column;
  height: 700px;
  width: 80%;
  margin: auto;
  .body {
    display: flex;
    border: 1px solid #ccc;
    min-height: 200px;
    flex-direction: column;
    margin-bottom: 20px;
    overflow: hidden;
    position: relative;

    .msg-content{
      display: flex;
      flex-direction: column;
      overflow-y: auto;
      height: 100%;
      padding: 10px;
      
      .msg-option{
        display: flex;
        column-gap: 10px;
        visibility: hidden;
      }

      .assist{
        display: flex;
        flex-direction: column;
        align-items: start;
      }
      .user{
        display: flex;
        flex-direction: column;
        align-items: end;
        .msg{
          align-self: end;
        }
      }

      .assist, .user{
        &:hover{
          .msg-option{
            visibility: visible;
            i{
              &:hover{
                cursor: pointer;
              }
            }
          }
        }
      } 
    }
  }
}

.acc_type-assist {
  .msg{
    background-color: #f0f0f0;
    padding: 10px;
    margin: 10px 0;
    border-radius: 5px;  
  }
  width: 30%;
  align-self: flex-start;
}

.acc_type-user {
  .msg{
    background-color: #ccc;
    padding: 10px;
    margin: 10px 0;
    border-radius: 5px;  
  }
  width: 30%;
  align-self: flex-end;
}



.upload-btn{
  width: 30px;
  height: 40px;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: start;
  :hover{
    cursor: pointer;
  }
}
.submit-btn{
  width: 30px;
  height: 40px;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: end;
  color: #1890ff;
  &:hover{
    cursor: pointer;
  }
}
.submit-btn.btn_disable {
  color: #ccc;
  &:hover {
    cursor: not-allowed;
  }
}

.scroll-btn{
  position: absolute;
  bottom: 5px;
  left: 50%;
  width: 30px;
  height: 30px;
  border: 1px solid #ccc; 
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #FFF;
  :hover{
    cursor: pointer;
  }
}

.stop-generate-btn{
  position: absolute;
  bottom: 5px;
  left: 40%;
  width: 30px;
  height: 30px;
  border: 1px solid #ccc; 
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #FFF;
  :hover{
    cursor: pointer;
  }
}

.footer {
  display: flex;
  // row-gap: 10px;
  .input-container{
    display: flex;
    flex: 1;
    .el-input{
      margin-bottom: 10px;
    }  
  }
  .delete-btn{
    height: 40px;
    width: 30px;
    font-size: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    &:hover{
      cursor: pointer;
    }
  }
}

.msg-hits {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  justify-items: start;
  row-gap: 10px;
  font-size: 12px;
  .hit-item {
    display: flex;
    column-gap: 20px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    width: fit-content;
    .hit-item_content {
      display: flex;
      align-items: center;
    }
    .hit-item_arrow {
      display: flex;
      align-items: center;
    }
    &:hover {
      cursor: pointer;
      background-color: #f0f0f0;
    }
  }
}



</style>
