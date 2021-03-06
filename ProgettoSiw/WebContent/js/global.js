/*funzione show password in Prenota.jsp per mostrare la password e cambiare il testo del bottone nel popup del login*/
function show_log(){
	if (pass_login_popup.type == "password")
		pass_login_popup.type = "text";
	else
		pass_login_popup.type =  "password";
	
	if ( $('#pass_popup_login_show').hasClass('fa fa-eye')){
		$('#pass_popup_login_show').removeClass('fa fa-eye');
		$('#pass_popup_login_show').addClass('fa fa-eye-slash');
	}
	else{
		$('#pass_popup_login_show').removeClass('fa fa-eye-slash');
		$('#pass_popup_login_show').addClass('fa fa-eye');
	}
}
/*funzione cerca in recensioni.jsp per filtrare le recensioni mostrate in base al num di stelle (id->)*/

function cerca(id) {
	var s = document.getElementById(id).value;
	var stars = ("");
	for(var k = 0;k<s;k++){
		stars = stars + '<label class="mdi mdi-star piene"></label>';
	}
	for(k = 0;k<5-s;k++){
		stars = stars + '<label class="mdi mdi-star vuote"></label>';
	}
	$.ajax({
		type:"GET",
		url:"recensioniPerStelle",
		data:{stelle:s},
		success: function(data) {
			$("#contenitore").empty();
			for(var i = 0; i < data.length; i++) {
					$("#contenitore").append('<ul class="list-group" id="recensione_log"><li class="list-group-item text-muted" id="intestazione_review"><span id="nome_recensitore">'+data[i].utente+'</span><div id="stelline">'+stars+'</div></li><li class="list-group-item" id="corpo_review"><span id="text_rec" class="pull-left">'+data[i].testo+'</span></li></ul>');
			}
		}
	})	
}
/*funzione in recensione.jsp che mostra tutte le recensioni*/

function cercaTutte() {
	$.ajax({
		type:"GET",
		url:"recensioniTutte",
		success: function(data) {
			$("#contenitore").empty();
			for(var i = 0; i < data.length; i++) {
				var stars = ("");
				for(var k = 0;k<data[i].stelle;k++){
					stars = stars + '<label class="mdi mdi-star piene"></label>';
				}
				for(var k = 0;k<5-data[i].stelle;k++){
					stars = stars + '<label class="mdi mdi-star vuote"></label>';
					}
				$("#contenitore").append('<ul class="list-group" id="recensione_log"><li class="list-group-item text-muted" id="intestazione_review"><span id="nome_recensitore">'+data[i].utente+'</span><div id="stelline">'+stars+'</div></li><li class="list-group-item text-right" id="corpo_review"><span id="text_rec" class="pull-left">'+data[i].testo+'</span></li></ul>');
		}
		}
	})
}

/*funzioni per implementare l'api di FLICKR*/
function JavaScriptFetch() {
	var script = document.createElement('script');
	script.src = "https://api.flickr.com/services/feeds/photos_public.gne?format=json&tags=" + document.getElementById("search").value;;
	document.querySelector('head').appendChild(script);
	}
function jsonFlickrFeed(data) {
	var image = "";
	var s = 1;
	data.items.forEach(function (element) {
	image += "<img src=\"" + element.media.m + "\"  onclick='setImmagine(this.id)' id ="+ s +">";
	s += 1;
	});
	document.getElementById("outputDiv").innerHTML = image;
}
/*funzione in profilo.jsp per settare l'immagine di un utente a quella selezionata*/
function setImmagine(s) {
	var pa = document.getElementById(s).getAttribute('src');
	document.getElementById('avatar_img').src = pa;
	$.ajax({
		type:"POST",
		url:"aggiornaImmagine",
		data:{p:pa},
		success: function(data) {
			$(location).attr('href','ProfiloServlet');
		}
	})
}

/*
 * funzione show password in Registrati.jsp e Login.jsp per mostrare la password
 * e cambiare il testo del bottone
 */
