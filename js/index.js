$(function () {
	//推荐歌单信息添加
	$.get('/NetEaseMusic/js/playlists.json').then(function (response) {
		let items = response
		items.forEach((i)=>{
			let $li = $(`
				<li>
					<a href="/NetEaseMusic/playlist/playlist.html?id=${i.id}">
					<img src="${i.img}" alt="">
						<span>
							<svg class="icon" aria-hidden="true">
						    	<use xlink:href="#icon-n"></use>
							</svg>
							${i.number}万
						</span>
						<p>${i.title}</p>
					</a>
				</li>
					`)
			$('#playList').append($li)
		})
	})

	//添加歌曲列表
	setTimeout(function(){
		$.get('/NetEaseMusic/js/index.json').then(function(response){
			let items = response
			items.forEach((i)=>{
				if (i.id < 11) {
					let $li = $(`
					<li>
						<a href="/NetEaseMusic/song/song.html?id=${i.id}">
							<h3>${i.name}</h3>
							<p>${i.album}</p>
							<span></span>
						</a>
					</li>			
						`)
					$('#lastestMusic').append($li)
				}else{}
			})
			$('#lastestMusicloading').remove()
		},function(){
		})	
	},500)

	//tab切换设置
	$('.sitenav').on('click','ol.tabItems>li',function (e) {
		let $li = $(e.currentTarget)
		$li.children().addClass('active').parent().siblings().children().removeClass('active')
		let index = $li.index()
		$li.trigger('tabChange',index)
		$('.tabContent > li').eq(index).addClass('active').siblings().removeClass('active')
	})
	$('.sitenav').on('tabChange',function(e,index){
		let $li = $('.tabContent > li').eq(index)
		if ($li.attr('data-downloaded') === 'yes') {
			return
		}
		if (index === 1) {
			//热歌榜页面设置
			$.get('/NetEaseMusic/js/index.json').then(function(response){
				$li.attr('data-downloaded','yes')
				let myDate = new Date();
				let month=myDate.getMonth()+1;
				let date=myDate.getDate(); 		
				$span = $('.tabContent .tab2 .hotTop .hotTime > span')
				$span.text(month + '月' + date + '日')
				$li.text(response.content)
				let items = response
				setTimeout(function () {
					items.forEach((i)=>{
						let id = i.id
						if (id < 10) {
							let $li = $(`
							<li>
								<a href="/NetEaseMusic/song/song.html?id=${i.id}">
									<h2>0${i.id}</h2>
									<div><h3>${i.name}</h3>
									<p>${i.album}</p>
									<span></span></div>
								</a>
							</li>			
								`)
							$('#hotMusiclist').append($li)
						}else{
							let $li = $(`
							<li>
								<a href="/NetEaseMusic/song/song.html?id=${i.id}">
									<h2>${i.id}</h2>
									<div><h3>${i.name}</h3>
									<p>${i.album}</p>
									<span></span></div>
								</a>
							</li>			
								`)
							$('#hotMusiclist').append($li)
						}	
					})
					$('#hottMusicloading').remove()
					let $a = $(`
						<a href="#">查看完整榜单&nbsp;></a>
							`)
					$('.tab2>footer').append($a)
				},500)
				
			})
		}else if (index === 2) {
			//搜索页面设置
			$.get('/NetEaseMusic/js/index.json').then(function(response){
				$li.attr('data-downloaded','yes')
				let timer = undefined
				//热门搜索
				response.forEach((i)=>{
					if (i.id<7) {
						let $span = $(`
							<span class="hotSearVal">${i.name}</span>
							`)
						$('.hotCon').append($span)
					}else{
					}
				})

				var save_max_len=10//设置最大保存数量
				$(document).ready(function() {
					$('#searchSong').val('')
					showHistory();

					//监听input进行元素切换
					$('input#searchSong').on('input',function (e) {
						let $input = $(e.currentTarget)
						let value = $input.val().trim()
						$('.resultDetails > ol > li,.resultCon').remove()
						changeMId(value)
					})

					//监听输入框
					$('input#searchSong').on('keydown',function (event) {
						var search_text = $("#searchSong").val().trim();
						//监听回车
						if (event.keyCode == "13") {
							if (search_text != '') {
								addHistory(search_text)//添加历史记录
								showHistory()
								finalResult(search_text)
							}else{
								alert("请输入歌曲信息")
							}
						}	
					})

					//监听输入框关闭按钮
					$('.icon-guanbi').on('click',function () {
						$('#searchSong').val('')
						$('.icon-guanbi,.searchVal,.searchResult,.resultDetails').addClass('hidden')
						$('.resultCon').remove()
						$('.hotSearch,.historySearch').removeClass('hidden')
					})

					//监听关闭按钮删除历史记录
					$('.historySearch > ol').on('click','.delHis svg',function (event) {
						let index =$(this).parent().parent().index()
						deleteHistory(index)
						event.stopPropagation()
					})

					//监听点击历史记录再次查询
					$('.historySearch > ol').on('click','li',function () {
						searchVal = $(this).text().trim()
						$('#searchSong').val(searchVal)
						finalResult(searchVal)
						addHistory(searchVal)
						showHistory()
					})

					//监听联想内容点击查询
					$('.searchResult').on('click','.resultCon',function () {
						searchVal = $(this).text().trim()
						$('#searchSong').val(searchVal)
						finalResult(searchVal)
						addHistory(searchVal)
						showHistory()
					})

					//热门搜索点击查询
					$('.hotSearch').on('click','.hotSearVal',function () {
						searchVal = $(this).text().trim()
						$('#searchSong').val(searchVal)
						finalResult(searchVal)
						addHistory(searchVal)
						showHistory()
					})

					//点击自动匹配内容进行搜索
					$('.searchVal').on('click',function(){
						searchVal = $("#searchSong").val().trim()
						finalResult(searchVal)
						addHistory(searchVal)
						showHistory()
					})
				})

				//显示历史记录
				function showHistory() {
					var data = new Array();
					var cookie=$.cookie("search_history");//获取cookie
					if(cookie!=null){
						data = JSON.parse(cookie); //从cookie中取出数组
					}
					$('.historySearch > ol').empty()//清除原来的显示内容，以免重复显示
					if (data != null) {
						for (let i = 0; i < data.length ; i++) {
							let $li = (`
								<li>
									<svg class="icon" aria-hidden="true">
									    <use xlink:href="#icon-lishi"></use>
									</svg>
									<div class="delHis">
										${data[i]}
										<svg class="icon " aria-hidden="true">
										    <use xlink:href="#icon-guan"></use>
										</svg>
									</div>
								</li>
								`)
							$('.historySearch > ol').prepend($li)
						}
					}
				}
				
				//添加历史记录
				function addHistory(str) {
					var data = new Array();
					var cookie = $.cookie('search_history'); //获取cookie
					if(cookie!=null){
						data = JSON.parse(cookie);
					}
					//如果历史记录中有，就先删除，然后再添加（保持最近搜索的记录在最新），否则，直接添加
					var index=-1;
					if(data){
						index=data.indexOf(str);
					}
					if(index>-1){
						data.splice(index,1);//删除原来的
					}
					
					//最多保留save_max_len条记录，超过最大条数，就把第一条删除
					if(data && data.length==save_max_len){
						data.splice(0,1);
					}
					data.push(str);
					$.cookie('search_history', JSON.stringify(data), {expires : 7});//设置一周有效期
				}

				//删除历史记录
				function deleteHistory(index){
					let data = new Array();
					data = JSON.parse($.cookie("search_history")); 
					delIdx = data.length - index - 1
					data.splice(delIdx,1);
					$.cookie('search_history', JSON.stringify(data), {expires : 7});
					showHistory();
				}

				//搜索联想元素切换
				function changeMId(value,event) {
					if (value.length !== 0) {
						$('.icon-guanbi,.searchVal,.searchResult').removeClass('hidden')
						$('.hotSearch,.historySearch').addClass('hidden')
						let $span = $('.searchVal>span')
						$span.empty().text(value)
						if (timer) {
							clearTimeout(timer)
							
						}
						timer = setTimeout(function () {	
							search(value).then((result)=>{
								timer = undefined
								if (result.length !== 0) {
									result.forEach((i)=>{
										let $div = $(`
										<div class="resultCon">
											<svg class="icon " aria-hidden="trZue">
											    <use xlink:href="#icon-sousuo"></use>
											</svg>
											<div><span>${i.name}</span></div>
										</div>	
											`)
										$('.searchResult').append($div)
									})
								}
							})
						},300)
					}else{
						$('.icon-guanbi,.searchVal,.searchResult,.resultDetails').addClass('hidden')
						$('.hotSearch,.historySearch').removeClass('hidden')
						$('.resultCon').remove()
					}	
				}

				//搜索函数
				function search(keyword) {
					return new Promise((resolve,reject)=>{		
						let result = response.filter(function (item) {
							return item.name.indexOf(keyword)>=0
						})
						setTimeout(function(){
							resolve(result)
						},(Math.random()*300+1000))
					})
				}

				//搜索结果页面
				function finalResult(value) {
					$('.resultDetails > ol > li').remove()
					$('.searchVal,.searchResult,.historySearch,.hotSearch').addClass('hidden')
					$('.resultDetails,.icon-guanbi').removeClass('hidden')
					search(value).then((result)=>{
						if (result.length !== 0) {
							result.forEach((i)=>{
								let $li = $(`
									<li>
										<a href="/NetEaseMusic/song/song.html?id=${i.id}">
											<h3>${i.name}</h3>
											<p>${i.album}</p>
											<span></span>
										</a>
									</li>			
										`)
								$('.resultDetails > ol').append($li)
							})
						}else{
							console.log('zero')
							$('.resultDetails > ol').append($(`<li>暂无信息</li>`))
						}
					})
				}
			})
		} 
	})
	
	
})
