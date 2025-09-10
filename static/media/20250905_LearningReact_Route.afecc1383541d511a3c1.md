# React路由

视频：- 86 - 93

## 路由组件和一般组件
### withRouter可以在export class时把一般组件转换为路由组件

## 依托于react-route库，该库分三个使用场景，并提供了不同的分支
- react-route-dom: web
- react-route-native: 跨平台
- react-route-anywhere
> 该库由Facebook直接维护，但create-react-app脚手架并没有自动安装，需要手动安装
- `npm install react-route-dom@5`
    > (react-route版本差异非常大， 当前教程基于v5， 后续127节会补充v7内容)
## 使用react-route
1. 在index.jx里用`<BrowserRouter>`包裹起`<App>`
    - `<HashRouter>`是另一种实现，兼容性更好，但路径多一个#，类似锚点实现
2. 在App.jsx里：
    - `<NavLink to="/home">Home</NavLink>`
        > 描述导航链接
            > NavLink有高亮效果, Link没有高亮效果
    - 在内容展示区
        ```
            <Switch>
                <Route path="/home" component={Home}/>
                <Redirect to="/about"/>
            </Switch>
        ```
    - 在pages/Home中可以继续嵌套路由，但必须带上上级路径，比如“/home/news”
    - components下只有Header和另外自行封装的MyNavLink组件，其他都放在pages里
## 向路由传递参数，有三种方法：
1. params
    - 路由链接（携带参数）``<Link to={`/home/message/detail/${msgObj.id}/${msgObj.title}`}>{msgObj.title}</Link>``
        - 注意语法：``是模板字符串,在里面引用参数必须${}
    - 注册路由（声明接收）``<Route path="/home/message/detail/:id/:title" component={Detail}/>``
        - 三种路由参数传递方法中，只有params要修改注册路由部分
    - 接收参数（组件内使用）`const {id,title} = this.props.match.params`
2. search
    - 路由链接（携带参数）    ``<Link to={`/home/message/detail/?id=${msgObj.id}&title=${msgObj.title}`}>{msgObj.title}</Link>``
        - 类似ajax的query参数
    - 注册路由（声明接收）    ``<Route path="/home/message/detail" component={Detail}/>``
    - 接收参数（组件内使用）  ``const {search} = this.props.location; const {id,title} = qs.parse(search.slice(1))``
        - `search = “?id=xxx&title=xxxx”`（这种格式叫做urlencoded）
        - 利用querystring解析，脚手架已自动安装
        - querystring.stringify(obj)  <====> querystring.parse(str)  //互相转换
3. state //不是组件状态
    - 路由链接（携带参数） ``<Link to={{pathname:'/home/message/detail',state:{id:msgObj.id,title:msgObj.title}}}>{msgObj.title}</Link>``
        - 类似ajax的query参数
    - 注册路由（声明接收） `<Route path="/home/message/detail" component={Detail}/>`
    - 接收参数（组件内使用）`const {id,title} = this.props.location.state || {}`
        - 后面用||{}保证总有object返回，而不是undefined，弹幕里提到一个概念“可选链”
    - state参数刷新页面并不会丢失，因为使用BrowserRouter
## 路由的Push和Replace以及编程式路由
- 在`<NavLink>`或者`<Link>`中增加属性 `replace={true}`（当指定为true时，可以省略为replace），可以把默认的push改为replace，也就是不保留历史记录，如果back的话，会跳到栈再上那个一个节点
- 普通组件也可以实现路由功能，只要在组件的onClick里通过props.history.push/replace方法实现
    - `<button onClick={()=> this.replaceShow(msgObj.id,msgObj.title)}>replace查看</button>`
    - ```
        replaceShow = (id,title)=>{
            //replace跳转+携带params参数
            //this.props.history.replace(`/home/message/detail/${id}/${title}`)

            //replace跳转+携带search参数
            // this.props.history.replace(`/home/message/detail?id=${id}&title=${title}`)

            //replace跳转+携带state参数
            this.props.history.replace(`/home/message/detail`,{id,title})
        }
    ```
## BrowserRouter和HashRouter的区别
1. 底层实现不同，Browser利用的是H5提供的history API实现；兼容性不同
2. 路径格式不同
3. 刷新后state丢失（传参的那个state）
