<template>
  <div class="gray-dark">
    <div class="box-justify Mb-25">
      <div>
        <span class="font-bold">{{ index + 1 }}、{{ choiceMultiQuestion.stem }}</span> <span class="">（{{ choiceMultiQuestion.score }}分）</span>
      </div>
      <div v-if="!lookWrong">
        <img v-if="choiceMultiQuestion.isSign" src="@/assets/images/signActive.png" class="signCss mousePointer" @click="sign">
        <img v-else src="@/assets/images/sign.png" class="signCss mousePointer" @click="sign">
      </div>
    </div>
    <div v-for="(item,index) in options" :key="item.id" class="box-start Mb-25">
      <div :class="{optionActive:item.isAnswer}" class="optionCss box-v-center Mr-6 mousePointer" @click="doAnswer(index)">{{ index+1 | convert }}</div>
      <div :class="{activeFont:item.isAnswer}" class="mousePointer" @click="doAnswer(index)">{{ item.metas }}</div>
    </div>
    <div v-if="lookWrong" class="Mb-20">
      <div>
        <span class="font-bold">【参考答案】</span> {{ choiceMultiQuestion.answer | convertQuestionAnswer('choice_multi') }}
        <span class="Ml-10">【得分】<span class="getScore">{{ choiceMultiQuestion.userScore }}</span>分</span>
      </div>
    </div>
    <div v-if="lookWrong">
      <div><span class="font-bold">【解析】</span> {{ $isNull(choiceMultiQuestion.analysis)?'无':choiceMultiQuestion.analysis }}</div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Index',
    props: {
      choiceMultiQuestion: {
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
        options: [],
        answerData: {
          questionId: this.choiceMultiQuestion.id,
          isDone: false,
          isSign: false,
          answer: ''
        }
      }
    },
    created() {
      this.options = JSON.parse(this.choiceMultiQuestion.metas).choices.map((item, index) => {
        let isAnswer = false
        if (this.choiceMultiQuestion.userAnswer !== undefined && this.choiceMultiQuestion.userAnswer !== null) {
          const userAnswer = JSON.parse(this.choiceMultiQuestion.userAnswer)
          isAnswer = userAnswer.indexOf(index) !== -1
        }
        return {
          metas: item,
          id: index,
          isAnswer: isAnswer
        }
      })
    },
    methods: {
      // 答题
      doAnswer(index) {
        if (this.lookWrong) {
          return
        }
        if (this.options[index].isAnswer) {
          this.$set(this.options[index], 'isAnswer', false)
        } else {
          this.$set(this.options[index], 'isAnswer', true)
        }
        const tempArr = []
        for (let i = 0; i < this.options.length; i++) {
          if (this.options[i].isAnswer) {
            tempArr.push(i)
          }
        }
        this.answerData.answer = JSON.stringify(tempArr)
        if (!this.$isNull(tempArr)) {
          this.answerData.isDone = true
        } else {
          this.answerData.isDone = false
        }
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
</style>
