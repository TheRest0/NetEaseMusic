$(function () {
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
})