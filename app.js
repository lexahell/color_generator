"use strict"
const hexChars = '0123456789ABCDEF'
const colorSections = document.querySelectorAll(".color-section");
const Inputs = document.querySelectorAll(".text-color");
const lockBtns = document.querySelectorAll('.lock-btn')

function genRandomColor(){
    let color = "";
    for (let i = 0; i < 6; i++){
        color = color + hexChars[Math.floor(Math.random() * hexChars.length)]
    }
    return "#"+color;
}
function setСolorSection(color, section){
    const textColor = section.querySelector(".text-color");
    const copyBtn = section.querySelector(".copy-btn");
    const lockBtn = section.querySelector(".lock-btn");
    if (!lockBtn.firstElementChild.classList.contains("fa-lock")){
        function writeToClipboard(){
            navigator.clipboard.writeText(color)
        }
        copyBtn.removeEventListener('click', writeToClipboard);
        copyBtn.addEventListener('click', writeToClipboard)
        textColor.value = color;
        const luminance =  chroma(color).luminance();
        const currentTextColor = luminance > 0.5 ? "black":"white";
        textColor.style.color = currentTextColor;
        copyBtn.style.color = currentTextColor;
        lockBtn.style.color = currentTextColor;
        section.style.backgroundColor = color;
    }
    updateColorsHash();
}
function changeColors(){
    colorSections.forEach(section =>{
        const color = genRandomColor();   
        setСolorSection(color, section);
    });
    
    
}

document.addEventListener("keydown", (event)=>{
    if(event.key === " " && event.target.tagName!="INPUT"){
        changeColors();
    }
});
document.addEventListener("touchstart", (event)=>{
    if(event.target.tagName == "SECTION"){
        changeColors();
    }
});
lockBtns.forEach(button =>{
    button.addEventListener('mousedown', (event)=>{
        const icon = button.querySelector('i');
        const textColor = button.closest(".color-section")
                                  .querySelector('.text-color');
        icon.classList.toggle("fa-lock-open");
        icon.classList.toggle("fa-lock");
        if(icon.classList.contains("fa-lock")){
            textColor.disabled = true;
        }else{
            textColor.disabled = false;
        }
    });
});
Inputs.forEach(input =>{
    let oldColor;
    const colorSection = input.closest(".color-section");
    input.addEventListener("keydown",(event)=>{
        if(event.key==="Enter"){
            input.blur();   
        }
    });
    input.onfocus = function(){
        oldColor = input.value.toUpperCase()
    }
    input.onblur = function() {
        let inputColor = this.value.toUpperCase(); 
        let regexp6 = /#[A-F0-9]{6}/gi
        let regexp3 = /#[A-F0-9]{3}/gi 
        let regexp2 = /#[A-F0-9]{2}/gi 
        let regexp1 = /#[A-F0-9]{1}/gi 
        if (inputColor.slice(0,7).match(regexp6)){
            inputColor = inputColor.slice(0,7);
            setСolorSection(inputColor, colorSection)
            return
        }
        if (inputColor.slice(0,4).match(regexp3)){
            inputColor = "#" + (inputColor[1].repeat(2)) + (inputColor[2].repeat(2)) + (inputColor[3].repeat(2));
            setСolorSection(inputColor, colorSection)
            return
        }
        if (inputColor.slice(0,3).match(regexp2)){
            inputColor = "#" + (inputColor[1]+inputColor[2]).repeat(3);
            setСolorSection(inputColor, colorSection)
            return
        }
        if (inputColor.slice(0,2).match(regexp1)){
            inputColor = "#" + inputColor[1].repeat(6);
            setСolorSection(inputColor, colorSection)
            return
        }
        setСolorSection(oldColor, colorSection);
    };
});
function updateColorsHash(){
    let newHash = "";
    Inputs.forEach((input)=>{
        newHash +="-"+input.value.toUpperCase();
    })
    newHash = newHash.substring(0, newHash.length);
    document.location.hash = newHash;
}

if (document.location.hash){
    const colorsFromHash =  document.location.hash.substring(2).split("-");
    for (let i = 0; i < colorSections.length; i++){
        setСolorSection(colorsFromHash[i] ,colorSections[i])
    }
}else{
    changeColors();
}