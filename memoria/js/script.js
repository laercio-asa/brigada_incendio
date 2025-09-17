
let largura = window.innerWidth;
let altura = window.innerHeight;
let tentativas = 0;

let larguraCard = 100;
if (largura > altura) {
	larguraCard = Math.floor(((largura - 75) / 8));
}
else {
	larguraCard = Math.floor(((largura - 35) / 4));
}

let alturaCard = larguraCard * 1.5;
for (var i = 0; i < 16; i++) {
	document.querySelector("#card" + i).style.width = larguraCard + "px";
	document.querySelector("#card" + i).style.height = alturaCard + "px";
}

let qtdCards = Math.floor(largura / (larguraCard + 5))

//array que armazenará os objetos com src e id de 1 a 8
var images = [];

//imagem a ser exibida em caso de acerto
var matchSign = document.querySelector("#match");

//imagem de fim do jogo
var modal = document.querySelector("#gameOver");

//array que armazena as cartas viradas
var flippedCards = [];

//variável contadora de acertos. ao chegar em 8 o jogo termina
var matches = 0;

function sortearNumeros(listaOriginal, quantidade) {
	// Cria uma cópia da lista original para não modificá-la diretamente
	const listaEmbaralhada = [...listaOriginal];

	// Embaralha a lista usando o método sort() com uma função de comparação aleatória
	listaEmbaralhada.sort(() => Math.random() - 0.5);

	// Pega os primeiros 'quantidade' elementos da lista embaralhada
	const numerosSorteados = listaEmbaralhada.slice(0, quantidade);

	return numerosSorteados;
}

// Exemplo de uso:
const listaCompleta = [
	0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15
];
const numerosSorteados = sortearNumeros(listaCompleta, 8);
for (var i = 0; i < 8; i++) {
	numerosSorteados.push(numerosSorteados[i] + 16);
}
console.log(numerosSorteados);

const diferente = listaCompleta.filter(item => !numerosSorteados.includes(item));
console.log(diferente); // Saída: [1, 2]

//estrutura de atribiução das imagens aos card
for (var i = 0; i < 16; i++) {
	//cria um objeto img com um src e um id
	var img = {
		src: "img/" + numerosSorteados[i] + ".jpg",
		id: i % 8
	};

	//inserer o objeto criado no array
	images.push(img);
}

//chama a função de inicialização do jogo
startGame();

//função de inicialização do jogo
function startGame() {
	//zera o array de cartas viradas
	flippedCards = [];

	//zera o contador de acertos
	matches = 0;

	//embaralhamento do array de imagens
	images = randomSort(images);

	//lista de elementos div com as classes back e front
	var backFaces = document.getElementsByClassName("back");
	var frontFaces = document.getElementsByClassName("front");

	//posicionamento das cartas e adição do evento click


	topCard = 0;
	let ii = 0;
	for (var i = 0; i < 16; i++) {
		if (ii == qtdCards) {
			ii = 0;
			topCard += alturaCard + 10;
		}
		ii++;

		//limpa as cartas marcadas
		backFaces[i].classList.remove("match", "flipped");
		frontFaces[i].classList.remove("match", "flipped");

		//posiciona as cartas no tabuleiro
		var card = document.querySelector("#card" + i);

		card.style.left = (i % qtdCards) === 0 ? 5 + "px" : 5 + ((i % qtdCards) * (larguraCard + 5)) + "px";
		card.style.top = i / qtdCards >= 1 ? topCard + "px" : 5 + "px";

		//adiciona às cartas o evento click chamando a função que vira as cartas
		card.addEventListener("click", flipCard, false);

		//adiciona as imagens às cartas
		frontFaces[i].style.background = "url('" + images[i].src + "')";
		frontFaces[i].style.backgroundSize = "cover";
		frontFaces[i].setAttribute("id", images[i].id);
	}

	//joga a imagem de game over para o plano de fundo
	modal.style.zIndex = "-2";

	//remove o evento click da imagem de game over
	modal.removeEventListener('click', function () {
		startGame();
	}, false);
}//fim da função de inicialização do jogo


