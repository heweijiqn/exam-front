<template>
  <div class="gray-dark">
    <div class="box-justify Mb-25">
      <div>
        <span class="font-bold">{{ index + 1 }}、{{ questionQuestion.stem }}</span> <span class="">（{{ questionQuestion.score }}分）</span>
      </div>
      <div v-if="!lookWrong">
        <img v-if="questionQuestion.isSign" src="@/assets/images/signActive.png" class="signCss mousePointer" @click="sign">
        <img v-else src="@/assets/images/sign.png" class="signCss mousePointer" @click="sign">
      </div>
    </div>
    <div class="box-start Mb-25">
      <el-input
        :autosize="{ minRows: 3, maxRows: 6}"
        :readonly="lookWrong"
        v-model="answerValue"
        type="textarea"
        placeholder="请输入内容"
        @input.native="fillAnswer"/>
    </div>
    <div v-if="lookWrong" class="Mb-20">
      <div v-if="!isMark">
        <div class="Mb-20"><span class="font-bold">【参考答案】</span> {{ questionQuestion.answer }}</div>
        <div class="Mb-20"><span class="font-bold">【得分】</span> {{ questionQuestion.userScore }}分</div>
      </div>
      <div v-else>
        <div class="Mb-20"><span class="font-bold">【参考答案】</span> {{ questionQuestion.answer }}</div>
        <div class="Mb-20"><span class="font-bold">【打分】</span> <input v-model="markedScore" @blur="markScore" class="getScore pl-5">&nbsp;分
        </div>
      </div>
    </div>
    <div v-if="lookWrong">
      <div><span class="font-bold">【解析】</span> {{ $isNull(questionQuestion.analysis)?'无':questionQuestion.analysis }}</div>
    </div>
  </div>
</template>

<script>
  import { debounce } from '@/utils/index'

  export default {
    name: 'Index',
    props: {
      questionQuestion: {
        type: Object,
        default: null
      },
      lookWrong: {
        type: Boolean,
        default: false
      },
      isMark: {
        type: Boolean,
        default: false
      },
      index: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        answerValue: this.lookWrong ? this.questionQuestion.userAnswer : null,
        answerData: {
          questionId: this.questionQuestion.id,
          isDone: false,
          isSign: false,
          answer: ''
        },
        markedScore: this.questionQuestion.score
      }
    },
    created() {
      if (this.isMark) {
        this.markScore()
      }
    },
    methods: {
      fillAnswer: debounce(function() {
        this.doAnswer()
      }, 500),
      // 答题
      doAnswer() {
        if (this.lookWrong && !this.isMark) {
          return
        }
        if (this.isMark) {
          this.answerData.score = this.answerData.score.replace(/[^\d]/g, '')
        }
        if (!this.$isNull(this.answerValue)) {
          this.answerData.isDone = true
        } else {
          this.answerData.isDone = false
        }
        this.answerData.answer = this.answerValue
        this.$emit('doAnswer', this.answerData)
      },
      // 标记
      sign() {
        if (this.lookWrong) {
          return
        }
        this.answerData.isSign = !this.answerData.isSign
        this.$emit('doAnswer', this.answerData)
      },
      // 打分
      markScore() {
        const data = {
          questionId: this.answerData.questionId,
          score: this.markedScore
        }
        this.$emit('markScore', data)
      }
    }
  }
</script>

<style scoped>
  .signCss {
    color: #999999;
    width: 25px;
    height: 25px;
  }

  .getScore {
    width: 50px;
    border-radius: 5px;
    height: 32px;
    line-height: 32px;
    padding-left: 5px;
    font-weight: bold;
    color: firebrick;
    border: 1px solid #000000;
  }

  .getScore:focus {
    outline: none
  }

  .getScore2 {
    color: #EF684A;
    font-weight: bold
  }
</style>
