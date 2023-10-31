<template>
  <el-table
    :data="tableData"
    height="300px"
    :show-header="isShowHeader"
    style="width: 100%">
    <el-table-column
      align="left"
      type="index"
      label="序号"
      width="40">
    </el-table-column>
    <el-table-column
      prop="stem"
      label="题干"
      align="left"
      show-overflow-tooltip>
    </el-table-column>
    <el-table-column
      prop="answer"
      width="200"
      label="参考答案"
      align="left"
      show-overflow-tooltip>
      <template slot-scope="scope">
        {{ scope.row.answer | convertQuestionAnswer(scope.row.type) }}
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
  export default {
    name: 'QuestionListDetail',
    props: ['tableData'],
    data() {
      return {
        isShowHeader: false
      }
    }
  }
</script>

<style scoped>

</style>
