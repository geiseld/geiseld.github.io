"use strict";

function flip(object){
    let obj = document.getElementById(object)
    if (obj.classList.contains("up")){
        obj.classList.remove("up")
    }else{
        obj.classList.add("up")
    }
}