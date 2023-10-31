<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="query.type" placeholder="请选择试卷类型" class="filter-item">
        <el-option v-for="(item,index) in types" :label="item.title" :value="item.type" :key="index"/>
      </el-select>
      <el-input placeholder="Title" style="width: 200px;margin-left: 5px;" class="filter-item"/>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-search" @click="getList">
        查询
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="add()">
        添加
      </el-button>
    </div>

    <el-table
      :data="tableData"
      height="400px"
      border
      style="width: 100%">
      <el-table-column
        type="index"
        align="center"
        width="50">
      </el-table-column>
      <el-table-column
        prop="type"
        label="试卷类型"
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
        prop="totalScore"
        label="总分"
        width="60">
      </el-table-column>
      <el-table-column
        prop="passedScore"
        label="及格分"
        width="80">
      </el-table-column>
      <el-table-column
        prop="limitedTime"
        label="限时（秒）"
        width="100">
      </el-table-column>
      <el-table-column
        prop="date"
        label="日期"
        width="110">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime,'{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="left" width="240" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="preview(scope.row.id)">预览</el-button>
          <el-button size="mini" type="success" v-if="scope.row.isUsed===0" @click="publish(scope.row.id)">发布</el-button>
          <el-button size="mini" type="danger" @click="del(scope.row.id)">删除</el-button>
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
  import { listTypes, listTestPaper, publish, deleteTestPaper } from '@/api/testPaper/test-paper'

  export default {
    name: 'ListTestPaper',
    inject: ['reload'],
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
      this.getTestPaperTypes()
      this.getList()
    },
    methods: {
      add() {
        this.$router.push({ path: '/testPaper/addTestPaper' })
      },
      getTestPaperTypes() {
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
        listTestPaper(params).then(response => {
          const data = response.data
          this.query.currentPage = data.current
          this.query.total = data.total
          this.tableData = data.records
        })
      },
      preview(id) {
        this.$router.push({
          path: '/testPaper/previewTestPaper',
          query: { id: id }
        })
      },
      // 发布试卷
      publish(id) {
        this.$confirm('确认发布？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'info'
        }).then(() => {
          const params = { id: id }
          publish(params).then(response => {
            if (response.code === 20000) {
              this.msgSuccess('已发布')
              setTimeout(() => this.reload(), 500)
            }
          }).catch(function() {
          })
        })
      },
      // 删除
      del(id) {
        this.$confirm('确认删除？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'info'
        }).then(() => {
          const params = { id: id }
          deleteTestPaper(params).then(response => {
            if (response.code === 20000) {
              this.msgSuccess('已删除')
              setTimeout(() => this.reload(), 500)
            }
          }).catch(function() {
          })
        })
      }
    }
  }
</script>

<style scoped>

</style>
