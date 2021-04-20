let userNameValid = false;
let passwordValid = false;

let $uName = $("#username");
let $pword = $("#password");

function checkUsername(){
    console.log("hi");

    userNameValid = this.value.length > 0;
}

function checkPassword(){
    console.log("hi");

    passwordValid = this.value.length > 0;
}

$("#username").on("keyup", checkUsername);
$("#password").on("keyup", checkPassword);
$("#signin").on("click", checkForm);

function checkForm(){
    console.log("hi");
    if (!(userNameValid && passwordValid)){
        alert("Please enter correct information");
        event.preventDefault();
    }
}