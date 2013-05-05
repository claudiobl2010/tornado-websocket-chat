$(document).ready(function() {

	var ws;
	var timerQTDUsers;

	$('.entrar').click(function() {

		ws = new WebSocket("ws://localhost:8989/chat");

		ws.onopen = function() {
			$("#msg").append("<br>ABERTO!!!");
			$('#msg').scrollTop($('#msg')[0].scrollHeight);
			ws.send('{"tipo":"QTD"}');
		}

		ws.onclose = function() {
			$("#msg").append("<br>FECHADO!!!");
			$('#msg').scrollTop($('#msg')[0].scrollHeight);			

			$("#qtd").html("?");
    		clearInterval(timerQTDUsers);
		}
		
		ws.onmessage = function(msg){
			var data = $.parseJSON(msg.data);
			
			if (data.tipo == 'QTD') {
				$("#qtd").html(data.qtd);
			}
			
			if (data.tipo == 'MSG') {
				$("#msg").append("<br>" + msg.data);
				$('#msg').scrollTop($('#msg')[0].scrollHeight);
			}
         }
		
		timerQTDUsers = setInterval(function() {
    			ws.send('{"tipo":"QTD"}');
        	},
        	5000
        );

		return false;
	});

	$('.sair').click(function() {

		ws.close();

		return false;
	});

	$('#enviar').click(function() {

		ws.send('{"tipo":"MSG", "nickname":"Chiquinho", "mensagem":"' + $("#envio-txt").val() + '"}');

		return false;
	});

});