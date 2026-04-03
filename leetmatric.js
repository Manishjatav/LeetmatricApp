// jai shree ram
// "chatgpt **...koi valid browser event nahi hai.

// Browser sirf kuch specific events ko samajhta hai, jaise:

// "DOMContentLoaded"

// "load"

// "click"

// "submit"

// "scroll"

// "input"

// etc.
document.addEventListener("DOMContentLoaded",function(){

    const searchButton = document.getElementById('search-button');
    const usernameInput = document.getElementById('user-input');
    const statsContainer = document.getElementsByClassName('stats-container');
    const progress = document.getElementsByClassName('progress');
    const easyProgressCircle = document.querySelector(".easy-progress");
    const mediumProgressCircle = document.querySelector(".medium-progress");
    const hardProgressCircle = document.querySelector(".hard-progress");     
    const easyLabel = document.querySelector("#easy-label");
    const mediumLabel = document.querySelector("#medium-label");
    const hardLabel = document.querySelector("#hard-label");
    const cardStatsContainer = document.querySelector(".stats-cards");

    const easystrip = document.querySelector("#progress-easy-btn");
    const mediumstrip = document.querySelector("#progress-medium-btn");
    const hardstrip = document.querySelector("#progress-hard-btn");

    const contestBox = document.getElementById('contest-rating');


    
    // return true or false based on regex =? or basen on empty username
    function validateUsername(username){
        if(username.trim() === ""){
            alert("Username should not be Empty");
            return false;
        }
        const regex = /^[A-Za-z0-9_-]{2,30}$/;
        const isMatching = regex.test(username);
        if(!isMatching){
            alert("Invalid username try again")
        }
        //ye if to only ek alert ke liye h
        return isMatching;
        //yani isMatching ke true or false ane pr return t or f ho jayega to overall
        // y funct validateUsername true or false return kr rha hai username valid h y n
    }

    
    function updateProgress(solved, total, lebel, circle, btn){
        const progressDegree = (solved/total)*100;
        circle.style.setProperty('--progress-degree', `${progressDegree}%`);
        // btn.style.setProperty('--progress-width',`${progressDegree}%`)
        const text = btn.textContent;
        btn.textContent = `${text} : ${solved}/${total}`;

    }


    function displayUserData(parsedData){
    
        if("errors" in parsedData){
            const err = parsedData.errors[0].message;
            console.log(err);
            alert(err);
            usernameInput.value = "";
            return;
        }

    totalQues = parsedData.data.allQuestionsCount[0].count;
    totalEasyQues = parsedData.data.allQuestionsCount[1].count;
    totalMediumQues = parsedData.data.allQuestionsCount[2].count;
    totalHardQues = parsedData.data.allQuestionsCount[3].count;

    solvedTotalQues = parsedData.data.matchedUser.submitStats.acSubmissionNum[0].count;
    solvedTotalEasyQues = parsedData.data.matchedUser.submitStats.acSubmissionNum[1].count;
    solvedTotalMediumQues = parsedData.data.matchedUser.submitStats.acSubmissionNum[2].count;
    solvedTotalHardQues = parsedData.data.matchedUser.submitStats.acSubmissionNum[3].count;


    updateProgress(solvedTotalEasyQues, totalEasyQues, easyLabel, easyProgressCircle,easystrip);
    updateProgress(solvedTotalMediumQues, totalMediumQues, mediumLabel, mediumProgressCircle,mediumstrip);
    updateProgress(solvedTotalHardQues, totalHardQues, hardLabel, hardProgressCircle,hardstrip);
    }

    
     // me
    async function getRating(username){

    const response = await fetch("https://cors-anywhere.herokuapp.com/https://leetcode.com/graphql", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            query: `
            query userContestRankingInfo($username: String!) {
                userContestRanking(username: $username) {
                    rating
                    globalRanking
                    attendedContestsCount
                }
            }`,
            variables: { username: username }
        })
    });

    const ratingData = await response.json();

    const ContestRating = ratingData.data.userContestRanking.rating;
    const roundOff = ContestRating.toFixed(2);
    
    contestBox.style.visibility = "visible";
    if(roundOff < 1400){
    contestBox.textContent = `Leetcode Contest Rating : ${roundOff} 🌞`;
    }else if(roundOff <= 1500){
        contestBox.textContent = `Leetcode Contest Rating : ${roundOff} 👌`;
    }else{
        contestBox.textContent = `Leetcode Contest Rating : ${roundOff} 🔥`;
    }
    

    }



    async function fetchUserdetails(username){

        try{
            searchButton.textContent = "Searching...";
            searchButton.ariaDisabled = true;

            // const response = await fetch(url);
            const proxyUrl = 'https://cors-anywhere.herokuapp.com/'
            const targetUrl = 'https://leetcode.com/graphql/';
            const myHeaders = new Headers();
            myHeaders.append("content-type", "application/json");

            const graphql = JSON.stringify({
                query: "\n    query userSessionProgress($username: String!) {\n    allQuestionsCount {\n        difficulty\n        count\n    }\n    matchedUser (username: $username) {\n        submitStats {\n            acSubmissionNum {\n                difficulty\n                count\n                submissions\n            }\n            totalSubmissionNum {\n                difficulty\n                count\n                submissions\n            }\n        }\n    }\n}\n",
                variables: { "username": `${username}` }
            })

            const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: graphql,
                redirect: "follow"
            };

        const response = await fetch(proxyUrl+targetUrl, requestOptions);
            if(!response.ok){
                alert("Something went Wrong or Request Limit Over for this Network");
                usernameInput.value = "";
            }
            const parsedData = await response.json();
            console.log("logging data : " , parsedData);

            displayUserData(parsedData);
            }
            catch(error){
                statsContainer.innerHTML = `<p> No data found </p>`
            }
            finally{
                searchButton.textContent = "Search";
                searchButton.ariaDisabled = false;
                getRating(username);
            }
    }



    function clearPrevResponse(btn,val,circle){
        btn.textContent = `${val}`;
        circle.style.setProperty('--progress-degree', 0);
    }


     // first step click event hone pr
    searchButton.addEventListener('click',function(){
        const username = usernameInput.value;
        console.log("logining username: ",username);
        if(validateUsername(username)){

            clearPrevResponse(easystrip,"Easy",easyProgressCircle);
            clearPrevResponse(mediumstrip,"Medium",mediumProgressCircle);
            clearPrevResponse(hardstrip,"Hard",hardProgressCircle);

            fetchUserdetails(username);
        }

    })

});



// dark mode ke liye

const toggle = document.getElementById("theme-toggle");

toggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
});











