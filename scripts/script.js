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
let selectedQuizz;
let isEditing = false;

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
			
		
			<div class="quizz margemDireita">
				<img src="${listOfQuizzes[cont].image}" alt="imagem quiz" />
				<p>${listOfQuizzes[cont].title}</p>
				<div class="gradiente" onclick="openQuizz(this)"></div>
				<div class="id escondido">${listOfQuizzes[cont].id}</div>
				<div class="funcoes-quizz">
            		<ion-icon name="create-outline" onclick="editQuizz(this)"></ion-icon>
            		<ion-icon name="trash-outline" onclick="apagarQuizz(this)"></ion-icon>
        		</div>
			</div>
		
			`
		}
	}
}



function openQuizz(quizz){
	document.querySelector(".main-page").classList.add("escondido");
	document.querySelector(".create-quizz").classList.add("escondido");
    const idQuizz = Number(quizz.parentNode.querySelector(".id").innerHTML);
    
	exibeLoading();
	setTimeout(function (){
        removeLoading();
    
        for(let i = 0; i < listOfQuizzes.length; i++){
			if(listOfQuizzes[i].id === idQuizz){
				exibeQuizz(listOfQuizzes[i]);
			}
        }
    }, TIME_1S);

	
}





function startQuizzCreation(){
	document.querySelector(".main-page").classList.add("escondido");
	document.querySelector(".create-quizz").classList.remove("escondido");
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
			<div class="select-question" onclick="openQuestion(this, ${cont})" id="question${cont}">
				<div class="select">
					<h2>Pergunta ${cont+1}</h2>
					<img src="images/note.svg" />
				</div>


			</div>
		`
	}
	questionElement.innerHTML += `
	<button class="create-quizz-button" onclick="validateQuestions(listOfElements)">Prosseguir para criar níveis</button>
	`
}


function openQuestion(question, id){
	question.onclick ="";
	listOfElements.push(question);
	question.innerHTML += `
	
	<div class="edit-question">
		<h3>Pergunta ${id+1}</h3>
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
	`

	if (isEditing === true){
		let cont = 0;
		while (cont < selectedQuizz.questions.length){
			if (id === cont){
				question.querySelector(".question-text").value = selectedQuizz.questions[cont].title;
				question.querySelector(".question-color").value = selectedQuizz.questions[cont].color;

				question.querySelector(".correct-answer").value = selectedQuizz.questions[cont].answers[0].text;
				question.querySelector(".image-url").value = selectedQuizz.questions[cont].answers[0].image;

				question.querySelector(".incorrect-1").value = selectedQuizz.questions[cont].answers[1].text;
				question.querySelector(".incorrect-url-1").value = selectedQuizz.questions[cont].answers[1].image;
				question.querySelector(".incorrect-2").value = selectedQuizz.questions[cont].answers[2].text;
				question.querySelector(".incorrect-url-2").value = selectedQuizz.questions[cont].answers[2].image;
				question.querySelector(".incorrect-3").value = selectedQuizz.questions[cont].answers[3].text;
				question.querySelector(".incorrect-url-3").value = selectedQuizz.questions[cont].answers[3].image;
			
			}
				cont++;
		}
	}
	question.querySelector(".select").classList.toggle("escondido");
}




function validateQuestions(elements){
	let isAllCorrect = true;
	let incorrectAnswers = 0;

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
		
		let incorrect1 = edit.querySelector(".incorrect-1");
		if(edit.querySelector(".incorrect-1").value && edit.querySelector(".incorrect-url-1").value){
			incorrectAnswers++;
		}
		if(edit.querySelector(".incorrect-2").value && edit.querySelector(".incorrect-url-2").value){
			incorrectAnswers++;
		}
		if(edit.querySelector(".incorrect-3").value && edit.querySelector(".incorrect-url-3").value){
			incorrectAnswers++;
		}

		if (incorrectAnswers === 0){
			isAllCorrect = false;
			incorrect1.classList.add("error-border");
			incorrect1.placeholder = "Você deve inserir ao menos uma resposta errada";
		}
		else{
			incorrectAnswers = 0
		}


	}

	if (isAllCorrect === true && elements.length == questionsQuantity){
		showLevel();
	}

}
// 

function showLevel(){
	let questionElement = document.querySelector(".quizz-levels");
	questionElement.onclick ="";
	document.querySelector(".quizz-questions").classList.toggle("escondido");
	document.querySelector(".quizz-levels").classList.toggle("escondido");

	for (let cont = 0; cont < quizzLevels; cont++){
		questionElement.innerHTML += `
		<div class="select-level" onclick="editLevel(this, ${cont})" id="level${cont}">
			<div class="select">
				<h2>Nível ${cont+1}</h2>
				<img src="images/note.svg" />
			</div>
    </div>`
	}
		questionElement.innerHTML += `
				<button class="create-quizz-button" onclick="validateLevels(levelsElements)">Finalizar quizz</button>

		`
}



