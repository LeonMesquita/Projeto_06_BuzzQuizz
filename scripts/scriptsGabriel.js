//Variáveis globais
let arrQuizzes = [];

function carregaQuizzes(){

    const promise = axios.get("https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes"); 

    promise.catch(windowReload);
    promise.then(renderizaQuizzes);
}

function windowReload(){
    window.location.reload();
}

function renderizaQuizzes(response){ 

    arrQuizzes = response.data;
    
    document.querySelector(".quizzes").innerHTML = "";
    for(let i = 0; i < arrQuizzes.length; i++){
        imprimeQuiz(arrQuizzes[i]);
    }

}

function imprimeQuiz(quiz){

    const quizzes = document.querySelector(".quizzes");

    quizzes.innerHTML += `
    <div class="quiz">
        <img src="${quiz.image}" alt="imagem quiz" />
        <p>${quiz.title}</p>
        <div class="gradiente"></div>
    </div>
    `

}

carregaQuizzes();