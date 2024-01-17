// Show and Hide password
const showPassword = (inputId, iconId) => {
    let inputPassword = document.getElementById(inputId);
    let eyeIcon = document.getElementById(iconId);

    if (inputPassword.type === 'password') {
        inputPassword.type = 'text';
        eyeIcon.src = 'public/img/eye-unhide.svg';
    } else {
        inputPassword.type = 'password';
        eyeIcon.src = 'public/img/Eye.svg';
    }
};

//header script

$(document).ready(function() {
    $("#toggle").click(function(){
        $("#add-class").addClass("active");
    });
    $("#cross").click(function(){
        $("#add-class").removeClass("active");
    });

})