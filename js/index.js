$(function () {
	$.get('./js/index.json').then(function(response){
		let items = response
		items.forEach((i)=>{
			let $li = $(`
			<li>
				<a href="../song/song.html?id=${i.id}">
					<h3>${i.name}</h3>
					<p>文字</p>
				</a>
			</li>			
				`)
			$('#lastestMusic').append($li)
		})
		$('#lastestMusicloading').remove()
	},function(){
	})	
})