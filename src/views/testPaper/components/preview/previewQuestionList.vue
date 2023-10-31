<template>
  <div class="bg-white group">
    <div v-for="(item,index) in questionQuestions" :key="item.id" class="groupItem">
      <PreviewQuestion :questionQuestion="item" :index="index" :lookWrong="lookWrong" :isMark="isMark" @doAnswer="doAnswer" @markScore="markScore"/>
    </div>
    <div v-if="isMark" class="nextGroup box-v-center">
      <div @click="doMark">确认打分</div>
    </div>
  </div>
</template>

<script>
  import PreviewQuestion from '@/components/PreviewQuestion'

  export default {
    name: 'PreviewQuestionList',
    components: { PreviewQuestion },
    props: {
      questionQuestions: {
        type: Array,
        default: null
      },
      lookWrong: {
        type: Boolean,
        default: false
      },
      isMark: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      doAnswer(data) {
        this.$emit('doAnswer', data)
      },
      markScore(data) {
        this.$emit('markScore', data)
      },
      doMark() {
        this.$emit('doMark')
      }
    }
  }
</script>

<style scoped>
  .group {
    padding: 0px 22px 20px 22px
  }

  .nextGroup {
    width: 156px;
    height: 43px;
    background: rgba(61, 83, 230, 1);
    border-radius: 5px;
    color: white;
    font-weight: bold;
    margin-top: 30px;
    margin-left: 12px;
    cursor: pointer;
  }

  .groupItem {
    padding: 36px 50px 16px 21px;
    border-bottom: 1px solid #EAEAEA
  }
</style>
