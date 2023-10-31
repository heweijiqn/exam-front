<template>
  <div class="app-container">
    <el-table
      :data="tableData"
      height="calc(80vh - 80px)"
      border
      style="width: 100%;">
      <el-table-column
        type="index"
        align="center"
        width="50">
      </el-table-column>
      <el-table-column
        prop="testpaperName"
        label="试卷名称"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="userId"
        label="考生"
        width="80">
      </el-table-column>
      <el-table-column
        prop="subjectiveScore"
        label="客观题得分"
        width="120">
      </el-table-column>
      <el-table-column
        prop="usedTime"
        label="耗时(分)"
        width="120">
        <template slot-scope="scope">
          <span>{{ (scope.row.usedTime/60).toFixed(1) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="date"
        label="日期"
        width="120">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.updateTime,'{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="left" width="200" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="mark(scope.row.id)">阅卷</el-button>
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
  import { marks } from '@/api/testPaper/test-result'

  export default {
    name: 'ListMark',
    data() {
      return {
        query: {
          currentPage: 1,
          pageSize: 10,
          total: 0
        },
        tableData: []
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        const params = {
          'pNum': this.query.currentPage,
          'pSize': this.query.pageSize
        }
        marks(params).then(response => {
          const data = response.data
          this.query.currentPage = data.current
          this.query.total = data.total
          this.tableData = data.records
        })
      },
      mark(id) {
        this.$router.push({
          path: '/exam/markExam',
          query: { id: id }
        })
      }
    }
  }
</script>

<style scoped>

</style>
