//validate first name
$("#fname").on("input", validateFullName);

function validateFullName(){
    if($("#fname").val().length > 0){
        $("#fullNameAlert").hide();
        return true;
    } else {
        $("#fullNameAlert").show();
        return false;
    }
}

$("#email").on("input", validateEmail);

function validateEmail(){
    let re = /\S+@\S+\.\S+/;
    if(re.test($("#email").val()) === true){
        $("#emailAlert").hide();
        return true;
    } else {
        $("#emailAlert").show();
        return false;
    }
}

$("#adr").on("input",validateAddress);
$("#city").on("input",validateAddress);
$("#state").on("input",validateAddress);
$("#zip").on("input",validateAddress)

function validateAddress(){
    if($("#adr").val().length > 0 && $("#city").val().length > 0
        && ($("#zip").val().length === 5) && !isNaN($("#zip").val()) && $("#state").val().length > 0){
        $("#addressAlert").hide();
        return true;
    } else {
        $("#addressAlert").show();
        return false;
    }
}



//card Validation
$("#cname").on("input", validateCardName);

function validateCardName() {
    if($("#cname").val().length > 0) {
        $("#cardNameAlert").hide()
        return true;
    } else {
        $("#cardNameAlert").show();
        return false;
    }
}

$("#ccnum").on("input", validateCard);

function validateCard(){
    if($("#ccnum").val().length === 16 && !isNaN($("#ccnum").val())){
        $("#ccAlert").hide();
        return true;
    } else {
        $("#ccAlert").show();
        return false;
    }

}

$("#expMonth").on("input", validateCardInfo);
$("#cvv").on("input", validateCardInfo);
$("#expYear").on("input", validateCardInfo);


function validateCardInfo(){
    if(!isNaN($("#expMonth").val()) && $("#expMonth").val().length == 2 &&
        $("#cvv").val().length === 3 && !isNaN($("#cvv").val()) &&
        $("#expYear").val().length === 4 && !isNaN($("#expYear").val())){
        $("#cardInfoAlert").hide();
        return true;
    } else {
        $("#cardInfoAlert").show();
        return false;
    }
}


//zoom in

function zoomIn(event) {
    let element = document.getElementById("overlay");
    element.style.display = "inline-block";
    let img = document.getElementById("imgZoom");
    let positionX = event.offsetX ? (event.offsetX) : event.pageX - img.offsetLeft;
    let positionY = event.offsetY ? (event.offsetY) : event.pageY - img.offsetTop;
    element.style.backgroundPosition = (-positionX * 4) + "px " + (-positionY * 4) + "px";

}

function zoomOut() {
    let element = document.getElementById("overlay");
    element.style.display = "none";
}


$("#submitPayment").on("click", validateWhole);

function validateWhole(){
    let fullName = validateFullName();
    let cardInfo = validateCardInfo();
    let cardNum = validateCard();
    let cardName = validateCardName();
    let address = validateAddress();
    let email = validateEmail();
    if(!(fullName === true && cardInfo === true && cardNum === true &&
        cardName === true && cardName === true && address === true && email === true)){
        alert("Please enter correct information");
        event.preventDefault();
    }
}