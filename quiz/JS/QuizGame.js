document.addEventListener("DOMContentLoaded", function () {
    var interface = {
        qMainElement: document.getElementsByClassName("questionDiv__main")[0],
        headerElement: document.getElementsByClassName("questionDiv__headerText")[0],
        buttonElement: document.getElementsByTagName("button")[0],
        divElement: document.getElementsByClassName("questionDiv")[0],
        questionElement: document.getElementsByClassName("questionDiv__question")[0],
        ansersElement: document.getElementsByClassName("questionDiv__ansers")[0],
        singleAnserElements: document.getElementsByClassName("questionDiv__singleAnser"),
        clockDiv: document.getElementsByClassName("clock__stripe")[0],
        clockIcon: document.getElementsByClassName("sg-icon")[0],
        scoreTable: document.getElementsByClassName("questionDiv__score"),
        piontsNo: document.getElementsByClassName("questionDiv__piontsNo")
        
    };
    var date = {
        xobj: new XMLHttpRequest(),
        jsonObectArr: [],
        Question: [],
        Ansers: [],
        QuestionNr: [],
        CorrQNr: 0,
        time: 0,
        score: 0,

        loadJSON: function () {
            var that = this;
            this.xobj.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    Game.bindEvents();
                    that.jsonObectArr = JSON.parse(this.responseText);
                    for (i = 0; i < 9; i++) {
                        that.Question[i] = that.jsonObectArr.questions[i].question;
                        that.Ansers[i] = that.jsonObectArr.questions[i].answers;
                        that.QuestionNr[i] = that.jsonObectArr.questions[i].id;
                        that.time = that.jsonObectArr.time_seconds;
                    }
                    timer.GetTime(that.time);
                    Game.ubdateText("Witamy w Quiz","Czy chcesz Wylosowaæ swoje pytania i rozpocz¹c test ? Bêdziesz mia³ "+
                            that.time+"s ¿eby odpowiedzieæ na "+that.Question.length+" pytañ.",0);
                }
            };
            this.xobj.open("GET", 'https://cdn.rawgit.com/kdzwinel/cd08d08002995675f10d065985257416/raw/f681999d414a85f081c52424605151cc8f93313d/quiz-data.json', true);
            this.xobj.send();
        }
    };
    var Game = {
        startFunctionEventH: 0,
        ShowAnsersH: 0,
        nextQuestionEventH: 0,
        
        startFunctionEvent: function () {
            this.animateChange();
            setTimeout(function () {
                this.questionStyle(true);
                this.ubdateText("<i>#"+date.QuestionNr[0]+"</i>",date.Question[0],date.Ansers[0]);
                timer.clockOn();
            }.bind(this), 300);
        },
        nextQuestionEvent: function () {
            this.markAnswers("on");
            setTimeout(this.animateChange.bind(this),300);
            setTimeout(function () {
                this.markAnswers("off");
                date.CorrQNr++;
                if (date.CorrQNr < 9) 
                    this.ubdateText("<i>#"+date.QuestionNr[date.CorrQNr]+"</i>",date.Question[date.CorrQNr],date.Ansers[date.CorrQNr]);
                else 
                    this.FinishEvent();
            }.bind(this), 600);
        },
        FinishEvent: function () {
            timer.clockOff();
            this.questionStyle(false);
            this.replaceClass(interface.buttonElement, "questionDiv__button--showAnsers", "questionDiv__button--start");
            //this.replaceClass(interface.buttonElement, "questionDiv__button--showAnsers", "questionDiv__button--next");
            interface.buttonElement.innerHTML="<strong>Sprawdz Test</strong>";
            this.showScore(true);
            this.ubdateText("KONIEC TESTU","<p class='sg-text sg-text--light'>Twój wynik to :</p>",0);
            this.unbindEvents();
            date.CorrQNr=-1;
        },
        showScore: function(state){
            interface.scoreTable[0].style.display=(state)?"table":"none";
            interface.scoreTable[1].style.display=(state)?"table":"none";
            interface.piontsNo[0].innerHTML=date.score;
            interface.piontsNo[1].innerHTML=timer.Minutes()+"min "+timer.Secounds()+"s";
        },
        ShowAnsers: function(){
            this.animateChange();
            setTimeout(function () {
                this.replaceClass(interface.buttonElement, "questionDiv__button--next", "questionDiv__button--showAnsers");
                this.questionStyle(true);
                interface.buttonElement.innerHTML="<strong>></strong>";
                interface.buttonElement.style.display="table";
                this.showScore(false);
                interface.buttonElement.removeEventListener('click', this.ShowAnsersH);
            }.bind(this), 300);
        },
        next: function(){
            date.CorrQNr++;
            if (date.CorrQNr < 9){
                this.markAnswers("on");
                this.ubdateText("<i>#"+date.QuestionNr[date.CorrQNr]+"</i>",date.Question[date.CorrQNr],date.Ansers[date.CorrQNr]);}
            else{
                this.FinishEvent();
                interface.buttonElement.style.display="none";}
        },
        checkCorrectness: function () {
            if (date.Ansers[date.CorrQNr][this.index].correct)
                date.score++;
        },
        animateChange: function () {
            this.replaceClass(interface.divElement,"questionDiv--rotat90deg", "questionDiv--rotat180deg");
            setTimeout(function () {
                this.replaceClass(interface.divElement, "questionDiv--rotat180deg", "questionDiv--rotat90deg");
            }.bind(this), 300);
        },
        ubdateText: function(hed, qes, ans){
            interface.headerElement.innerHTML = hed;
            interface.questionElement.innerHTML = qes;
            if(ans!==0){
                for (i = 0; i < 4; i++) {
                    interface.singleAnserElements[i].innerHTML = ans[i].answer;}
            }
        },
        markAnswers: function(state){
            if(state==="on"){//kolorowanie odpowiedzi dobrych i zlych
                for (i = 0; i < 4; i++) {
                    console.log("date.CorrQNr "+date.CorrQNr);
                    console.log("date.Ansers[date.CorrQNr][i] "+date.Ansers[date.CorrQNr][i]+" date.Ansers[date.CorrQNr] "+date.Ansers[date.CorrQNr][i]);
                    if(date.Ansers[date.CorrQNr][i].correct){ 
                        interface.singleAnserElements[i].style.backgroundColor = "green";} 
                    else
                        interface.singleAnserElements[i].style.backgroundColor = "red";
                }
            }
            else{
                for (i = 0; i < 4; i++) {
                    interface.singleAnserElements[i].style.backgroundColor = "";}//przywracanie koloru odpowiedza
            }
        },
        questionStyle: function(state){
                interface.ansersElement.style.display = (state)? "table":"none";
                interface.buttonElement.style.display = (state)? "none":"table";
                this.replaceClass(interface.questionElement,(state)?"questionDiv__question--questions":"questionDiv__question--end",(state)?"questionDiv__question--end":"");
                interface.headerElement.parentNode.style.textAlign = (state)? "left":"center";
                interface.headerElement.parentNode.style.backgroundImage = (state)? "url('source/header_background_black.jpg')":"";
                interface.headerElement.style.backgroundColor= (state)? "#ffffff":"";
                interface.headerElement.style.color= (state)?"#434e66":"#ffffff";
                interface.qMainElement.style.backgroundColor= (state)?"#ffffff":"";
                if(!state){
                    for(i=0 ; i<4 ; i++){
                        this.replaceClass(interface.singleAnserElements[i], "","questionDiv__singleAnser--hover");}
                }
        },
        replaceClass: function(elem, newClass, oldClass){
            if(oldClass!=="")elem.classList.remove(oldClass);
            if(newClass!=="")elem.classList.add(newClass);
        },
        bindEvents: function () {
            this.startFunctionEventH=this.startFunctionEvent.bind(this);
            this.nextQuestionEventH=this.nextQuestionEvent.bind(this);
            interface.buttonElement.addEventListener('click', this.startFunctionEventH);
            for (i = 0; i < 4; i++) {
                interface.singleAnserElements[i].addEventListener('click', this.nextQuestionEventH);
                interface.singleAnserElements[i].addEventListener('click', this.checkCorrectness);
                interface.singleAnserElements[i].index = i;}
        },
        unbindEvents: function (){
            interface.buttonElement.removeEventListener('click', this.startFunctionEventH);
            this.ShowAnsersH=this.ShowAnsers.bind(this);
            interface.buttonElement.addEventListener('click', this.ShowAnsersH);
            interface.buttonElement.addEventListener('click', this.next.bind(this));
            for (i = 0; i < 4; i++) {
                interface.singleAnserElements[i].removeEventListener('click', this.nextQuestionEventH);
                interface.singleAnserElements[i].removeEventListener('click', this.checkCorrectness);}
        },
    };
    var timer = {
        width: 0,
        timeMs: 0,
        countDown: 0,
        timeStart: 0,
        timeStop: 0,
        playerTime: 0,
        
        GetTime: function (time) {
            this.time = time * 1000;
        },
        GeteWidth: function (elem) {
            this.width = parseInt(window.getComputedStyle(elem, null).getPropertyValue("width"));
        },
        clockOn: function () {
            setTimeout(function () {
                var t= new Date();
                this.timeStart=t.getTime();
                interface.clockDiv.style.display = "block";
                interface.clockIcon.style.display = "block";
                this.GeteWidth(interface.clockDiv);
                interface.clockDiv.style.transition = "width "+this.time / 1000+"s , "+"background-color "+this.time / 1000+"s";
                interface.clockDiv.style.webkitTransition="width "+this.time / 1000+"s , "+"background-color "+this.time / 1000+"s";
                Game.replaceClass(interface.clockDiv,"clock__stripe--clockOn","");
            }.bind(this), 300);
            this.countDown = setTimeout(this.timeOut, this.time);
        },
        clockOff: function () {
            clearTimeout(this.countDown);
            this.GeteWidth(interface.clockDiv);
            interface.clockDiv.style.width = this.width + "px";
            interface.clockDiv.style.backgroundColor="#7ed7ac";
            interface.clockDiv.style.transition = "";
            var t= new Date();
            this.timeStop=t.getTime();
            this.playerTime= this.timeStop - this.timeStart;
        },
        timeOut: function () {
            Game.animateChange();
            setTimeout(function () {
                Game.questionStyle(false);
                interface.buttonElement.style.display="none";
                Game.ubdateText("KONIEC CZASU","",0);
            }, 300);
        },
        Minutes: function(){
            return Math.floor(this.playerTime/60000);;
        },
        Secounds: function(){
            t=Math.floor(this.playerTime/1000);
            return this.playerTime%60;
        }
    };
    date.loadJSON();
});