//função que vira as cartas
function flipCard() {
	if (flippedCards.length == 1) {	
		tentativas++;
		document.getElementById("tentativas").innerText = tentativas;
	}
	//verifica se o número de cartas viradas é menor que 2
	if (flippedCards.length < 2) {
		//pega as faces da carta clicada
		var faces = this.getElementsByClassName("face");

		//confere se a carta já está virada, impedindo que a mesma carta seja virada duas vezes
		if (faces[0].classList[2]) {
			return;
		}

		//adiciona a classe fliped às faces da carta para que sejam viradas
		faces[0].classList.toggle("flipped");
		faces[1].classList.toggle("flipped");

		//adiciona a carta clicada ao array de cartas viradas
		flippedCards.push(this);

		//verifica se o número de cartas no array de cartas viradas é igual a 2
		if (flippedCards.length === 2) {
			//compara o id das cartas viradas para ver se houve um acerto
			if (flippedCards[0].childNodes[3].id === flippedCards[1].childNodes[3].id) {
				//em caso de acerto adiciona a classe match a todas as faces das duas cartas presentes no array de cartas viradas
				flippedCards[0].childNodes[1].classList.toggle("match");
				flippedCards[0].childNodes[3].classList.toggle("match");
				flippedCards[1].childNodes[1].classList.toggle("match");
				flippedCards[1].childNodes[3].classList.toggle("match");

				//chama a função que exibe a mensagem MATCH
				matchCardsSign();

				//limpa o array de cartas viradas
				flippedCards = [];

				//soma um ao contador de acertos
				matches++;

				//verifica se o contador de acertos chegou a 8
				if (matches >= 8) {
					//caso haja 8 acertos, chama a função que finaliza o jogo
					gameOver();
				}
			}
		}
	} else {
		//em caso haver duas cartas no array de cartas viradas (terceiro click) remove a classe flipped das cartas no array de cartas viradas
		flippedCards[0].childNodes[1].classList.toggle("flipped");
		flippedCards[0].childNodes[3].classList.toggle("flipped");
		flippedCards[1].childNodes[1].classList.toggle("flipped");
		flippedCards[1].childNodes[3].classList.toggle("flipped");

		//limpa o array de cartas viradas
		flippedCards = [];
		
	}
}


//função que embaralha as cartas recebendo um array de cartas por parâmetro
function randomSort(array) {
	//cria um array vazio
	var newArray = [];

	//executa a estrutura enquanto o novo array não atingir o mesmo número de elementos do arrau passado por parâmetro
	while (newArray.length !== array.length) {
		//cria uma variável i recebendo um número aleatório entre 0 e o número de elementos no array -1
		var i = Math.floor(Math.random() * array.length);

		//verifica se o elemento indicado pelo índice i já existe no array novo
		if (newArray.indexOf(array[i]) < 0) {
			//caso não exista é inserido
			newArray.push(array[i]);
		}
	}

	//retorna o array novo, que possui os elementos do array passado por parâmetro embaralhados
	return newArray;
}//fim da função que embaralha as cartas


//função que gera o sinal de MATCH
function matchCardsSign() {
	//joga a mensagem de MATCH para o primeiro plano
	matchSign.style.zIndex = "1";

	//deixa a mensagem transparente
	matchSign.style.opacity = "0";

	//move a mensagem para cima
	matchSign.style.top = "150px";

	//função executada após 1.5 segundo
	setTimeout(function () {

		matchSign.style.zIndex = "-1";

		//remove a transparência 
		matchSign.style.opacity = "1";

		//move a mensagem para o centro da tela
		matchSign.style.top = "250px";
	}, 1500);
}//função que exibe mensagem de MATCH

//função de fim do jogo
function gameOver() {
	//joga a mensagem de fim do jogo 
	modal.style.zIndex = "99";

	//evento click p/ game over
	modal.addEventListener('click', function () {
		//chama a função que reinicia o jogo
		startGame();
	}, false);
}


window.addEventListener('resize', function () {
	let largura = window.innerWidth;
	let altura = window.innerHeight;

	let larguraCard = 100;

	if (largura > altura) {
		larguraCard = Math.floor(((largura - 75) / 8));
	}
	else {
		larguraCard = Math.floor(((largura - 35) / 4));
	}

	let alturaCard = larguraCard * 1.5;
	for (var i = 0; i < 16; i++) {
		document.querySelector("#card" + i).style.width = larguraCard + "px";
		document.querySelector("#card" + i).style.height = alturaCard + "px";
	}

	let qtdCards = Math.floor(largura / (larguraCard + 5))
	topCard = 0;
	let ii = 0;
	for (var i = 0; i < 16; i++) {
		if (ii == qtdCards) {
			ii = 0;
			topCard += alturaCard + 10;
		}
		ii++;

		var card = document.querySelector("#card" + i);
		console.log(qtdCards, i, larguraCard);

		card.style.left = (i % qtdCards) === 0 ? 5 + "px" : 5 + ((i % qtdCards) * (larguraCard + 5)) + "px";
		card.style.top = i / qtdCards >= 1 ? topCard + "px" : 5 + "px";


		//posiciona as cartas no tabuleiro
		var card = document.querySelector("#card" + i);
		card.style.left = (i % qtdCards) === 0 ? 5 + "px" : 5 + ((i % qtdCards) * (larguraCard + 5)) + "px";
		card.style.top = i / qtdCards >= 1 ? topCard + "px" : 5 + "px";

	}
});