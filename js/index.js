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

	//热歌榜信息添加
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
			let timer = undefined
			$('input#searchSong').on('input',function (e) {
				let $input = $(e.currentTarget)
				let value = $input.val().trim()
				if (value.length !== 0) {
					$('.icon-guanbi,.searchVal,#output').removeClass('hidden')
					$('.hotSearch,.historySearch').addClass('hidden')
					let $span = $('.searchVal>span')
					$span.empty().text(value)
					$('.icon-guanbi').on('click',function () {
						$('#searchSong').val('')
						$('.icon-guanbi,.searchVal,#output').addClass('hidden')
					$('.hotSearch,.historySearch').removeClass('hidden')
					})
					if (timer) {
						clearTimeout(timer)
					}
					timer = setTimeout(function () {
						search(value).then((result)=>{
							timer = undefined
							if (result.length !== 0) {
								$('#output').text(result.map((r)=>r.name).join(','))
							}else{
								$('#output').text('没有结果')
							}
						})
					},300)
				}else{
					$('.icon-guanbi,.searchVal,#output').addClass('hidden')
					$('.hotSearch,.historySearch').removeClass('hidden')
					$('#output').text('')
				}	
			})

			function search(keyword) {
				return new Promise((resolve,reject)=>{
					var database = [
						{"id":1, "name": "可乐"},
						{"id":2, "name": "山丘 (Live)", },
						{"id":3, "name": "光年之外", },
						{"id":4, "name": "那些你很冒险的梦", }
					]
					let result = database.filter(function (item) {
						return item.name.indexOf(keyword)>=0
					})
					setTimeout(function(){
						resolve(result)
					},(Math.random()*300+1000))
				})
				window.search = search
			}
		} 
	})

	
})