function show(){
	
	if (input_password.type == "password")
		input_password.type = "text";
	else
		input_password.type =  "password";
	
	if (show_hide.value == 'show')
		show_hide.value = 'hide';
	else
		show_hide.value =  'show';
}

/* funzione che controlla la data inserita nella pagina prenota */
function validaData() {
	var d = document.getElementById("input_data").value;
	var b = d.split("-");
	if(b[0] != 2019) {
		document.getElementById("erroreData").innerHTML = 'Inserisci una data valida.';
		return false;
	}
	else if((b[0] == 2019) && (b[1] < 5 || b[1] > 9)) {
		document.getElementById("erroreData").innerHTML = 'Inserisci una data valida.';
		return false;
	}
	else if(b[0] == 2019 && b[1] == 5 && b[2] < 15) {
		document.getElementById("erroreData").innerHTML = 'Inserisci una data valida.';
		return false;
	}
	document.getElementById("erroreData").innerHTML ='';
}
/*funzione in profilo.jsp che aggiunge una recensione al database*/
function inviaRecensione() {
	var texto = $("#new-review").val();
	var radioValue = $("input[name='rating3']:checked").val();
	if(texto == "") {
		$("#avviso").empty();
		$("#avviso").html("Devi inserire una recensione");
	}
	else if(texto != ""){
		$.ajax({
			type:"POST",
			url:"InserisciRecensione",
			data:{testo:texto,stelle:radioValue},
			success: function(data) {
				$("#avviso").empty();
				$("#avviso").html(data);
				$(location).attr('href','ProfiloServlet');
			}
		})
	}
}
/*
 * funzione che controlla tramite chiamata Ajax se in fase di registrazione
 * l'username è già utilizzato
 */
function controllaUtente() {
	var user = $("#input_username").val();
	if(user == " ") {
		$("#errore").empty();
	}
	else {
	$.ajax({
		type: "GET",
		url: "GetUtenteServlet" ,
		data: {input_username: user},
		success: function(data) {
			$("#errore").empty();
			$("#errore").html(data);
			
		}		
	});
	}
}

/* script per validazione form registrazione con jQuery e Ajax */
function validaRegistrazione() {
	var user = $("#input_username").val();
	var pws = $("#input_password").val();
	var email = $('#input_email').val();
	var nome = $("#input_nome").val();
	var cognome = $("#input_cognome").val();
	var data = new Date($('#input_compleanno').val());
	day = data.getDate();
	month = data.getMonth() + 1;
	year = data.getFullYear();
	var date = year+"-"+month+"-"+day;
	var telefono = $("#input_telefono").val();
	if (user=="" || pws == "" || email=="" || nome == "" || cognome == "" || data == "Invalid Date" || telefono == "") {
		$("#errore").empty();
		$("#errore").html("<font color=red> Devi inserire tutti i campi. </font>");
	}
	else if (year > 2001){
		$("#errore").empty();
		$("#errore").html("<font color=red> Devi inserire una data valida. </font>");	
	}
	else {
		$.ajax({
			type: "POST",
			url: "RegistrationServlet",
			data: {input_username:user,input_password:pws,input_email:email,input_nome:nome,input_cognome:cognome,input_compleanno:date,input_telefono:telefono},
			success: function(data) {
				if(data == "True") {
					$(location).attr('href','ConfirmedReg.jsp');
				} 
				else {
					$("#errore").empty();
					$("#errore").html("<font color=red> Campi non validi e/o email gia utilizzata. </font>");	
				}
			}
		});
	}
	
}

