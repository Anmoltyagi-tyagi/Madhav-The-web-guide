let recognition = null;
let assistantRunning = false;

/* profile state */
let waitingForProfileMenu = false;
let requestedProfileAction = null;

/* ---------------- MESSAGE LISTENER ---------------- */
chrome.runtime.onMessage.addListener((msg) => {
    if (msg.action === "startAssistant") {
        startAssistant();
    }
});

/* ---------------- SPEAK ---------------- */
function speak(text){

    /* cancel previous speech so new one always plays */
    speechSynthesis.cancel();

    let speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-US";
    speech.rate = 1;
    speech.pitch = 1;

    speechSynthesis.speak(speech);
}

/* ---------------- START ASSISTANT ---------------- */
function startAssistant(){

    if(assistantRunning) return;
    assistantRunning = true;

    const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

    if(!SpeechRecognition){
        alert("Speech recognition not supported");
        return;
    }

    recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onresult = (event)=>{

        let command =
        event.results[event.results.length-1][0]
        .transcript.toLowerCase();

        console.log("Heard:",command);

        parseCommand(command);
    };

    /* restart if stopped */
    recognition.onend = () => {
        if(assistantRunning){
            recognition.start();
        }
    };

    recognition.start();
}

/* ---------------- TEXT EXTRACTION ---------------- */
function getElementText(el){

    return(
        el.innerText ||
        el.value ||
        el.placeholder ||
        el.title ||
        el.alt ||
        el.getAttribute("aria-label") ||
        ""
    ).toLowerCase();

}

/* ---------------- COMMAND PARSER ---------------- */
function parseCommand(command){

    if(command.includes("search")){
        guideSearch();
        return;
    }

    if(command.includes("subscribe")){
        guideSubscribe();
        return;
    }

    if(command.includes("login") || command.includes("sign in")){
        if(detectLoginForm()) return;
    }

    /* PROFILE COMMANDS */

    if(command.includes("sign out")){
        requestedProfileAction="sign out";
        findProfileAvatar();
        return;
    }

    if(command.includes("switch account")){
        requestedProfileAction="switch account";
        findProfileAvatar();
        return;
    }

    if(command.includes("settings")){
        requestedProfileAction="settings";
        findProfileAvatar();
        return;
    }

    if(command.includes("help")){
        requestedProfileAction="help";
        findProfileAvatar();
        return;
    }

    if(command.includes("data")){
        requestedProfileAction="data";
        findProfileAvatar();
        return;
    }

    handleGeneralCommand(command);
}

/* ---------------- SEARCH ---------------- */
function guideSearch(){

let inputs=document.querySelectorAll("input");

for(let input of inputs){

let rect=input.getBoundingClientRect();

if(rect.width>200){

guideElement(input,"Search here");
speak("Use this search box");

return;

}

}

}

/* ---------------- SUBSCRIBE ---------------- */
function guideSubscribe(){

/* check if on video page */

let subscribeBtn = document.querySelector(
"#subscribe-button button, ytd-subscribe-button-renderer button"
);

if(subscribeBtn){

guideElement(subscribeBtn,"Subscribe button");
speak("Here is the subscribe button");

return;

}

/* otherwise guide user to search */

let searchInput = document.querySelector(
"input#search, input[placeholder*='search']"
);

if(searchInput){

guideElement(searchInput,"Search a video first");
speak("Search for a video first to subscribe");

return;

}

/* fallback */

let inputs=document.querySelectorAll("input");

for(let input of inputs){

let rect=input.getBoundingClientRect();

if(rect.width>200){

guideElement(input,"Search a video first");
speak("Search a video first");

return;

}

}

}

/* ---------------- LOGIN ---------------- */
function detectLoginForm(){

let password=document.querySelector("input[type='password']");
let username=document.querySelector(
"input[type='email'],input[type='text']"
);

if(password && username){

guideElement(username,"Enter username");
speak("Enter username");

setTimeout(()=>{

guideElement(password,"Enter password");
speak("Enter password");

},3000);

return true;

}

return false;

}

/* ---------------- FIND PROFILE ICON ---------------- */
function findProfileAvatar(){

let avatar = document.querySelector("#avatar-btn");

if(!avatar){
avatar=document.querySelector("button[aria-label*='account']");
}

if(avatar){

guideElement(avatar,"Open profile menu");
speak("Open profile menu first");

waitingForProfileMenu=true;

observeProfileMenu();

}

}

/* ---------------- WATCH PROFILE MENU ---------------- */
function observeProfileMenu(){

let observer=new MutationObserver(()=>{

if(!waitingForProfileMenu) return;

let popup=document.querySelector(
"ytd-popup-container tp-yt-paper-dialog,tp-yt-iron-dropdown"
);

if(popup){

waitingForProfileMenu=false;

setTimeout(()=>{

guideProfileOption(requestedProfileAction);

},800);

observer.disconnect();

}

});

observer.observe(document.body,{
childList:true,
subtree:true
});

}

/* ---------------- PROFILE OPTION ---------------- */
function guideProfileOption(keyword){

if(!keyword) return false;

let popup=document.querySelector("ytd-popup-container");

if(popup){

let items=popup.querySelectorAll(
"a,button,yt-formatted-string"
);

for(let el of items){

let text=getElementText(el);

if(text.includes(keyword)){

guideElement(el,keyword);
speak("Here is "+keyword);

return true;

}

}

}

/* fallback */

let elements=document.querySelectorAll(
"a,button,yt-formatted-string"
);

for(let el of elements){

let text=getElementText(el);

if(text.includes(keyword)){

guideElement(el,keyword);
speak("Here is "+keyword);

return true;

}

}

return false;

}

/* ---------------- GENERAL SEARCH ---------------- */
function handleGeneralCommand(command){

let words=command.split(" ");

let elements=document.querySelectorAll(
"a,button,input,[aria-label]"
);

for(let word of words){

if(word.length<3) continue;

for(let el of elements){

let text=getElementText(el);

if(text.includes(word)){

guideElement(el,"Here is "+word);
speak("Here is "+word);

return;

}

}

}

}

/* ---------------- VISUAL GUIDE ---------------- */
function guideElement(el,text){

removeGuides();

el.style.outline="4px solid red";
el.style.boxShadow="0 0 15px red";

el.scrollIntoView({
behavior:"smooth",
block:"center"
});

let label=document.createElement("div");

label.innerText=text;

label.style.position="fixed";
label.style.bottom="30px";
label.style.left="50%";
label.style.transform="translateX(-50%)";
label.style.background="black";
label.style.color="white";
label.style.padding="8px 12px";
label.style.borderRadius="6px";
label.style.fontSize="14px";
label.style.zIndex="999999";

document.body.appendChild(label);

setTimeout(()=>{

el.style.outline="";
el.style.boxShadow="";
label.remove();

},6000);

}

/* ---------------- REMOVE OLD GUIDES ---------------- */
function removeGuides(){

document.querySelectorAll("*").forEach(el=>{

if(el.style && el.style.outline==="4px solid red"){
el.style.outline="";
el.style.boxShadow="";
}

});

}