function editLevel(levelElement, id){
	levelElement.onclick ="";
	levelElement.querySelector(".select").classList.toggle("escondido");
	levelsElements.push(levelElement);

	levelElement.innerHTML += `
		<div class="edit-question">
			<h3>Nível ${id+1}</h3>
			<input type="text" placeholder="Título do nível" class="text-box level-title">
			<input type="text" placeholder="% de acerto mínima" class="text-box min-percent">
			<input type="text" placeholder="URL da imagem do nível" class="text-box level-url">
			<input type="text" placeholder="Descrição do nível" class="text-box level-description">
		</div>
	`
	console.log(selectedQuizz)

	if (isEditing === true){
		let cont = 0;
		while (cont < selectedQuizz.levels.length){
			if (id === cont){
				levelElement.querySelector(".level-title").value = selectedQuizz.levels[cont].title;
				levelElement.querySelector(".min-percent").value = selectedQuizz.levels[cont].minValue;
				levelElement.querySelector(".level-url").value = selectedQuizz.levels[cont].image;
				levelElement.querySelector(".level-description").value = selectedQuizz.levels[cont].text;	
			}
				cont++;
		}
	}

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
	let answers = [];
	answers.push(
		{
			text: question.querySelector(".correct-answer").value,
			image: question.querySelector(".image-url").value,
			isCorrectAnswer: true
			},
	);

	for (let i = 1; i <= 3; i++){
		if (question.querySelector(`.incorrect-${i}`).value && question.querySelector(`.incorrect-url-${i}`).value){
			answers.push(
				{
					text: question.querySelector(`.incorrect-${i}`).value,
					image: question.querySelector(`.incorrect-url-${i}`).value,
					isCorrectAnswer: false
				},
			);
	}
	}

	

	listOfAnswers.push(answers);


	
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
	if (isEditing === false){
		const promise = axios.post(`${apiUrl}quizzes`, newQuizz);
		promise.then(
			function(response){
				saveLocalQuizz(response)
				showCreatedQuizz(response)
			}
		);
	}
	else {
		isEditing = false;
		let promise = axios.put(`https://mock-api.driven.com.br/api/v6/buzzquizz/quizzes/${editID}`, newQuizz, {headers: {"Secret-Key": secretKey}});
		promise.then(
			function(response){
				saveEditedQuizz(response)
				showCreatedQuizz(response)
			}
		);

	}

}

function saveLocalQuizz(newQuizz){
	listOfQuizzes = JSON.parse(localStorage.getItem('listOfQuizzes'));
	listOfQuizzes.push(newQuizz.data);
	localStorage.setItem('listOfQuizzes', JSON.stringify(listOfQuizzes));
	const teste = JSON.parse(localStorage.getItem("listOfQuizzes"));
}



function saveEditedQuizz(quizz){
	listOfQuizzes.splice(listOfQuizzes.indexOf(editID), 1);
	listOfQuizzes.push(quizz.data);
	localStorage.setItem('listOfQuizzes', JSON.stringify(listOfQuizzes));
}



function showCreatedQuizz(response){
	let finishQuizz = document.querySelector(".finish-quizz");
	document.querySelector(".quizz-levels").classList.toggle("escondido")
	document.querySelector(".finish-quizz").classList.toggle("escondido")
	finishQuizz.innerHTML = `
	<div class="finished-quizz">
		<h1>Seu quizz está pronto!</h1>
		<div class = "quizz">
			<img src="${response.data.image}" />
			<p>${response.data.title}</p>
			<div class="gradiente"></div>
		</div>
		<div class="id escondido">${response.data.id}</div>
	</div>

	<button class='reset-button' onclick="openCreatedQuizz()">Acessar Quizz</button>

    <button class='home-button' onclick="voltaMenu()">Voltar para home</button>

`;
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
	



let secretKey;
let editID
function editQuizz(iconClicado){
	listOfQuizzes = JSON.parse(localStorage.getItem('listOfQuizzes'));
	document.querySelector(".main-page").classList.toggle("escondido");
	let createPage = document.querySelector(".create-quizz")
	createPage.classList.toggle("escondido");
	
	isEditing = true;

	const quizz = iconClicado.parentNode.parentNode;
	editID = Number(quizz.querySelector(".id").innerHTML);


	for (let cont = 0; cont < listOfQuizzes.length; cont++){
		if (listOfQuizzes[cont].id == editID){
			selectedQuizz = listOfQuizzes[cont];
			secretKey = listOfQuizzes[cont].key;
		}

	}

	let basicInformations = createPage.querySelector(".basic-informations");
	basicInformations.querySelector(".title").value = selectedQuizz.title;
	basicInformations.querySelector(".url").value = selectedQuizz.image;
	basicInformations.querySelector(".quantity").value = selectedQuizz.questions.length;
	basicInformations.querySelector(".levels").value = selectedQuizz.levels.length;
}




function isValidURL(string) {
	let res = string.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
	return (res !== null)
  };