/* funzione per eseguire il login tramite ajax */
function controllaLogin() {
	var user = $('#input_username').val();
	var pws = $('#input_password').val();
	if(user == "" || pws == "") {
		$("#errore").html("<font color=red>Completa tutti i campi.</font>");
	}
	else {
		$.ajax({
			type: "POST",
			url: "LoginServlet",
			data: {input_username: user, input_password: pws},
			success: function(data) {
				if(data == "True") {
					$(location).attr('href','indexServlet');
				} else {
					$("#errore").html(data);
				}
			}
		});
	}
}
/*funzione in prenota.jsp che valida il login che avviene dentro il popup*/
function loginPopup() {
	var user = $("#user_login_popup").val();
	var pws = $("#pass_login_popup").val();
	if(user == "" || pws == "") {
		$("#errore").html("Completa tutti i campi");
	} else {
		$.ajax({
			type: "POST",
			url: "LoginServlet",
			data: {input_username: user, input_password: pws},
			success: function(data) {
				if(data != "True") {
					$("#errore").empty();
					$("#errore").html("Username e/o password errate!");
				} else {
					$("#errore").empty();
					$("#errore").html("<font color = green>Login Effettuato!</font>");
					$("#user_log_pop").empty();
					$("#user_log_pop").html("<input type=\"text\" class=\"form-control\" name=\"cardExpiry\" placeholder=\""+user+"\" disabled id=\"user_login_popup\" />");
					$("#pass_log_pop").empty();
					$("#pass_log_pop").html("<input type=\"password\" class=\"form-control\" name=\"cardExpiry\" placeholder=\"*****\" id=\"pass_login_popup\" disabled />");
					$("#pulsante").empty();
					$("#pulsante").html("<button class=\"btn btn-success btn-lg btn-block\" type=\"button\" onclick=\"functione_pay()\" id=\"submit_popup_login\">Paga</button>");
				}
			}
		});
	}
}

/*funzione in prenota.jsp che valida la prenotazione dopo aver effettuato il pagamento*/

function prenotazione(d) {
	var dat = d;
	$("#ErrorePagamento").empty();
	if(dat == "") {
		$("#ErrorePagamento").empty();
		$("#ErrorePagamento").html("<font color = red>Devi selezionare una data.</font>");
	}
	var postiSelezionati = [];
	$.each($("input[name='posto']:checked"), function(){            
        postiSelezionati.push($(this).val());
    })
	if(postiSelezionati.length < 1) {
		$("#ErrorePagamento").empty();
		$("#ErrorePagamento").html("<font color = red>Devi selezionare almeno un posto.</font>");
	} else if(dat != "" && postiSelezionati.length >= 1){
		$("#ErrorePagamento").empty();
		var arrayStringa = "";
		for (var i = 0; i < postiSelezionati.length; i++) {
				arrayStringa += postiSelezionati[i] +"|";
			}
		$.ajax({
			type:"POST",
			url: "PrenotaPosti",
			data: {data:dat,posto:arrayStringa},
			success:function(data) {
				$(location).attr('href','ConfirmedPrenotazione.jsp');
			}
		});
	}
}
/*funzione in prenota.jsp per controllare se il coupon inserito è valido*/
function controllaCoupon() {
	var totale = $("#tott").val();
	var coupon = $("#input_coupon").val();
	$.ajax({
		type: "POST",
		url: "ValidaCouponServlet",
		data: {tott:totale, input_coupon: coupon},
		success: function(data) {
			$("#scrittaa").empty();
			$("#scrittaa").html(data);
		}
	});
}
/*funzione utilizzata per la richiesta di cambio password
 * 
 */
function cambioPassword() {
	var email = $("#input_email").val();
	$.ajax({
		type: "POST",
		url: "cambioPassword",
		data: {input_email:email},
		success: function(data) {
			$("#conferma").empty();
			$("#conferma").html("<font color = green> Email inviata con successo.</font>");
		}
	});
}
/*
 * funzione utilizzata per il cambio effettivo della password
 */
function cambioEffettivoPassword() {
	var email = $("#input_username").val();
	var pass = $("#input_password").val();
	if(email== "" || pass == "") {
		$("#avviso").empty();
		$("#avviso").html("<font color = red> Completa tutti i campi.</font>");
	}
	else {
		$.ajax({
			type: "POST",
			url: "confermaCambioPassword",
			data: {input_username:email,input_password:pass},
			success: function(data) {
				$(location).attr('href','ConfirmedPassword.jsp');
			}
		});
	}
}
/* Funzione per mostrare la lista di hotel presente in Contatti.jsp */
function showHotel(){
	if (hotel.style.visibility == "hidden")
		hotel.style.visibility = "visible";
	else
		hotel.style.visibility =  "hidden";
}

