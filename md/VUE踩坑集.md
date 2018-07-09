### VUE踩坑集

* #### data

* #### computed

* #### watch

* #### 生命周期

  生命周期钩子的一些使用方法：

  beforecreate : 可以在这加个loading事件，在加载实例时触发
  created : 初始化完成时的事件写在这里，如在这结束loading事件，异步请求也适宜在这里调用
  mounted : 挂载元素，获取到DOM节点
  updated : 如果对数据统一处理，在这里写上相应函数
  beforeDestroy : 可以做一个确认停止事件的确认框
  nextTick : 更新数据后立即操作dom

* #### methods

  1. 修改数组后v-for没有跟新????

     * 为啥？

       1. 啥是变异方法：

          ```
          push()
          pop()
          shift()
          unshift()
          splice()
          sort()
          reverse()
          ```

          *会改变原数组！！！

       2. 非变异方法

          ```
          fliter()
          concat()
          slice()
          ```

          *不会改变原数组，但是会返回一个新数组

       3. 举个栗子

          ```
          1. 
          ```

          ​

       4. ​

     * ​

  2. 对于惯用E6的箭头函数的习惯，常想在声明函数时简写

     ```
     data: {
       arrow: '箭头函数',
     },
     methodes: {
       newFunction => {
         console.log('1', this.arrow)；
       }
     }
     ```

     这时候你会发现控制台输出 'undefined'，因为箭头函数所指的this为'window'。

     So: 

     ```
     data: {
       arrow: '箭头函数',
     },
     methodes: {
       newFunction: function () {
         console.log('2', this.arrow)；// '箭头函数'
       },
       simple () {
             console.log('3', this.arrow)；// '箭头函数'
       }
     }
     ```

     番茄： 

     * 箭头函数里面的 this 是一个常量，它继承自外围作用域。

     * ```
       var sum = (a,b) => {return a+b;}  // 传统块级结构，必须要有 return
       var sum = (a,b) => a+b;           // 简单结构，不用声明 return

       var sum = (a,b) => ({sum: a+b});  // 如果要返回一个对象字面量，则必须用括号包裹

       // `花括号`是运算符，声明这是一个计算值，否则会把对象字面量的花括号认为是箭头函数的函数体声明
       ```

