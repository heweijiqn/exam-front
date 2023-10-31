<template>
  <div :class="{'Mt-20':paperQus}" class="W100 box-v-center">
    <div v-if="!paperQus" style="width: 80%;height: 55px;max-width: 1350px;" class="Mt-10 box-start mousePointer">
      <i class="el-icon-circle-plus normalBlue"/>
      <div class="Ml-10 normalBlue" @click="showAddPanel">添加问答题</div>
    </div>
    <div v-show="showAddTopic" class="addAnswerCss box-start align-stretch Pt-20 Pb-20 gray-dark Mb-20">
      <div style="width: 80%;" class="box-v-start">
        <div class="box-justify Mb-16 align-stretch" style="width: 80%;">
          <div class="rest">
            <el-input :autosize="{minRows: 2,maxRows: 4}" v-model="question.stem" type="textarea" placeholder="请输入题干内容"/>
          </div>
          <div v-if="paperQus">分值：<input v-model="question.score" class="scoreInput">分</div>
        </div>
        <div class="box-justify Mb-16" style="width:80%">
          <div class="rest box-start">
            <div class="box-start" style="width:80%">
              <el-input :autosize="{minRows: 3,maxRows: 6}" v-model="question.answer" type="textarea" placeholder="请输入参考答案"/>
            </div>
          </div>
        </div>
        <div class="box-justify Mb-16" style="width: 80%;">
          <div class="rest box-start">
            <div class="saveBtn box-center mousePointer" @click="doAdd">保存</div>
            <div class="deleteBtn box-center mousePointer Ml-16" @click="doClear">删除</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import { add } from '@/api/testPaper/question'

  export default {
    name: 'AnswerQuestion',
    props: ['copyQuestion', 'paperQus'],
    data() {
      return {
        textarea2: null,
        activeNames: ['1'],
        examQuestionList: [],
        question: {
          analysis: null,
          answer: null,
          stem: null,
          score: null,
          showAddTopic: false,
          options: [{
            isAnswer: true,
            title: null,
            id: 1
          }, {
            isAnswer: false,
            title: null,
            id: 2
          }, {
            isAnswer: false,
            title: null,
            id: 3
          }],
          keyWord: [],
          knowledgeType: []
        },
        showAddTopic: false,
        editIndexNow: null
      }
    },
    computed: {
      treeDataList() {
        return this.$store.getters.chapterType
      }
    },
    created() {
      if (this.copyQuestion !== undefined && this.copyQuestion != null && typeof this.copyQuestion === 'object') {
        this.showAddTopic = true
        this.question.stem = this.copyQuestion.stem
        this.question.score = this.copyQuestion.score
        this.question.answer = this.copyQuestion.answer
        this.question.analysis = this.copyQuestion.analysis
      }
    },
    methods: {
      showAddPanel() {
        if (this.editIndexNow !== null) {
          this.$message('请先保存题目')
          return
        }
        this.editIndexNow = 0
        this.showAddTopic = true
      },
      doAdd() {
        const stem = this.question.stem
        if (stem === undefined || stem === '' || stem === null) {
          this.$message('请填写题干')
          return
        }

        const params = {
          analysis: this.question.analysis,
          answer: this.question.answer,
          metas: null,
          score: 0,
          stem: stem,
          type: 'question'
        }
        add(params).then(response => {
          if (response.code === 20000) {
            this.msgSuccess('添加成功')
            setTimeout(() => this.$router.push({ path: '/testPaper/listQuestion' }), 1000)
          }
        }).catch(function() {
        })
      },
      doClear() {
        this.question = {
          analysis: null,
          answer: null,
          stem: null,
          score: null,
          options: [{
            isAnswer: true,
            title: null,
            id: 1
          }, {
            isAnswer: false,
            title: null,
            id: 2
          }, {
            isAnswer: false,
            title: null,
            id: 3
          }],
          keyWord: [],
          knowledgeType: []
        }
        this.editIndexNow = null
        this.showAddTopic = false
      }
    }
  }
</script>
<style scoped>
  .addAnswerCss {
    width: 80%;
    max-width: 1350px;
    /* height:341px; */
    background: rgba(240, 240, 240, 1);
  }

  .answerCss {
    width: 80%;
    max-width: 1350px;
    background: white;
    border: 1px solid rgba(203, 203, 203, 1);
  }

  .saveBtn {
    width: 70px;
    height: 32px;
    background: rgba(61, 83, 230, 1);
    border-radius: 5px;
    color: white
  }

  .deleteBtn {
    width: 70px;
    height: 32px;
    border-radius: 5px;
    border: 1px solid rgba(51, 51, 51, 1);
  }

  .scoreInput {
    width: 40px;
    height: 28px;
    border-radius: 5px;
    border: 1px solid rgba(203, 203, 203, 1);
  }

  .scoreInput:focus {
    outline: none
  }

  .circle {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    border: 1px solid rgba(151, 151, 151, 1);
  }

  .addOpition {
    height: 32px;
    border-radius: 5px;
    border: 1px dashed rgba(203, 203, 203, 1);
  }

  .answerDetail {
    padding: 30px 70px
  }

  .isAnswer {
    background-color: #EF684A;
    padding: 2px;
  }
</style>

