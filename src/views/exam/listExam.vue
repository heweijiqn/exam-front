<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="query.type" placeholder="请选择考试类型" class="filter-item">
        <el-option v-for="(item,index) in types" :label="item.title" :value="item.type" :key="index"/>
      </el-select>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-search" @click="getList">
        查询
      </el-button>
    </div>

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
        prop="type"
        label="考试类型"
        width="100">
        <template slot-scope="scope">
          {{ scope.row.type | convertTestPaperTypeToTitle }}
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="试卷名称"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="limitedTime"
        label="限时"
        width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.limitedTime / 60 }} 分钟</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="remainTimes"
        label="考试次数"
        width="120">
        <template slot-scope="scope">
          <span v-if="scope.row.times===0">不限</span>
          <span v-else>{{ scope.row.times - scope.row.resultTimes }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="date"
        label="日期"
        width="120">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime,'{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="left" width="200" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-if="scope.row.times===0 || (scope.row.times - scope.row.resultTimes)>0" type="primary" size="mini" @click="startExam(scope.row.id)">开始考试
          </el-button>
          <el-button v-if="scope.row.resultTimes>0" type="primary" size="mini" @click="showResult(scope.row.id)">查看结果</el-button>
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

    <!-- 选择试题弹出层 -->
    <el-dialog :visible.sync="isShowDialog" :append-to-body="true" :close-on-click-modal="false" top="5vh" width="800px" style="padding:0px;">
      <ShowTestResult :resultTableData="resultTableData"/>
    </el-dialog>

  </div>
</template>

<script>
  import ShowTestResult from '@/components/ShowTestResult'
  import { listExam, listTypes } from '@/api/testPaper/test-paper'
  import { list } from '@/api/testPaper/test-result'

  export default {
    name: 'ListTestPaper',
    components: { ShowTestResult },
    data() {
      return {
        isShowDialog: false,
        query: {
          type: '',
          currentPage: 1,
          pageSize: 10,
          total: 0
        },
        tableData: [],
        resultTableData: [],
        types: []
      }
    },
    created() {
      this.getTestPaperTypes()
      this.getList()
    },
    methods: {
      getTestPaperTypes() {
        listTypes().then(response => {
          this.types = response.data
        }).catch(function() {
        })
      },
      getList() {
        const params = {
          'type': this.query.type,
          'pNum': this.query.currentPage,
          'pSize': this.query.pageSize
        }
        listExam(params).then(response => {
          const data = response.data
          this.query.currentPage = data.current
          this.query.total = data.total
          this.tableData = data.records
        })
      },
      startExam(id) {
        this.$router.push({
          path: '/startExam',
          query: { id: id }
        })
      },
      showResult(id) {
        this.isShowDialog = true
        const params = {
          'id': id
        }
        list(params).then(response => {
          this.resultTableData = response.data
        })
      }
    }
  }
</script>

<style scoped>

</style>
