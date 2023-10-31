<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="form.roleName"></el-input>
      </el-form-item>
      <el-form-item label="角色代码" prop="roleKey">
        <el-input v-model="form.roleKey"></el-input>
      </el-form-item>
      <el-form-item label="显示顺序" prop="roleSort">
        <el-input v-model="form.roleSort"></el-input>
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="form.remark"></el-input>
      </el-form-item>
      <el-form-item label="授权">
        <el-tree
          ref="tree"
          :data="treeData"
          show-checkbox
          default-expand-all
          check-strictly
          node-key="id">
        </el-tree>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import { getRole, updateRole } from '@/api/system/role'
  import { listMenuTree } from '@/api/system/menu'

  export default {
    name: 'UpdateRole',
    data() {
      return {
        // 表单校验
        rules: {
          roleName: [
            { required: true, message: '角色名称不能为空', trigger: 'blur' }
          ],
          roleKey: [
            { required: true, message: '角色代码不能为空', trigger: 'blur' }
          ]
        },
        form: {
          roleName: '',
          roleKey: '',
          roleSort: 0,
          remark: ''
        },
        treeData: []
      }
    },
    computed: {
      roleId() {
        return this.$route.query.id
      }
    },
    created() {
      this.get()
      this.getTreeData()
    },
    methods: {
      onSubmit() {
        const keys = this.$refs.tree.getCheckedKeys()
        if (keys.length === 0) {
          this.msgError('请选择授权信息')
          return
        }

        this.$refs['form'].validate(valid => {
          if (valid) {
            const params = { menuIds: keys.toString() }
            updateRole(this.form, params).then(response => {
              if (response.code === 20000) {
                this.msgSuccess('修改成功')
                setTimeout(() => this.$router.push({ path: '/system/listRole' }), 1000)
              }
            }).catch(function() {
            })
          }
        })
      },
      get() {
        const params = { id: this.roleId }
        getRole(params).then(response => {
          if (response.code === 20000) {
            this.form = response.data
            this.$refs.tree.setCheckedKeys(response.data.ownedMenuIds)
          }
        }).catch(function() {
        })
      },
      getTreeData() {
        listMenuTree().then(response => {
          if (response.code === 20000) {
            this.treeData = response.data
          }
        }).catch(function() {
        })
      }
    }
  }
</script>

<style scoped>

</style>
