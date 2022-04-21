const apiUrl = "https://mock-api.driven.com.br/api/v6/buzzquizz/";
let quizzTitle;
let quizzUrl;
let questionsQuantity;
let quizzLevels;

let listOfquestions = [];
let listOfAnswers = [];
let listOfLevels = [];
let newQuizz;

function setBasicInformations(){
    basicInformations = document.querySelector(".basic-informations")
    quizzTitle = basicInformations.querySelector(".title").value;
    quizzUrl = basicInformations.querySelector(".url").value;
    questionsQuantity =  parseInt(basicInformations.querySelector(".quantity").value); 
    quizzLevels = parseInt(basicInformations.querySelector(".levels").value);

    document.querySelector(".basic-informations").classList.toggle("escondido");
	document.querySelector(".quizz-questions").classList.toggle("escondido");
	showQuestions();
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
					<input type="text" placeholder="Texto da pergunta" class="question-text">
					<input type="text" placeholder="Cor de fundo da pergunta" class="question-color">
				
		
					<h3>Resposta correta</h3>
						<input type="text" placeholder="Resposta correta" class="correct-answer">
						<input type="text" placeholder="URL da imagem" class="image-url">
				


						<h3>Respostas incorretas</h3>
						<input type="text" placeholder="Resposta incorreta 1" class="incorrect-1">
						<input type="text" placeholder="URL da imagem 1" class="incorrect-url-1">
					
						<input type="text" placeholder="Resposta incorreta 2" class="incorrect-2">
						<input type="text" placeholder="URL da imagem 2" class="incorrect-url-2">
					
						<input type="text" placeholder="Resposta incorreta 3" class="incorrect-3">
						<input type="text" placeholder="URL da imagem 3" class="incorrect-url-3">	
				</div>
			</div>
		`
	}
	questionElement.innerHTML += `
	<button class="create-quizz-button" onclick="showLevel()">Prosseguir para criar níveis</button>
	`
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
            <input type="text" placeholder="Título do nível" class="level-title">
            <input type="text" placeholder="% de acerto mínima" class="min-percent">
            <input type="text" placeholder="URL da imagem do nível" class="level-url">
            <input type="text" placeholder="Descrição do nível" class="level-description">
        </div>
    </div>`
	}
		questionElement.innerHTML += `
				<button class="create-quizz-button" onclick="setQuestions()">Finalizar quizz</button>

		`
}



function editQuestion(questionElement){
	questionElement.onclick ="";
	questionElement.querySelector(".select").classList.toggle("escondido");
	questionElement.querySelector(".edit-question").classList.toggle("escondido");


}



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
console.log(response);
console.log(response.data);


}

/*
   <div>
        <h1>Seu quizz está pronto!</h1>
        <img src="images/image title.svg" />
        <h4>O quão Potterhead é você?</h4>
    </div>


    <button class="reset-button">Acessar Quizz</button>

    <button class="home-button">Voltar para home</button>
*/




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