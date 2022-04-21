//Variáveis globais
let arrQuizzes = [];
let acertos;
let perguntasRespondidas;
let quizzID;

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
    acertos = 0;
    perguntasRespondidas = 0;
    quizzID = quizz.id;

    document.querySelector(".main-page").classList.add("escondido");
    document.querySelector(".botoes").classList.remove("escondido");
    
    const pagQuizz = document.querySelector(".quizz-page");
    pagQuizz.classList.remove("escondido");

    pagQuizz.querySelector(".quizz-image").innerHTML = `
    <img src="${quizz.image}" />
    <span>${quizz.title}</span>
    `;
    
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
            <div class="option" onclick="selecionaOpcao(this)">
                <img src="${quizz.questions[i].answers[j].image}" />
                <h3>${quizz.questions[i].answers[j].text}</h3>
                <p class="escondido">${quizz.questions[i].answers[j].isCorrectAnswer}</p>
            </div>`;
        }
        
    }

    document.querySelector(".botoes").innerHTML = `
    <button class='reset-button'>Reiniciar Quizz</button>
    <button class='home-button' onclick="voltaMenu()">Voltar para home</button>
    `;
    
}

function selecionaOpcao(opcaoClicada){

    const divPai = opcaoClicada.parentNode;
    const arrOptions = divPai.querySelectorAll(".option");

    for(let i = 0; i < arrOptions.length; i++){
        
        if(arrOptions[i] !== opcaoClicada){
            arrOptions[i].classList.add("opacidade");
        }
        
        if(arrOptions[i].querySelector("p").innerHTML === "true"){
            arrOptions[i].querySelector("h3").classList.add("verde");
        }
        
        if(arrOptions[i].querySelector("p").innerHTML === "false"){
            arrOptions[i].querySelector("h3").classList.add("vermelho");
        }
    }

    if(opcaoClicada.querySelector("p").innerHTML === "true"){
        acertos++;
        perguntasRespondidas++;
        verificaFim();
    }else{
        perguntasRespondidas++;
        verificaFim();
    }

    for(let j = 0; j < arrOptions.length; j++){
        arrOptions[j].removeAttribute("onclick");
    }
}

function verificaFim(){

    const arrQuestions = document.querySelector(".quizz-page").querySelectorAll(".questions-container");

    if(perguntasRespondidas === arrQuestions.length){
        buscaQuizz();
    }
}

function buscaQuizz(){

    let promise = axios.get(`https://mock-api.driven.com.br/api/v6/buzzquizz/quizzes/${quizzID}`);
    promise.then(calculaResultado);
}

function calculaResultado(response){

    let quizz = response.data;
    let porcentagemAcertos = calculaAcertos();
    let levelUsuario;    

    for(let i = 0; i < quizz.levels.length; i++){
        if(porcentagemAcertos >= Number(quizz.levels[i].minValue)){

            if(levelUsuario === undefined || (Number(quizz.levels[i].minValue) > Number(quizz.levels[levelUsuario].minValue))  ){
                levelUsuario = i;
            }
        }
    }
    
    renderizaResultado(quizz, levelUsuario, porcentagemAcertos);
}

function renderizaResultado(quizz, level, porcentagemAcertos){

    const pagQuizz = document.querySelector(".quizz-page");
    const levelExibido = quizz.levels[level];
    
    pagQuizz.innerHTML += `
    <div class="questions-container">
        <div class="question-title result">
            ${porcentagemAcertos}% de acerto: ${levelExibido.title}
        </div>
        <div class="result-div">
            <img src="${levelExibido.image}" alt="imagem quizz">
            <p>${levelExibido.text}</p>
        </div>
</div>
    `

}

function calculaAcertos(){

    const porcentagemAcertos = (acertos/perguntasRespondidas)*100;
    return porcentagemAcertos.toFixed(0);
}

function voltaMenu(){

    const pagQuizz = document.querySelector(".quizz-page");
    const questContainer = pagQuizz.querySelectorAll(".questions-container")
    pagQuizz.classList.add("escondido");
    for(let i = 0; i < questContainer.length; i++){
        questContainer[i].remove();
    }
    
    document.querySelector(".quizz-image").innerHTML = "";
    
    document.querySelector(".botoes").classList.add("escondido");

    document.querySelector(".main-page").classList.remove("escondido");
    carregaQuizzesTodos();
}

carregaQuizzesTodos();
carregaQuizzesUsuario();