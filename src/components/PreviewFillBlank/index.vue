<template>
  <div class="gray-dark">
    <div class="box-justify Mb-25">
      <div>
        <span class="font-bold">{{ index + 1 }}、填空题</span> <span class="">（{{ fillBlankQuestion.score }}分）</span>
      </div>
      <div v-if="!lookWrong">
        <img v-if="fillBlankQuestion.isSign" src="@/assets/images/signActive.png" class="signCss mousePointer" @click="sign">
        <img v-else src="@/assets/images/sign.png" class="signCss mousePointer" @click="sign">
      </div>
    </div>
    <div v-if="isBlankFirst" class="box-start-wrap">
      <div v-for="(item,index) in answerArr" :key="item.id" class="box-start Mb-25">
        <input v-show="index!==answerArr.length-1" v-model="item.answer" :readonly="lookWrong" type="text" class="blankInput" @input="fillAnswer(index)">
        <div>{{ item.stem }}</div>
      </div>
    </div>
    <div v-if="!isBlankFirst" class="box-start-wrap">
      <div v-for="(item,index) in answerArr" :key="item.id" class="box-start Mb-25">
        <div>{{ item.stem }}</div>
        <input v-show="index!==answerArr.length-1" v-model="item.answer" :readonly="lookWrong" type="text" class="blankInput" @input="fillAnswer(index)">
      </div>
    </div>
    <div v-if="lookWrong" class="Mb-20">
      <div>
        <span class="font-bold">【参考答案】</span> {{ fillBlankQuestion.answer | convertQuestionAnswer('fill_blank') }}
        <span class="Ml-10">【得分】<span class="getScore">{{ fillBlankQuestion.userScore }}</span>分</span>
      </div>
    </div>
    <div v-if="lookWrong">
      <div><span class="font-bold">【解析】</span> {{ $isNull(fillBlankQuestion.analysis)?'无':choiceQuestion.analysis }}</div>
    </div>
  </div>
</template>

<script>
  import { debounce } from '@/utils/index'

  export default {
    name: 'Index',
    props: {
      fillBlankQuestion: {
        type: Object,
        default: null
      },
      lookWrong: {
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
        stemArr: [],
        isAnswer: false,
        isBlankFirst: false,
        answerArr: [],
        answerData: {
          questionId: this.fillBlankQuestion.id,
          isDone: false,
          isSign: false,
          answer: ''
        }
      }
    },
    created() {
      this.stemArr = this.fillBlankQuestion.stem.split('{{}}')
      if (this.stemArr[0] === '') {
        this.isBlankFirst = true
      } else {
        this.isBlankFirst = false
      }
      const tempArr = this.$isNull(this.fillBlankQuestion.userAnswer) ? [] : JSON.parse(this.fillBlankQuestion.userAnswer)
      if (this.lookWrong) {
        for (let i = 0; i < this.stemArr.length; i++) {
          this.answerArr.push({
            id: i,
            answer: tempArr[i],
            stem: this.stemArr[i]
          })
        }
      } else {
        for (let i = 0; i < this.stemArr.length; i++) {
          this.answerArr.push({
            id: i,
            answer: null,
            stem: this.stemArr[i]
          })
        }
      }
    },
    methods: {
      fillAnswer: debounce(function(index) {
        this.doAnswer(index)
      }, 500),
      // 答题
      doAnswer(index) {
        if (this.lookWrong) {
          return
        }
        let answerAll = true
        const tempAnswer = []
        for (let i = 0; i < this.answerArr.length; i++) {
          if (i !== this.answerArr.length - 1) {
            if (this.$isNull(this.answerArr[i].answer)) {
              answerAll = false
              tempAnswer.push('')
            } else {
              tempAnswer.push(this.answerArr[i].answer.trim())
            }
          }
        }
        if (answerAll) {
          this.answerData.isDone = true
        } else {
          this.answerData.isDone = false
        }
        this.answerData.answer = JSON.stringify(tempAnswer)
        this.$emit('doAnswer', this.answerData)
      },
      // 标记
      sign() {
        if (this.lookWrong) {
          return
        }
        this.answerData.isSign = !this.answerData.isSign
        this.$emit('doAnswer', this.answerData)
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

  .optionCss {
    width: 22px;
    height: 22px;
    color: #999999;
    border: 1px solid #999999;
    border-radius: 50%;
  }

  .optionActive {
    background: rgba(61, 83, 230, 1);
    color: white;
    border: none
  }

  .activeFont {
    color: #3D53E6
  }

  .blankInput {
    border-right: none;
    border-left: none;
    border-top: none;
    border-bottom: 1px solid #333;
    text-align: center;
    color: #333;
    padding: 3px 5px;
    margin-top: 2px;
    width: 140px;
  }

  .blankInput:focus {
    outline: none
  }

</style>
