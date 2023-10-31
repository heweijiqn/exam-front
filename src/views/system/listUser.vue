<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input placeholder="关键字" v-model="query.keyWord" style="width: 200px;" class="filter-item"/>
      <el-button v-has-permission="['system:user:page']" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-search" @click="getList">
        查询
      </el-button>
      <el-button v-has-permission="['system:user:add']" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleAdd">
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
        prop="username"
        label="账号"
        width="100">
      </el-table-column>
      <el-table-column
        prop="email"
        label="邮箱">
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="手机号"
        width="110">
      </el-table-column>
      <el-table-column
        prop="nickname"
        label="昵称"
        width="120">
      </el-table-column>
      <el-table-column
        prop="gender"
        label="性别"
        width="50">
        <template slot-scope="scope">
          {{ scope.row.gender===0?'未知':(scope.row.gender===1?'男':'女') }}
        </template>
      </el-table-column>
      <el-table-column
        prop="idcard"
        label="身份证">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建日期"
        width="110">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime,'{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-has-permission="['system:user:edit']" type="primary" size="mini" @click="handleUpdate(scope.row.id)">
            修改
          </el-button>
          <el-button v-has-permission="['system:user:delete']" size="mini" type="danger" @click="handleDelete(scope.row)">
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
  import { listUser, deleteUser } from '@/api/system/user'

  export default {
    name: 'ListUser',
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
        listUser(params).then(response => {
          const data = response.data
          this.query.currentPage = data.current
          this.query.total = data.total
          this.tableData = data.records
        })
      },
      handleAdd() {
        this.$router.push({ path: '/system/addUser' })
      },
      handleUpdate(id) {
        if (id) {
          this.$router.push({
            path: '/system/updateUser',
            query: { id: id }
          })
        }
      },
      handleDelete(row) {
        const id = row.id
        this.$confirm('是否确认删除该条数据?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function() {
          return deleteUser(id)
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
