<template>
  <div class="bg-white group">
    <div v-for="(item,index) in trueFalseQuestions" :key="item.id" class="groupItem">
      <PreviewTrueFalse :trueFalseQuestion="item" :index="index" :lookWrong="lookWrong" @doAnswer="doAnswer"/>
    </div>
    <div v-if="trueFalseQuestions.length>0" class="nextGroup box-v-center" @click="nextGroup">
      <div>下一部分 <i class="el-icon-d-arrow-right font-bold"/></div>
    </div>
  </div>
</template>

<script>
  import PreviewTrueFalse from '@/components/PreviewTrueFalse'

  export default {
    name: 'PreviewTrueFalseList',
    components: { PreviewTrueFalse },
    props: {
      trueFalseQuestions: {
        type: Array,
        default: null
      },
      lookWrong: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      doAnswer(data) {
        this.$emit('doAnswer', data)
      },
      nextGroup() {
        this.$emit('nextGroup', 4)
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
