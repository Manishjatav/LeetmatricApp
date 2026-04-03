// jai shree ram
// window.alert("welcome to our counter App");
document.addEventListener("DOMContentLoaded", function(){

    const countButton = document.querySelector(".counting_btn");
    const countBtnText = document.querySelector(".counting_btn p");
    const resetBtn = document.querySelector("#reset_btn");
    const negCountBtn = document.querySelector("#neg_count_btn")
    const negCountBtnText = document.querySelector("#neg_count_btn span");

    let number = 0;
    let increaseCount = () => {
        number = number+1;
        countBtnText.textContent = number;
        countButton.style.backgroundColor = "yellow";
    } 

    countButton.addEventListener("click",increaseCount);

    let reset = function reset(){
        number = 0;
        countBtnText.textContent = number;
    }
    resetBtn.addEventListener("click",reset);

    let decreaseCount = () =>{
        if(number != 0){
            number -= 1;
        }
        
        countBtnText.textContent = number;
    }

    negCountBtn.addEventListener("click",decreaseCount);


});
