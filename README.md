# NetEaseMusic
### 仿照网易云音乐官网 https://music.163.com 制成的网易云音乐移动端

####通过下载音乐专辑等相关数据自制出json数据进行ajax请求，项目制作过程中的几个难点：
######1. 歌词的滚动显示
通过配合官网下载的歌词文件，通过自带的分割标识符对歌词进行换行分割，并使用正则表达式对歌词内容进行内容择取——`let regex = /^\[(.+)\](.*)/`，返回的数组中第一项为时间信息，并通过 data-time 的方式添加到标签中，第二项为与时间相对应的歌词，通过于`data-time`中的时间进行匹配显示

######2. 搜索历史添加
使用cookie的方式对历史搜索内容进行保存，并配置删除和点击在此查询功能

