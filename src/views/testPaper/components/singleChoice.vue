<template>
  <div :class="{'Mt-20':paperQus}" class="W100 box-v-center">
    <div v-if="!paperQus" style="width: 80%;height: 55px;max-width: 1350px;" class="Mt-10 box-start mousePointer">
      <i class="el-icon-circle-plus normalBlue"/>
      <div class="Ml-10 normalBlue" @click="showAddPanel">添加单选题</div>
    </div>
    <div v-show="showAddTopic" class="addSingleCss box-start align-stretch Pt-20 Pb-20 gray-dark Mb-20">
      <div style="width: 80%;" class="box-v-start">
        <div class="box-justify Mb-16 align-stretch" style="width: 80%;">
          <div class="rest">
            <el-input :autosize="{minRows: 2,maxRows: 4}" v-model="question.stem" type="textarea" placeholder="请输入题干内容"/>
          </div>
          <div v-if="paperQus">分值：<input v-model="question.score" class="scoreInput">分</div>
        </div>
        <div class="box-justify Mb-16 align-stretch" style="width: 80%;">
          <div class="rest">
            <el-input :autosize="{ minRows: 2,maxRows: 4}" v-model="question.analysis" type="textarea" placeholder="请输入题目解析"/>
          </div>
        </div>
        <div v-for="(item, index) in question.options" :key="item.id" class="box-justify Mb-16" style="width: 80%;">
          <div class="rest box-start">
            <div class="box-start" style="width: 80%;">
              <div class="Mr-10 gray-medium box-start">
                <div class="circle Mr-10"/>
                {{ index + 1 | convert }}
              </div>
              <el-input
                v-model="item.title"
                class="rest"
                placeholder="请输入选项内容"
              />
            </div>
            <div class="rest box-start">
              <div style="position: absolute;width: 200px;" class="box-distribute Ml-10">
                <div :class="{isAnswer: item.isAnswer}" class="circle mousePointer" @click="setAnswer(index)"/>
                <p class="mousePointer" @click="setAnswer(index)">设为答案</p>
                <i class="el-icon-sort-up mousePointer" @click="upOption(index)"/>
                <i class="el-icon-sort-down mousePointer" @click="downOption(index)"/>
                <i class="el-icon-error mousePointer" @click="deleteOption(index)"/>
              </div>
            </div>
          </div>
        </div>
        <div class="box-justify Mb-16" style="width: 80%;">
          <div class="rest box-start">
            <div class="box-start" style="width: 80%;">
              <div class="rest addOption box-center mousePointer gray-light" @click="addOption">
                <i class="el-icon-circle-plus" style="letter-spacing: 10px;"/>添加选项
              </div>
            </div>
            <div class="rest box-start">
              <div style="position: absolute;width: 200px;" class="box-distribute Ml-10">
                <div class="saveBtn box-center mousePointer" @click="doAdd">保存</div>
                <div class="deleteBtn box-center mousePointer" @click="doClear">清除</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import { add } from '@/api/testPaper/question'

  export default {
    name: 'SingleChoice',
    props: ['copyQuestion', 'paperQus'],
    data() {
      return {
        textarea2: null,
        activeNames: ['1'],
        examQuestionList: [],
        question: {
          stem: null,
          score: null,
          answer: null,
          analysis: null,
          options: [
            {
              isAnswer: true,
              title: null,
              id: 1
            },
            {
              isAnswer: false,
              title: null,
              id: 2
            },
            {
              isAnswer: false,
              title: null,
              id: 3
            },
            {
              isAnswer: false,
              title: null,
              id: 4
            }
          ],
          keyWord: [],
          knowledgeType: []
        },
        showAddTopic: false,
        editIndexNow: null
      }
    },
    created() {
      if (this.copyQuestion !== undefined && this.copyQuestion != null && typeof this.copyQuestion === 'object') {
        this.showAddTopic = true
        this.question.stem = this.copyQuestion.stem
        this.question.score = this.copyQuestion.score
        this.question.answer = this.copyQuestion.answer
        this.question.analysis = this.copyQuestion.analysis
        if (this.copyQuestion.type === 'choice') {
          this.question.options = JSON.parse(this.copyQuestion.metas).choices.map((item, index) => {
            return {
              id: index + 1,
              title: item,
              isAnswer: (Number(this.question.answer) === index)
            }
          })
        }
      }
    },
    methods: {
      addOption() {
        this.question.options.push({
          isAnswer: false,
          title: null,
          id: new Date().getTime()
        })
      },
      setAnswer(index) {
        for (let i = 0; i < this.question.options.length; i++) {
          if (index === i) {
            this.$set(this.question.options[i], 'isAnswer', true)
          } else {
            this.$set(this.question.options[i], 'isAnswer', false)
          }
        }
      },
      deleteOption(index) {
        this.question.options.splice(index, 1)
      },
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
        let answerIndex = 0
        const metas = { choices: this.question.options.map(option => option.title) }
        for (let i = 0; i < this.question.options.length; i++) {
          if (this.question.options[i].isAnswer === true) {
            answerIndex = i
          }
        }
        const params = {
          stem: stem,
          analysis: this.question.analysis,
          answer: answerIndex,
          metas: JSON.stringify(metas),
          score: 0,
          type: 'choice'
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
          },
            {
              isAnswer: false,
              title: null,
              id: 2
            },
            {
              isAnswer: false,
              title: null,
              id: 3
            },
            {
              isAnswer: false,
              title: null,
              id: 4
            }],
          keyWord: [],
          knowledgeType: []
        }
        this.editIndexNow = null
        this.showAddTopic = false
      },
      upOption(index) {
        if (index === 0) {
          return
        }
        const option = this.question.options[index - 1]
        this.$set(this.question.options, index - 1, this.question.options[index])
        this.$set(this.question.options, index, option)
      },
      downOption(index) {
        if (index === this.question.options.length - 1) {
          return
        }
        const option = this.question.options[index + 1]
        this.$set(this.question.options, index + 1, this.question.options[index])
        this.$set(this.question.options, index, option)
      }
    }
  }
</script>
<style scoped>
  .addSingleCss {
    width: 80%;
    max-width: 1350px;
    background: rgba(240, 240, 240, 1);
  }

  .singleCss {
    width: 80%;
    max-width: 1350px;
    background: white;
    border: 1px solid rgba(200, 200, 200, 1);
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

  .addOption {
    height: 40px;
    border-radius: 5px;
    border: 2px dashed rgba(203, 203, 203, 1);
  }

  .singleDetail {
    padding: 30px 70px
  }

  .isAnswer {
    background-color: #EF684A;
    padding: 2px;
  }
</style>

