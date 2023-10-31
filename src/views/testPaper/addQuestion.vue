<template>
  <div class="app-container" style="min-height: calc(100vh - 60px);width: 100%;">
    <AddQuestionMain :copyQuestion="copyQuestion"/>
  </div>
</template>
<script>
  import AddQuestionMain from './components/addQuestionMain'

  export default {
    name: 'AddQuestion',
    components: {
      AddQuestionMain
    },
    data() {
      return {
        copyQuestion: null
      }
    },
    created() {
      const data = this.$route.query.copyQuestion
      if (data !== undefined) {
        this.copyQuestion = data
      }
    }
  }
</script>
