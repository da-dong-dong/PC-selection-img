# PC端选片系统

## 初始化项目
```
yarn install
```

### 运行项目
```
yarn serve
```

### 打包项目 分包两个环境
```
yarn build
```

### 项目构成
使用vuex，数据管理+本地数据永久化插件 vuex-persistedstate

### 项目包涵选片，看板
#### 选片 启动地址 
http://localhost:8080/?itemId=640&id=745&ticket=mscmwcFPUb6b1yiFfVIMhROy1537MfkEO1Uu3Rj2Ctg1MX5a0E63m96HO7e322QY&userId=7&shopId=14&ccId=00000000737f5b5a01737fbfce600000

#### 看板 启动地址  无重构
http://localhost:8080/index?itemId=640&id=745&ticket=mscmwcFPUb6b1yiFfVIMhROy1537MfkEO1Uu3Rj2Ctg1MX5a0E63m96HO7e322QY&userId=7&shopId=14&ccId=00000000737f5b5a01737fbfce600000

### 选片项目结构
##### 1，app.vue 
截取url地址到vuex中
##### 2，store
1，app.js窗口页面持久化数据
2，typeModule.js选片类型数据
3，design.js看板数据
##### 3，home.vue
1，检测http弹框,判断公网内网，返回相片服务器所有图片
2，tab栏，包含需要展示的图片信息
3，调取接口，存入持久化数据vuex
##### 4, tab/tab.vue
1，展示tab栏选项卡
2，contents图片展示
3，pList虚拟设计
4，imgBig大图展示
5，save保存
6，@components/ps标记说明 绘制图片