/*
 * funziona che tramite chiamata Ajax aggiorna il prezzo totale prendendo il
 * prezzo dal database
 */
function check(num_ombrellone) {
		var input = document.getElementById(num_ombrellone).htmlFor;
		if(document.getElementById(input).disabled == false){
		var totale = $("#tott").val();
		
		if (document.getElementById(input).checked == false) {
			$.ajax({
				type : "POST",
				url : "GetPrezzoPosto",
				data : {
					posto : num_ombrellone,
					tott : totale
				},
				success : function(data) {
					$("#scrittaa").empty();
					$("#scrittaa").html(data);
				}
			});
			addInLista(num_ombrellone);
		} 
		else if (document.getElementById(input).checked == true) {
			var totale = $("#tott").val();
			$.ajax({
				type : "GET",
				url : "EliminaPosto",
				data : {
					tot : totale
				},
				success : function(data) {
					$("#scrittaa").empty();
					$("#scrittaa").html(data);
				}
			});
			removeFromLista(num_ombrellone);
	}}
}
/*funzione in prenota.jsp che aggiunge l'ombrellone cliccato alla lista in "la mia prenotazione"*/
function addInLista(num_ombrellone){
	
	var new_ombrello = document.createElement("h3");
	var node = document.createTextNode("Ombrellone N."+num_ombrellone+" prezzo : 15 euro");
	new_ombrello.appendChild(node);
	var element = document.getElementById("lista_ombrelloni");
	element.appendChild(new_ombrello);
}
/*funzione in prenota.jsp che rimuove l'ombrellone cliccato alla lista in "la mia prenotazione"*/

function removeFromLista(num_ombrellone){
	
	var dim = document.getElementById("lista_ombrelloni").childNodes.length;	
	var umb = document.getElementById("lista_ombrelloni").childNodes;
	
	for (var i=0;i<dim;i++){
		var s = umb[i].textContent;
		if (umb[i].textContent == "Ombrellone N."+num_ombrellone+" prezzo : 15 euro"){
			document.getElementById("lista_ombrelloni").removeChild(umb[i]);
		}
	}
}

/*funzione in prenota.jsp che mostra il popup del login*/
function functione() {
	document.getElementById('myModal').style.display = "block";
}
/*funzione in prenota.jsp che mostra il popup del pagamneto e chiude quello del login*/

function functione_pay() {
	$("#ErrorePagamento").empty();
	document.getElementById('myModal').style.display = "none";
	document.getElementById('myModal2').style.display = "block";
}
/*funzioni in prenota.jap che chiudono rispettivamente il popup del login e del pagamento se si clicca sulla "X"*/
function close_popup_login() {
	document.getElementById('myModal').style.display = "none";
}
function close_popup_payment() {
	document.getElementById('myModal2').style.display = "none";
}


//carica la foto nell'avatar 
$("#profileImage").click(function(e) {
    $("#imageUpload").click();
});

function fasterPreview( uploader ) {
    if ( uploader.files && uploader.files[0] ){
          $('#profileImage').attr('src', 
             window.URL.createObjectURL(uploader.files[0]) );
    }
}

$("#imageUpload").change(function(){
    fasterPreview( this );
});

