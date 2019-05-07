//时间格式转换
function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
//日期格式转换
function formatDate(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('-');
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

//完整性校验
function checkSuffix(queryStr) {
  let md5 = require('MD5.js');
  let token = wx.getStorageSync('token');
  //encode编码后md5加密
  let paramsDigestCode = md5.encode(encodeURI(queryStr));
  //加密结果再加密
  let QY_CHECK_SUFFIX = md5.encode(paramsDigestCode + '@@' + token);
  console.log(QY_CHECK_SUFFIX);
  return QY_CHECK_SUFFIX;
}

//根据参数对象生成查询字符串
function objToParmStr(parmObj) {
  let parmStr = ""
  for (let key in parmObj) {
    if (parmObj.hasOwnProperty(key)) {
      parmStr += key + '=' + parmObj[key] + '&';
    }
  }
  return parmStr.slice(0, parmStr.length - 1);
}
//将身份证号转换为****
function getStarIdNo(idNo) {
  if (idNo == null || idNo == undefined || idNo == '') {
    return;
  } else {
    var len = idNo.length;
    var head = idNo.substr(0, 3);
    var idNoS = head;
    var tail = idNo.substr(len - 4, 4); //substr(len - 6, 6);
    for (var i = 3; i < idNo.length - 4; i++) {
      idNoS = idNoS + '*';
    }
    idNoS = idNoS + tail;
    return idNoS;
  }
}
//将手机号转换为****
function getStarPhoneNum(phoneNum) {
  if (phoneNum == null || phoneNum == undefined || phoneNum == '') {
    return;
  } else {
    var len = phoneNum.length;
    var head = phoneNum.substr(0, 3);
    var phoneS = head;
    var tail = phoneNum.substr(len - 4, 4);
    for (var i = 3; i < phoneNum.length - 4; i++) {
      phoneS = phoneS + '*';
    }
    phoneS = phoneS + tail;
    return phoneS;
  }
}

function isEmptyString(string) {
  if (string == undefined || string == '' || string == "" || string == null) {
    return true;
  } else {
    return false;
  }

}
//拦截实名认证
function identityFilter() {
  var userId = wx.getStorageSync('CURRENT_USER_RECORD') ? wx.getStorageSync('CURRENT_USER_RECORD').USER_ID : '';
  console.log("用户id是" + userId)
  var loginFlag = false;
  if (userId != '') {
    loginFlag = true;
  }else{
    loginFlag = false;
    //跳转实名认证
    wx.navigateTo({
      url: '../authority/authority',
    })
  }
  return loginFlag
}
// 获取当前页面    
function getPageInstance() {
  var pages = getCurrentPages();
  console.log("pages是"+pages);
  return pages[pages.length - 1];
}
// screenWidth	number	屏幕宽度	1.1.0
// screenHeight	number	屏幕高度	1.1.0
// windowWidth	number	可使用窗口宽度
// windowHeight	number	可使用窗口高度
function getScreenSize() {
  var res = wx.getSystemInfoSync();
  var screenSize = {
    screenWidth: res.screenWidth,
    screenHeight: res.screenHeight,
    windowWidth: res.windowWidth,
    windowHeight: res.windowHeight
  }
  return screenSize;
}
//根据生日计算年龄
function ageBydateOfBirth (dateOfBirth) {
  if (dateOfBirth) {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var birthMonth = 0;
    var birthYear = 0;
    var birthDay = 0;
    if (dateOfBirth && dateOfBirth.length > 9) {
      birthDay = dateOfBirth.substring(8, 10);
      birthMonth = dateOfBirth.substring(5, 7);
      birthYear = dateOfBirth.substring(0, 4);

    } else {
      birthYear = year;
    }
    var count = year - birthYear;
    if (count > 0) {
      if (month <= birthMonth) {
        if (month == birthMonth) {
          if (day < birthDay) {
            count = count - 1;
          }
        } else {
          count = count - 1;
        }
      }
    }
    if (count > 0) {    //不是儿童
      return count + "岁";
    } else if (count == 0) {
      if (year - birthYear > 0) {
        return 12 - (birthMonth - month) + "个月";
      } else {
        if (month - birthMonth > 0) {
          return month - birthMonth + "个月";
        } else {
          return 1 + "个月";
        }
      }
    } else {                                    //无年龄数据
      return "";
    }
  } else {
    return "";
  }

}


module.exports = {
  formatTime: formatTime,
  checkSuffix: checkSuffix,
  objToParmStr: objToParmStr,
  getStarIdNo: getStarIdNo,
  getStarPhoneNum: getStarPhoneNum,
  isEmptyString: isEmptyString,
  getScreenSize: getScreenSize,
  identityFilter: identityFilter,
  ageBydateOfBirth:ageBydateOfBirth,
  formatDate:formatDate
}