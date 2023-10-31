<template>
  <div>
    <div class="box-start filter-container">
      <el-select v-model="query.type" placeholder="请选择试题类型">
        <el-option v-for="(item,index) in types" :label="item.title" :value="item.type" :key="index"/>
      </el-select>
      <el-input v-model="query.keyWord" class="Mr-16 Ml-20 rest" placeholder="关键字" prefix-icon="el-icon-search"/>
      <el-button type="primary" class="searchButton" style="background-color: #3D53E6;" @click="getList">搜索</el-button>
    </div>
    <el-table
      ref="table"
      :data="tableData"
      stripe
      height="398"
      size="mini"
      style="min-width: 100%"
      @select="selectCheck"
      @select-all="selectCheck"
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        align="center"
        width="55"/>
      <el-table-column
        label="题型"
        prop="type"
        width="100">
        <template slot-scope="scope">
          {{ scope.row.type | convertQuestionTypeToTitle }}
        </template>
      </el-table-column>
      <el-table-column
        label="题干"
        prop="stem"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        label="创建时间"
        prop="createTime"
        width="130">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime,'{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
    </el-table>

    <!--分页组件-->
    <pagination
      v-show="query.total>0"
      :total="query.total"
      :page.sync="query.currentPage"
      :limit.sync="query.pageSize"
      @pagination="getList"
    />

    <div class="W100 scoreContainer">
      <div class="box-start Mb-20">
        <div class="Mr-20">当前已选中：{{ allSelected.length }}道题目</div>
        <div>共计{{ allScore }}分</div>
      </div>
      <div class="box-start">
        <div class="itemCss">
          <div class="Mb-20">题型：</div>
          <div class="Mb-20">题数：</div>
          <div class="Mb-20 box-start" style="height:25px">分数：</div>
        </div>
        <div class="itemCss">
          <div class="Mb-20">单选题</div>
          <div class="Mb-20">{{ scoreObj.singleNum }}</div>
          <div class="Mb-20"><input v-model.number="scoreObj.singleScore" type="text" class="scoreInput"></div>
        </div>
        <div class="itemCss">
          <div class="Mb-20">多选题</div>
          <div class="Mb-20">{{ scoreObj.moreNum }}</div>
          <div class="Mb-20"><input v-model.number="scoreObj.moreScore" type="text" class="scoreInput"></div>
        </div>
        <div class="itemCss">
          <div class="Mb-20">判断题</div>
          <div class="Mb-20">{{ scoreObj.judgNum }}</div>
          <div class="Mb-20"><input v-model.number="scoreObj.judgScore" type="text" class="scoreInput"></div>
        </div>
        <div class="itemCss">
          <div class="Mb-20">填空题</div>
          <div class="Mb-20">{{ scoreObj.blankNum }}</div>
          <div class="Mb-20"><input v-model.number="scoreObj.blankScore" type="text" class="scoreInput"></div>
        </div>
        <div class="itemCss">
          <div class="Mb-20">问答题</div>
          <div class="Mb-20">{{ scoreObj.answerNum }}</div>
          <div class="Mb-20"><input v-model.number="scoreObj.answerScore" type="text" class="scoreInput"></div>
        </div>
      </div>
    </div>
    <div class="box-end">
      <el-button type="primary" @click="sureSelect">确定</el-button>
    </div>
  </div>