/*funzione in profilo.jsp che permette l'animazione del box per inserire una recensione*/
(function(e){var t,o={className:"autosizejs",append:"",callback:!1,resizeDelay:10},i='<textarea tabindex="-1" style="position:absolute; top:-999px; left:0; right:auto; bottom:auto; border:0; padding: 0; -moz-box-sizing:content-box; -webkit-box-sizing:content-box; box-sizing:content-box; word-wrap:break-word; height:0 !important; min-height:0 !important; overflow:hidden; transition:none; -webkit-transition:none; -moz-transition:none;"/>',n=["fontFamily","fontSize","fontWeight","fontStyle","letterSpacing","textTransform","wordSpacing","textIndent"],s=e(i).data("autosize",!0)[0];s.style.lineHeight="99px","99px"===e(s).css("lineHeight")&&n.push("lineHeight"),s.style.lineHeight="",e.fn.autosize=function(i){return this.length?(i=e.extend({},o,i||{}),s.parentNode!==document.body&&e(document.body).append(s),this.each(function(){function o(){var t,o;"getComputedStyle"in window?(t=window.getComputedStyle(u,null),o=u.getBoundingClientRect().width,e.each(["paddingLeft","paddingRight","borderLeftWidth","borderRightWidth"],function(e,i){o-=parseInt(t[i],10)}),s.style.width=o+"px"):s.style.width=Math.max(p.width(),0)+"px"}function a(){var a={};if(t=u,s.className=i.className,d=parseInt(p.css("maxHeight"),10),e.each(n,function(e,t){a[t]=p.css(t)}),e(s).css(a),o(),window.chrome){var r=u.style.width;u.style.width="0px",u.offsetWidth,u.style.width=r}}function r(){var e,n;t!==u?a():o(),s.value=u.value+i.append,s.style.overflowY=u.style.overflowY,n=parseInt(u.style.height,10),s.scrollTop=0,s.scrollTop=9e4,e=s.scrollTop,d&&e>d?(u.style.overflowY="scroll",e=d):(u.style.overflowY="hidden",c>e&&(e=c)),e+=w,n!==e&&(u.style.height=e+"px",f&&i.callback.call(u,u))}function l(){clearTimeout(h),h=setTimeout(function(){var e=p.width();e!==g&&(g=e,r())},parseInt(i.resizeDelay,10))}var d,c,h,u=this,p=e(u),w=0,f=e.isFunction(i.callback),z={height:u.style.height,overflow:u.style.overflow,overflowY:u.style.overflowY,wordWrap:u.style.wordWrap,resize:u.style.resize},g=p.width();p.data("autosize")||(p.data("autosize",!0),("border-box"===p.css("box-sizing")||"border-box"===p.css("-moz-box-sizing")||"border-box"===p.css("-webkit-box-sizing"))&&(w=p.outerHeight()-p.height()),c=Math.max(parseInt(p.css("minHeight"),10)-w||0,p.height()),p.css({overflow:"hidden",overflowY:"hidden",wordWrap:"break-word",resize:"none"===p.css("resize")||"vertical"===p.css("resize")?"none":"horizontal"}),"onpropertychange"in u?"oninput"in u?p.on("input.autosize keyup.autosize",r):p.on("propertychange.autosize",function(){"value"===event.propertyName&&r()}):p.on("input.autosize",r),i.resizeDelay!==!1&&e(window).on("resize.autosize",l),p.on("autosize.resize",r),p.on("autosize.resizeIncludeStyle",function(){t=null,r()}),p.on("autosize.destroy",function(){t=null,clearTimeout(h),e(window).off("resize",l),p.off("autosize").off(".autosize").css(z).removeData("autosize")}),r())})):this}})(window.jQuery||window.$);

$(function(){

  $('#new-review').autosize({append: "\n"});

  var reviewBox = $('#post-review-box');
  var newReview = $('#new-review');
  var openReviewBtn = $('#open-review-box');
  var closeReviewBtn = $('#close-review-box');
  var ratingsField = $('#ratings-hidden');

  openReviewBtn.click(function(e)
  {
    reviewBox.slideDown(400, function()
      {
        $('#new-review').trigger('autosize.resize');
        newReview.focus();
      });
    openReviewBtn.fadeOut(100);
    closeReviewBtn.show();
  });

  closeReviewBtn.click(function(e)
  {
    e.preventDefault();
    reviewBox.slideUp(300, function()
      {
        newReview.focus();
        openReviewBtn.fadeIn(200);
      });
    closeReviewBtn.hide();
    
  });
});