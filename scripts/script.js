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






function loadUserQuizzes(){
	listOfQuizzes = JSON.parse(localStorage.getItem('listOfQuizzes'));
	let userQuizzes = document.querySelector(".user-quizzes");
	userQuizzes.querySelector(".all-user-quizzes").innerHTML = "";
	if (listOfQuizzes.length === 0){
		userQuizzes.innerHTML = `
			<div class="zero-quizzes">
				<p>Você não criou nenhum<br>quizz ainda :(</p>
				<button onclick="startQuizzCreation()">Criar Quizz</button>
			</div>
			`
	}
	else {
		document.querySelector(".info").innerHTML = `
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
	document.querySelector(".main-page").classList.add("escondido");
	document.querySelector(".create-quizz").classList.add("escondido");
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

	let isAllCorrect = true;

		if (quizzTitle.length < 20 || quizzTitle.length > 65){
			let title = document.querySelector(".title");
			title.value = "";
			title.classList.add("error-border");
			title.placeholder = "O título deve ter no mínimo 20 caracteres e no máximo 65";
			isAllCorrect = false;
		}
		if (!isValidURL(quizzUrl)){
			let url = document.querySelector(".url");
			url.value = "";
			url.classList.add("error-border");
			url.placeholder = "Insira uma url válida";
			isAllCorrect = false;

		}
		
		 if (questionsQuantity < 3){
			let quantity = document.querySelector(".quantity");
			quantity.value = "";
			quantity.classList.add("error-border");
			quantity.placeholder = "O quizz deve ter no mínimo 3 perguntas";
			isAllCorrect = false;

		} 
		if (quizzLevels < 2){
			let level = document.querySelector(".levels");
			level.value = "";
			level.classList.add("error-border");
			level.placeholder = "O quizz deve ter no mínimo 2 níveis";
			isAllCorrect = false;

		}
		
		if (isAllCorrect === true){
		document.querySelector(".basic-informations").classList.toggle("escondido");
		document.querySelector(".quizz-questions").classList.toggle("escondido");
		showQuestions();
		}
 
}

let listOfElements = [];
let levelsElements = [];

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
	<button class="create-quizz-button" onclick="validateQuestions(listOfElements)">Prosseguir para criar níveis</button>
	`
}

//onclick="showLevel()"




function validateQuestions(elements){
	let isAllCorrect = true;

	for (let cont = 0; cont < elements.length; cont++){
		let edit = elements[cont].querySelector(".edit-question");
		let text = edit.querySelector(".question-text");
		if (text.value.length < 20){
			isAllCorrect = false;
			text.classList.add("error-border");
			text.value = "";
			text.placeholder = "O texto da pergunta deve ter no mínimo 20 caracteres";
		}
	
		//
		let color = edit.querySelector(".question-color");
		if (color.value.length != 7 || color.value[0] != "#"){
			isAllCorrect = false;
			color.classList.add("error-border");
			color.value = "";

			color.placeholder = "A cor de fundo precisa ser em hexadecimal";
		}
	
		//
		let answer = edit.querySelector(".correct-answer");
		if (answer.value.length === 0){
			isAllCorrect = false;
			answer.classList.add("error-border");
			answer.value = "";

			answer.placeholder = "A resposta não pode estar vazia";
		}

		//
		let url = edit.querySelector(".image-url");
		if (!isValidURL(url.value)){
			isAllCorrect = false;
			url.classList.add("error-border");
			url.value = "";

			url.placeholder = "Insira uma url válida";
		}
	


	}

	if (isAllCorrect === true && elements.length == questionsQuantity){
		showLevel();
	}

}
// 


function editQuestion(questionElement){
	questionElement.onclick ="";
	questionElement.querySelector(".select").classList.toggle("escondido");
	questionElement.querySelector(".edit-question").classList.toggle("escondido");
	listOfElements.push(questionElement);
}

//document.getElementById(`question${cont}`)


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
				<button class="create-quizz-button" onclick="validateLevels(levelsElements)">Finalizar quizz</button>

		`
}



function validateLevels(elements){
	let isAllCorrect = true;

	for (let cont = 0; cont < elements.length; cont++){
		let edit = elements[cont].querySelector(".edit-question");
		let title = edit.querySelector(".level-title");
		if (title.value.length < 10){
			isAllCorrect = false;
			title.classList.add("error-border");
			title.value = "";
			title.placeholder = "O título do nível deve ter no mínimo 10 caracteres";
		}
	
		//
		let percent = edit.querySelector(".min-percent");
		if (percent.value < 0 || percent.value > 100 || percent.value.length === 0 || isNaN(percent.value)){
			isAllCorrect = false;
			percent.classList.add("error-border");
			percent.value = "";
			percent.placeholder = "A porcentagem deve estar entre 0 e 100";
		}
	
		//#EC362D
		let description = edit.querySelector(".level-description");
		if (description.value.length < 30){
			isAllCorrect = false;
			description.classList.add("error-border");
			description.value = "";
			description.placeholder = "A descrição deve ter no mínimo 30 caracteres";
		}
	
		//
		let url = edit.querySelector(".level-url");
		if (!isValidURL(url.value)){
			isAllCorrect = false;
			url.classList.add("error-border");
			url.value = "";

			url.placeholder = "Insira uma url válida";
		}


	}

	if (isAllCorrect === true && elements.length == quizzLevels){
		setQuestions();
	}

}






function editLevel(levelElement){
	levelElement.onclick ="";
	levelElement.querySelector(".select").classList.toggle("escondido");
	levelElement.querySelector(".edit-question").classList.toggle("escondido");
	levelsElements.push(levelElement);


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
			saveLocalQuizz(response)
			showCreatedQuizz(response)
		}
	);
	promise.catch(
	);
}



function openCreatedQuizz(){
	document.querySelector(".create-quizz").classList.toggle("escondido");
	let nquizz = document.querySelector(".finished-quizz");
	const idQuizz = Number(nquizz.querySelector(".id").innerHTML);

	for(let i = 0; i < listOfQuizzes.length; i++){
			if(listOfQuizzes[i].id === idQuizz){
				exibeQuizz(listOfQuizzes[i]);
			}
		}
}
	


function showCreatedQuizz(response){
	let finishQuizz = document.querySelector(".finish-quizz");
	finishQuizz.innerHTML = `
	<div class="finished-quizz">
		<h1>Seu quizz está pronto!</h1>
		<img src="${response.data.image}" />
		<h4>${response.data.title}</h4>
		<div class="id escondido">${response.data.id}</div>
	</div>

	<button class='reset-button' onclick="openCreatedQuizz()">Acessar Quizz</button>

    <button class='home-button' onclick="voltaMenu()">Voltar para home</button>

`
}


function saveLocalQuizz(newQuizz){
	listOfQuizzes = JSON.parse(localStorage.getItem('listOfQuizzes'));
	listOfQuizzes.push(newQuizz.data);
	localStorage.setItem('listOfQuizzes', JSON.stringify(listOfQuizzes));
	const teste = JSON.parse(localStorage.getItem("listOfQuizzes"));
	console.log(teste);

}





function isValidURL(string) {
	let res = string.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
	return (res !== null)
  };