<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="rules" label-width="60px">
      <el-form-item label="账号" prop="username">
        <el-input v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password" type="password"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="form.email"></el-input>
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="form.mobile"></el-input>
      </el-form-item>
      <el-form-item label="昵称" prop="nickname">
        <el-input v-model="form.nickname"></el-input>
      </el-form-item>
      <el-form-item label="角色">
        <el-select v-model="form.roleId">
          <el-option label="请选择角色" :value="0"/>
          <el-option v-for="(item,index) in roles" :label="item.roleName" :value="item.roleId" :key="index"/>
        </el-select>
      </el-form-item>
      <el-form-item label="性别">
        <el-radio-group v-model="form.gender">
          <el-radio :label="1">男</el-radio>
          <el-radio :label="2">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="身份证">
        <el-input v-model="form.idcard"></el-input>
      </el-form-item>
      <el-form-item label="头像">
        <el-upload
          class="avatar-uploader"
          action="https://jsonplaceholder.typicode.com/posts/"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload">
          <img v-if="imageUrl" :src="imageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">添加</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import { addUser } from '@/api/system/user'
  import { listAllRole } from '@/api/system/role'

  export default {
    name: 'AddUser',
    data() {
      return {
        // 表单校验
        rules: {
          username: [
            { required: true, message: '账号不能为空', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '密码不能为空', trigger: 'blur' }
          ],
          email: [
            { required: true, message: '邮箱地址不能为空', trigger: 'blur' },
            {
              type: 'email',
              message: '请输入正确的邮箱地址',
              trigger: ['blur', 'change']
            }
          ],
          mobile: [
            { required: true, message: '手机号码不能为空', trigger: 'blur' },
            {
              pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
              message: '请输入正确的手机号码',
              trigger: 'blur'
            }
          ],
          nickname: [
            { required: true, message: '昵称不能为空', trigger: 'blur' }
          ]
        },
        imageUrl: '',
        form: {
          username: '',
          password: '',
          email: '',
          mobile: '',
          nickname: '',
          gender: 2,
          idcard: '',
          roleId: 0
        },
        roles: []
      }
    },
    created() {
      this.listAllRole()
    },
    methods: {
      onSubmit() {
        this.$refs['form'].validate(valid => {
          if (valid) {
            addUser(this.form).then(response => {
              if (response.code === 20000) {
                this.msgSuccess('添加成功')
                setTimeout(() => this.$router.push({ path: '/system/listUser' }), 1000)
              }
            }).catch(function() {
            })
          }
        })
      },
      handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw)
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg'
        const isLt2M = file.size / 1024 / 1024 < 2

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!')
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!')
        }
        return isJPG && isLt2M
      },
      listAllRole() {
        listAllRole().then(response => {
          if (response.code === 20000) {
            this.roles = response.data
          }
        }).catch(function() {
        })
      }
    }
  }
</script>

<style scoped>
  .avatar-uploader {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    width: 118px;
    height: 128px;
  }

  .avatar-uploader:hover {
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 118px;
    height: 128px;
    line-height: 128px;
    text-align: center;
  }

  .avatar {
    width: 118px;
    height: 128px;
    display: block;
  }
</style>
