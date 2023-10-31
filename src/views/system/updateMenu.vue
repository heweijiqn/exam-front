<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="菜单名称" prop="menuName">
        <el-input v-model="form.menuName"></el-input>
      </el-form-item>
      <el-form-item label="父级菜单">
        <el-select v-model="form.parentId">
          <el-option label="一级目录" :value="0"/>
          <el-option v-for="(item,index) in parentMenus" :label="item.menuName" :value="item.menuId" :key="index"/>
        </el-select>
      </el-form-item>
      <el-form-item label="显示顺序" prop="orderNum">
        <el-input v-model="form.orderNum"></el-input>
      </el-form-item>
      <el-form-item label="路由地址" prop="path">
        <el-input v-model="form.path"></el-input>
      </el-form-item>
      <el-form-item label="组件路径" prop="component">
        <el-input v-model="form.component"></el-input>
      </el-form-item>
      <el-form-item label="是否外链">
        <el-radio-group v-model="form.isFrame">
          <el-radio :label="0">是</el-radio>
          <el-radio :label="1">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="菜单类型">
        <el-radio-group v-model="form.menuType">
          <el-radio label="M">目录</el-radio>
          <el-radio label="C">菜单</el-radio>
          <el-radio label="F">按钮</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="菜单状态">
        <el-radio-group v-model="form.visible">
          <el-radio label="0">显示</el-radio>
          <el-radio label="1">隐藏</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="权限标识" prop="perms">
        <el-input v-model="form.perms"></el-input>
      </el-form-item>
      <el-form-item label="菜单图标" prop="icon">
        <el-input v-model="form.icon"></el-input>
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="form.remark"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">提交</el-button>
        <el-button @click="onCancel">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import { queryMC, getMenu, updateMenu } from '@/api/system/menu'

  export default {
    name: 'UpdateMenu',
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
          menuName: '',
          parentId: 0,
          orderNum: 0,
          path: '',
          component: '',
          isFrame: 1,
          menuType: 'F',
          visible: '1',
          perms: '',
          icon: '#',
          remark: ''
        },
        parentMenus: []
      }
    },
    computed: {
      menuId() {
        return this.$route.query.id
      }
    },
    watch: {
      'form.menuType': {
        handler(val, oldVal) {
          if (val === 'M' || val === 'C') {
            this.form.visible = '0'
          } else {
            this.form.visible = '1'
          }
        },
        deep: true
      }
    },
    created() {
      this.get()
      queryMC().then(response => {
        if (response.code === 20000) {
          this.parentMenus = response.data
        }
      }).catch(function() {
      })
    },
    methods: {
      onSubmit() {
        this.$refs['form'].validate(valid => {
          if (valid) {
            updateMenu(this.form).then(response => {
              if (response.code === 20000) {
                this.msgSuccess('修改成功')
                setTimeout(() => this.$router.push({ path: '/system/listMenu' }), 1000)
              }
            }).catch(function() {
            })
          }
        })
      },
      onCancel() {
        this.$message({
          message: 'cancel!',
          type: 'warning'
        })
      },
      get() {
        const params = { id: this.menuId }
        getMenu(params).then(response => {
          if (response.code === 20000) {
            this.form = response.data
          }
        }).catch(function() {
        })
      }
    }
  }
</script>

<style scoped>

</style>
