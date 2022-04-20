//Variáveis globais
let arrQuizzes = [];

function carregaQuizzesTodos(){
    const promise = axios.get("https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes"); 

    promise.catch(windowReload);
    promise.then(renderizaQuizzes);
}

function renderizaQuizzes(response){ 

    arrQuizzes = response.data;
    
    document.querySelector(".quizzes").innerHTML = "";
    for(let i = 0; i < arrQuizzes.length; i++){
        imprimeQuiz(arrQuizzes[i]);
    }
}

function imprimeQuiz(quiz){

    const quizzes = document.querySelector(".quizzes")

    quizzes.innerHTML += `
    <div class="quiz" onclick="abrirQuiz()">
        <img src="${quiz.image}" alt="imagem quiz" />
        <p>${quiz.title}</p>
        <div class="gradiente"></div>
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

function imprimeQuizUsuario(quiz){

    const quizzes = document.querySelector(".quizzesUsuario");

    quizzes.innerHTML += `
    <div class="quiz margemDireita" onclick="abrirQuiz()">
        <img src="${quiz.image}" alt="imagem quiz" />
        <p>${quiz.title}</p>
        <div class="gradiente"></div>
    </div>
    `

}

function windowReload(){
    window.location.reload();
}

carregaQuizzesTodos();