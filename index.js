const rawData = `
[
    {
        "id": 0,
        "category": 1,
        "statement": "Why astronauts are weightless in space?",
        "options": [
            {
                "option": "There is no gravity in space.",
                "value": 1
            },
            {
                "option": "The force of gavity decreases as the dsitance between two masses increases.",
                "value": 2
            },
            {
                "option": "Astronauts are plummeting around earth at constant speed.",
                "value": 3
            }
        ],
        "answer": {
            "option": "Astronauts are plummeting around earth at constant speed.",
            "value": 3
        }
    },
    {
        "id": 1,
        "category": 1,
        "statement": "How do atoms look like?",
        "options": [
            {
                "option": "A cloud",
                "value": 1
            },
            {
                "option": "A solar system.",
                "value": 2
            },
            {
                "option": "A plum pudding.",
                "value": 3
            }
        ],
        "answer": {
            "option": "A cloud",
            "value": 1
        }
    },
    {
        "id": 2,
        "category": 1,
        "statement": "Why is the sky blue?",
        "options": [
            {
                "option": "The reflection of the sea on the sky.",
                "value": 1
            },
            {
                "option": "Human eyes perceive violet light most sharply.",
                "value": 2
            },
            {
                "option": "Blue light is more likely to strike nitrogen and oxigen molecules.",
                "value": 3
            }
        ],
        "answer": {
            "option": "Rayleigh Scattering.",
            "value": 3
        }
    },
    {
        "id": 3,
        "category": 2,
        "statement": "What is the most common element in the human body?",
        "options": [
            {
                "option": "Calcium",
                "value": 1
            },
            {
                "option": "Oxigen",
                "value": 2
            },
            {
                "option": "Carbon",
                "value": 3
            }
        ],
        "answer": {
            "option": "Oxigen",
            "value": 2
        }
    },
    {
        "id": 4,
        "category": 2,
        "statement": "Unlike most other fish, sharks have no ______?",
        "options": [
            {
                "option": "liver",
                "value": 1
            },
            {
                "option": "bones",
                "value": 2
            },
            {
                "option": "heart",
                "value": 3
            }
        ],
        "answer": {
            "option": "bones",
            "value": 2
        }
    },
    {
        "id": 5,
        "category": 2,
        "statement": "Which organ do insects NOT have?",
        "options": [
            {
                "option": "Lungs",
                "value": 1
            },
            {
                "option": "Brain",
                "value": 2
            },
            {
                "option": "Stomach",
                "value": 3
            }
        ],
        "answer": {
            "option": "Lungs",
            "value": 1
        }
    }
]
`;

