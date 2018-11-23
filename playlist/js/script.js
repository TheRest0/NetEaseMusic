$(function () {
	//推荐歌单信息添加
	let id = parseInt(location.search.match(/\bid=([^&]*)/)[1],10)
	$.get('../js/playlists.json').then(function (response) {
		let infos = response
		let info = infos.filter(s=>s.id === id)[0]
		let {img,title,number,author,auImg,label,introduction} = info
		listImg(img,auImg)
		listText(title,number,author)
		listIntro(label,introduction)
	})
	//获取封面
	function listImg(img,auImg) {
		$('.listImg > img').attr("src",img)
		$('.bg-blur').css({
			"background": "transparent url("+img+") no-repeat center"
		})
		$('.listText img').attr("src",auImg)
	}
	//获取文字内容
	function listText(title,number,author) {
		$('#span2').text(number+"万")
		$('.listText > h2').text(title)
		$('.auInfo > a >span').text(author)
	}

	//获取简介内容
	function listIntro(label,introduction) {
		parsetext(label,introduction)
	}


	//简介切换
	$('.intro').on('click',function(){
		$("div.intro").toggleClass( "hidden" )
		$(".icon").toggleClass("icon-show")
	})

	//简介内容分离
	function parsetext(label,introduction) {
		let biaoqian = label.split(',')
		biaoqian.forEach((i)=>{
			let $span = $(`
				<span>${i}</span>
				`)
			$('.label').append($span)
		})
		let jianjie = introduction.split(',')
		jianjie.forEach((i)=>{
			let $p = $(`
					<p>${i}</span>
				`)
			$('.intro').append($p)
		})
	}
	
})	
