$(document).ready(function() {

	var ws;
	var timerQTDUsers;
	
	$('#msg').scrollTop($('#msg')[0].scrollHeight);

	$(".entrar-sair").on("click", ".entrar", function() {
		
		$(".user").val($(".user").val().trim());
		
		if ($(".user").val() == "") {
			$(".user").addClass("campo-em-branco");
			return false;
		}
		
		ws = new WebSocket("ws://localhost:8989/chat");

		ws.onopen = function() {
			$(".user").attr("disabled", "disabled");
			$(".user").removeClass("campo-em-branco").removeClass("user").addClass("user-disabled");
			
			$(".entrar").removeClass("entrar").addClass("sair");
			$(".sair").html("sair");
			
			$(".rolagem-automatica input").removeAttr("disabled");
			
			$(".enviar-txt-disabled").removeAttr("disabled");
			$(".enviar-txt-disabled").removeClass("enviar-txt-disabled").addClass("enviar-txt");
			
			$(".enviar-btn-disabled").removeClass("enviar-btn-disabled").addClass("enviar-btn");
			
			ws.send('{"tipo":"MSG", "nickname":"' + $(".user-disabled").val() + '", "mensagem":"Entrou!!!"}');
			ws.send('{"tipo":"QTD"}');
		}

		ws.onclose = function() {
			$("#qtd").html("?");
			
			$(".user-disabled").removeAttr("disabled");
			$(".user-disabled").removeClass("user-disabled").addClass("user");
			$(".user").val("");
			
			$(".sair").removeClass("sair").addClass("entrar");
			$(".entrar").html("entrar");
			
			$(".rolagem-automatica input").attr("checked", "checked");
			$(".rolagem-automatica input").attr("disabled", "disabled");
			
			$(".enviar-txt").attr("disabled", "disabled");
			$(".enviar-txt").removeClass("campo-em-branco").removeClass("enviar-txt").addClass("enviar-txt-disabled");
			$(".enviar-txt-disabled").val("");
			
			$(".enviar-btn").removeClass("enviar-btn").addClass("enviar-btn-disabled");
			
    		clearInterval(timerQTDUsers);
		}
		
		ws.onmessage = function(msg){
			var data = $.parseJSON(msg.data);
			
			if (data.tipo == 'QTD') {
				$("#qtd").html(data.qtd);
			}
			
			if (data.tipo == 'SAIR') {
				ws.close();
			}
			
			if (data.tipo == 'MSG') {
				var tmpl = ''; 
				tmpl += '<div class="item-msg">';
				tmpl += '    <div class="header-msg"><span>{nickname}</span> em {data}</div>';
				tmpl += '    <div class="texto-msg">{mensagem}</div>';
				tmpl += '</div>';

				tmpl = tmpl.replace("{nickname}", data.nickname)
						   .replace("{data}", data.data)
						   .replace("{mensagem}", data.mensagem);
				
				$("#msg").append(tmpl);
				
				if ($(".rolagem-automatica input").attr("checked") == "checked") {
					$('#msg').scrollTop($('#msg')[0].scrollHeight);
				}
			}
         }
		
		timerQTDUsers = setInterval(function() {
    			ws.send('{"tipo":"QTD"}');
        	},
        	5000
        );

		return false;
	});
	
	$(".entrar-sair").on("click", ".sair", function() {
		ws.send('{"tipo":"MSG", "nickname":"' + $(".user-disabled").val() + '", "mensagem":"Saiu!!!"}');
		ws.send('{"tipo":"SAIR"}');
		return false;
	});
	
	$(".area-enviar").on("click", ".enviar-btn", function() {
		$(".enviar-txt").val($(".enviar-txt").val().trim());
		
		if ($(".enviar-txt").val() == "") {
			$(".enviar-txt").addClass("campo-em-branco");
			return false;
		}
		
		$(".enviar-txt").removeClass("campo-em-branco");
		
		ws.send('{"tipo":"MSG", "nickname":"' + $(".user-disabled").val() + '", "mensagem":"' + $(".enviar-txt").val() + '"}');
		
		$(".enviar-txt").val("");

		return false;
	});

	$(".area-enviar").on("click", ".enviar-btn-disabled", function() {
		return false;
	});
	
});