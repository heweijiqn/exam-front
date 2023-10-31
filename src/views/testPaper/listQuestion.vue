<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="query.type" placeholder="请选择题型" class="filter-item">
        <el-option v-for="(item,index) in types" :label="item.title" :value="item.type" :key="index"/>
      </el-select>
      <el-input v-model="query.keyWord" placeholder="关键字" style="width: 200px;margin-left: 5px;" class="filter-item"/>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-search" @click="getList">
        查询
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-plus" @click="add(1)">
        手动添加
      </el-button>
      <el-button class="filter-item" type="primary" icon="el-icon-upload2" @click="add(2)">
        Excel导入
      </el-button>
    </div>

    <el-table
      :data="tableData"
      height="400px"
      border
      style="width: 100%">
      <el-table-column
        type="selection"
        align="center"
        width="50">
      </el-table-column>
      <el-table-column
        prop="type"
        label="题型"
        width="70">
        <template slot-scope="scope">
          {{ scope.row.type | convertQuestionTypeToTitle }}
        </template>
      </el-table-column>
      <el-table-column
        prop="stem"
        label="题干"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="usedNum"
        label="引用数"
        width="70">
      </el-table-column>
      <el-table-column
        prop="score"
        label="分值"
        width="50">
      </el-table-column>
      <el-table-column
        prop="answer"
        label="正确答案"
        width="200"
        show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.answer | convertQuestionAnswer(scope.row.type) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建日期"
        width="110">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime,'{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="120" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="copy(scope.row)">
            复制
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="query.total>0"
      :total="query.total"
      :page.sync="query.currentPage"
      :limit.sync="query.pageSize"
      @pagination="getList"
    />

  </div>
</template>

<script>
  import { listQuestion, listTypes } from '@/api/testPaper/question'

  export default {
    name: 'ListQuestion',
    data() {
      return {
        query: {
          type: '',
          keyWord: '',
          currentPage: 1,
          pageSize: 10,
          total: 0
        },
        tableData: [],
        types: []
      }
    },
    created() {
      this.getQuestionType()
      this.getList()
    },
    methods: {
      add(type) {
        if (type === 1) { // 手动添加
          this.$router.push({ path: '/testPaper/addQuestion' })
        } else if (type === 2) { // Excel导入
          this.$router.push('')
        }
      },
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
        })
      },
      // 复制
      copy(question) {
        this.$router.push({
          path: '/testPaper/addQuestion',
          query: {
            copyQuestion: question
          }
        })
      }
    }
  }
</script>

<style scoped>

</style>