</template>
<script>
  import { listQuestion, listTypes } from '@/api/testPaper/question'

  export default {
    name: 'SelectQuestion',
    props: {
      selectedQuestions: {
        type: Array,
        default: null
      }
    },
    data() {
      return {
        tableData: [],
        types: [],
        query: {
          type: '',
          keyWord: '',
          currentPage: 1,
          pageSize: 10,
          total: 0
        },
        // 所有选中的数据
        allSelected: [],
        // 当前选中的数据
        currentSelected: [],
        scoreObj: {
          singleScore: 0,
          moreScore: 0,
          missMoreScore: 0,
          judgScore: 0,
          blankScore: 0,
          answerScore: 0,
          singleNum: 0,
          moreNum: 0,
          judgNum: 0,
          blankNum: 0,
          answerNum: 0
        }
      }
    },
    computed: {
      allScore() {
        const temp =
          this.scoreObj.singleScore * this.scoreObj.singleNum +
          this.scoreObj.moreScore * this.scoreObj.moreNum +
          this.scoreObj.judgScore * this.scoreObj.judgNum +
          this.scoreObj.blankScore * this.scoreObj.blankNum +
          this.scoreObj.answerScore * this.scoreObj.answerNum
        return temp
      }
    },
    watch: {
      allSelected: {
        handler(val) {
          this.scoreObj.singleNum = 0
          this.scoreObj.moreNum = 0
          this.scoreObj.judgNum = 0
          this.scoreObj.blankNum = 0
          this.scoreObj.answerNum = 0
          for (let i = 0; i < val.length; i++) {
            if (val[i].type === 'choice') {
              this.scoreObj.singleNum = this.scoreObj.singleNum + 1
            } else if (val[i].type === 'choice_multi') {
              this.scoreObj.moreNum = this.scoreObj.moreNum + 1
            } else if (val[i].type === 'true_false') {
              this.scoreObj.judgNum = this.scoreObj.judgNum + 1
            } else if (val[i].type === 'fill_blank') {
              this.scoreObj.blankNum = this.scoreObj.blankNum + 1
            } else if (val[i].type === 'question') {
              this.scoreObj.answerNum = this.scoreObj.answerNum + 1
            }
          }
        },
        deep: true
      }
    },
    created() {
      this.allSelected = this.selectedQuestions
      this.getQuestionType()
      this.getList()
    },
    methods: {
      getQuestionType() {
        listTypes().then(response => {
          this.types = response.data
        }).catch(function() {
        })
      },
      getList() {
        const params = {
          'type': this.query.type,
          'keyword': this.query.keyWord,
          'pNum': this.query.currentPage,
          'pSize': this.query.pageSize
        }
        listQuestion(params).then(response => {
          const data = response.data
          this.query.currentPage = data.current
          this.query.total = data.total
          this.tableData = data.records
          // 200毫秒后设置选中
          setTimeout(() => {
            this.setSelected()
          }, 200)
        })
      },
      sureSelect() {
        if (this.scoreObj.singleNum !== 0) {
          if (this.scoreObj.singleScore === 0 || !this.scoreObj.singleScore) {
            this.$message('请将分数填写完整')
            return
          }
        }
        if (this.scoreObj.moreNum !== 0) {
          if (this.scoreObj.moreScore === 0 || !this.scoreObj.moreScore) {
            this.$message('请将分数填写完整')
            return
          }
        }
        if (this.scoreObj.judgNum !== 0) {
          if (this.scoreObj.judgScore === 0 || !this.scoreObj.judgScore) {
            this.$message('请将分数填写完整')
            return
          }
        }
        if (this.scoreObj.blankNum !== 0) {
          if (this.scoreObj.blankScore === 0 || !this.scoreObj.blankScore) {
            this.$message('请将分数填写完整')
            return
          }
        }
        if (this.scoreObj.answerNum !== 0) {
          if (this.scoreObj.answerScore === 0 || !this.scoreObj.answerScore) {
            this.$message('请将分数填写完整')
            return
          }
        }
        this.getAllSelected()
        const tempObj = {
          allSelected: JSON.stringify(this.allSelected),
          scoreObj: this.scoreObj
        }
        this.$emit('getSelectedQuestion', tempObj)
      },
      selectCheck(selection) {
        this.currentSelected = selection
        this.getAllSelected()
      },
      // 设置选中
      setSelected() {
        if (!this.allSelected || this.allSelected <= 0) {
          return
        }

        const allSelectedIdArray = []
        this.allSelected.forEach(row => {
          allSelectedIdArray.push(row.id)
        })

        this.$refs.table.clearSelection()
        for (let i = 0; i < this.tableData.length; i++) {
          if (allSelectedIdArray.indexOf(this.tableData[i]['id']) >= 0) {
            this.$refs.table.toggleRowSelection(this.tableData[i], true)
          }
        }
      },
      handleSelectionChange(selection) {
        this.currentSelected = selection
      },
      // 获取所有选中的数据
      getAllSelected() {
        const that = this
        // 首次选择，所有选中数据就是当前选中数据
        if (this.allSelected.length <= 0) {
          this.allSelected = this.currentSelected
          return
        }

        // 所有选中的id
        const allSelectedIdArray = []
        this.allSelected.forEach(row => {
          allSelectedIdArray.push(row.id)
        })

        // 当前选中的id
        const currentSelectedIdArray = []
        this.currentSelected.forEach(row => {
          currentSelectedIdArray.push(row.id)
          if (allSelectedIdArray.indexOf(row.id) === -1) {
            that.allSelected.push(row)
            allSelectedIdArray.push(row.id)
          }
        })

        // 当前没有选中的id
        const noSelectedIdArray = []
        this.tableData.forEach(row => {
          if (currentSelectedIdArray.indexOf(row.id) === -1) {
            noSelectedIdArray.push(row.id)
          }
        })

        noSelectedIdArray.forEach(id => {
          if (allSelectedIdArray.indexOf(id) >= 0) {
            for (let i = 0; i < that.allSelected.length; i++) {
              if (that.allSelected[i].id === id) {
                that.allSelected.splice(i, 1)
                break
              }
            }
          }
        })
      }
    }
  }
</script>
<style scoped>
  .itemCss {
    width: 65px;
  }

  .scoreInput {
    width: 40px;
    height: 25px;
    border-radius: 5px;
    border: 1px solid #dadada;
    padding: 5px 10px
  }

  .scoreInput:focus {
    outline: none
  }

  .scoreContainer {
    background-color: antiquewhite;
    padding: 10px;
    margin-bottom: 20px;
    margin-top: 10px
  }
</style>

