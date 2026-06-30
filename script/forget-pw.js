const formSteps = document.querySelectorAll(".form-step");
const progressSteps = document.querySelectorAll(".progress-bar-wrpr .step");

const continueBtn = document.querySelector(".continue");
const backBtn = document.querySelector(".back");
const signInLink = document.querySelector(".toBack");
const h1 = document.querySelector('H1');

let currentStep = 1;


function updateUI() {

// display active form
    formSteps.forEach((step, index) => {
        if(index+1 === currentStep){
            step.style.position = "relative";
            step.style.opacity = "1";
            step.style.pointerEvents = "auto";
        }
        else{
            step.style.position = "absolute";
            step.style.opacity = "0";
            step.style.pointerEvents = "none";
        }
    });


// progress bar update
    progressSteps.forEach((step, index) => {

        step.classList.remove("completed", "active");

        if (index + 1 < currentStep) {
            step.classList.add("completed");
        }
        else if (index + 1 === currentStep) {
            step.classList.add("active");
        }

    });


// for changing text of continue btn
    switch (currentStep) {

        case 1:
            continueBtn.textContent = "Continue";
            break;

        case 2:
            continueBtn.textContent = "Send OTP";
            break;

        case 3:
            continueBtn.textContent = "Verify OTP";
            break;

        case 4:
            continueBtn.textContent = "Reset Password";
            break;
    }


    backBtn.style.display = currentStep === 1 ? "none" : "inline-block";

    // "back to sign-in" btn
    signInLink.style.display = currentStep === 1 ? "block" : "none";

    // display success msg
    if(currentStep > formSteps.length){
        backBtn.style.display = "none";
        continueBtn.style.display = "none";
        h1.style.color = "green";
        h1.innerHTML = "Password has been changed successfully"
    }

}


continueBtn.addEventListener("click", () => {

    currentStep++;
    updateUI();

});



backBtn.addEventListener("click", () => {

    if (currentStep > 1) {

        currentStep--;

        updateUI();

    }

});


updateUI();

// for otp inputs navigation
const otpInputs = document.querySelectorAll(".otp-group input");

otpInputs.forEach((input, index) => {

    input.addEventListener("input", () => {

        if (input.value && index < otpInputs.length - 1) {
            otpInputs[index + 1].focus();
        }

    });

    input.addEventListener("keydown", (e) => {

        if (
            e.key === "Backspace" &&
            index > 0
        ) {
            otpInputs[index - 1].focus();
        }

    });

});
