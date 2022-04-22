const apiUrl = "https://mock-api.driven.com.br/api/v6/buzzquizz/";
let quizzTitle;
let quizzUrl;
let questionsQuantity = 0;
let quizzLevels = 0;
let listOfquestions = [];
let listOfAnswers = [];
let listOfLevels = [];
let listOfQuizzes = [];
let newQuizz;

let temp = JSON.parse(localStorage.getItem('listOfQuizzes'));
	
if (temp === null){
	localStorage.setItem('listOfQuizzes', JSON.stringify(listOfQuizzes));
}


loadUserQuizzes();



function loadUserQuizzes(){
	listOfQuizzes = JSON.parse(localStorage.getItem('listOfQuizzes'));
	let userQuizzes = document.querySelector(".user-quizzes");
	if (listOfQuizzes.length === 0){
		userQuizzes.innerHTML = `
			<div class="zero-quizzes">
				<p>Você não criou nenhum<br>quizz ainda :(</p>
				<button onclick="startQuizzCreation()">Criar Quizz</button>
			</div>
			`
	}
	else {
		document.querySelector(".info").innerHTML += `
					<p>Seus Quizzes</p>
					<button onclick="startQuizzCreation()">+</button>
				`
		for (let cont = 0; cont < listOfQuizzes.length; cont++){
			userQuizzes.querySelector(".all-user-quizzes").innerHTML += `
			
		
			<div class="quizz  margemDireita" onclick="openQuizz(this)">
				<img src="${listOfQuizzes[cont].image}" alt="imagem quiz" />
				<p>${listOfQuizzes[cont].title}</p>
				<div class="gradiente"></div>
				<div class="id escondido">${listOfQuizzes[cont].id}</div>
			</div>
		
			`
		}
	}
}



function openQuizz(quizz){
    const idQuizz = Number(quizz.querySelector(".id").innerHTML);
    
    for(let i = 0; i < listOfQuizzes.length; i++){
       if(listOfQuizzes[i].id === idQuizz){
           exibeQuizz(listOfQuizzes[i]);
       }
    }
}





function startQuizzCreation(){
	document.querySelector(".main-page").classList.toggle("escondido");
	document.querySelector(".create-quizz").classList.toggle("escondido");
}





function setBasicInformations(){
    basicInformations = document.querySelector(".basic-informations")
    quizzTitle = basicInformations.querySelector(".title").value;
    quizzUrl = basicInformations.querySelector(".url").value;
    questionsQuantity =  basicInformations.querySelector(".quantity").value; 
    quizzLevels = basicInformations.querySelector(".levels").value;



		if (quizzTitle.length < 20 || quizzTitle.length > 65){
			let title = document.querySelector(".title");
			title.value = "";
			title.classList.add("error-border");
			title.placeholder = "O título deve ter no mínimo 20 caracteres e no máximo 65";
		} else if (questionsQuantity < 3){
			let quantity = document.querySelector(".quantity");
			quantity.value = "";
			quantity.classList.add("error-border");
			quantity.placeholder = "O quizz deve ter no mínimo 3 perguntas";
		} else if (quizzLevels < 2){
			let level = document.querySelector(".levels");
			level.value = "";
			level.classList.add("error-border");
			level.placeholder = "O quizz deve ter no mínimo 2 níveis";
		}
		
		else{
		document.querySelector(".basic-informations").classList.toggle("escondido");
		document.querySelector(".quizz-questions").classList.toggle("escondido");
		showQuestions();
		}
 
}



function showQuestions(){
	let questionElement = document.querySelector(".quizz-questions");
	for (let cont = 0; cont < questionsQuantity; cont++){
		questionElement.innerHTML += `
			<div class="select-question" onclick="editQuestion(this)" id="question${cont}">
				<div class="select">
					<h2>Pergunta ${cont+1}</h2>
					<img src="images/note.svg" />
				</div>

				<div class="edit-question escondido">
					<h3>Pergunta ${cont+1}</h3>
					<input type="text" placeholder="Texto da pergunta" class="text-box question-text">
					<input type="text" placeholder="Cor de fundo da pergunta" class="text-box question-color">
				
		
					<h3>Resposta correta</h3>
						<input type="text" placeholder="Resposta correta" class="text-box correct-answer">
						<input type="text" placeholder="URL da imagem" class="text-box image-url">
				


						<h3>Respostas incorretas</h3>
						<input type="text" placeholder="Resposta incorreta 1" class="text-box incorrect-1">
						<input type="text" placeholder="URL da imagem 1" class="text-box incorrect-url-1">
					
						<input type="text" placeholder="Resposta incorreta 2" class="text-box incorrect-2">
						<input type="text" placeholder="URL da imagem 2" class="text-box incorrect-url-2">
					
						<input type="text" placeholder="Resposta incorreta 3" class="text-box incorrect-3">
						<input type="text" placeholder="URL da imagem 3" class="text-box incorrect-url-3">	
				</div>
			</div>
		`
	}
	questionElement.innerHTML += `
	<button class="create-quizz-button" onclick="showLevel()">Prosseguir para criar níveis</button>
	`
}


function editQuestion(questionElement){
	questionElement.onclick ="";
	questionElement.querySelector(".select").classList.toggle("escondido");
	questionElement.querySelector(".edit-question").classList.toggle("escondido");
}




function checkInputs(inputElement){
	for (let cont = 0; cont < inputElement.length; cont++){

	}
}


