<template>
  <div class="W100 H100" style="background-color: #ffffff;min-height: 70%;">
    <div class="questionType box-start">
      <div class="font-bold" style="margin-left: 40px;">试题类型：</div>
      <div :class="{activeItem:typeIndex===1}" class="questionTypeItem box-center" @click="changeTypeItem(1)">单选题</div>
      <div :class="{activeItem:typeIndex===2}" class="questionTypeItem box-center" @click="changeTypeItem(2)">多选题</div>
      <div :class="{activeItem:typeIndex===3}" class="questionTypeItem box-center" @click="changeTypeItem(3)">判断题</div>
      <div :class="{activeItem:typeIndex===4}" class="questionTypeItem box-center" @click="changeTypeItem(4)">填空题</div>
      <div :class="{activeItem:typeIndex===5}" class="questionTypeItem box-center" @click="changeTypeItem(5)">问答题</div>
    </div>
    <SingleChoice v-show="typeIndex===1" :paper-qus="false" :copyQuestion="copyQuestion"/>
    <MultipleChoice v-show="typeIndex===2" :paper-qus="false" :copyQuestion="copyQuestion"/>
    <TrueOrFalse v-show="typeIndex===3" :paper-qus="false" :copyQuestion="copyQuestion"/>
    <FillBlank v-show="typeIndex===4" :paper-qus="false" :copyQuestion="copyQuestion"/>
    <AnswerQuestion v-show="typeIndex===5" :paper-qus="false" :copyQuestion="copyQuestion"/>
  </div>
</template>
<script>
  import SingleChoice from './singleChoice'
  import MultipleChoice from './multipleChoice'
  import TrueOrFalse from './trueOrFalse'
  import FillBlank from './fillBlank'
  import AnswerQuestion from './answerQuestion'

  export default {
    name: 'AddQuestionMain',
    props: ['copyQuestion'],
    components: { SingleChoice, MultipleChoice, TrueOrFalse, FillBlank, AnswerQuestion },
    data() {
      return {
        typeIndex: 1
      }
    },
    created() {
      if (this.copyQuestion != null) {
        const type = this.copyQuestion.type
        if (type === 'choice_multi') this.typeIndex = 2
        if (type === 'true_false') this.typeIndex = 3
        if (type === 'fill_blank') this.typeIndex = 4
        if (type === 'question') this.typeIndex = 5
      }
    },
    methods: {
      changeTypeItem(type) {
        this.typeIndex = type
      }
    }
  }
</script>

<style scoped>
  .headerTitle {
    margin: 0px 40px 0px 46px;
    border-bottom: 2px solid #EDEDED;
    position: relative;
    height: 50px;
  }

  .tabTitle {
    height: 50px;
    width: 120px;
    font-size: 18px;
    font-weight: bold;
    color: rgba(51, 51, 51, 1);
    line-height: 23px;
    border-bottom: 2px solid #3D53E6;
    position: absolute;
  }

  .importItem {
    padding: 17px 29px 3px 20px;
  }

  .uploadBtn {
    width: 315px;
    height: 36px;
    border-radius: 8px;
    padding-left: 30px;
    border: 1px solid rgba(203, 203, 203, 1);
    transition: background-color .6s ease
  }

  .uploadBtn:hover {
    background-color: #CCCCCC
  }

  .paperHeader {
    width: 72px;
    height: 23px;
    font-size: 18px;
    font-family: MicrosoftYaHeiUI-Bold;
    font-weight: bold;
    color: rgba(51, 51, 51, 1);
    line-height: 23px;
    margin-left: 86px;
  }

  .questionType {
    height: 38px;
    background: rgba(245, 245, 245, 1);
    color: #666666
  }

  .questionTypeItem {
    width: 77px;
    height: 38px;
    cursor: pointer;
    transition: background-color .6s ease
  }

  .questionTypeItem:hover {
    background-color: #CCCCCC
  }

  .activeItem {
    background: rgba(61, 83, 230, 1) !important;
    color: white
  }

  .saveBtn {
    width: 80px;
    height: 38px;
    background: rgba(61, 83, 230, 1);
    border-radius: 5px;
    color: white;
    cursor: pointer;
    position: absolute;
    right: 139px;
    top: 6px
  }

  .viewBtn {
    width: 127px;
    height: 38px;
    background: rgba(237, 237, 237, 1);
    border-radius: 5px;
    color: #333333;
    cursor: pointer;
    position: absolute;
    right: 239px;
    top: 6px
  }
</style>

