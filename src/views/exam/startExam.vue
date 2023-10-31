<template>
  <div v-loading.fullscreen.lock="!overData" style="background-color:#F5F5FC;min-height:calc(100vh);width:100%;">
    <div class="box-start startHeader">
      <div class="testCenter box-start">
        <div class="gray-dark size-header font-bold">{{ testPaperName }}</div>
      </div>
    </div>
    <div style="min-height:calc(100vh - 74px);">
      <div class="testCenter box-start Pt-30 align-stretch">
        <div class="rest gray-dark Pr-30 box-v-start align-stretch" style="min-height:calc(100vh - 104px);">
          <div class="box-start Pl-20 testDetailInfo">
            <div style="margin-right:42px;">总分：{{ totalScore }}分</div>
            <div style="margin-right:42px;">及格：{{ passedScore }}分</div>
            <div style="margin-right:42px;">共{{ itemCount }}题</div>
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
            <previewChoiceList v-show="typeIndex===1" :choiceQuestions="choiceQuestions" @doAnswer="doAnswer" @nextGroup="nextGroup"/>
            <previewChoiceMultiList v-show="typeIndex===2" :choiceMultiQuestions="choiceMultiQuestions" @doAnswer="doAnswer" @nextGroup="nextGroup"/>
            <previewTrueFalseList v-show="typeIndex===3" :trueFalseQuestions="trueFalseQuestions" @doAnswer="doAnswer" @nextGroup="nextGroup"/>
            <previewFillBlankList v-show="typeIndex===4" :fillBlankQuestions="fillBlankQuestions" @doAnswer="doAnswer" @nextGroup="nextGroup"/>
            <previewQuestionList v-show="typeIndex===5" :questionQuestions="questionQuestions" @doAnswer="doAnswer"/>
          </div>
        </div>
        <div class="outlineTest">
          <div class="outlineBody">
            <div class="gray-medium size-large box-center" style="margin-top:8px;">剩余时间</div>
            <div class="box-center countdown">
              {{ retainTime | countdownFilter }}
            </div>
            <div class="gray-medium size-large Mt-20 Mb-20">答题卡</div>
            <div class="box-start-wrap Mb-30" style="max-height:700px;overflow-y:auto;">
              <div v-for="(item,index) in allAnswers" :key="item.questionId" class="itemContent box-v-start">
                <div :class="{doneItem:item.isDone}" class="itemIndex box-v-center">
                  {{ index + 1 }}
                </div>
                <div :class="{visibilityNone:!item.isSign}" class="signCircle"/>
              </div>
            </div>
            <div class="box-distribute">
              <div class="box-start">
                <span class="gray-medium" style="margin-right:5px;">已答</span>
                <div class="answered"/>
              </div>
              <div class="box-start">
                <span class="gray-medium" style="margin-right:5px;">未答</span>
                <div class="unAnswered"/>
              </div>
              <div class="box-start">
                <span class="gray-medium" style="margin-right:5px;">标记</span>
                <div class="signCircle"/>
              </div>
            </div>
          </div>
          <div class="submitTest box-v-center mousePointer" @click="handTestPaper">交卷</div>
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
  import { preview, submit } from '@/api/testPaper/test-paper'

  export default {
    name: 'StartExam',
    components: {
      previewChoiceList,
      previewChoiceMultiList,
      previewTrueFalseList,
      previewFillBlankList,
      previewQuestionList
    },
    computed: {
      examTestPaperId() {
        return this.$route.query.id
      },
      // 所有答案
      allAnswers() {
        const answers = []
        this.allQuestions.forEach((question, index) => {
          answers.push({
            questionId: question.id,
            itemId: 0,
            isDone: false,
            isSign: false,
            answer: ''
          })
        })
        return answers
      }
    },
    data() {
      return {
        typeIndex: 1,
        // 试卷名
        testPaperName: '',
        totalScore: 0,
        passedScore: 0,
        itemCount: 0,
        // 限时
        limitedTime: 0,
        // 剩余时间
        retainTime: 0,
        // 所有试题
        allQuestions: [],
        // 所有试题项目
        allTestPaperItems: [],
        // 单选题
        choiceQuestions: [],
        // 多选题
        choiceMultiQuestions: [],
        // 判断题
        trueFalseQuestions: [],
        // 填空题
        fillBlankQuestions: [],
        // 问答题
        questionQuestions: [],
        // 倒计时定时器
        countdown: null,
        overData: true
      }
    },
    created() {
      this.preview()
    },
    beforeDestroy() {
      window.clearInterval(this.countdown)
    },
    methods: {
      preview() {
        const params = { id: this.examTestPaperId }
        preview(params).then(response => {
          const data = response.data
          this.testPaperName = data.name
          this.totalScore = data.totalScore
          this.passedScore = data.passedScore
          this.itemCount = data.itemCount
          this.limitedTime = data.limitedTime
          this.retainTime = data.limitedTime
          // 单选题
          this.choiceQuestions = data.examQuestions.filter(item => item.type === 'choice')
          this.choiceQuestions = this.choiceQuestions.map(question => {
            const item = data.examTestPaperItems.find(item => item.questionId === question.id)
            question.score = item.score
            return question
          })
          // 多选题
          this.choiceMultiQuestions = data.examQuestions.filter(item => item.type === 'choice_multi')
          this.choiceMultiQuestions = this.choiceMultiQuestions.map(question => {
            const item = data.examTestPaperItems.find(item => item.questionId === question.id)
            question.score = item.score
            return question
          })
          // 判断题
          this.trueFalseQuestions = data.examQuestions.filter(item => item.type === 'true_false')
          this.trueFalseQuestions = this.trueFalseQuestions.map(question => {
            const item = data.examTestPaperItems.find(item => item.questionId === question.id)
            question.score = item.score
            return question
          })
          // 填空题
          this.fillBlankQuestions = data.examQuestions.filter(item => item.type === 'fill_blank')
          this.fillBlankQuestions = this.fillBlankQuestions.map(question => {
            const item = data.examTestPaperItems.find(item => item.questionId === question.id)
            question.score = item.score
            return question
          })
          // 问答题
          this.questionQuestions = data.examQuestions.filter(item => item.type === 'question')
          this.questionQuestions = this.questionQuestions.map(question => {
            const item = data.examTestPaperItems.find(item => item.questionId === question.id)
            question.score = item.score
            return question
          })
          // 所有试题
          this.allQuestions = data.examQuestions
          this.allTestPaperItems = data.examTestPaperItems
          // 倒计时开始
          this.countdown = window.setInterval(this.countdownTime, 1000)
        })
      },
      // 倒计时
      countdownTime() {
        this.retainTime--
        if (this.retainTime === 0) {
          window.clearInterval(this.countdown)
          // 倒计时结束必须交卷
          this.doSubmit()
        } else if (this.retainTime === 900) {
          this.$notify({
            title: '注意',
            message: '仅剩最后15分钟',
            type: 'warning'
          })
        }
      },
      changeTypeItem(type) {
        this.typeIndex = type
      },
      doAnswer(data) {
        const questionId = data.questionId
        const item = this.allAnswers.find(item => item.questionId === questionId)
        this.$set(item, 'isDone', data.isDone)
        this.$set(item, 'isSign', data.isSign)
        this.$set(item, 'answer', data.answer)
      },
      nextGroup(type) {
        this.changeTypeItem(type)
      },
      // 交卷
      handTestPaper() {
        let answerAll = true
        let tempStr = null
        for (let i = 0; i < this.allAnswers.length; i++) {
          if (!this.allAnswers[i].isDone) {
            answerAll = false
          }
        }
        if (!answerAll) {
          tempStr = '有试题未做，是否交卷？'
        } else {
          tempStr = '确认交卷吗？'
        }
        this.$confirm(tempStr, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'info'
        }).then(() => {
          this.doSubmit()
        }).catch(() => {
        })
      },
      doSubmit() {
        const loading = this.$loading({
          lock: true,
          text: '正在提交试卷，请稍候...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })

        const userId = 0

        // 试卷结果
        const examTestPaperResult = {
          testpaperId: this.examTestPaperId,
          testpaperName: this.testPaperName,
          userId: userId,
          score: 0,
          objectiveScore: 0,
          subjectiveScore: 0,
          teacherSay: '',
          rightItemCount: 0,
          usedTime: this.limitedTime - this.retainTime,
          status: 'doing'
        }

        // 试卷项目结果
        const examTestPaperItemResults = []
        this.allAnswers.forEach(answer => {
          const item = this.allTestPaperItems.find(item => item.questionId === answer.questionId)
          examTestPaperItemResults.push({
            testpaperId: this.examTestPaperId,
            testpaperItemId: item.id,
            questionId: answer.questionId,
            userId: userId,
            answer: answer.answer,
            status: 'none'
          })
        })

        // 提交试卷参数
        const params = {
          examTestPaperResult: examTestPaperResult,
          examTestPaperItemResults: examTestPaperItemResults
        }

        submit(params).then(response => {
          this.$message({ type: 'success', message: '交卷完毕！' })
          loading.close()
          this.$router.push({ path: '/exam/listExam' })
        }).catch(function() {
          this.$message({ type: 'success', message: '系统出错啦！' })
          loading.close()
        })
      }
    }
  }
</script>

<style scoped>
  .startHeader {
    width: 100%;
    height: 74px;
    background-color: white
  }

  .backCssIcon {
    color: #979797;
    font-size: 25px;
    margin-left: 40px;
    position: absolute;
  }

  .testCenter {
    margin: 0px auto;
    width: 78%;
    min-width: 1119px;
    max-width: 1170px;
    height: 100%;
  }

  .outlineTest {
    width: 270px;

  }

  .outlineBody {
    padding: 18px 26px;
    border-radius: 2px;
    background-color: white
  }

  .countdown {
    color: #EF684A;
    font-size: 24px;
    font-weight: 600;
    padding: 13px 0px 20px;
    border-bottom: 1px solid #EAEAEA
  }

  .itemContent {
    width: 20%;
    margin-bottom: 13px
  }

  .signCircle {
    background-color: #EF684A;
    width: 6px;
    height: 6px;
    border-radius: 50%
  }

  .itemIndex {
    border-radius: 50%;
    width: 32px;
    height: 32px;
    color: #666666;
    border: 1px solid #CBCBCB;
    font-size: 14px;
    margin-bottom: 2px;
  }

  .doneItem {
    background-color: #3D53E6;
    color: white;
    border: none
  }

  .answered {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background-color: #3D53E6
  }

  .unAnswered {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    border: 1px solid #CBCBCB
  }

  .submitTest {
    height: 43px;
    background: rgba(61, 83, 230, 1);
    border-radius: 5px;
    color: white;
    font-weight: bold;
    margin-top: 20px
  }

  .testDetailInfo {
    height: 48px;
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

  .questionType {
    height: 61px;
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
