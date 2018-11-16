$(function(){
	let id = parseInt(location.search.match(/\bid=([^&]*)/)[1],10)
	$.get('../js/index.json').then(function(response){
		let songs = response
		let song = songs.filter(s=>s.id === id)[0]
		let {url,name,author,img,backimg,lyric} = song
		initPlayer.call(undefined,url)
		initText(name,author,lyric)
		initJpg(img,backimg)
	})
	//获取文字内容
	function initText(name,author,lyric){
		$('.song-description > h1').text(name + "-" + author)
		parseLyric(lyric)
	}
	//获取图片内容
	function initJpg(img,backimg) {
		$('.cover').attr("src",img)
		$('.page').css({
			"background":"transparent url("+backimg+") no-repeat center",
			"background-size":"cover"
		})
	}
	//获取音乐播放地址
	function initPlayer(url){
		let audio = document.createElement('audio')
		audio.src = url
		audio.oncanplay = function () {
			audio.play()
			$('.disc-container').addClass('playing')
		}
		$('.disc-container,.song-description').click(function(){
			if(audio.paused){
				audio.play()
				$(".pause").css("z-index","-1")
				$('.disc-container').addClass('playing')
			}else{
				audio.pause()
				$(".pause").css("z-index","10")
				$('.disc-container').removeClass('playing')
			}
		})
	}
	//获取音乐歌词
	function parseLyric(lyric) {
		let array = lyric.split('↵')
		let regex = /^\[(.+)\](.*)/
		array = array.map(function (string) {
			let matches = string.match(regex)
			if(matches){
				return {time:matches[1],words: matches[2]}
			}
		})
		let $lyric = $('.lyric')
		array.map(function (object) {
			if (!object) {return}
			let $p = $('</p>')
			$p.attr('data-time', object.time).text(object.words)
			$p.appendTo($lyric.children('.lines'))
		})
	}
	
})	