document.onreadystatechange = () => {  // Use this to an alternative of document.addEventListener("DOMContentLoaded", callback );
    switch (document.readyState){
        case "interactive":
            // Global Vars:
            let name, 
            selectedCat, 
            qIdx = 1,
            time = 30;
            let selectedAnswers = [];
            const data = JSON.parse(rawData);
            let questions;
            
            // Logo redirect to home
            logoAction();
            
            // NavBar change color at intersection
            navBarAnim();

            // Welcome Card Handler
            let welcomeForm = document.querySelector(".welcome__form"),
            timerElement = document.querySelector("#time");

            welcomeForm.onsubmit = event => {
                name = event.target.elements.name.value;
                cardChange( catContent(name , time) );
            };
            
            // Observer Of DOM Mutations
            let observer = new MutationObserver(callback);

            observer.observe( document.querySelector(".card__form"), {
                childList: true,
                subtree: true
            });

            function callback(mutations) {
                for ( let mutation of mutations ){
                    if ( mutation.type === 'childList' ){
                        // Category Card Handler
                        let catC1Btn = document.querySelector("#cat_one_btn"), catC2Btn = document.querySelector("#cat_two_btn");

                        if ( catC1Btn ){
                            catC1Btn.onclick = event => {
                                event.preventDefault();
                                selectedAnswers = [];
                                qIdx = 1;
                                selectedCat = 1;
                                questions = shuffleArr(data.filter( item => item.category == selectedCat ));
                                cardChange( questionContent(questions[0]) );
                            };
                        }
                        if ( catC2Btn ){
                            catC2Btn.onclick = event => {
                                event.preventDefault();
                                selectedAnswers = [];
                                qIdx = 1;
                                selectedCat = 2;
                                questions = shuffleArr(data.filter( item => item.category == selectedCat ));
                                cardChange( questionContent(questions[0]) );
                            };
                        }

                        // Questions Card Handler
                        let usrAns = 0, optionsForm = document.querySelector(".q-options");

                        let nIntervId;

                        if( optionsForm ){

                            // CountDown Timer Handler
                            timerElement.innerText = "";
                            let timer = time, seconds;
                            nIntervId = setInterval( () => {
                                seconds = parseInt( timer, 10 );
                                seconds = ( seconds < 10 ) ? "0" + seconds : seconds;
                                timerElement.innerText = `${seconds}`;
                                --timer;
                                if ( timer < 0 ){

                                    timerElement.innerText = "";
                                    clearInterval(nIntervId);
                                    nIntervId = null;

                                    usrAns = 0;
                                    selectedAnswers.push(usrAns);
                                    if ( qIdx == (questions.length - 1) ){
                                        cardChange( questionContent(questions[qIdx], last=true) );
                                    } else if ( qIdx >= questions.length ){
                                        cardChange( answersContent( questions, selectedAnswers, name ) )
                                    }else{
                                        cardChange( questionContent(questions[qIdx]) );
                                    }
                                    qIdx++;
                                }
                            }, 1000);

                            optionsForm.onsubmit = event => {
                                event.preventDefault();
                                usrAns = parseInt(event.target.elements.option.value);

                                timerElement.innerText = "";
                                clearInterval(nIntervId);
                                nIntervId = null;

                                if ( usrAns ){
                                    selectedAnswers.push(usrAns);
                                    if ( qIdx == (questions.length - 1) ){
                                        cardChange( questionContent(questions[qIdx], last=true) );
                                    } else if ( qIdx >= questions.length ){
                                        cardChange( answersContent( questions, selectedAnswers, name ) )
                                    }else{
                                        cardChange( questionContent(questions[qIdx]) );
                                    }
                                    qIdx++;
                                }else{
                                    alert("Please select an option!");
                                }
                            };
                        }

                        // Ending Card Handler
                        let endTrivia = document.querySelector("#end_btn");

                        if( endTrivia ) {
                            endTrivia.onclick = event => {
                                event.preventDefault();
                                location.reload();
                            };
                        }

                    }
                }
            }

            break;
        default:
            break;
    }
};


// NewContent functions that returns the object with new content for the cardChangeFunction
function answersContent( questions, selectedAnswers, name ) {
    /**
     * This functions returns the content of the card that show the cquestions with the user selected answers and the corresponding correct answers
     * - questions (array<object>) array of questions to show in the card
     * - selectedAnswers (array) array that contains the values of the user selected answers.
     */
    let content = {};

    for (let i = 0; i < questions.length; i++ ){

    }

    content.subtitle = "<h2>Results: </h2>";
    content.desc = scoreElement(questions, selectedAnswers, name );
    string = "";

    for ( let i = 0; i < questions.length; i++ ) {

        string += `<h4>${questions[i].statement}</h4>`;

        let correctOption = parseInt(questions[i].answer.value);
        let selectedOption = parseInt(selectedAnswers[i]);

        let selected;

        let inpArr = [];

        for ( let opt of questions[i].options ){

            let classString = "";
            
            if ( parseInt(opt.value) == correctOption ){
                classString = "correct-answer";
            } else if ( parseInt(opt.value) == selectedOption && selectedOption != correctOption ){
                classString = "incorrect-answer";
            }

            selected = ( parseInt(opt.value) == selectedOption ) ? true : false;

            let x = {
                class: classString,
                dName: opt.option,
                nameAt: "option",
                valAt: opt.value,
                selAt: selected,
            };
            inpArr.push(x);

        }

        if ( i == questions.length - 1 ){

            string += formElement("", inpArr, [
                {
                    idAt: "cat_one_btn",
                    nameAt: "again_cat_one_btn",
                    valAt: "Play Again Physics",
                },
                {
                    idAt: "cat_two_btn",
                    nameAt: "again_cat_two_btn",
                    valAt: "Play Again Biology",
                },
                {
                    idAt: "end_btn",
                    nameAt: "end_btn",
                    valAt: "END",
                },
            ], inpName = name, playAgain = true , disabled = true);

        }else{

            string += formElement("", inpArr, [], undefined, false, true);

        }

    }
    content.form = string;

    return content;    
}

