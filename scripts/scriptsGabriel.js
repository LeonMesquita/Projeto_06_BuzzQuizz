//Variáveis globais
let arrQuizzes = [];

function carregaQuizzesTodos(){
    const promise = axios.get("https://mock-api.driven.com.br/api/v6/buzzquizz/quizzes"); 

    promise.catch(windowReload);
    promise.then(renderizaQuizzes);
}

function renderizaQuizzes(response){ 

    arrQuizzes = response.data;
    
    document.querySelector(".quizzesServer").innerHTML = "";
    for(let i = 0; i < arrQuizzes.length; i++){
        imprimeQuiz(arrQuizzes[i]);
    }
}

function imprimeQuiz(quizz){

    const quizzes = document.querySelector(".quizzesServer")

    quizzes.innerHTML += `
    <div class="quizz margemDireita" onclick="abreQuiz(this)">
        <img src="${quizz.image}" alt="imagem quiz" />
        <p>${quizz.title}</p>
        <div class="gradiente"></div>
        <div class="id escondido">${quizz.id}</div>
    </div>
    `

}

function carregaQuizzesUsuario(){
    const promise = axios.get("https://mock-api.driven.com.br/api/v6/buzzquizz/quizzes"); 

    promise.catch(windowReload);
    promise.then(renderizaQuizzesUsuario);
}

function renderizaQuizzesUsuario(response){ 

    arrQuizzes = response.data;
    
    document.querySelector(".quizzesUsuario").innerHTML = "";
    for(let i = 0; i < arrQuizzes.length; i++){
        imprimeQuizUsuario(arrQuizzes[i]);
    }
}

function imprimeQuizUsuario(quizz){

    const quizzes = document.querySelector(".quizzesUsuario");

    quizzes.innerHTML += `
    <div class="quizz margemDireita" onclick="abreQuiz(this)">
        <img src="${quizz.image}" alt="imagem quiz">
        <p>${quizz.title}</p>
        <div class="gradiente"></div>
        <div class="id escondido">${quizz.id}</div>
    </div>
    `

}

function windowReload(){
    window.location.reload();
}

function abreQuiz(quizz){
    
    const idQuizz = Number(quizz.querySelector(".id").innerHTML);
    
    for(let i = 0; i < arrQuizzes.length; i++){
       if(arrQuizzes[i].id === idQuizz){
           exibeQuizz(arrQuizzes[i]);
       }
    }

}

function exibeQuizz(quizz){
    console.log(quizz)

    document.querySelector(".main-page").classList.add("escondido");
    const pagQuizz = document.querySelector(".quizz-page");
    pagQuizz.classList.remove("escondido");

    pagQuizz.querySelector(".quizz-image").innerHTML += `
    <img src="${quizz.image}" />
    <span>${quizz.title}</span>
    `

    for(let i = 0; i < quizz.questions.length; i++){
        pagQuizz.innerHTML += `
        <div class="questions-container"> 
            <div class="question-title question1">${quizz.questions[i].title}</div>
            <div class="options-container box${i}">
                
            </div>
        </div>
        `;

        let containerOpcoes = pagQuizz.querySelector(`.options-container.box${i}`);
        for(let j = 0; j < quizz.questions[i].answers.length; j++){
            containerOpcoes.innerHTML += `
            <div class="option">
                <img src="${quizz.questions[i].answers[j].image}" />
                <h3>${quizz.questions[i].answers[j].text}</h3>
                <p class="escondido">${quizz.questions[i].answers[j].isCorrectAnswer}</p>
            </div>`;
        }
        
    }

    //COMPLETAR ESSA PARTE NO MOMENTO EM QUE CALCULAR A % DE ACERTOS
    pagQuizz.innerHTML += `
    <div class="questions-container escondido">
        <div class="question-title result">
            88% de acerto: Você é praticamente um aluno de Hogwarts!
        </div>
        <div class="result-div">
            <img src="images/image 10.svg" alt="">
            <p>Parabéns Potterhead! Bem-vindx a Hogwarts, aproveite o loop infinito de comida e clique no botão abaixo para usar o vira-tempo e reiniciar este teste.</p>
        </div>
    </div>
    `;

    pagQuizz.innerHTML += `
    <button class='reset-button'>Reiniciar Quizz</button>
    <button class='home-button'>Voltar para home</button>
    `;
    
}

carregaQuizzesTodos();
carregaQuizzesUsuario();