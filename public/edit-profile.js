let emailValid = false;
let firstNameValid = false;
let lastNameValid = false;
let userNameValid = false;

let $fName = $("#first");
let $lName = $("#last");
let $email = $("#email");

function checkNameFirst(){
    lastNameValid = this.value.length > 0;
}
function checkNameLast(){
    firstNameValid = this.value.length > 0;
}

function checkEmail(){
    emailValid = this.value.length > 0;
}

function checkUsername(){
    userNameValid = this.value.length > 0;
}

$("#first").on("keyup", checkNameFirst);
$("#last").on("keyup", checkNameLast);
$("email").on("keyup",checkEmail);