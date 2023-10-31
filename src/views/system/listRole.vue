<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input placeholder="关键字" v-model="query.keyWord" style="width: 200px;" class="filter-item"/>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-search" @click="getList">
        查询
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleAdd">
        添加
      </el-button>
    </div>

    <el-table
      :data="tableData"
      height="calc(80vh - 80px)"
      border
      style="width: 100%">
      <el-table-column
        type="selection"
        align="center"
        width="50">
      </el-table-column>
      <el-table-column
        prop="roleName"
        label="角色名称">
      </el-table-column>
      <el-table-column
        prop="roleKey"
        label="角色代码">
      </el-table-column>
      <el-table-column
        prop="roleSort"
        label="显示顺序">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row.roleId)">
            修改
          </el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">
            删除
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
  import { listRole, deleteRole } from '@/api/system/role'

  export default {
    name: 'ListRole',
    data() {
      return {
        tableData: [],
        query: {
          currentPage: 1,
          keyWord: '',
          pageSize: 10,
          total: 0
        }
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        const params = { 'keyword': this.query.keyWord, 'pNum': this.query.currentPage, 'pSize': this.query.pageSize }
        listRole(params).then(response => {
          const data = response.data
          this.query.currentPage = data.current
          this.query.total = data.total
          this.tableData = data.records
        })
      },
      handleAdd() {
        this.$router.push({
          path: '/system/addRole'
        })
      },
      handleUpdate(id) {
        if (id) {
          this.$router.push({
            path: '/system/updateRole',
            query: { id: id }
          })
        }
      },
      handleDelete(row) {
        const params = { id: row.roleId }
        this.$confirm('是否确认删除该条数据?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function() {
          return deleteRole(params)
        }).then(() => {
          this.msgSuccess('删除成功')
          this.getList()
        }).catch(function() {
        })
      }
    }
  }
</script>

<style scoped>

</style>
