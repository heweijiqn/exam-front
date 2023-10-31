<template>
  <div class="app-container">
    <el-table
      :data="resultTableData"
      height="calc(60vh - 80px)"
      style="width: 100%;">
      <el-table-column
        type="index"
        align="center"
        width="50">
      </el-table-column>
      <el-table-column
        prop="testpaperName"
        label="考试名称">
      </el-table-column>
      <el-table-column
        prop="score"
        label="得分"
        width="120">
      </el-table-column>
      <el-table-column
        prop="status"
        label="状态"
        width="120">
        <template slot-scope="scope">
          <span v-if="scope.row.status==='finished'">已完成</span>
          <span v-if="scope.row.status==='reviewing'">批阅中</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="date"
        label="更新时间"
        width="120">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.updateTime,'{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="left" width="120" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="detail(scope.row.id)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  export default {
    name: 'Index',
    props: ['resultTableData'],
    methods: {
      detail(id) {
        this.$router.push({
          path: '/exam/showTestPaperResultDetail',
          query: { id: id }
        })
      }
    }
  }
</script>

<style scoped>

</style>
