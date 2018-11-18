$(function () {
	setTimeout(function(){
		$.get('./js/index.json').then(function(response){
			let items = response
			items.forEach((i)=>{
				let $li = $(`
				<li>
					<a href="../song/song.html?id=${i.id}">
						<h3>${i.name}</h3>
						<p>${i.album}</p>
						<span></span>
					</a>
				</li>			
					`)
				$('#lastestMusic').append($li)
			})
			$('#lastestMusicloading').remove()
		},function(){
		})	
	},1000)
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
			$.get('./js/page2.json').then((response)=>{
				$li.text(response.content)
				$li.attr('data-downloaded','yes')
			})
		}else if (index === 2) {
			$.get('./js/page3.json').then((response)=>{
				$li.text(response.content)
				$li.attr('data-downloaded','yes')
			})
		} 
	})


	let timer = undefined
	$('input#searchSong').on('input',function (e) {
		let $input = $(e.currentTarget)
		let value = $input.val().trim()
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
})
