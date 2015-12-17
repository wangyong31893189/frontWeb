$(function(){
	$(".del").click(function(){
		var id=$(this).attr("data-id");
		var $tr=$(".item-id-"+id);

		$.ajax({
			type:"DELETE",
			url:"/admin/del?id="+id
		}).done(function(results){
			if(results.success===1){
				if($tr){
					$tr.remove();
				}
			}
		});
	});
});