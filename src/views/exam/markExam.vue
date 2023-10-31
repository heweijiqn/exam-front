<template>
  <div class="app-container" style="min-height: calc(100vh - 60px);width: 100%;">
    <div class="W100 H100" style="background-color: white;min-height: calc(100vh - 100px);">
      <div class="box-justify importItem">
        <div class="mousePointer gray-light size-small" style="width: 100px;" @click="back"><i class="el-icon-d-arrow-left"/>返回</div>
      </div>
      <div class="rest gray-dark box-v-start align-stretch" style="min-height: calc(100vh - 94px);">
        <div class="gray-dark size-header font-bold box-center bg-white Pt-20">{{ testPaperName }}</div>
        <div class="box-distribute testDetailInfo">
          <div>总分：{{ totalScore }}</div>
          <div>及格：{{ passedScore }}</div>
          <div style="font-size:32px;font-weight:bold;font-style:italic;color:firebrick;">得分：{{ resultScore }}</div>
        </div>
        <div class="rest testDetail">
          <div style="padding:0px 22px;" class="bg-white">
            <div class="questionType box-start bb1px">
              <div v-if="choiceQuestions.length>0" :class="{activeItem:typeIndex===1}" class="questionTypeItem box-center" @click="changeTypeItem(1)">单选题（{{ choiceQuestions.length }}）</div>
              <div v-if="choiceMultiQuestions.length>0" :class="{activeItem:typeIndex===2}" class="questionTypeItem box-center" @click="changeTypeItem(2)">多选题（{{ choiceMultiQuestions.length }}）</div>
              <div v-if="trueFalseQuestions.length>0" :class="{activeItem:typeIndex===3}" class="questionTypeItem box-center" @click="changeTypeItem(3)">判断题（{{ trueFalseQuestions.length }}）</div>
              <div v-if="fillBlankQuestions.length>0" :class="{activeItem:typeIndex===4}" class="questionTypeItem box-center" @click="changeTypeItem(4)">填空题（{{ fillBlankQuestions.length }}）</div>
              <div v-if="questionQuestions.length>0" :class="{activeItem:typeIndex===5}" class="questionTypeItem box-center" @click="changeTypeItem(5)">问答题（{{ questionQuestions.length }}）</div>
            </div>
          </div>
          <previewChoiceList v-show="typeIndex===1" :choiceQuestions="choiceQuestions" :lookWrong="true" @nextGroup="nextGroup"/>
          <previewChoiceMultiList v-show="typeIndex===2" :choiceMultiQuestions="choiceMultiQuestions" :lookWrong="true" @nextGroup="nextGroup"/>
          <previewTrueFalseList v-show="typeIndex===3" :trueFalseQuestions="trueFalseQuestions" :lookWrong="true" @nextGroup="nextGroup"/>
          <previewFillBlankList v-show="typeIndex===4" :fillBlankQuestions="fillBlankQuestions" :lookWrong="true" @nextGroup="nextGroup"/>
          <previewQuestionList v-show="typeIndex===5" :questionQuestions="questionQuestions" :lookWrong="true" :isMark="true" @markScore="markScore" @doMark="doMark"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import previewChoiceList from '@/views/testPaper/components/preview/previewChoiceList'
  import previewChoiceMultiList from '@/views/testPaper/components/preview/previewChoiceMultiList'
  import previewTrueFalseList from '@/views/testPaper/components/preview/previewTrueFalseList'
  import previewFillBlankList from '@/views/testPaper/components/preview/previewFillBlankList'
  import previewQuestionList from '@/views/testPaper/components/preview/previewQuestionList'
  import { detail, doMark } from '@/api/testPaper/test-result'

  export default {
    name: 'MarkExam',
    components: {
      previewChoiceList,
      previewChoiceMultiList,
      previewTrueFalseList,
      previewFillBlankList,
      previewQuestionList
    },
    data() {
      return {
        typeIndex: 5,
        // 试卷名
        testPaperName: '',
        totalScore: 0,
        passedScore: 0,
        resultScore: 0,
        // 单选题
        choiceQuestions: [],
        // 多选题
        choiceMultiQuestions: [],
        // 判断题
        trueFalseQuestions: [],
        // 填空题
        fillBlankQuestions: [],
        // 问答题
        questionQuestions: []
      }
    },
    computed: {
      testResultId() {
        return this.$route.query.id
      },
      // 所有问答题得分
      itemResultScores() {
        const scores = []
        this.questionQuestions.forEach((question) => {
          scores.push({
            id: question.itemResultId,
            questionId: question.id,
            score: 0
          })
        })
        return scores
      }
    },
    created() {
      this.preview()
    },
    methods: {
      preview() {
        const params = { id: this.testResultId }
        detail(params).then(response => {
          const data = response.data
          this.testPaperName = data.name
          this.totalScore = data.totalScore
          this.passedScore = data.passedScore
          this.resultScore = data.examTestPaperResult.score
          // 单选题
          this.choiceQuestions = data.examQuestions.filter(item => item.type === 'choice')
          this.choiceQuestions = this.choiceQuestions.map(question => {
            const item = data.examTestPaperItems.find(item => item.questionId === question.id)
            const itemResult = data.examTestPaperItemResults.find(item => item.questionId === question.id)
            question.score = item.score
            question.userScore = itemResult.score
            question.userAnswer = itemResult.answer
            return question
          })
          // 多选题
          this.choiceMultiQuestions = data.examQuestions.filter(item => item.type === 'choice_multi')
          this.choiceMultiQuestions = this.choiceMultiQuestions.map(question => {
            const item = data.examTestPaperItems.find(item => item.questionId === question.id)
            const itemResult = data.examTestPaperItemResults.find(item => item.questionId === question.id)
            question.score = item.score
            question.userScore = itemResult.score
            question.userAnswer = itemResult.answer
            return question
          })
          // 判断题
          this.trueFalseQuestions = data.examQuestions.filter(item => item.type === 'true_false')
          this.trueFalseQuestions = this.trueFalseQuestions.map(question => {
            const item = data.examTestPaperItems.find(item => item.questionId === question.id)
            const itemResult = data.examTestPaperItemResults.find(item => item.questionId === question.id)
            question.score = item.score
            question.userScore = itemResult.score
            question.userAnswer = itemResult.answer
            return question
          })
          // 填空题
          this.fillBlankQuestions = data.examQuestions.filter(item => item.type === 'fill_blank')
          this.fillBlankQuestions = this.fillBlankQuestions.map(question => {
            const item = data.examTestPaperItems.find(item => item.questionId === question.id)
            const itemResult = data.examTestPaperItemResults.find(item => item.questionId === question.id)
            question.score = item.score
            question.userScore = itemResult.score
            question.userAnswer = itemResult.answer
            return question
          })
          // 问答题
          this.questionQuestions = data.examQuestions.filter(item => item.type === 'question')
          this.questionQuestions = this.questionQuestions.map(question => {
            const item = data.examTestPaperItems.find(item => item.questionId === question.id)
            const itemResult = data.examTestPaperItemResults.find(item => item.questionId === question.id)
            question.itemResultId = itemResult.id
            question.score = item.score
            question.userScore = itemResult.score
            question.userAnswer = itemResult.answer
            return question
          })
        })
      },
      changeTypeItem(index) {
        this.typeIndex = index
      },
      nextGroup(index) {
        this.changeTypeItem(index)
      },
      back() {
        this.$router.push({
          path: '/exam/listMark'
        })
      },
      markScore(data) {
        const questionId = data.questionId
        const item = this.itemResultScores.find(item => item.questionId === questionId)
        this.$set(item, 'score', data.score)
      },
      // 确认打分
      doMark() {
        const params = {
          resultId: this.testResultId,
          markScoreItems: this.itemResultScores
        }
        
        doMark(params).then(response => {
          this.$message({ type: 'success', message: '打分完毕！' })
          this.$router.push({ path: '/exam/listExam' })
        })
      }
    }
  }
</script>

<style scoped>
  .testDetailInfo {
    height: 70px;
    background: rgba(255, 255, 255, 1);
    border-radius: 2px;
    margin-bottom: 30px;
  }

  .testDetail {
    background-color: rgb(245, 245, 252);
    overflow-y: auto;
    height: 100%;
    max-height: calc(100vh - 182px)
  }

  .questionTypeItem {
    height: 61px;
    padding: 0px 20px;
    cursor: pointer;
    color: #666666;
    transition: background-color .6s ease
  }

  .questionTypeItem:hover {
    color: #333333
  }

  .activeItem {
    color: #333333;
    font-weight: bold;
    border-bottom: 1px solid #3D53E6
  }
</style>