function questionContent( question, last = false ) {
    /**
     * This function returns the object with the new html elements  for the question (idx) card
     * - question (object) object that contains the question you want to show
     * - last (bool) value that tells if the question is the last of the list of questions
     * 
     */
    let content = {};
    let inpArr = [];
    let btnArr;

    if ( last ){
        btnArr = [{
            idAt: "next_q_btn",
            nameAt: "next_q_btn",
            valAt: "FINISH",
        }];
    }else{
        btnArr = [{
            idAt: "next_q_btn",
            nameAt: "next_q_btn",
            valAt: "NEXT",
        }];
    }

    for ( let opt of question.options ){
        let x = {
            class: "",
            dName: opt.option,
            nameAt: "option",
            valAt: opt.value,
            selAt: false,
        };
        inpArr.push(x);
    }

    content.subtitle = `<h2>${question.statement}</h2>`;
    content.desc = "<p>Please select the correct answer: </p>";
    content.form = formElement( "q-options", inpArr, btnArr );
    return content;
    
}

function catContent( inputName, time ) {
    /**
     * This function returns the object with the new html elements for the category select card
     * - inputName (string) the name that  the index page asks for
     */
    let content = {};

    content.subtitle = (inputName) ? `<h2>Hello ${inputName}!!</h2>` : "<h2>Hello Random Player!!</h2>";
    content.desc = `
        <h3>Instructions: </h3>
        <p>You will have ${time} seconds to answer each question.</p>
        <p>Please select a category: </p>
    `;
    content.form = formElement( "", [], [
        {
            idAt: "cat_one_btn",
            nameAt: "cat_one_btn",
            valAt: "Play Physics",
        },
        {
            idAt: "cat_two_btn",
            nameAt: "cat_two_btn",
            valAt: "Play Biology",
        },
    ] );

    return content;
}

// DOM manipuator
function cardChange( newContent ) {
    /**
     * Function that changes the htmlElements of the main card
     * - newContent (object) is the object that contains the new html or text of each element
     */
    let cardSubtitle = document.querySelector(".card__subtitle");
    let cardDesc = document.querySelector(".card__description");
    let cardForm = document.querySelector(".card__form");

    cardSubtitle.innerHTML = newContent.subtitle;
    cardDesc.innerHTML = newContent.desc;
    cardForm.innerHTML = newContent.form;
}

function navBarAnim(){
    /**
     * Function that detects the intersection of the navbar with the main element to toggle a color change
     */
    const observer = new IntersectionObserver( entries => {
        document.querySelector(".bar").classList.toggle("bar--bg", entries[0].intersectionRatio < 0.9);
    }, {
        threshold: 0.9
    });
    
    observer.observe(document.querySelector(".main"));
}

function logoAction(){
    /**
     * Function that gives the webpage logo and the home logo the ability of reloading the whole app
     */
    let logo = document.querySelector(".bar__logo");
    let homeLogo = document.querySelector(".home--link");

    logo.addEventListener("mouseover", () => {
        logo.style.cursor = "pointer";
    });

    logo.addEventListener("click", e => {
        window.location.reload();
    });

    homeLogo.addEventListener("click", e => {
        e.preventDefault();
        window.location.reload();
    });
    }

