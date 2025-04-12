let prompt = document.querySelector("#prompt");
let submitBtn = document.querySelector("#submit");
let chatContainer = document.querySelector(".chat-container");
let imageBtn = document.querySelector("#image")
let image = document.querySelector("#image img")
  let inputBtn = document.querySelector("#image input")


let API_Url ="https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyDj1JrPudakAn4Dq0SQXcdf5_BH5AUaAgQ"

let user ={
    message:null,
    file : {
      mime_type:null,
      data:null
    }
}

async function generateResponse(aiChatBox) {

let text = aiChatBox.querySelector(".ai-chat-area")

let RequestOption = {
    method : "POST",
    header : {'Content-Type': 'application/json' },
    body : JSON.stringify({
        "contents": [{
        "parts":[
            {"text": user.message}, (user.file.data ? [{"inline_data" :user.file}] : [])
        ]
        }]
    })
}

try {
    let response = await fetch (API_Url, RequestOption);
    let data = await response.json();
    let aiResponse = data.candidates[0].content.parts[0].text.trim()
    text.innerHTML = aiResponse;
  

}
catch(error) {
    console.log(error);
    
}
finally {
  chatContainer.scrollTo({top:chatContainer.scrollHeight, behavior:"smooth"})
    image.src = `image/image.svg`
    image.classList.remove('choose')
user.file={}

}

}

function createChatBox(html, classes) {
  let div = document.createElement("div");
  div.innerHTML = html;
  div.classList.add(classes);
  return div;
}

function handleChatResponse(message) {
    user.message = message;
  let html = `<img src="image/user-image.png" alt="" id="userImage" width="7%" />
        <div class="user-chat-area">
        ${user.message}
        ${user.file.data ? `<img src="data:${user.file.mime_type};base64,${user.file.data}" class="chooseimg"/>` : "" }
        </div>`;

  let userChatBox = createChatBox(html, "user-chat-box");
  chatContainer.appendChild(userChatBox);
  prompt.value = "";
chatContainer.scrollTo({top:chatContainer.scrollHeight, behavior:"smooth"})

  setTimeout(() => {
    let html = `<img src="image/ai-image.jpg" alt="" id="aiImage" width="7%" />
        <div class="ai-chat-area">
            <img src="image/loading-7528_512.gif" class="load" alt="" width="30">


       </div>`

      let aiChatBox = createChatBox(html, "ai-chat-box");
  chatContainer.appendChild(aiChatBox);
  generateResponse(aiChatBox);
  prompt.value = ""; 
  }, 100);

}
submitBtn.addEventListener("click", () => {
  handleChatResponse(prompt.value)
})

prompt.addEventListener("keydown", (e) => {
  if (e.key == "Enter") {
    handleChatResponse(prompt.value);
  }
});

inputBtn.addEventListener("change", () => {
  let file = inputBtn.files[0];
  if (!file) return
  let reader = new FileReader()
  reader.onload = (e) => {
    let base64string = e.target.result.split(",")[1]
    user.file = {
      mime_type: file.type,
      data : base64string
    }
    image.src = `data:${user.file.mime_type};base64,${user.file.data}`
    image.classList.add('choose')
  }
  reader.readAsDataURL(file)
})

imageBtn.addEventListener("click", ()=> {
  inputBtn.click();
})