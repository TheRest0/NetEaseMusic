$(function(){
	$.get('/lyric.json').then(function(object) {
			let {lyric} = object
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
		})
	let audio = document.createElement('audio')
	audio.src = 'musiclist/那些你很冒险的梦.mp3'
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
})	