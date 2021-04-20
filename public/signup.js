let userNameValid = false;
let passwordValid = false;
let emailValid = false;
let rePasswordValid = false;

let $uName = $("#username");
let $pword = $("#password");
let $rePword = $("#re-password");
let $emailValid = $("#email");

function checkUsername(){
    userNameValid = this.value.length > 0;
}

function checkPassword(){
    passwordValid = this.value.length > 0;
}

function checkEmail(){
    emailValid = this.value.length > 0;
}

function checkRePassword(){
    rePasswordValid = this.value.length > 0;
}

$("#username").on("keyup", checkUsername);
$("#password").on("keyup", checkPassword);
$("#re-password").on("keyup", checkRePassword);
$("email").on("keyup",checkEmail);

function checkForm(event){
    if (!userNameValid || !passwordValid || !rePasswordValid || !emailValid){
        event.preventDefault();
    }
}