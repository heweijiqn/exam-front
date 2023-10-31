/**
 * 数字转换成字母
 * @param num
 * @returns {string}
 */
export function convert(num) {
  return num <= 26 ? String.fromCharCode(num + 64) : convert(~~((num - 1) / 26)) + convert(num % 26 || 26)
}

/**
 * 将试卷类型转换为中文
 * @param type
 * @returns {string}
 */
export function convertTestPaperTypeToTitle(type) {
  let title = ''
  if (type === 'training') {
    title = '日常练习'
  } else if (type === 'mock') {
    title = '模拟考试'
  } else if (type === 'formal') {
    title = '正式考试'
  }
  return title
}

/**
 * 将题型转换为中文
 * @param type
 * @returns {string}
 */
export function convertQuestionTypeToTitle(type) {
  let title = ''
  if (type === 'choice') {
    title = '单选题'
  } else if (type === 'choice_multi') {
    title = '多选题'
  } else if (type === 'true_false') {
    title = '判断题'
  } else if (type === 'fill_blank') {
    title = '填空题'
  } else if (type === 'question') {
    title = '问答题'
  }
  return title
}

/**
 * 将答案转换成中文
 * @param answer
 * @param type
 * @returns {string}
 */
export function convertQuestionAnswer(answer, type) {
  let result = ''
  if (type === 'choice') {
    result = convertQuestionAnswerForChoice(answer)
  } else if (type === 'choice_multi') {
    result = convertQuestionAnswerForChoiceMulti(answer)
  } else if (type === 'true_false') {
    result = convertQuestionAnswerForTrueFalse(answer)
  } else if (type === 'fill_blank') {
    result = convertQuestionAnswerForFillBlank(answer)
  } else if (type === 'question') {
    result = answer
  }
  return result
}

/**
 * 将单选题答案转换成中文
 * @param answer
 * @returns {string}
 */
function convertQuestionAnswerForChoice(answer) {
  const arr = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']
  return arr[answer]
}

/**
 * 将多选题答案转换成中文
 * @param answer
 * @returns {string}
 */
function convertQuestionAnswerForChoiceMulti(answer) {
  let result = ''
  const answerArr = JSON.parse(answer)
  answerArr.forEach((value, index) => {
    if (index === answerArr.length - 1) {
      result += convertQuestionAnswerForChoice(value)
    } else {
      result += convertQuestionAnswerForChoice(value) + '、'
    }
  })
  return result
}

/**
 * 将判断题答案转换成中文
 * @param answer
 * @returns {string}
 */
function convertQuestionAnswerForTrueFalse(answer) {
  const arr = ['正确', '错误']
  return arr[answer]
}

/**
 * 将填空题答案转换成中文
 * @param answer
 * @returns {string}
 */
function convertQuestionAnswerForFillBlank(answer) {
  let result = ''
  const answerArr = JSON.parse(answer)
  answerArr.forEach((value, index) => {
    if (index === answerArr.length - 1) {
      result += value
    } else {
      result += value + ' '
    }
  })
  return result
}

/**
 * 倒计时
 * @param value
 * @returns {string|null}
 */
export function countdownFilter(value) {
  if (value === null) {
    return null
  }
  // 秒
  let secondTime = parseInt(value)
  // 分
  let minuteTime = 0
  // 小时
  let hourTime = 0
  // 天
  let dayTime = 0
  if (secondTime > 60) { // 如果秒数大于60，将秒数转换成整数
    // 获取分钟，除以60取整数，得到整数分钟
    minuteTime = parseInt(secondTime / 60)
    // 获取秒数，秒数取佘，得到整数秒数
    secondTime = parseInt(secondTime % 60)
    // 如果分钟大于60，将分钟转换成小时
    if (minuteTime > 59) {
      // 获取小时，获取分钟除以60，得到整数小时
      hourTime = parseInt(minuteTime / 60)
      // 获取小时后取佘的分，获取分钟除以60取佘的分
      minuteTime = parseInt(minuteTime % 60)
    }
    // 如果小时大于24，将小时转换成天
    if (hourTime > 23) {
      // 获取天，获取分钟除以60，得到整数天
      dayTime = parseInt(hourTime / 24)
      // 获取天后取佘的小时，获取小时除以24取佘的小时
      hourTime = parseInt(hourTime % 24)
    }
  }
  let result = ''
  if (secondTime >= 0) {
    if (secondTime > 9) {
      result = '' + parseInt(secondTime)
    } else {
      result = '' + '0' + parseInt(secondTime)
    }
  }
  if (minuteTime >= 0) {
    if (minuteTime > 9) {
      result = '' + parseInt(minuteTime) + ':' + result
    } else {
      result = '' + '0' + parseInt(minuteTime) + ':' + result
    }
  }
  if (hourTime >= 0) {
    if (hourTime > 9) {
      result = '' + parseInt(hourTime) + ':' + result
    } else {
      result = '' + '0' + parseInt(hourTime) + ':' + result
    }
  }
  if (dayTime > 0) {
    result = '' + parseInt(dayTime) + ':' + result
  }
  return result
}
