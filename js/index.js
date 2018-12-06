﻿$(function () {
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
							<span>${i.name}</span>
							`)
						$('.hotCon').append($span)
					}else{
					}
				})
				//监听input
				$('input#searchSong').on('input',function (e) {
					let $input = $(e.currentTarget)
					let value = $input.val().trim()
					if (value.length !== 0) {
						$('.icon-guanbi,.searchVal,.searchResult').removeClass('hidden')
						$('.hotSearch,.historySearch').addClass('hidden')
						let $span = $('.searchVal>span')
						$span.empty().text(value)
						$('.icon-guanbi').on('click',function () {
							$('#searchSong').val('')
							$('.icon-guanbi,.searchVal,.searchResult').addClass('hidden')
							$('.resultCon').remove()
							$('.hotSearch,.historySearch').removeClass('hidden')
						})
						if (timer) {
							clearTimeout(timer)
							$('.resultCon').remove()
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
						$('.icon-guanbi,.searchVal,.searchResult').addClass('hidden')
						$('.hotSearch,.historySearch').removeClass('hidden')
						$('.resultCon').remove()
					}	
				})


				//搜索并添加搜索历史
				
				let hisSearch = $.cookie("hisSearch")
				let len = 0	
				$('input#searchSong').on('keydown',function (event) {
					let searchVal = $("#searchSong").val().trim()
					if (searchVal != null) {


						if (event.keyCode == "13") {
							$.each(hisSearch,function(n,obj){ 
								if (obj.val == searchVal) {
									len = len - 1
									hisSearch.splice(n,1)
									return false;
								}
							})
							$('.historySearch > ol').empty()
							if (hisSearch) {
								hisSearch.forEach((i)=>{
									let $li = (`
										<li>
											<svg class="icon" aria-hidden="true">
											    <use xlink:href="#icon-lishi"></use>
											</svg>
											<div>
												${i.val}
												<svg class="icon " aria-hidden="true">
												    <use xlink:href="#icon-guan"></use>
												</svg>
											</div>
										</li>
										`)
									$('.historySearch > ol').prepend($li)
								})	
							}
							let $li = (`
								<li>
									<svg class="icon" aria-hidden="true">
									    <use xlink:href="#icon-lishi"></use>
									</svg>
									<div>
										${searchVal}
										<svg class="icon " aria-hidden="true">
										    <use xlink:href="#icon-guan"></use>
										</svg>
									</div>
								</li>
								`)
							$('.historySearch > ol').prepend($li)
							//将搜索内容添加到搜索记录
							let json = "["
							let start = 0
							//确保显示十条历史记录
							if (len>9) {start = 1 }
							for (let i = start; i < len; i++) {
								json = json + "{\"val\":\""+hisSearch[i].val+"\"},"
							}
							json = json + "{\"val\":\""+searchVal+"\"}]"
							$.cookie("hisSearch",json,{expires:30}); 
							
							//搜索结果
							search(searchVal).then((result)=>{
								if (result.length !== 0) {
								}
							})
						}


					}
				})
				if(hisSearch){
					hisSearch = eval("("+hisSearch+")");
					len = hisSearch.length
				}
				hisSearch.forEach((i)=>{
					let $li = (`
						<li>
							<svg class="icon" aria-hidden="true">
							    <use xlink:href="#icon-lishi"></use>
							</svg>
							<div>
								${i.val}
								<svg class="icon " aria-hidden="true">
								    <use xlink:href="#icon-guan"></use>
								</svg>
							</div>
						</li>
						`)
					$('.historySearch > ol').prepend($li)
				})	

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






				//显示历史记录
				// function showHistory() {
				// 	var data = new Array()
				// 	var cookie = $.cookie('search_history','search_val',{ expires: 30, path: '/' }); //获取cookie
				// 	console.log(cookie)
				// 	// if (cookie != null) {
				// 		// 	data = JSON.parse(cookie)
				// 	// }
				// 	$("#history").empty();//清除原来的显示内容，以免重复显示
				// 	if (data != null) {
				// 		var len = data.length>display_max_len?display_max_len:data.length;//显示时只显示特定的条数	
				// 		var limit = data.length-len-1;
				// 		for (var i = data.length-1; i >limit ; i--) {
				// 			if(data[i].indexOf(str)>-1){//动态创建历史记录条目
				// 				let $li = $(`
				// 					<li>
				// 						<svg class="icon" aria-hidden="true">
				// 						    <use xlink:href="#icon-lishi"></use>
				// 						</svg>
				// 						<div>
				// 							${i}
				// 							<svg class="icon " aria-hidden="true">
				// 							    <use xlink:href="#icon-guan"></use>
				// 							</svg>
				// 						</div>
				// 					</li>
				// 					`)
								
				// 				$(".historySearch>ol").append($li);
				// 			}
				// 		}
				// 	}
				// }

				//添加历史记录
				// function addHistory(str) {
				// 	var data = new Array();
				// 	var cookie = $.cookie('search_history'); //获取cookie
				// 	if(cookie!=null){
				// 		data = JSON.parse(cookie);
				// 	}
					
				// 	//如果历史记录中有，就先删除，然后再添加（保持最近搜索的记录在最新），否则，直接添加
				// 	var index=-1;
				// 	if(data){
				// 		index=data.indexOf(str);
				// 	}
				// 	if(index>-1){
				// 		data.splice(index,1);//删除原来的
				// 	}
					
				// 	//最多保留save_max_len条记录，超过最大条数，就把第一条删除
				// 	if(data && data.length==save_max_len){
				// 		data.splice(0,1);
				// 	}
				// 	data.push(str);
				// 	$.cookie('search_history', JSON.stringify(data), {expires : 365});//设置一年有效期
				// 	console.log(data)
				// }

			})
		} 
	})

	
})
