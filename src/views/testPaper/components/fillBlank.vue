<template>
  <div :class="{'Mt-20':paperQus}" class="W100 box-v-center">
    <div v-if="!paperQus" style="width: 80%;height: 55px;max-width: 1350px;" class="Mt-10 box-start mousePointer">
      <i class="el-icon-circle-plus normalBlue"/>
      <div class="Ml-10 normalBlue" @click="showAddPanel">添加填空题</div>
    </div>
    <div v-show="showAddTopic" class="addBlankCss box-start align-stretch Pt-20 Pb-20 gray-dark Mb-20">
      <div style="width: 80%;" class="box-v-start">
        <div class="box-justify Mb-16 align-stretch" style="width: 80%;">
          <div class="rest">
            <div class="box-start blankCssInput">
              <el-button size="mini" type="primary" class="Mr-10" @click="setBlank">设为空格</el-button>
              <div>输入完整题干后，选中需要填空的文字点击“设为空格”</div>
            </div>
            <textarea ref="textarea" v-model="examQuestion.name" rows="3" class="textareaCss"/>
            <div style="line-height: 20px;width: 90%;" class="Mb-20">效果预览：{{ examQuestion.name2}}</div>
            <div v-for="(item,index) in answer" :key="index" class="box-start-wrap Mb-10">
              <div>空格{{ index + 1 }}：{{ item }}</div>
              <div class="mousePointer Ml-10 C4598E8" @click="deleteBlank(index)">取消空格</div>
            </div>
          </div>
          <div v-if="paperQus">
            <div class="Mb-10">分值：<input v-model="examQuestion.score" class="scoreInput">分</div>
            <div>每空：<input v-model="examQuestion.score" class="scoreInput">分</div>
          </div>
        </div>
        <div class="box-justify Mb-16 align-stretch" style="width: 80%;">
          <div class="rest">
            <el-input :autosize="{ minRows: 2,maxRows: 4}" v-model="examQuestion.analysis" type="textarea" placeholder="请输入题目解析"/>
          </div>
        </div>
        <div class="box-justify Mb-16" style="width: 80%;">
          <div class="rest box-start">
            <div class="saveBtn box-center mousePointer" @click="doAdd">保存</div>
            <div class="deleteBtn box-center mousePointer Ml-16" @click="doClear">清除</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import { add } from '@/api/testPaper/question'

  export default {
    name: 'FillBlank',
    props: ['copyQuestion', 'paperQus'],
    data() {
      return {
        textarea2: null,
        activeNames: ['1'],
        examQuestionList: [],
        question: {
          name: null,
          name2: null
        },
        examQuestion: {
          analysis: null,
          answer: null,
          stem: null,
          score: null,
          name: null,
          name2: null,
          blankAnswer: [],
          blankName: [],
          options: [],
          keyWord: [],
          knowledgeType: []
        },
        showAddTopic: false,
        editIndexNow: null,
        answer: [],
        answerStem: null
      }
    },
    computed: {
      treeDataList() {
        return this.$store.getters.chapterType
      }
    },
    watch: {
      'examQuestion.name'(newValue, oldValue) {
        if (newValue === null) {
          return
        }
        this.examQuestion.name2 = this.examQuestion.name.replace(/\{{(.+?)\}}/g, '_______')
      }
    },
    created() {
      if (this.copyQuestion !== undefined && this.copyQuestion != null && typeof this.copyQuestion === 'object') {
        this.showAddTopic = true
        this.answer = JSON.parse(this.copyQuestion.answer)
        this.examQuestion.name = this.copyQuestion.stem
        this.answer.forEach(t => {
          this.examQuestion.name = this.examQuestion.name.replace(/\{\{}}/, '{{' + t + '}}')
        })
        this.examQuestion.score = this.copyQuestion.score
        this.examQuestion.analysis = this.copyQuestion.analysis
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
        const params = {
          analysis: this.examQuestion.analysis,
          answer: JSON.stringify(this.answer),
          metas: JSON.stringify(this.examQuestion.blankName),
          score: 0,
          stem: this.examQuestion.name2.replace(/_______/g, '{{}}'),
          type: 'fill_blank'
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
        this.examQuestion = {
          analysis: null,
          answer: null,
          stem: null,
          score: null,
          showAddTopic: false,
          name: null,
          name2: null,
          blankAnswer: [],
          blankName: [],
          options: [],
          keyWord: [],
          knowledgeType: []
        }
        this.answer = []
        this.editIndexNow = null
        this.showAddTopic = false
      },
      setBlank() {
        const selectionStart = this.$refs.textarea.selectionStart
        const selectionEnd = this.$refs.textarea.selectionEnd
        if (selectionStart === selectionEnd) {
          this.$message('请选中文字')
          return
        }
        const text = window.getSelection().toString()
        if (text.indexOf('{{') !== -1 || text.indexOf('}}') !== -1) {
          this.$message('不允许这么操作，请先取消原空格')
          return
        }
        this.examQuestion.name = this.examQuestion.name.slice(0, selectionStart) + '{{' + this.examQuestion.name.slice(selectionStart)
        this.examQuestion.name = this.examQuestion.name.slice(0, selectionEnd + 2) + '}}' + this.examQuestion.name.slice(selectionEnd + 2)
        this.answer = []
        this.answer = this.$getBracketStr(this.examQuestion.name)
        this.$refs.textarea.selectionStart = 0
        this.$refs.textarea.selectionEnd = 0
      },
      // 撤销空格操作
      deleteBlank(index) {
        const tempStr = this.answer[index]
        this.examQuestion.name = this.examQuestion.name.replace('{{' + tempStr + '}}', tempStr)
        this.examQuestion.name2 = this.examQuestion.name.replace(/\{{(.+?)\}}/g, '_______')
        this.answer.splice(index, 1)
      }
    }
  }
</script>
<style scoped>
  .addBlankCss {
    width: 80%;
    max-width: 1350px;
    background: rgba(240, 240, 240, 1);
  }

  .blankCss {
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

  .blankDetail {
    padding: 30px 70px
  }

  .isAnswer {
    background-color: #EF684A;
    padding: 2px;
  }

  /* ############填空 */
  .blankCssInput {
    border: 1px solid #dadada;
    width: 90%;
    padding-left: 10px;
    padding-top: 5px;
    padding-bottom: 5px;
  }

  .textareaCss {
    width: 90%;
    padding: 5px;
    line-height: 20px;
    border: 1px solid #dadada;
    margin-bottom: 15px;
  }

  .textareaCss:focus {
    outline: none
  }
</style>

