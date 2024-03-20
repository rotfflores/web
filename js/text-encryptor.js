//keys of encryption//
const e = "enter";
const i = "imes";
const a = "ai";
const o = "ober";
const u = "ufat";

const buttonEncript = document.getElementById("button-encript");

//encript//
function encrypt(string) {
    let inputText = document.getElementById("input-text").value;

    if (inputText.length >= 1) {
        document.getElementById("box-hiden").style.display = "none";
    }
    

    string = string.replace(/e/g, e);
    string = string.replace(/i/g, i);
    string = string.replace(/a/g, a);
    string = string.replace(/o/g, o);
    string = string.replace(/u/g, u);
    return string;
}

function finalResult() {
    var text = document.getElementById("input-text").value;
    var result = encrypt(text);
    document.getElementById("output-text").value = result;
}

//desencript//
function decrypt(string) {
    let inputText = document.getElementById("input-text").value;

    if (inputText.length >= 1) {
        document.getElementById("box-hiden").style.display = "none";
    }
    
    string = string.replace(new RegExp(e, 'g'), 'e');
    string = string.replace(new RegExp(i, 'g'), 'i');
    string = string.replace(new RegExp(a, 'g'), 'a');
    string = string.replace(new RegExp(o, 'g'), 'o');
    string = string.replace(new RegExp(u, 'g'), 'u');
    return string;
}

function finalResultDecrypt() {
    var text = document.getElementById("input-text").value;
    var result = decrypt(text);
    document.getElementById("output-text").value = result;
}

//extra//
function copyToClipboard() {
    var copyText = document.getElementById("output-text");
    copyText.select();
    document.execCommand("copy");
    return copyText.value;
}

function clearText() {
    document.getElementById("input-text").value = "";
    document.getElementById("output-text").value = "";
    document.getElementById("box-hiden").style.display = "block";
}

function desencript() {
    var text = document.getElementById("input-text").value;
    var result = desencript(text);
    document.getElementById("output-text").value = result;
}