function showLevel(){
	let questionElement = document.querySelector(".quizz-levels");
	questionElement.onclick ="";
	document.querySelector(".quizz-questions").classList.toggle("escondido");
	document.querySelector(".quizz-levels").classList.toggle("escondido");

	for (let cont = 0; cont < quizzLevels; cont++){
		questionElement.innerHTML += `
		<div class="select-level" onclick="editLevel(this)" id="level${cont}">
			<div class="select">
				<h2>Nível ${cont+1}</h2>
				<img src="images/note.svg" />
			</div>

        <div class="edit-question escondido">
            <h3>Nível ${cont+1}</h3>
            <input type="text" placeholder="Título do nível" class="text-box level-title">
            <input type="text" placeholder="% de acerto mínima" class="text-box min-percent">
            <input type="text" placeholder="URL da imagem do nível" class="text-box level-url">
            <input type="text" placeholder="Descrição do nível" class="text-box level-description">
        </div>
    </div>`
	}
		questionElement.innerHTML += `
				<button class="create-quizz-button" onclick="setQuestions()">Finalizar quizz</button>

		`
}


/*

function editQuestion(questionElement){
	questionElement.onclick ="";
	questionElement.querySelector(".select").classList.toggle("escondido");
	questionElement.querySelector(".edit-question").classList.toggle("escondido");


}

*/




function editLevel(levelElement){
	levelElement.onclick ="";
	levelElement.querySelector(".select").classList.toggle("escondido");
	levelElement.querySelector(".edit-question").classList.toggle("escondido");

}




function setQuestions(){
	for (let cont = 0; cont < quizzLevels; cont++){
		const level = document.getElementById(`level${cont}`);
		listOfLevels.push(
			{
				title: level.querySelector(".level-title").value,
				image: level.querySelector(".level-url").value,
				text: level.querySelector(".level-description").value,
				minValue: parseInt(level.querySelector(".min-percent").value),
			},
		);
		
	}


	for (let cont = 0; cont < questionsQuantity; cont++){
	const question = document.getElementById(`question${cont}`);

	listOfAnswers.push(
		[
			{
			text: question.querySelector(".correct-answer").value,
			image: question.querySelector(".image-url").value,
			isCorrectAnswer: true
		},
		{
			text: question.querySelector(".incorrect-1").value,
			image: question.querySelector(".incorrect-url-1").value,
			isCorrectAnswer: false
		},
		{
			text: question.querySelector(".incorrect-2").value,
			image: question.querySelector(".incorrect-url-2").value,
			isCorrectAnswer: false
		},
		{
			text: question.querySelector(".incorrect-3").value,
			image: question.querySelector(".incorrect-url-3").value,
			isCorrectAnswer: false
		},
		]
		
		
	);


	
	listOfquestions.push(
		{
			title: question.querySelector(".question-text").value,
			color: question.querySelector(".question-color").value,
			answers: listOfAnswers[cont],
		},
	);

	}
	



newQuizz = {
	title: quizzTitle,
	image: quizzUrl,
	questions: listOfquestions,
	levels: listOfLevels,
}

createQuizz();


}



function createQuizz(){
	const promise = axios.post(`${apiUrl}quizzes`, newQuizz);
	promise.then(
		function(response){
			document.querySelector(".quizz-levels").classList.toggle("escondido")
			document.querySelector(".finish-quizz").classList.toggle("escondido")
			showCreatedQuizz(response)
			saveLocalQuizz(response)
		}
	);
	promise.catch(
	);
}


function showCreatedQuizz(response){
	let finishQuizz = document.querySelector(".finish-quizz");
	finishQuizz.innerHTML = `
	<div>
		<h1>Seu quizz está pronto!</h1>
		<img src="${response.data.image}" />
		<h4>${response.data.title}</h4>
	</div>


	<button class="reset-button">Acessar Quizz</button>

	<button class="home-button">Voltar para home</button>
	
	`
//console.log(response);
//console.log(response.data);


}


function saveLocalQuizz(newQuizz){
	listOfQuizzes = JSON.parse(localStorage.getItem('listOfQuizzes'));
	listOfQuizzes.push(newQuizz.data);
	localStorage.setItem('listOfQuizzes', JSON.stringify(listOfQuizzes));
	const teste = JSON.parse(localStorage.getItem("listOfQuizzes"));
	console.log(teste);

}



/*
formato do quizz:

{
	title: "Título do quizz",
	image: "https://http.cat/411.jpg",
	questions: [
		{
			title: "Título da pergunta 1",
			color: "#123456",
			answers: [
				{
					text: "Texto da resposta 1",
					image: "https://http.cat/411.jpg",
					isCorrectAnswer: true
				},
				{
					text: "Texto da resposta 2",
					image: "https://http.cat/412.jpg",
					isCorrectAnswer: false
				}
			]
		},
		{
			title: "Título da pergunta 2",
			color: "#123456",
			answers: [
				{
					text: "Texto da resposta 1",
					image: "https://http.cat/411.jpg",
					isCorrectAnswer: true
				},
				{
					text: "Texto da resposta 2",
					image: "https://http.cat/412.jpg",
					isCorrectAnswer: false
				}
			]
		},
		{
			title: "Título da pergunta 3",
			color: "#123456",
			answers: [
				{
					text: "Texto da resposta 1",
					image: "https://http.cat/411.jpg",
					isCorrectAnswer: true
				},
				{
					text: "Texto da resposta 2",
					image: "https://http.cat/412.jpg",
					isCorrectAnswer: false
				}
			]
		}
	],
	levels: [
		{
			title: "Título do nível 1",
			image: "https://http.cat/411.jpg",
			text: "Descrição do nível 1",
			minValue: 0
		},
		{
			title: "Título do nível 2",
			image: "https://http.cat/412.jpg",
			text: "Descrição do nível 2",
			minValue: 50
		}
	]
}


*/