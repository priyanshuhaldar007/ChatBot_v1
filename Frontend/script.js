var prompt = document.getElementById("prompt");
var text = document.getElementById("heading");
var ChatBox = document.getElementById("ChatWindow");

let headersList = {
    "Content-Type": "application/json",
};
prompt.value = "";

function handleCodeSnippet(response, result, para2) {
    let preStatement = response.slice(0, result - 1); // prestatement before code

    // for removing backticks
    let code = response.slice(result + 3); // code including language name
    result = code.indexOf("```"); // checking for final backtics
    let postStatement = code.slice(result + 4); // for extracting poststatement
    code = code.slice(0, result); // final code without any bacticks

    // for removing language
    let ans = code.indexOf("\n");
    var language = code.slice(0, ans); // language the code is written in
    code = code.slice(ans);

    // formatting the code inside
    let prePara = document.createElement("p");
    let postPara = document.createElement("p");
    let codeSecContainer = document.createElement("pre");
    let codeSec = document.createElement("code");
    let copyCode = document.createElement("span");

    codeSec.classList.add(`hljs`);
    if (language.length == 0) language = "plaintext";
    codeSec.classList.add(`${language}`);

    // adding content to paras
    prePara.innerText = preStatement;
    codeSec.innerText = code;
    postPara.innerText = postStatement;

    copyCode.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M280 64h40c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128C0 92.7 28.7 64 64 64h40 9.6C121 27.5 153.3 0 192 0s71 27.5 78.4 64H280zM64 112c-8.8 0-16 7.2-16 16V448c0 8.8 7.2 16 16 16H320c8.8 0 16-7.2 16-16V128c0-8.8-7.2-16-16-16H304v24c0 13.3-10.7 24-24 24H192 104c-13.3 0-24-10.7-24-24V112H64zm128-8a24 24 0 1 0 0-48 24 24 0 1 0 0 48z"/></svg>';
    copyCode.classList.add("copyBtn");

    codeSec.appendChild(copyCode);
    codeSecContainer.appendChild(codeSec);
    para2.appendChild(prePara);
    hljs.highlightBlock(codeSec);
    para2.appendChild(codeSecContainer);
    para2.appendChild(postPara);

}

document.getElementById("send").addEventListener("click", async () => {
    //for user's message
    let UserChatParent = document.createElement("div");
    UserChatParent.classList.add("chat-message");
    UserChatParent.classList.add("user");
    var para = document.createElement("span");
    UserChatParent.appendChild(para);
    let userData = prompt.value;
    para.innerText = userData;
    ChatBox.appendChild(UserChatParent);

    let answer = {};

    await axios
//         .post("http://localhost:5000/getChat", { promptVal: userData })
        .post("https://chatbot-backend.netlify.app/getChat", { promptVal: userData })
        .then((response) => {
            answer = response.data;
        });

    // for bot's message
    let BotChatParent = document.createElement("div");
    BotChatParent.classList.add("chat-message");
    var para2 = document.createElement("span");
    BotChatParent.appendChild(para2);

    var response = answer.content;

    // checking for code snippet
    let result = response.indexOf("```"); // checking for iniital backtics
    if (result != -1) {
        handleCodeSnippet(response, result, para2);
    } else {
        para2.innerText = response;
    }

    ChatBox.appendChild(BotChatParent);
    prompt.value = "";

    handleCopy();
});

function handleCopy() {
    var check = document.getElementsByClassName("hljs");
    if (Object.keys(check)) {
        Object.values(check).forEach((ele) => {
            ele.lastChild.addEventListener("click", () => {
                navigator.clipboard.writeText(ele.innerText);
                console.log(ele.innerText);
                console.log(ele);
            });
        });
    }
}
