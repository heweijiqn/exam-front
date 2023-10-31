<template>
  <div class="gray-dark">
    <div class="box-justify Mb-25">
      <div>
        <span class="font-bold">{{ index+1 }}、{{ choiceQuestion.stem }}</span> <span class="">（{{ choiceQuestion.score }}分）</span>
      </div>
      <div v-if="!lookWrong">
        <img v-if="answerData.isSign" src="@/assets/images/signActive.png" class="signCss mousePointer" @click="sign">
        <img v-else src="@/assets/images/sign.png" class="signCss mousePointer" @click="sign">
      </div>
    </div>
    <div v-for="(item,index) in options" :key="item.id" class="box-start Mb-25">
      <div :class="{optionActive: item.isAnswer}" class="optionCss box-v-center Mr-6 mousePointer" @click="doAnswer(index)">{{ index + 1 | convert }}</div>
      <div :class="{activeFont: item.isAnswer}" class="mousePointer" @click="doAnswer(index)">{{ item.metas }}</div>
    </div>
    <div v-if="lookWrong" class="Mb-20">
      <div>
        <span class="font-bold">【参考答案】</span> {{ Number(choiceQuestion.answer) + 1 | convert }}
        <span class="Ml-10">【得分】<span class="getScore">{{ choiceQuestion.userScore }}</span>分</span>
      </div>
    </div>
    <div v-if="lookWrong">
      <div><span class="font-bold">【解析】</span> {{ $isNull(choiceQuestion.analysis)?'无':choiceQuestion.analysis }}</div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Index',
    props: {
      choiceQuestion: {
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
          questionId: this.choiceQuestion.id,
          isDone: false,
          isSign: false,
          answer: ''
        }
      }
    },
    created() {
      this.options = JSON.parse(this.choiceQuestion.metas).choices.map((item, index) => {
        let isAnswer = false
        if (this.choiceQuestion.userAnswer !== undefined && this.choiceQuestion.userAnswer !== null) {
          isAnswer = (index === Number(this.choiceQuestion.userAnswer))
        }
        return {
          id: index,
          metas: item,
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
        for (let i = 0; i < this.options.length; i++) {
          if (i === index) {
            this.$set(this.options[i], 'isAnswer', true)
          } else {
            this.$set(this.options[i], 'isAnswer', false)
          }
        }

        this.answerData.answer = index
        this.answerData.isDone = true
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
