##fetch

### 概念

* 用于访问和操纵HTTP管道的部分，例如请求和响应
* 跨网络异步获取资源
* 全局

```
let url = window.location.href;
fetch(url).then(e => {
  console.log(e);
}).catch(e => {
  console.error;
})
```









## 番茄

### contentType

### 简介

* header

* 指定请求和响应HTTP内容类型（默认：text/html）

* MIME

  ```
  1.text/html
  2.text/plain
  3.text/css
  4.text/javascript

  post发包类型：
  5.application/x-www-form-urlencoded
  6.multipart/form-data
  7.application/json
  8.application/xml
  …
  ```



#### application/x-www-form-urlencoded

* 普通的表单提交，或js发包

#### multipart/form-data

* 发送post用在发送文件的POST包

#### application/xml

* 下载时希望浏览器将文件保存起来

#### application/json

* 通过json形式将数据发送给服务器
* HTTP通信中并不存在所谓的json，而是将string转成json罢了