// HTML string elements
function scoreElement( questions, selectedAnswers, name = undefined ) {
    /**
     * Function that return an html element that displays the score related to the answers selected.
     * - questions (array<object>) the array of the questions selected from the DB
     * - selectedAnswers (array<int>) array containikng the values of the user selected answers
     * - name (string) optional, it displays the name of the  player
     */
    let correct = questions.map( item => parseInt(item.answer.value) );
    let corrAns = 0;
    let string = `<p class="results">`;

    for ( let i = 0; i < correct.length; i++ ){
        if ( correct[i] == selectedAnswers[i] )
            corrAns += 1;
    }

    let score = (corrAns*100)/correct.length;

    if ( name ){
        string += `${name}, you got ${corrAns}/${correct.length} correct. <span class="score"> Score: ${score.toFixed(2)}</span></p>`;
    }else{
        string += `You got ${corrAns}/${correct.length} correct. <span class="score"> Score: ${score.toFixed(2)}</span></p>`
    }
    return string;
}

function formElement( formClassName, inputsArr, btnsArr, inpName = undefined , playAgain = false, disabled = false ) {
    /**
     * Functions that returns a string containing a form element, with the respective buttons and inputs
     * - formClassName (string) add another class to the elment form created
     * - inputsArr (array<object>) each object should contain the parameters that inputRadioELement needs (length independent of btnsArr)
     * - btnsArr (array<object>) each object should contain the parameters that btnElement needs
     */
    let string = `<form class="form ${formClassName}">`;

    for ( let input of inputsArr ) {
        string += inputRadioElement( input.class, input.dName, input.nameAt, input.valAt, input.selAt , disabled );
    }
    if ( playAgain ){
        string += (inpName) ? `<p>${inpName}, do you want to play again??</p>` : "<p>Do you want to play again??</p>";
    }
    for ( let btn of btnsArr ){
        string += btnElement(btn.idAt, btn.nameAt, btn.valAt );
    }

    string += "</form>"
    return string;

}

function inputRadioElement( extraClass = "", displayName, nameAtt, valAtt, selectedAtt = false, disabledAtt = false ) {
    /**
     * Function that returns a string with a form html element
     * - extraClass (string) add another class to the input element
     * - displayName (string) assigns innerText for the span element
     * - nameAtt (string) assigns name attribute
     * - valAtt (string/int) assigns value attribute
     * - selectedAtt (bool) if true if puts the input on checked state
     */
    return `
    <label class="label">
        <input class="input" type="radio" name="${nameAtt}" value="${valAtt}" ${ (selectedAtt) ? (" checked ") : ("") } ${ (disabledAtt) ? (" disabled ") : ("")}>
        <span class="${extraClass}">${displayName}</span>
    </label>
    `;
}

function btnElement( idAtt, nameAtt, valAtt ) {
    /**
     * Funciton that returns a string with a button html element
     * - idAtt (string) assigns the id attribute
     * - nameAtt (string) assigns the name attribute
     * - valAtt (string) assigns the value attribute
     */
    return `<input class="card__button" id="${idAtt}" type="submit" name="${nameAtt}" value="${valAtt}" />`;
}

// Misc
function shuffleArr(array) {
    /**
     * Function that returns the input array shuffled
     * - array (array) array to be shuffled
     */
    let currentIndex = array.length,  randomIndex;
    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
    return array;
}

// Minutes and seconds count down (dont forget to cclear interval when finished!)
// function startTimer( duration, display ) {
//     let timer = duration, minutes, seconds;
//     setInterval( () => {
//         minutes = parseInt( timer / 60, 10 );
//         seconds = parseInt( timer % 60, 10 );

//         minutes = ( minutes < 10 ) ? "0" + minutes : minutes;
//         seconds = ( seconds < 10 ) ? "0" + seconds : seconds;

//         display.innerText = `${minutes}:${seconds}`;

//         if ( --timer < 0 )
//             display.innerText = "Time's UP!";

//     }, 1000);
// }