var global_user = {
    id:null,
    name:null,
    description:null,
    emailAddress:null,
    isInitial: true,
    score:0,
    d_points:0,
	isMale:0 //0-false, 1-true
}
var myBadge = {
    badgeId:0,
    badgeName:null,
    badgeFile:null,
    isLocked:false,
    badgeDescription:null,
    badgePoint:0,
    price:0,
    drillCount:0,
    isCompleted:false,
    SKU:null
}
var myDrill = {
    drillId:0,
    drillName:null,
    drillDescription:null,
    drillFile:null,
    drillPoint:0,
    isCompleted:false,
    duration:0
}
var myDrillDetails = {
    id:0,
    order:0,
    drillId:0,
    details:null,
    type:0
}
var isDrillCompleted = false;
var timerId = null;
function playAudio(src) {
   
    setTimeout(function () {
        var a = new Audio();
        a.src = src;

        a.play();
    }, 0);
}

document.addEventListener('webworksready', function (e) {
 //   blackberry.event.addEventListener("entercover", onEnterCover);
    // For some fun I did some random color scheme generation :o)
    var highlightColor,
					randomNumber;
    randomNumber = Math.floor(Math.random() * 100);
    if (randomNumber > 90) {
        highlightColor = '#BA55D3';
    } else if (randomNumber > 60) {
        highlightColor = '#00BC9F';
    } else if (randomNumber > 30) {
        highlightColor = '#00A8DF';
    } else {
        highlightColor = '#B2CC00';
    }

    // You must call init on bbUI before any other code loads.  
    // If you want default functionality simply don't pass any parameters.. bb.init();
    bb.init({ actionBarDark: true,
        controlsDark: true,
        listsDark: false,
        bb10ForPlayBook: false,
        highlightColor: highlightColor,
        // Fires "before" styling is applied and "before" the screen is inserted in the DOM
        onscreenready: function (element, id) {
            if (id == 'dataOnLoad') {
                dataOnLoad_initialLoad(element);
            } else if (id == 'masterDetail') {
                masterDetail_initialLoad(element);
            }

            // Remove all titles "except" input and pill buttons screen if running on BB10
            if (bb.device.isBB10 && (id != 'input') && (id != 'pillButtons')) {
                var titles = element.querySelectorAll('[data-bb-type=title]');
                if (titles.length > 0) {
                    titles[0].parentNode.removeChild(titles[0]);
                }
            }

        },

        // Fires "after" styling is applied and "after" the screen is inserted in the DOM
        ondomready: function (element, id) {
            if (id == 'dataOnTheFly') {
                dataOnTheFly_initialLoad(element);
            }
            else if (id == 'main') {

                myDrilSergeantDB.db_init();
                ds_init_events();
                //register bbm
                _bbm.register();


            } else if (id == 'register') {

                if (_bbm.registered === true) {
                    $('#BBMdiv').show();
                } else {
                    $('#BBMdiv').hide();
                }

                $('#txtRegName').blur(function () {
                    if ($(this).val() == '') {
                        $('#spnRegName').html('<ul><li>Please enter your name here!</li></ul>');
                        validated = false;
                    } else {
                        $('#spnRegName').html('');

                    }
                });

                $('#txtRegDesc').blur(function () {
                    if ($(this).val() == '') {
                        $('#spnRegDesc').html('<ul><li>Please describe yourself here!</li></ul>');

                    } else {
                        $('#spnRegName').html('');

                    }
                });

                $('#txtRegFB').blur(function () {
                    if ($(this).val() == '') {
                        $('#spnRegFB').html('<ul><li>Please enter your email here!</li></ul>');

                    } else {
                        $('#spnRegFB').html('');

                    }
                });

                $('#ds-btnCreateUser').click(function () {
                    // playAudio('button.mp3');
                    var gender = document.getElementById('gender');

                    var name = $('#txtRegName').val();
                    var emailAddress = $('#txtRegFB').val();
                    var description = $('#txtRegDesc').val();
                    var validated = true;
                    if (name == '') {
                        validated = false;
                    }
                    if (emailAddress == '') {
                        validated = false;
                    }
                    if (description == '') {
                        validated = false;
                    }


                    if (validated) {
                        global_user.name = name;
                        global_user.description = description;
                        global_user.emailAddress = emailAddress;
                        global_user.isInitial = true;


                        var checked = (gender.value == '1' ? true : false);

                        myDrilSergeantDB.db_insertUser(name, emailAddress, description, checked);
                        if (checked) {
                            global_user.isMale = 1;
                        } else {
                            global_user.isMale = 0;
                        }
                        bb.pushScreen('ds-Rules.htm', 'ds-rules');
                    }
                });

            } else if (id == 'rules') {
                $('#ruleName').html(global_user.name);
                $('#wLoading5').hide();
                loadEvents();
            } else if (id == 'ds-rules') {


                $('#ruleName').html(global_user.name);

                if (global_user.isInitial) {
                    $('#ds-btnRulesNext').show();
                }
                $('#ds-btnRulesNext').click(function () {
                    // playAudio('button.mp3');
                    myDrilSergeantDB.db_getUserByName(global_user.name, successUserHandler2, errorHandler);

                });

                $('#wLoading5').hide();


            } else if (id == 'TrainingRoom') {

                if (_bbm.registered === true) {
                    blackberry.bbm.platform.self.getDisplayPicture(function (image) {
                        if (image != 'undefined') {
                            document.getElementById('bbmProfileImage').src = 'data:image/jpeg;base64,' + image;
                        }

                    });

                } else {
                    document.getElementById('bbmProfileImage').src = "img/logo.png";
                }

                loadTrainingRoom();

                loadEvents();

            } else if (id == 'settings') {
                bb.refresh();
                $('#txtSetName').val(global_user.name);
                $('#txtSetEmail').val(global_user.emailAddress);
                $('#txtSetDesc').val(global_user.description);

                var gender = document.getElementById('gender');

                if (global_user.isMale == 1) {
                    gender.setSelectedText('Male');
                } else {
                    gender.setSelectedText('Female');
                }



                $('#btnDelete').click(function () {
                    // playAudio('button.mp3');
                    myDrilSergeantDB.db_truncateTables(dropTableSuccessHandler, errorHandler);
                    bb.popScreen();
                });
                loadEvents();
                $('#wLoading2').hide();

            } else if (id == 'myProfile') {

                var pImg = document.getElementById('bImg2');
                var pImg2 = document.getElementById('bImg3');


                if (_bbm.registered === true) {

                    blackberry.bbm.platform.self.getDisplayPicture(function (image) {
                        if (image != 'undefined') {
                            pImg.src = 'data:image/jpeg;base64,' + image;
                        }

                    });

                } else {
                    pImg.src = "img/logo.png";

                }
                pImg2.src = getUserLevel(global_user.score, global_user.isMale);

                if (global_user.isMale == 0) {

                    pImg2.style.width = "65px";
                } else {
                    pImg2.style.width = "100px";
                }


                $('#ProfileName').html(global_user.name);
                $('#emailAddress').html(global_user.emailAddress);
                $('#description').html('"' + global_user.description + '"');
                $('#points').html((parseInt(global_user.score) > 1) ? global_user.score + 'pts' : global_user.score + 'pt');
                loadEvents();
                getBadgesEarned();
                getDrillsCompleted();


                $('#wLoading2').hide();
            } else if (id == 'MyMilestones') {

            } else if (id == 'MyTrainingHistory') {
                loadTrainingHistory();
                loadEvents();
                $('#wLoading2').hide();

            } else if (id == 'about') {

            } else if (id == 'badgePage') {
                ShowBadge(myBadge.badgeId);
                $('#badgePageBack').click(function () {
                    // playAudio('button.mp3');
                    $('.floatDivBottom').hide();
                    bb.popScreen();
                });
                myDrilSergeantDB.db_getCompletedDrillsByBadgeId(parseInt(myBadge.badgeId), completedHandler, errorHandler);


            } else if (id == 'showtime') {
                if (isDrillCompleted) {
                    isDrillCompleted = false;
                    bb.popScreen();
                }
                count = myDrill.duration * 60;
                var drillImage = document.getElementById('drillImage');
                var imgDrill = document.getElementById('imgDrill');
                if (myDrill.drillFile == '') {
                    imgDrill.src = "img/drills/noImage.png";

                } else {
                    imgDrill.src = "img/drills/" + myDrill.drillFile;

                }
                $('#spnDrillName').html(myDrill.drillName);
                $('#spnDrillScore').html(myDrill.drillPoint + 'pts');
                $('#spnTimeLeft').html(formatTime(parseInt(myDrill.duration * 60)));
                $('#btnStart').click(function () {

                    // playAudio('button.mp3');
                    startTimer();
                });
                $('#btnBack').click(function () {
                    // playAudio('button.mp3');
                    window.clearInterval(timerId);
                    bb.popScreen();
                });
                $('#btnStop').click(function () {
                    // playAudio('button.mp3');
                    window.clearInterval(timerId);
                });

                loadDrillDetails(myDrill.drillId);
                $('#wLoading4').hide();
            }
            else if (id == 'congrats1') {
                playAudio('alert.mp3');

                $('#cBack1').click(function () {
                    // playAudio('button.mp3');
                    bb.popScreen();
                });
                $('#fb').click(function () {
                    // facebook
                    initApp();
                    getAuthorization();
                   // postToService('Sample Drill Sergeant post');
                });
                $('#spnCongrats1').html(myDrill.drillPoint + 'pts');
                $('#spnDrillName1').html(myDrill.drillName);
                _bbm.setPersonalMessage("I just earned " + myDrill.drillPoint + " points for doing the " + myDrill.drillName + " drill using Drill Sergeant!");
            } else if (id == 'congrats2') {
                playAudio('alert.mp3');

                $('#btnCongrats2').click(function () {
                    // playAudio('button.mp3');
                    bb.popScreen();
                });

                var badgeImg = document.getElementById('bImg');
                $('#cBack2').click(function () {
                    // playAudio('button.mp3');
                    bb.popScreen();
                });
                $('#spnCongrats2').html(myBadge.badgePoint + 'pts');
                $('#myPoints2').html(global_user.score);
                $('#spnBadgeName').html(myBadge.badgeName);

                badgeImg.src = "img/" + myBadge.badgeFile + "";
                _bbm.setPersonalMessage("I just completed the " + myBadge.badgeName + " badge worth " + myBadge.badgePoint + " points using Drill Sergeant!");
            } else if (id == 'alert') {

                if (parseInt(global_user.score) == 0) {
                    $('#spnAlert1').html('You have ZERO. How lame..');
                } else {
                    $('#spnAlert1').html(global_user.d_points + (parseInt(global_user.d_points) > 1 ? 'pts' : 'pt') +
                        ' will be deducted because you did not exercise ' +
                        ((
                            parseInt(global_user.d_points) <= 1
                          ) ? 'yesterday.' : 'for ' + global_user.d_points + ' days.'
                        ) + ' You only have ' + global_user.score + ((global_user.score == 1) ? 'pt' : 'pts'));
                }

                $('#btnAlert1').click(function () {
                    // playAudio('button.mp3');
                    bb.pushScreen('TrainingRoom.htm', 'TrainingRoom');
                });
            }
            else if (id == 'purchase') {
                $('#badgeDescPurchase').html(myBadge.badgeDescription);
                var badgeImg = document.getElementById('bImg2');
                badgeImg.src = "img/" + myBadge.badgeFile + "";
                $('#BadgeNamePurchase').html(myBadge.badgeName);
                $('#badgePointPurchase').html(myBadge.badgePoint + ' pts');
                $('#badgePricePurchase').html('$' + myBadge.price);
                $('#btnPurchaseBadgeA').click(function () {
                    // playAudio('button.mp3');
                });
                myDrilSergeantDB.db_getDrillsByBadgeId(myBadge.badgeId, function (tx, r) {
                    $('#badgeDrillsPurchase').html(r.rows.length);
                }, errorHandler);
                $('#wLoading2').hide();
            }

        }

    });

}, false);
var chartData;
function onEnterCover() {
    blackberry.ui.cover.setContent(blackberry.ui.TYPE_IMAGE,
        { path: "/img/logo.png" });
    blackberry.ui.cover.labels.push({ label: "",
        size: 15,
        wrap: false
    });
    blackberry.ui.cover.setTransition(blackberry.ui.cover.TRANSITION_FADE);
    blackberry.ui.cover.updateCover();
}


function doSomething() {

}
function getUserLevel(score, isMale) {
    var levelPath = null;
    levelPath = getGender(isMale, Math.floor(score/20));
    
    return levelPath;
}
function getGender(isMale, levelCount) {
   
    if (levelCount > 31) {
        levelCount = 31;
    }
    if (global_user.isMale == 1) {
       
        return "levels/Male-" + levelCount + ".png";
    } else {
        return "levels/Female-" + levelCount + ".png";
    }
}
function getBadgesEarned() {
    myDrilSergeantDB.getCompletedBadges(function (t, r) {
        if (r.rows.length > 0) {
            var badgesEarned = document.getElementById('BadgeCollected');
            var header = 'Badges Earned(' + r.rows.length + ')';
            var badgeHeader = document.createElement('div');

            badgeHeader.innerHTML = '<div><b>' + header + '</b><hr></div>';


            badgesEarned.appendChild(badgeHeader);

            for (var i = 0; i < r.rows.length; i++) {
                var row = r.rows.item(i);
                createBadge(row);
               
                badgesEarned.appendChild(createBadgesDivRow());
            }
        }
    }, errorHandler);
}
function createBadgesDivRow(){
     var div = document.createElement('div');
     var img = document.createElement('img');
     if (myBadge.badgeFile == '')
         img.src = 'img/drills/noImageSmall.png';
     else
        img.src = 'img/' + myBadge.badgeFile;
    img.style.height = "100px";
    img.style.width = "100px";
    

    var table= document.createElement('table');
    var row= document.createElement('tr');
    var td1= document.createElement('td');
    var td2= document.createElement('td');
    td1.appendChild(img);
    td2.innerHTML= myBadge.badgeName;

    row.appendChild(td1);
    row.appendChild(td2);

    table.appendChild(row);

    div.appendChild(table);
    return div;
}

function getDrillsCompleted() {
    myDrilSergeantDB.db_getCompletedDrills(function (t, r) {
        if (r.rows.length > 0) {
            var DrillsCompleted = document.getElementById('DrillsCompleted');
            var header = 'Drills Completed(' + r.rows.length + ')';
            var drillsHeader = document.createElement('div');

            drillsHeader.innerHTML = '<div><b>' + header + '</b><hr></div>';


            DrillsCompleted.appendChild(drillsHeader);

            for (var i = 0; i < r.rows.length; i++) {
                var row = r.rows.item(i);
                createDrill(row);
                $('#OpaqueDiv').animate({ height: '+=100' }, { queue: false, duration: 1100, easing: 'easeOutBounce' });

                DrillsCompleted.appendChild(createDrillsDivRow());
            }

        }
    }, errorHandler);
}

function createDrillsDivRow() {
    var div = document.createElement('div');
    var img = document.createElement('img');
    if (myDrill.drillFile == '')
        img.src = 'img/drills/noImageSmall.png';
    else
        img.src = 'img/drills/' + myDrill.drillFile;
    img.style.height = "100px";
    img.style.width = "100px";
    

    var table= document.createElement('table');
    var row= document.createElement('tr');
    var td1= document.createElement('td');
    var td2= document.createElement('td');
    td1.appendChild(img);
    td2.innerHTML= myDrill.drillName;

    row.appendChild(td1);
    row.appendChild(td2);

    table.appendChild(row);

    div.appendChild(table);
    return div;
}
function loadEvents() {
    $('#btnTrainingRoom').click(function () {
		// playAudio('button.mp3');
        $('#sMessage').hide();
        bb.pushScreen('TrainingRoom.htm', 'TrainingRoom');
    });
    $('#btnTrainingSettings').click(function () {
		// playAudio('button.mp3');
        $('#sMessage').hide();
        bb.pushScreen('Settings.htm', 'settings');
    });

    $('#btnTrainingMyProfile').click(function () {
		// playAudio('button.mp3');
        $('#sMessage').hide();
        bb.pushScreen('MyProfile.htm', 'myProfile');
    });

    $('#btnTrainingMyMilestones').click(function () {
		// playAudio('button.mp3');
        $('#sMessage').hide();
        bb.pushScreen('MyMilestones.htm', 'MyMilestones');
    });
    $('#btnTrainingHistory').click(function () {
		// playAudio('button.mp3');
        $('#sMessage').hide();
        bb.pushScreen('MyTrainingHistory.htm', 'MyTrainingHistory');
    });
    $('#btnAbout').click(function () {
		// playAudio('button.mp3');
        $('#sMessage').hide();
        bb.pushScreen('About.htm', 'about');
    });
    $('#btnRules').click(function () {
		// playAudio('button.mp3');
        $('#sMessage').hide();
        bb.pushScreen('Rules.htm', 'rules');
    });
}
function loadTrainingHistory() {
    //get running score history
    loadHistory();
  
}
var googleString;
function GetBBMProfile() {
    if (document.getElementById('checkBBM').checked) {
        if (_bbm.registered === true) {
            $('#txtRegName').val(blackberry.bbm.platform.self.displayName);

        }
    }
}
function runningScoreSuccessHandler(tx, results) {
   var url = 'http://chart.apis.google.com/chart?cht=lc&chs=500x300&chco=4D89F9,C6D9FD&chxt=x,y&chtt=My%20Training%20History';
   // var url = 'http://chart.apis.google.com/chart?cht=bvg&chs=500x300&chco=4D89F9,C6D9FD&chxt=x,y&chtt=My%20Training%20History&&chbh=10,10,10?chds=0,5&chxr=1,0,200,5';

   // google.load("visualization", "1", { packages: ["corechart"] });
   // chartData = new google.visualization.DataTable();
   
  //  chartData.addColumn('datetime', 'Date');
    //   chartData.addColumn('number', 'points');
    
    var ext = '&chd=t:';
    var ext2 = '&chxl=0:|';
    var ext3 = '&chxr=1' + ',' + '1,' + results.rows.length + ',1';
    var y = 0;
    for (var i = results.rows.length-1; i >= 0; i--) {
        y += 1;
        var row = results.rows.item(i);
        var myDate = new Date(row['added_on']);

        if (i == 0) {
            ext2 +=  parseInt(row['score']);
            ext += y; // myDate.getMonth() + '-' + myDate.getDate() + '-' + myDate.getFullYear();
        } else {
            ext2 +=  parseInt(row['score']) + '|';
            ext += y + ','; //myDate.getMonth() + '-' + myDate.getDate() + '-' + myDate.getFullYear() + '|';
        }

        

    }

    googleString = url + ext + ext2  + ext3;

    setTimeout('loadCharts2()', 300);
    
  

}
function loadCharts2() {

    var imgChart1 = new Image();
    document.getElementById('chart_div').innerHTML = '<img alt="Graph not available at this time" src="' + googleString + '" />';
    imgChart1.onload = function () {
       
    }
    imgChart1.src = googleString;

    loadHistory();

}
function loadHistory() {

    myDrilSergeantDB.db_getMyTrainingHistory(function (tx, results) {
        var divTrainingList = document.getElementById('divTrainingList');
        if (results.rows.length > 0) {

            clearDiv(divTrainingList);
            for (var i = 0; i < results.rows.length; i++) {
                var row = results.rows.item(i);
                divTrainingList.appendChild(createTrainingHistoryDiv(row));
            }
            bb.doLoad(divTrainingList.parentNode);
        } else {
            var nthImg = document.createElement('img');
            
            nthImg.src = "img/nth.png";
            divTrainingList.appendChild(nthImg);
            bb.doLoad(divTrainingList.parentNode);
        }
    }, errorHandler);


}
var custom_date_formats = {
    past: [
    { ceiling: 60, text: "less than a minute ago" },
    { ceiling: 86400, text: "$hours hours, $minutes minutes and $seconds seconds ago" },
    { ceiling: null, text: "$years years ago" }
  ],
    future: [
    { ceiling: 60, text: "in less than a minute" },
    { ceiling: 86400, text: "in $hours hours, $minutes minutes and $seconds seconds time" },
    { ceiling: null, text: "in $years years" }
  ]
}
function createTrainingHistoryDiv(row) {
    var thdiv = document.createElement('div');
    var table = document.createElement('table');
    var row1 = document.createElement('tr');
    var td1 = document.createElement('td');
    var td2 = document.createElement('td');

    var img = document.createElement('img');
   
    img.style.height = "150px";
    img.style.width = "150px";
    if (row['isBadge'] == 'true') {
        if (row['file'] == '')
            img.src = 'img/drills/noImageSmall.png';
        else
            img.src = 'img/' + row['file'];
    } else {
        if (row['file'] == '')
            img.src = 'img/drills/noImageSmall.png';
        else
        img.src = 'img/drills/' + row['file'];
    }
    td1.appendChild(img);
    row1.appendChild(td1);
    var innerTable = document.createElement('table');
    var innerRow1 = document.createElement('tr');
    var innertd1 = document.createElement('td');
    innertd1.setAttribute('colspan', '2');
    var title = document.createElement('span');
    title.className = 'titleDrill';
    title.innerHTML= row['drillName'];
    innertd1.appendChild(title);
    innerRow1.appendChild(innertd1);
    var innerRow2 = document.createElement('tr');
    var innertd2 = document.createElement('td');
    innertd2.innerHTML = 'performed:&nbsp;';
    innerRow2.appendChild(innertd2);
    var innertd3 = document.createElement('td');
    innertd3.innerHTML = humanized_time_span(new Date(row['added_on']), new Date());
    innerRow2.appendChild(innertd3);
    var innerRow3 = document.createElement('tr');
    var innertd4 = document.createElement('td');
    innertd4.innerHTML = 'earned:&nbsp;';
    innerRow3.appendChild(innertd4);
    var innertd5 = document.createElement('td');
    var span = document.createElement('span');
     if (row['isAdd'] == 'true') {
         span.className = 'up';
   } else {
         span.className = 'down';
    }
    var score = row['drillScore'] + (parseInt(row['drillScore']) == 1 ? 'pt' : 'pts');
    span.innerHTML = score;
    innertd5.appendChild(span);
    innerRow3.appendChild(innertd5);
    innerTable.appendChild(innerRow1);
    innerTable.appendChild(innerRow2);
    innerTable.appendChild(innerRow3);

    td2.appendChild(innerTable);
    row1.appendChild(td1);
    row1.appendChild(td2);
    table.appendChild(row1);



//    if (row['isAdd'] == 'true') {
//        thdiv.setAttribute('data-bb-img', 'img/arrowUp.png');
//    } else {
//        thdiv.setAttribute('data-bb-img', 'img/arrowDown.png');
//    }
//    thdiv.setAttribute('data-bb-type', 'item');
//    thdiv.setAttribute('data-bb-title', row['drillName']);
//    thdiv.setAttribute('data-bb-accent-text', row['drillScore'] + (parseInt(row['drillScore']) ==1 ? 'pt' :'pts'));
//   
    //    thdiv.innerHTML = humanized_time_span(new Date(row['added_on']), new Date());
    thdiv.appendChild(table);
    thdiv.appendChild(document.createElement('hr'));
    return thdiv;
}
function drawChart() {
    
    var options = { 'title': 'My Training History',
        'width': 400,
        'height': 300
    };

    var chart = new google.visualization.BarChart(document.getElementById('chart_div'));
    chart.draw(chartData, options);
}
function dropTableSuccessHandler(tx, results) {
   
    
}

function loadTrainingRoom() {
   
    $('#TrainingName').html(global_user.name);
    $('#wLoading2').hide();
    loadBadges();

    
   
    $('#sMessage').show();
    myDrilSergeantDB.db_getMyScore(global_user.id,myScoreHandler, errorHandler);

}

function myScoreHandler(tx, results) {
    global_user.score = 0;
    for (var i = 0; i < results.rows.length; i++) {
        var row = results.rows.item(i);
        if (row['isAdd'] == 'true') {
            global_user.score += parseInt(row['drillScore']);
        } else {
            global_user.score -= parseInt(row['drillScore']);
        }


    }
    $('#myPoints').html(((parseInt(global_user.score) > 1) ? global_user.score + 'pts' : global_user.score + 'pt') + '&nbsp;&nbsp;');
}
var count = 0;


function startTimer() {
    window.clearInterval(timerId);
    timerId = window.setInterval(function () {

        count -= 1;
        playAudio('tick.mp3');
        
        $('#spnTimeLeft').html(formatTime(count));
        if (count == 0) {
            window.clearInterval(timerId);

            global_user.score += myDrill.drillPoint;
            myDrilSergeantDB.db_insertTrainingHistory(global_user.id, myDrill.drillId, myDrill.drillName, myDrill.drillPoint, true, false, myDrill.drillFile);
            myDrilSergeantDB.db_insertRunningScore(global_user.id, global_user.score);
            myDrilSergeantDB.db_updateBadgeDrill(myBadge.badgeId, myDrill.drillId, true);
            //insert to drill history.
            isDrillCompleted = true;
            bb.pushScreen('ds-Congrats1.htm', 'congrats1');
            return;
            //      

        }
    }, 1000);
}
function completedHandler(tx, results){
   
    if (results.rows.length == parseInt(myBadge.drillCount)) {
       
        if (myBadge.isCompleted == false) {

            myDrilSergeantDB.db_insertTrainingHistory(global_user.id, myBadge.badgeId, myBadge.badgeName, myBadge.badgePoint, true,true,myBadge.badgeFile);
            myDrilSergeantDB.db_insertCompletedBadge(myBadge.badgeId, true);
            global_user.score += myBadge.badgePoint;
            myDrilSergeantDB.db_insertRunningScore(global_user.id, global_user.score);
         
            myBadge.isCompleted = true;
          //  myDrilSergeantDB.db_UpdateBadgeToComplete(myBadge.badgeId);
            bb.pushScreen('ds-Congrats2.htm', 'congrats2');
        } else {
            $('#bpBadgeName').html(myBadge.badgeName);
            $('#spnBadgeScore').html(myBadge.badgePoint + 'pts');
            $('#badgeDesc').html(myBadge.badgeDescription);
            $('#badge').css('background-image', 'url(img/' + myBadge.badgeFile + ')');
           
            loadDrillsByBadgeId(myBadge.badgeId);
            $('#wLoading3').hide();
        }
    }else{
        $('#bpBadgeName').html(myBadge.badgeName);
        $('#spnBadgeScore').html(myBadge.badgePoint + 'pts');
        $('#badgeDesc').html(myBadge.badgeDescription);
        $('#badge').css('background-image', 'url(img/' + myBadge.badgeFile + ')');
       
        loadDrillsByBadgeId(myBadge.badgeId);
        $('#wLoading3').hide();
    }
}
function loadDrillDetails(drillId) {
    myDrilSergeantDB.db_getDrillDetailsByDrillId(drillId, 1, function (t, rt) {
        insertDrillDetailsSection(rt, 'drillDetails', 'Form:');

    },errorHandler);
    //benefits

    myDrilSergeantDB.db_getDrillDetailsByDrillId(drillId, 2, function (t, rt) {
        insertDrillDetailsSection(rt, 'drillDetails', 'Benefits:');

    }, errorHandler);

    myDrilSergeantDB.db_getDrillDetailsByDrillId(drillId, 3, function (t, rt) {
        insertDrillDetailsSection(rt, 'drillDetails', 'Main Muscles:');

    }, errorHandler);

    myDrilSergeantDB.db_getDrillDetailsByDrillId(drillId, 4, function (t, rt) {
        insertDrillDetailsSection(rt, 'drillDetails', 'Goal:');

    }, errorHandler);

    myDrilSergeantDB.db_getDrillDetailsByDrillId(drillId, 5, function (t, rt) {
        insertDrillDetailsSection(rt, 'drillDetails', 'Technique:');

    }, errorHandler);

    myDrilSergeantDB.db_getDrillDetailsByDrillId(drillId, 6, function (t, rt) {
        insertDrillDetailsSection(rt, 'drillDetails', 'Tips:');

    }, errorHandler);
}
function insertDrillDetailsSection(result, div, header) {
    if (result.rows.length != 0) {
        var DrillDetailsDiv = document.getElementById(div);
        var headerFormB = document.createElement('div');
        headerFormB.className = 'drillDetailsDivStyle';
        headerFormB.innerHTML = '<div><b>' + header + '</b><hr></div>';

        DrillDetailsDiv.appendChild(headerFormB);
        for (var i = 0; i < result.rows.length; i++) {
            var row = result.rows.item(i);
            DrillDetailsDiv.appendChild(createDrillDetailsGenericDiv(parseInt(row['DrillId']), parseInt(row['dOrder']), row['Details']));
        }
    }
}
function createDrillDetailsGenericDiv(id,order,details){
    var dddiv = document.createElement('div');
    
    var ul = document.createElement('ul');
    var li = document.createElement('li');
    li.innerHTML = details;
    ul.appendChild(li);
    //   
    dddiv.className = 'drillDetailsDivStyle';
    dddiv.appendChild(ul);

    return dddiv;
}

function createDrillDetailsDiv() {//deprecated

    var dddiv = document.createElement('div');
   // dddiv.setAttribute('data-bb-type', 'item');
   // dddiv.setAttribute('data-bb-title','<span class=details>' + myDrillDetails.order + '. ' +  myDrillDetails.details + '</span>');
    var ul = document.createElement('ul');
    var li = document.createElement('li');
    li.innerHTML = myDrillDetails.details;
    ul.appendChild(li);
//   
    dddiv.className = 'drillDetailsDivStyle';
    dddiv.appendChild(ul);

    return dddiv;
}
function createDrillDetail(row) {
    myDrillDetails.drillId = parseInt(row['DrillId']);
    myDrillDetails.order = parseInt(row['dOrder']);
    myDrillDetails.details = row['Details'];
    myDrillDetails.type = parseInt(row['type']);
}
function formatTime(duration) {
//    var milliSeconds = duration;

//    var Hours = Math.floor(milliSeconds / 360000);
//    milliSeconds -= Hours * (360000);

//    var Minutes = Math.floor(milliSeconds / 6000);
//    milliSeconds -= Minutes * (6000);

//    var Seconds = Math.floor(milliSeconds / 100);
//    milliSeconds -= Seconds * 100;

//    var TimeStr = LeadingZero(Hours) + ":" + LeadingZero(Minutes) + ":" + LeadingZero(Seconds) + ":" + LeadingZero(milliSeconds) ;

    //    return TimeStr;

    var Seconds = duration;

    var Hours = Math.floor(Seconds / 3600);
    Seconds -= Hours * (3600);

    var Minutes = Math.floor(Seconds / 60);
    Seconds -= Minutes * (60);

   

    var TimeStr = LeadingZero(Hours) + ":" + LeadingZero(Minutes) + ":" + LeadingZero(Seconds);// + ":" + LeadingZero(milliSeconds);

    return TimeStr;
}

function LeadingZero(Time) {

    return (Time < 10) ? "0" + Time : +Time;

}
function loadDrillsByBadgeId(badgeId) {
    
    myDrilSergeantDB.db_getDrillsByBadgeId(badgeId, badgeDrillSuccessHandler, errorHandler);
}
function badgeDrillSuccessHandler(tx, results) {
    var badgeDrillsDiv = document.getElementById('badgeDrillsDiv');
    clearDiv(badgeDrillsDiv);
  
   myBadge.drillCount = results.rows.length;
    for (var i = 0; i < results.rows.length; i++) {
        var row = results.rows.item(i);
        createDrill(row);
        badgeDrillsDiv.appendChild(createDrillDiv(myDrill));
    }
    bb.doLoad(badgeDrillsDiv.parentNode);
}
function createDrillDiv(md) {
    var badgeDiv = document.createElement('div');
    badgeDiv.setAttribute('data-bb-type', 'item');
    var path = '';
    if (md.isCompleted == 'true') {
        path='img/check.png'
    } else {
        path = 'img/uncheck.png';
    }
    badgeDiv.setAttribute('data-bb-img', path);
    badgeDiv.setAttribute('data-bb-title', md.drillName);
    badgeDiv.innerHTML = md.drillPoint + ' pts' + ' - ' + md.duration + ((parseInt(md.duration) > 1) ? " minutes" : " minute");

    badgeDiv.onclick = function (b) {
        return function () {
			// playAudio('button.mp3');
            invokeDrillPage(b);
        }
    } (md.drillId);
    return badgeDiv;
}

function invokeDrillPage(drillId) {
    myDrilSergeantDB.db_getDrillsByDrillId(drillId, badgeDrillSuccessHandler2, errorHandler);
}
function badgeDrillSuccessHandler2(tx, results) {
    
    var row = results.rows.item(0);
    createDrill(row);
    $('.floatDivBottom').hide();
    bb.pushScreen('Showtime.htm', 'showtime');
}
function createDrill(row) {
    myDrill.drillId= parseInt(row['drillId']);
    myDrill.drillName= row['drillName'];
    myDrill.drillDescription= row['drillDescription'];
    myDrill.drillFile= row['drillFile'];
    myDrill.drillPoint = parseInt(row['drillPoint']);
    myDrill.isCompleted = row['isCompleted'];
    myDrill.duration = parseInt(row['drillDuration']);
   
}
function loadBadges() {
    myDrilSergeantDB.loadBadges(badgeSuccessHandler, errorHandler);
}
function clearDiv(oDiv) {
    while (oDiv.hasChildNodes()) {
        oDiv.removeChild(oDiv.lastChild);
    }
}
function badgeSuccessHandler(tx, results) {
    var container = document.getElementById('badgeContainer');
    clearDiv(container);
    for (var i = 0; i < results.rows.length; i++) {
        var row = results.rows.item(i);
        createBadge(row);
        container.appendChild(createBadgeDiv(myBadge));
    }
}
function createBadge(row) {

    myBadge.badgeId= parseInt(row['badgeId']);
    myBadge.badgeName= row['badgeName'];
    myBadge.badgeFile= row['badgeFile'];
    myBadge.isLocked= row['isLocked'];
    myBadge.badgeDescription= row['badgeDescription'];
    myBadge.badgePoint = row['badgePoint'];
    myBadge.price = row['price'];
    myBadge.SKU = row['SKU'];

    myBadge.isCompleted = (row['isCompleted'] == null ? false : row['isCompleted']);

    myBadge.drillCount = row['drillCount'];
    
}
function createBadgeDiv(badge) {
    var badgeDiv = document.createElement('div');
    badgeDiv.className = 'badgeDiv';

    badgeDiv.style.backgroundImage = "url(img/" + badge.badgeFile + ")";
    badgeDiv.onclick = function (a) {
        return function () {
			// playAudio('button.mp3');
            invokeActivityList(a);
        }
    } (myBadge.badgeId);

    badgeDiv.appendChild(createBadgeTable(badge));
    return badgeDiv;
}

function createBadgeTable(badge) {

    var dDiv = document.createElement('div');
    dDiv.className = 'dDiv';
    var upperDiv = document.createElement('div');

    if (badge.isLocked == 'true') {

        upperDiv.innerHTML = "Locked";
        upperDiv.className = 'upperBadgeLockedDiv';
    } else {
        upperDiv.innerHTML = '<marquee direction="left" scrollamount="6" behaviour="slide" loop="0" >' + badge.badgeName + '</marquee>';
        upperDiv.className = 'upperBadgeDiv';
    }

    var lowerDiv = document.createElement('div');
    if (badge.isCompleted=='true') {
        lowerDiv.innerHTML = 'Completed';
    } else {
        lowerDiv.innerHTML = badge.badgePoint + 'pts';
    }
    lowerDiv.className = 'lowerBadgeDiv';
    dDiv.appendChild(upperDiv);
    dDiv.appendChild(lowerDiv);
 
    return dDiv;

}
function invokeActivityList(badgeId) {
   
    myDrilSergeantDB.db_getBadgeById(badgeId, badgeSuccessHandler2, errorHandler);
}
function setChange(o) {
    var gender = document.getElementById('gender');

    var checked = (gender.value == '1' ? true : false);
    
        var name = $('#txtSetName').val();
        var emailAddress = $('#txtSetEmail').val();
        var id = global_user.id;
        var description = $('#txtSetDesc').val();
        myDrilSergeantDB.db_updateUser(name, emailAddress, description, id, checked);
        global_user.name = name;
        global_user.emailAddress = emailAddress;
        global_user.description = description;

        global_user.isMale = (checked==true ? 1 : 0);
        bb.popScreen();

}

function badgeSuccessHandler2(tx, results) {

    var row = results.rows.item(0);
    console.log(parseInt(row['badgeId']));
    createBadge(row);
   
    if (myBadge.isLocked == 'false') {
        // bb.pushScreen('ds-Congrats2.htm', 'congrats2');
        $('#sMessage').hide();
        bb.pushScreen('BadgePage.htm', 'badgePage');
    } else {
    return;
        $('#sMessage').hide();
        bb.pushScreen('purchase.htm', 'purchase');
    }
}
function ds_init_events() {
   
    $('#ds-btnStartHere').click(function () {
        // playAudio('button.mp3');
      
        myDrilSergeantDB.db_getUser(successUserHandler, errorHandler);


    });
   
}
function dropSuccess(tx, results) {
    bb.pushScreen('main.htm', 'main');
}
function successUserHandler2(tx, results) {
    var row = results.rows.item(0);
    global_user.ud = row['id'];
    global_user.name = row['name'];
    global_user.description = row['description'];
    global_user.emailAddress = row['emailAddress'];
    global_user.isInitial = false;
    global_user.isMale = (row['isMale'] == 'true' ? 1 : 0);
   
    bb.pushScreen('TrainingRoom.htm', 'TrainingRoom');
   
    
}
    
function successUserHandler(tx, results) {
   
    if (results.rows.length != 0) {
        var row = results.rows.item(0);
        global_user.id = row['id'];
        global_user.name = row['name'];
        global_user.description = row['description'];
        global_user.emailAddress = row['emailAddress'];
        global_user.isInitial = false;
       
        global_user.isMale = (row['isMale'] == 'true' ? 1 : 0);
        myDrilSergeantDB.db_getMyTopRunningScore(function (tx, r) {

            if (r.rows.length == 0) {
                bb.pushScreen('TrainingRoom.htm', 'TrainingRoom');
            } else {

                var row1 = r.rows.item(0);
                if (parseInt(row1['score']) == 0) {
                    bb.pushScreen('TrainingRoom.htm', 'TrainingRoom');
                } else {
                    var difference = new Date().getTime() - new Date(row1['added_on']).getTime();
                    //convert difference to days

                    difference = (difference / 1000) / 60 / 60 / 24;
                    if (difference >= 2) {
                        var diff = parseInt(row1['score']) - Math.floor(difference) - 1;
                        if (diff > 0) {

                            global_user.score = diff;
                            global_user.d_points = Math.floor(difference) - 1;
                            myDrilSergeantDB.db_insertTrainingHistory(global_user.id, -1, 'Did not Exercise', Math.floor(difference) - 1, false,true,'arrowDown.png');
							 global_user.score+=2;
                            myDrilSergeantDB.db_insertRunningScore(global_user.id, global_user.score);
                        } else {
                            global_user.score = 0;
                            global_user.d_points = parseInt(row1['score']);
                            myDrilSergeantDB.db_insertTrainingHistory(global_user.id, -1, 'Did not Exercise', parseInt(row1['score']), false,true, 'arrowDown.png');
                            myDrilSergeantDB.db_insertRunningScore(global_user.id, global_user.score);
                        }

                        //insert training history

                        
                        bb.pushScreen('ds-alert.htm', 'alert');
                    } else {
                        // bb.pushScreen('ds-alert.htm', 'alert');
                           global_user.score = parseInt(row1['score']);
                        //   global_user.score -= 1;
                        //   myDrilSergeantDB.db_insertTrainingHistory(global_user.id, -1, 'Did not Exercise', 1, false);
                        //   myDrilSergeantDB.db_insertRunningScore(global_user.id, global_user.score);
                       // bb.pushScreen('ds-alert.htm', 'alert');
                         bb.pushScreen('TrainingRoom.htm', 'TrainingRoom');
                    }
                }


            }
        }, errorHandler);
        //bb.pushScreen('TrainingRoom.htm', 'TrainingRoom');
      //  bb.pushScreen('ds-Congrats1.htm', 'congrats1');

     } else {
       
        bb.pushScreen('register.htm', 'register');
    }
    
   
}
function errorHandler(tx, error) {
    alert(error.message);
}

//---------db-------//


var version = '1.0';
var myDrilSergeantDB = {
    dsDB: null,
    db_init: function () {

        this.db_initDatabase();
    },
    db_initDatabase: function () {

        try {

            if (!window.openDatabase) {
                alert('Databases are not supported in this browser.');
            } else {

                var shortName = 'drill-sergeantdb1';
                var version = '1.0';
                var displayName = 'drill-sergeant Database';
                var maxSize = 5 * 1024 * 1024; //  bytes  

                this.dsDB = window.openDatabase(shortName, version, displayName, maxSize);

                this.db_createTables();

            }

        } catch (e) {
            if (e == 2) {
                // Version number mismatch.  
                alert("Invalid database version.");
            } else {
                alert("Unknown error " + e + ".");
            }
            return;
        }
    },
    db_createTables: function () {
        //  this.db_dropTables(nullDataHandler, ds_errorHandler); ;
        // db_deleteData();
        this.db_resetTables(nullDataHandler, errorHandler);
        this.dsDB.transaction(function (transaction) {
            transaction.executeSql('CREATE TABLE IF NOT EXISTS user(id INTEGER PRIMARY KEY, name TEXT, emailAddress TEXT,description TEXT, added_on DATETIME, isMale bit);', []);
            transaction.executeSql('CREATE TABLE IF NOT EXISTS Badges(pid INTEGER PRIMARY KEY,badgeId INTEGER, badgeName TEXT, badgeFile TEXT, badgePoint INTEGER, isLocked bit, badgeDescription TEXT, price INTEGER, drillCount INTEGER, SKU TEXT);', []);
            transaction.executeSql('CREATE TABLE IF NOT EXISTS BadgeCompleted(pid INTEGER PRIMARY KEY, badgeId INTEGER, isCompleted bit, added_on DATETIME);', []);
            transaction.executeSql('CREATE TABLE IF NOT EXISTS Drills(pid INTEGER PRIMARY KEY, drillId INTEGER, drillName TEXT, drillDescription TEXT, drillFile TEXT, drillPoint int, drillDuration int);', []);
            transaction.executeSql('CREATE TABLE IF NOT EXISTS BadgeDrills(pid INTEGER PRIMARY KEY, badgeDrillId INTEGER, badgeId INTEGER, drillId INTEGER, isCompleted bit);', []);
            transaction.executeSql('CREATE TABLE IF NOT EXISTS DrillDetails(pid INTEGER PRIMARY KEY, dOrder INTEGER, DrillId INTEGER, Details TEXT,type INTEGER);', []);

            transaction.executeSql('CREATE TABLE IF NOT EXISTS RunningScore(pid INTEGER PRIMARY KEY, userId INTEGER, score INTEGER, added_on DATETIME);', []);
            transaction.executeSql('CREATE TABLE IF NOT EXISTS MyTrainingHistory(pid INTEGER PRIMARY KEY, myId INTEGER, drillId INTEGER, drillName TEXT, drillScore INTEGER, added_on DATETIME, isAdd bit, isBadge bit, file TEXT);', []);

            //transaction.executeSql('CREATE TABLE IF NOT EXISTS ProgramDrills(ProgramDrills INTEGER PRIMARY KEY,Description TEXT, ProgramId INTEGER);', []);
        });
        db_prePopulateData();
        //  this.db_intitializeData(db_dataSelectHandler, ds_errorHandler);
    },
    db_insertCompletedBadge: function (badgeId, isCompleted) {
        this.dsDB.transaction(function (transaction) {
            var addedOn = new Date();
            transaction.executeSql("INSERT INTO BadgeCompleted(badgeId , isCompleted, added_on) VALUES (?,?,?)",
             [badgeId, isCompleted, addedOn]);
        });
    },
    db_getMyTopRunningScore: function (successHandler, errorHandler) {
        this.dsDB.transaction(function (transaction) {
            transaction.executeSql("Select * from RunningScore  order by pid DESC LIMIT 1", [], successHandler, errorHandler);
        });
    },
    db_getMyRunningScore: function (successHandler, errorHandler) {
        this.dsDB.transaction(function (transaction) {
            transaction.executeSql("Select * from RunningScore  order by added_on DESC LIMIT 50", [], successHandler, errorHandler);
        });
    },
    db_insertRunningScore: function (userId, score) {
        this.dsDB.transaction(function (transaction) {
            var addedOn = new Date();
            transaction.executeSql("INSERT INTO RunningScore(userId , score, added_on) VALUES (?,?,?)",
             [userId, score, addedOn]);
        });
    },
    db_getMyTrainingHistory: function (successHandler, errorHandler) {
        this.dsDB.transaction(function (transaction) {
            transaction.executeSql("Select * from MyTrainingHistory order by pid DESC Limit 50", [], successHandler, errorHandler);
        });
    },
    db_updateBadgeDrill: function (badgeId, drillId, isCompleted) {
        this.dsDB.transaction(function (transaction) {
            transaction.executeSql("UPDATE BadgeDrills set isCompleted=? Where badgeId = ? and drillId= ?",
             [isCompleted, badgeId, drillId]);
        });
    },
    db_insertTrainingHistory: function (myId, drillId, drillName, drillScore, isAdd, isBadge, file) {
        this.dsDB.transaction(function (transaction) {
            var addedOn = new Date();
            transaction.executeSql("INSERT INTO MyTrainingHistory(myId , drillId, drillName, drillScore, added_on, isAdd, isBadge, file) VALUES (?,?,?,?,?,?,?,?)",
             [myId, drillId, drillName, drillScore, addedOn, isAdd, isBadge, file]);
        });

    },
    db_insertBadgeDrill: function (badgeDrillId, badgeId, drillId, isCompleted) {
        this.dsDB.transaction(function (transaction) {
            var addedOn = new Date();
            transaction.executeSql("Select * from BadgeDrills where badgeId=? and drillId=?", [badgeId, drillId], function (t, r) {
                if (r.rows.length == 0) {
                    t.executeSql("INSERT INTO BadgeDrills(badgeDrillId , badgeId, drillId, isCompleted) VALUES (?,?,?,?)", [badgeDrillId, badgeId, drillId, isCompleted]);
                }
            }, errorHandler);


        });
    },
    db_insertBadge: function (badgeId, badgeName, badgeFile, isLocked, badgeDescription, badgePoint, price, drillCount, SKU) {
        this.db_getBadgeById(badgeId, function (t, r) {
            if (r.rows.length == 0) {
                var addedOn = new Date();
                t.executeSql("INSERT INTO Badges(badgeId , badgeName, badgeFile, badgePoint, isLocked, badgeDescription, price, drillCount, SKU) VALUES (?,?,?,?,?,?,?,?,?)",
             [badgeId, badgeName, badgeFile, badgePoint, isLocked, badgeDescription, price, drillCount, SKU]);
            }
        }, errorHandler);

    },
    db_insertUser: function (name, emailAddress, Description, isMale) {
        this.dsDB.transaction(function (transaction) {
            var addedOn = new Date();
            transaction.executeSql("INSERT INTO user(name , emailAddress, added_on, description, isMale) VALUES (?,?,?,?,?)",
             [name, emailAddress, addedOn, Description, isMale]);
        });
    },
    db_insertDrillDetails: function (order, drillId, details, type) {
        this.db_getDrillDetailsByDrillIdAndOrder(drillId, order, type, function (t, r) {
            if (r.rows.length == 0) {
                t.executeSql("INSERT INTO DrillDetails(dOrder , drillId, details, type) VALUES (?,?,?,?)",
             [order, drillId, details, type]);
            }
        }, errorHandler);

    },
    db_getDrillDetailsByDrillIdAndOrder: function (drillId, order, type, successHandler, errorHandler) {
        this.dsDB.transaction(function (transaction) {
            transaction.executeSql("Select * from DrillDetails where drillId=? and dOrder=? and type=?", [drillId, order, type], successHandler, errorHandler);
        });
    },


    db_insertDrill: function (drillId, drillName, drillDescription, drillFile, drillPoint, drillDuration) {
        this.db_getDrillById(drillId, function (t, r) {
            if (r.rows.length == 0) {
                t.executeSql("INSERT INTO Drills(drillId , drillName, drillDescription, drillFile,drillPoint, drillDuration) VALUES (?,?,?,?,?,?)",
             [drillId, drillName, drillDescription, drillFile, drillPoint, drillDuration]);
            }
        }, errorHandler);

    },
    db_getDrillById: function (id, successHandler, errorHandler) {
        this.dsDB.transaction(function (transaction) {
            transaction.executeSql("Select * from Drills where drillId=?", [id], successHandler, errorHandler);
        });
    },
    db_getUser: function (successHandler, errorHandler) {
        this.dsDB.transaction(function (transaction) {
            transaction.executeSql("Select * from user", [], successHandler, errorHandler);
        });
    },
    db_getUserByName: function (name, successHandler, errorHandler) {
        this.dsDB.transaction(function (transaction) {
            transaction.executeSql("Select * from user where name=?", [name], successHandler, errorHandler);
        });
    },

    db_updateUser: function (name, emailAddress, description, id, checked) {
        
        this.dsDB.transaction(function (transaction) {
            transaction.executeSql("UPDATE user set name=?, description=?, emailAddress= ?, isMale= ? Where id = ?",
             [name, description, emailAddress, checked, id]);
        });
    },
    db_resetTables: function (successHandler, errorHandler) {
        this.dsDB.transaction(function (transaction) {
            //    transaction.executeSql("DROP TABLE user;", [], successHandler, errorHandler);
            // transaction.executeSql("Update Badges set isCompleted=?;", [false], successHandler, errorHandler);
            // transaction.executeSql("DROP TABLE Drills;", [], successHandler, errorHandler);

            //  transaction.executeSql("DROP TABLE DrillDetails;", [], successHandler, errorHandler);
            //  transaction.executeSql("DROP TABLE DrillDetailsBenefits;", [], successHandler, errorHandler);



        });


    },
    db_dropTables: function (successHandler, errorHandler) {
        this.dsDB.transaction(function (transaction) {
            //   transaction.executeSql("DROP TABLE user;", [], successHandler, errorHandler);
            transaction.executeSql("DROP TABLE Badges;", [], successHandler, errorHandler);
            transaction.executeSql("DROP TABLE Drills;", [], successHandler, errorHandler);
            transaction.executeSql("DROP TABLE BadgeDrills;", [], successHandler, errorHandler);
            transaction.executeSql("DROP TABLE DrillDetails;", [], successHandler, errorHandler);
            transaction.executeSql("DROP TABLE MyTrainingHistory;", [], successHandler, errorHandler);
            transaction.executeSql("DROP TABLE RunningScore;", [], successHandler, errorHandler);
            transaction.executeSql("DROP TABLE BadgeCompleted;", [], successHandler, errorHandler);

        });


    },
    db_truncateTables: function (successHandler, errorHandler) {
        this.dsDB.transaction(function (transaction) {
            //  transaction.executeSql("Delete FROM user;", [], successHandler, errorHandler);
            //            transaction.executeSql("UPDATE Badges set isCompleted=?",
            //             [false]);
             transaction.executeSql("Delete FROM Drills;", [], successHandler, errorHandler);
            transaction.executeSql("UPDATE BadgeDrills set isCompleted=?",
             [false]);
            // transaction.executeSql("Delete FROM BadgeDrills;", [], successHandler, errorHandler);
            //transaction.executeSql("Delete FROM DrillDetails;", [], successHandler, errorHandler);
            transaction.executeSql("Delete FROM MyTrainingHistory;", []);
            transaction.executeSql("Delete FROM RunningScore;", []);
            transaction.executeSql("Delete FROM BadgeCompleted;", []);
            //   transaction.executeSql("Delete FROM Badges;", []);
        });

    },
    db_intitializeData: function (successHandler, errorHandler) {
        this.dsDB.transaction(
        function (transaction) {
            transaction.executeSql("Select badgeId from Badges LIMIT 5", [], successHandler, errorHandler);
        });
    },
    //badges
    loadBadges: function (successHandler, errorHandler) {
        this.dsDB.transaction(
        function (transaction) {

            transaction.executeSql("Select b.badgeId,b.badgeName,b.badgeFile,b.badgePoint,b.isLocked,b.badgeDescription,b.price,b.drillCount,bc.isCompleted,bc.added_on from Badges b Left join BadgeCompleted bc on b.badgeId= bc.badgeId", [], successHandler, errorHandler);
        });
    },
    getCompletedBadges: function (successHandler, errorHandler) {
        this.dsDB.transaction(
        function (transaction) {

            transaction.executeSql("Select b.badgeId,b.badgeName,b.badgeFile,b.badgePoint,b.isLocked,b.badgeDescription,b.price,b.drillCount,bc.isCompleted,bc.added_on, b.SKU from Badges b inner join BadgeCompleted bc on b.badgeId= bc.badgeId where bc.isCompleted=?", [true], successHandler, errorHandler);
        });
    },
    db_getBadgeById: function (id, successHandler, errorHandler) {

        this.dsDB.transaction(
        function (transaction) {
            transaction.executeSql("Select b.badgeId,b.badgeName,b.badgeFile,b.badgePoint,b.isLocked,b.badgeDescription,b.price,b.drillCount,bc.isCompleted,bc.added_on, b.SKU  from Badges b Left join BadgeCompleted bc on b.badgeId= bc.badgeId where b.badgeId=?", [id], successHandler, errorHandler);
        });
    },
    db_getDrillsByBadgeId: function (id, successHandler, errorHandler) {
        this.dsDB.transaction(
        function (transaction) {
            transaction.executeSql("Select d.DrillId, d.DrillName, d.DrillDescription, d.DrillFile, d.DrillPoint, b.isCompleted,d.drillDuration from Drills d inner join badgeDrills b on d.drillId= b.drillId where b.badgeId=?", [id], successHandler, errorHandler);
        });
    },
    db_getCompletedDrillsByBadgeId: function (id, successHandler, errorHandler) {
        this.dsDB.transaction(
        function (transaction) {
            transaction.executeSql("Select d.DrillId, d.DrillName, d.DrillDescription, d.DrillFile, d.DrillPoint, b.isCompleted,d.drillDuration from Drills d inner join badgeDrills b on d.drillId= b.drillId where b.badgeId=? and b.isCompleted=?", [id, true], successHandler, errorHandler);
        });
    },
    db_getCompletedDrills: function (successHandler, errorHandler) {
        this.dsDB.transaction(
        function (transaction) {
            transaction.executeSql("Select DISTINCT d.DrillId, d.DrillName, d.DrillDescription, d.DrillFile, d.DrillPoint, b.isCompleted,d.drillDuration from Drills d inner join badgeDrills b on d.drillId= b.drillId where b.isCompleted=?", [true], successHandler, errorHandler);
        });
    },
    db_getDrillsByDrillId: function (id, successHandler, errorHandler) {
        this.dsDB.transaction(
        function (transaction) {
            transaction.executeSql("Select d.DrillId, d.DrillName, d.DrillDescription, d.DrillFile, d.DrillPoint, b.isCompleted, d.drillDuration from Drills d inner join badgeDrills b on d.drillId= b.drillId where d.drillId=?", [id], successHandler, errorHandler);
        });
    },
    db_getDrillDetailsByDrillId: function (id, type, successHandler, errorHandler) {
        this.dsDB.transaction(
        function (transaction) {
            transaction.executeSql("Select * from drillDetails where drillId=? and type= ? order by dOrder", [id, type], successHandler, errorHandler);
        });
    },
    db_getDrillDetailsBenefitsByDrillId: function (id, successHandler, errorHandler) {

        this.dsDB.transaction(
        function (transaction) {
            transaction.executeSql("Select * from DrillDetailsBenefits where drillId=? order by dOrder", [id], successHandler, errorHandler);
        });
    },
    db_getMyScore: function (id, successHandler, errorHandler) {
        this.dsDB.transaction(
        function (transaction) {
            transaction.executeSql("Select * from MyTrainingHistory where myId=? order by added_on DESC", [id], successHandler, errorHandler);
        });
    },
    db_UpdateBadgeToComplete: function (badgeId) {
        this.dsDB.transaction(function (transaction) {
            transaction.executeSql("UPDATE Badges set isCompleted=? Where badgeId = ?",
             [true, badgeId]);
        });
    }
};

//
function nullDataHandler(tx, result) {
    //alert('null Data');

}


function db_dataSelectHandler(transaction, results) {

    if (results.rows.length <= 0) {
        
        db_prePopulateData();
    }
}

function ds_errorHandler(transaction, results) {
    alert('error');
}
function db_prePopulateData() {

    //Badges
    myDrilSergeantDB.db_insertBadge(1, "Burn, baby! burn!", "badge1.png", false, "Use these cardio training to beat down cardio boredom as well as to keep your mind and body in the moment.", 25, 0, 6, "drillSer002");
    myDrilSergeantDB.db_insertBadge(2, "Resistance Machines", "badge2.png", false, "Contrary to what you may think, you don't need a license to operate resistance machines. " +
    "If you can use an elevator, you can use resistance machines. The machines generally have labelled directions which you can follow to get your body into the right position. The machine weights control the range of movement and support your body with the use of pads and cushioning, making resistance machines great for beginners.", 25, 0, 6, "drillSer003");

    myDrilSergeantDB.db_insertBadge(3, "The Ultimate body weight", "badge3.png", false, "Your body is a walking, talking, living, breathing piece of strength training equipment. You can bend it, push it, twist it, squat it and crunch it to build muscle.", 25, 0, 4, "drillSer004");
    myDrilSergeantDB.db_insertBadge(4, "Freedom with free weights", "badge4.png", false, "Dumbbells and barbells are bars with weights attached to each end. The long bars are barbells and the short bars are dumbbells and both are referred to as free weights because they are not attached to any cables or weight stacks. Free weights require greater coordination and control than machine weights because you determine the range of motion.", 50, 1, 6, "drillSer005");
    myDrilSergeantDB.db_insertBadge(5, "Fitness First: The Ultimate body weight", "badge5.png", true, "Use your body as a strength training equipment.", 50, 1, 5, "drillSer006");
    myDrilSergeantDB.db_insertBadge(6, "Fitness First: The Ultimate body weight", "badge6.png", true, "Use your body as a strength training equipment.", 65, 1, 5, "drillSer007");
    myDrilSergeantDB.db_insertBadge(7, "Fitness First: The Ultimate body weight", "badge7.png", true, "Use your body as a strength training equipment.", 65, 1, 5, "drillSer008");
    myDrilSergeantDB.db_insertBadge(8, "Fitness First: The Ultimate body weight", "badge8.png", true, "Use your body as a strength training equipment.", 70, 1, 5, "drillSer009");
    myDrilSergeantDB.db_insertBadge(9, "Fitness First: The Ultimate body weight", "badge9.png", true, "Use your body as a strength training equipment.", 70, 1, 5, "drillSer010");
    myDrilSergeantDB.db_insertBadge(10, "Fitness First: The Ultimate body weight", "badge10.png", true, "Use your body as a strength training equipment.", 80, 1, 5, "drillSer011");
    myDrilSergeantDB.db_insertBadge(11, "Fitness First: The Ultimate body weight", "badge11.png", true, "Use your body as a strength training equipment.", 90, 1, 5, "drillSer012");
    myDrilSergeantDB.db_insertBadge(12, "Fitness First: The Ultimate body weight", "badge12.png", true, "Use your body as a strength training equipment.", 90, 1, 5, "drillSer013");
    myDrilSergeantDB.db_insertBadge(13, "Fitness First: The Ultimate body weight", "badge13.png", true, "Use your body as a strength training equipment.", 100, 1, 5, "drillSer014");

   

}

function ShowBadge(badgeId) {
    switch(parseInt(badgeId)){
        case 1:
            myDrilSergeantDB.db_insertDrill(1, 'Treadmill', 'Perfect for beginners', 'treadmill.png', 5, 1);
            myDrilSergeantDB.db_insertDrill(2, 'Elliptical', 'Perfect for beginners', 'elliptical.png', 5, 1);
            myDrilSergeantDB.db_insertDrill(3, 'Stepper', 'Perfect for beginners', 'Stepper.png', 5, 1);
            myDrilSergeantDB.db_insertDrill(4, 'Stationary bike', 'Perfect for beginners', 'bike.png', 5, 1);
            myDrilSergeantDB.db_insertDrill(5, 'Rower', 'Perfect for beginners', 'rower.png', 5, 1);
            myDrilSergeantDB.db_insertDrill(6, 'Wave', 'Perfect for beginners', 'wave.png', 5, 10);
            
            myDrilSergeantDB.db_insertBadgeDrill(1, 1, 1, false);
            myDrilSergeantDB.db_insertBadgeDrill(2, 1, 2, false);
            myDrilSergeantDB.db_insertBadgeDrill(3, 1, 3, false);
            myDrilSergeantDB.db_insertBadgeDrill(4, 1, 4, false);
            myDrilSergeantDB.db_insertBadgeDrill(5, 1, 5, false);
            myDrilSergeantDB.db_insertBadgeDrill(6, 1, 6, false);

            myDrilSergeantDB.db_insertDrillDetails(1, 1, 'Start slowly.', 1); //1=Form, 2=benefits, 3=muscles, 4=Goal, 5= Technique, 6= Tips
            myDrilSergeantDB.db_insertDrillDetails(2, 1, 'Use handrails for balance if needed.', 1);
            myDrilSergeantDB.db_insertDrillDetails(3, 1, 'Maintain good posture.', 1);
            myDrilSergeantDB.db_insertDrillDetails(4, 1, 'Keep feet pointed straight ahead.', 1);
            myDrilSergeantDB.db_insertDrillDetails(1, 1, 'Perfect for beginners', 2);
            myDrilSergeantDB.db_insertDrillDetails(2, 1, 'Adjustable pace: you can walk or run.', 2);
            myDrilSergeantDB.db_insertDrillDetails(3, 1, 'Pre-programmed workouts are available on most models.', 2);
            myDrilSergeantDB.db_insertDrillDetails(1, 1, 'Quads, Glutes, Calves, Hamstrings, Core.', 3);

            myDrilSergeantDB.db_insertDrillDetails(1, 2, 'Start slowly.', 1);
            myDrilSergeantDB.db_insertDrillDetails(2, 2, 'Use handrails for balance if needed.', 1);
            myDrilSergeantDB.db_insertDrillDetails(3, 2, 'Maintain good posture.', 1);
            myDrilSergeantDB.db_insertDrillDetails(4, 2, 'Keep feet pointed straight ahead.', 1);
            myDrilSergeantDB.db_insertDrillDetails(5, 2, 'Keep feet flat on the pedals.', 1);
            myDrilSergeantDB.db_insertDrillDetails(1, 2, 'Low impact.', 2);
            myDrilSergeantDB.db_insertDrillDetails(2, 2, 'Pre-programmed workouts are available on most models.', 2);
            myDrilSergeantDB.db_insertDrillDetails(1, 2, 'Quads, Glutes, Calves, Hamstrings, Core, Arms on some models.', 3);


            myDrilSergeantDB.db_insertDrillDetails(1, 3, 'Start slowly.', 1);
            myDrilSergeantDB.db_insertDrillDetails(2, 3, 'Use handrails for balance if needed.', 1);
            myDrilSergeantDB.db_insertDrillDetails(3, 3, 'Maintain good posture.', 1);
            myDrilSergeantDB.db_insertDrillDetails(1, 3, 'Low impact.', 2);
            myDrilSergeantDB.db_insertDrillDetails(2, 3, 'Excellent for lower body conditioning.', 2);
            myDrilSergeantDB.db_insertDrillDetails(3, 3, 'Pre-programmed workouts are available on most models.', 2);
            myDrilSergeantDB.db_insertDrillDetails(1, 3, 'Quads, Glutes, Calves, Hamstrings, Core.', 3);


            myDrilSergeantDB.db_insertDrillDetails(1, 4, 'Adjust seat to correct height (you should have a slight bend in your knee at the bottom of the pedal stroke).', 1);
            myDrilSergeantDB.db_insertDrillDetails(2, 4, 'Start slowly.', 1);
            myDrilSergeantDB.db_insertDrillDetails(3, 4, 'Maintain good posture.', 1);
            myDrilSergeantDB.db_insertDrillDetails(1, 4, 'Perfect for beginners.', 2);
            myDrilSergeantDB.db_insertDrillDetails(2, 4, 'Low impact.', 2);
            myDrilSergeantDB.db_insertDrillDetails(3, 4, 'Pre-programmed workouts are available on most models.', 2);
            myDrilSergeantDB.db_insertDrillDetails(1, 4, 'Quads, Calves, Hamstrings, Core.', 3);

            myDrilSergeantDB.db_insertDrillDetails(1, 5, 'Strap feet in (should feel snug)', 1);
            myDrilSergeantDB.db_insertDrillDetails(2, 5, 'First drive through the balls of your feet to initiate movement.', 1);
            myDrilSergeantDB.db_insertDrillDetails(3, 5, 'Pull row shaft into stomach, synchronising both movements as legs extend', 1);
            myDrilSergeantDB.db_insertDrillDetails(4, 5, 'Return to start position.', 1);
            myDrilSergeantDB.db_insertDrillDetails(5, 5, 'Start slowly.', 1);
            myDrilSergeantDB.db_insertDrillDetails(6, 5, 'Maintain good posture.', 1);
            myDrilSergeantDB.db_insertDrillDetails(1, 5, 'Challenges coordination and cardio fitness simultaneously.', 2);
            myDrilSergeantDB.db_insertDrillDetails(2, 5, 'Excellent for total body conditioning.', 2);
            myDrilSergeantDB.db_insertDrillDetails(3, 5, 'Pre-programmed workouts are available on most models.', 2);
            myDrilSergeantDB.db_insertDrillDetails(1, 5, 'Arms, Chest, Back, Shoulders, Core, Glutes, Hamstrings,Quads, Calves', 3);

            myDrilSergeantDB.db_insertDrillDetails(1, 6, 'Start Slowly.', 1);
            myDrilSergeantDB.db_insertDrillDetails(2, 6, 'Use handrails for balance if needed.', 1);
            myDrilSergeantDB.db_insertDrillDetails(3, 6, 'Maintain good posture.', 1);
            myDrilSergeantDB.db_insertDrillDetails(4, 6, 'Keep feet pointed straight ahead.', 1);
            myDrilSergeantDB.db_insertDrillDetails(5, 6, 'Keep feet flat on the pedals.', 1);
            myDrilSergeantDB.db_insertDrillDetails(1, 6, 'Low impact.', 2);
            myDrilSergeantDB.db_insertDrillDetails(2, 6, 'Pre-programmed workouts are available on most models.', 2);
            myDrilSergeantDB.db_insertDrillDetails(1, 6, 'Quads, Glutes, Calves, Hamstrings, Core', 3);
            break;
        case 2:
            myDrilSergeantDB.db_insertDrill(7, 'Chest Press', 'Perfect for beginners', 'chestpress.png', 5, 1);
            myDrilSergeantDB.db_insertDrill(8, 'Leg Press', 'Perfect for beginners', 'leg Press.jpg', 5, 1);
            myDrilSergeantDB.db_insertDrill(9, 'Lat pull-down', 'Perfect for beginners', 'latPullDown.jpg', 5, 1);
            myDrilSergeantDB.db_insertDrill(10, 'Shoulder press', 'Perfect for beginners', 'shoulderPress.jpg', 5, 1);
            myDrilSergeantDB.db_insertDrill(11, 'Tricep extension', 'Perfect for beginners', 'triceps_extension.jpg', 5, 1);
            myDrilSergeantDB.db_insertDrill(12, 'Preacher curl', 'Perfect for beginners', 'PreacherCurl.jpg', 5, 1);

            myDrilSergeantDB.db_insertBadgeDrill(7, 2, 7, false);
            myDrilSergeantDB.db_insertBadgeDrill(8, 2, 8, false);
            myDrilSergeantDB.db_insertBadgeDrill(9, 2, 9, false);
            myDrilSergeantDB.db_insertBadgeDrill(10, 2, 10, false);
            myDrilSergeantDB.db_insertBadgeDrill(11, 2, 11, false);
            myDrilSergeantDB.db_insertBadgeDrill(12, 2, 12, false);

            myDrilSergeantDB.db_insertDrillDetails(1, 7, 'Best chest in the west.', 4);
            myDrilSergeantDB.db_insertDrillDetails(1, 7, 'Grip handles firmly.', 5);
            myDrilSergeantDB.db_insertDrillDetails(2, 7, 'Align elbows and wrists with shoulders.', 5);
            myDrilSergeantDB.db_insertDrillDetails(3, 7, 'Engage in resistance as you drive your arms forward.', 5);
            myDrilSergeantDB.db_insertDrillDetails(4, 7, 'Maintain control, returning to the start position.', 5);
            myDrilSergeantDB.db_insertDrillDetails(1, 7, 'Avoid locking your elbows at the end range.', 6);
            myDrilSergeantDB.db_insertDrillDetails(2, 7, 'Squeeze your chest at the end range.', 6);
            myDrilSergeantDB.db_insertDrillDetails(3, 7, 'Keeps arms parallel to the ground.', 6);
            myDrilSergeantDB.db_insertDrillDetails(4, 7, 'Lock in your core.', 6);

            myDrilSergeantDB.db_insertDrillDetails(1, 8, 'Develop strong sexy legs.', 4);
            myDrilSergeantDB.db_insertDrillDetails(1, 8, 'Adjust the leg press machine to fit your body.', 5);
            myDrilSergeantDB.db_insertDrillDetails(2, 8, 'Place feet a shoulder width apart.', 5);
            myDrilSergeantDB.db_insertDrillDetails(3, 8, 'Slowly release the safety catch and engage in resistance.', 5);
            myDrilSergeantDB.db_insertDrillDetails(4, 8, 'Smoothly slide down toward the foot plate.', 5);
            myDrilSergeantDB.db_insertDrillDetails(5, 8, 'Drive your heels in to the foot plate as you return to the start position.', 5);
            myDrilSergeantDB.db_insertDrillDetails(1, 8, 'Keep your knees over your toes throughout.', 6);
            myDrilSergeantDB.db_insertDrillDetails(2, 8, 'Breathe out as you engage the resistance.', 6);
            myDrilSergeantDB.db_insertDrillDetails(3, 8, 'Keep heels flat.', 6);
            myDrilSergeantDB.db_insertDrillDetails(4, 8, 'Engage abdominals throughout exercise.', 6);

            myDrilSergeantDB.db_insertDrillDetails(1, 9, 'Bring sexy back.', 4);
            myDrilSergeantDB.db_insertDrillDetails(1, 9, 'Take a wide grip on the bar with arms fully stretched.', 5);
            myDrilSergeantDB.db_insertDrillDetails(2, 9, 'Initiate movement by retracting your shoulder blades followed by your arms, pulling the bar to the top of your chest and breathing out as you go.', 5);
            myDrilSergeantDB.db_insertDrillDetails(1, 9, 'Engage your core.', 6);
            myDrilSergeantDB.db_insertDrillDetails(2, 9, 'Stabilise your upper body to minimize movement.', 6);
            myDrilSergeantDB.db_insertDrillDetails(3, 9, 'Focus on pulling first from the back and not with the arms.', 6);

            myDrilSergeantDB.db_insertDrillDetails(1, 10, 'Create the perfect frame for your physique with a strong pair of shapely shoulders', 4);
            myDrilSergeantDB.db_insertDrillDetails(1, 10, 'Press the handles up without locking your elbows.', 5);
            myDrilSergeantDB.db_insertDrillDetails(2, 10, 'Lower your arms until the weight stack is almost touching, then repeat.', 5);
            myDrilSergeantDB.db_insertDrillDetails(1, 10, 'Drive up with even effort through both hands.', 6);
            myDrilSergeantDB.db_insertDrillDetails(2, 10, 'Breathe out on the way up and breathe in on the way down.', 6);
            myDrilSergeantDB.db_insertDrillDetails(3, 10, 'Resist the urge to arch your back, always switch your core on.', 6);

            myDrilSergeantDB.db_insertDrillDetails(1, 10, 'Replace the excess baggage at the back of your arm with toned, taut triceps.', 4);
            myDrilSergeantDB.db_insertDrillDetails(1, 10, 'Retract shoulders and pin elbows into your ribs.', 5);
            myDrilSergeantDB.db_insertDrillDetails(2, 10, 'With straight wrists, extend your forearms.', 5);
            myDrilSergeantDB.db_insertDrillDetails(3, 10, 'Slowly let the bar return to the starting point.', 5);
            myDrilSergeantDB.db_insertDrillDetails(1, 10, 'Try not to lean over the bar, stand tall and engage your core.', 6);
            myDrilSergeantDB.db_insertDrillDetails(1, 10, 'Connect with your triceps, squeezing them at the bottom.', 6);

            myDrilSergeantDB.db_insertDrillDetails(1, 11, 'Shape and sculpt sexy arms.', 4);
            myDrilSergeantDB.db_insertDrillDetails(1, 11, 'Grasp handles, palms facing up.', 5);
            myDrilSergeantDB.db_insertDrillDetails(2, 11, 'Bend elbows and pull the handles.', 5);
            myDrilSergeantDB.db_insertDrillDetails(3, 11, 'Slowly lower the resistance back down.', 5);
            myDrilSergeantDB.db_insertDrillDetails(1, 11, 'Anchor your hips on the seat to eliminate momentum.', 6);

            myDrilSergeantDB.db_insertDrillDetails(1, 12, 'Shape and sculpt sexy arms', 4); //1=Form, 2=benefits, 3=muscles, 4=Goal, 5= Technique, 6= Tips
            myDrilSergeantDB.db_insertDrillDetails(1, 12, 'Grasp handles, palms facing up.', 5);
            myDrilSergeantDB.db_insertDrillDetails(2, 12, 'Bend elbows and pull the handles to the top of your shoulders.', 5);
            myDrilSergeantDB.db_insertDrillDetails(3, 12, 'Slowly lower the resistance back down.', 5);
            myDrilSergeantDB.db_insertDrillDetails(1, 12, 'Anchor your hips on the seat to eliminate momentum.', 6);
            break;
        case 3:

            myDrilSergeantDB.db_insertDrill(13, 'Squat', 'Perfect for beginners', 'squat.png', 5, 1);
            myDrilSergeantDB.db_insertDrill(14, 'Lunge', 'Perfect for beginners', 'lunge.jpg', 5, 1);
            myDrilSergeantDB.db_insertDrill(15, 'Crunch', 'Perfect for beginners', 'crunch.jpg', 5, 1);
            myDrilSergeantDB.db_insertDrill(16, 'Push-up', 'Perfect for beginners', 'pushup.jpg', 5, 1);

            myDrilSergeantDB.db_insertBadgeDrill(13, 3, 13, false);
            myDrilSergeantDB.db_insertBadgeDrill(14, 3, 14, false);
            myDrilSergeantDB.db_insertBadgeDrill(15, 3, 15, false);
            myDrilSergeantDB.db_insertBadgeDrill(16, 3, 16, false);

            myDrilSergeantDB.db_insertDrillDetails(1, 13, 'Make your back-side your good side', 4); //1=Form, 2=benefits, 3=muscles, 4=Goal, 5= Technique, 6= Tips
            myDrilSergeantDB.db_insertDrillDetails(1, 13, 'Keep feet a shoulder width apart.', 5);
            myDrilSergeantDB.db_insertDrillDetails(2, 13, 'Bend at the knee and hip, keeping knees over toes.', 5);
            myDrilSergeantDB.db_insertDrillDetails(3, 13, 'Lower your body to a manageable depth.', 5);
            myDrilSergeantDB.db_insertDrillDetails(4, 13, 'Drive up through the heels to the starting point.', 5);
            myDrilSergeantDB.db_insertDrillDetails(5, 13, 'Stretch arms out in front for balance if needed.', 5);
            myDrilSergeantDB.db_insertDrillDetails(1, 13, 'Look straight ahead.', 6);
            myDrilSergeantDB.db_insertDrillDetails(2, 13, 'Hold your chest high.', 6);
            myDrilSergeantDB.db_insertDrillDetails(3, 13, 'Avoid squatting too deep and keep your buttocks above the knees.', 6);

            myDrilSergeantDB.db_insertDrillDetails(1, 14, 'Develop legs that look great in shorts or skirts.', 4); //1=Form, 2=benefits, 3=muscles, 4=Goal, 5= Technique, 6= Tips
            myDrilSergeantDB.db_insertDrillDetails(1, 14, 'With feet a shoulder width apart, take a long step forward.', 5);
            myDrilSergeantDB.db_insertDrillDetails(2, 14, 'Turn on your core to stabilize your body.', 5);
            myDrilSergeantDB.db_insertDrillDetails(3, 14, 'Lower your knee to within an inch off the floor.', 5);
            myDrilSergeantDB.db_insertDrillDetails(4, 14, 'Driving mainly through the front foot, return to the starting point.', 5);
            myDrilSergeantDB.db_insertDrillDetails(1, 14, 'Look straight ahead.', 6);
            myDrilSergeantDB.db_insertDrillDetails(2, 14, 'Use a bar for support if needed.', 6);

            myDrilSergeantDB.db_insertDrillDetails(1, 15, 'Trade-in the keg for a six pack.', 4); //1=Form, 2=benefits, 3=muscles, 4=Goal, 5= Technique, 6= Tips
            myDrilSergeantDB.db_insertDrillDetails(1, 15, 'Curl up and forward, lifting head, neck and shoulder blades off the floor.', 5);
            myDrilSergeantDB.db_insertDrillDetails(2, 15, 'Squeeze at the top and lower slowly.', 5);
            myDrilSergeantDB.db_insertDrillDetails(1, 15, 'Keep a gap the size of your fist between your chin and chest.', 6);
            myDrilSergeantDB.db_insertDrillDetails(2, 15, 'Initiate the movement through the mid section as you breathe out.', 6);

            myDrilSergeantDB.db_insertDrillDetails(1, 16, 'Increase your upper body strength, power and muscle tone.', 4); //1=Form, 2=benefits, 3=muscles, 4=Goal, 5= Technique, 6= Tips
            myDrilSergeantDB.db_insertDrillDetails(1, 16, 'Assume a plank position with arms extended beneath your shoulders.', 5);
            myDrilSergeantDB.db_insertDrillDetails(2, 16, 'Lower your body toward the floor and push up.', 5);
            myDrilSergeantDB.db_insertDrillDetails(1, 16, 'Keep a straight back by bracing your core.', 6);
            myDrilSergeantDB.db_insertDrillDetails(2, 16, 'Avoid locking out your elbows to maintain tension in the muscle.', 6);


            break;
        case 4:
            myDrilSergeantDB.db_insertDrill(17, 'Dumbbell chest press', '', 'DumbbellChestPress.png', 5, 1);
            myDrilSergeantDB.db_insertDrill(18, 'Barbell row', '', 'barbellrow.png', 5, 1);
            myDrilSergeantDB.db_insertDrill(19, 'Barbell squat', '', 'barbellsquat.jpg', 5, 1);
            myDrilSergeantDB.db_insertDrill(20, 'Dumbbell over head press', '', 'dumbbell-overhead-press.jpg', 5, 1);
            myDrilSergeantDB.db_insertDrill(21, 'Lying dumbbell tricep extension', '', 'lying_tricep_extension.jpg', 5, 1);
            myDrilSergeantDB.db_insertDrill(22, 'Seated dumbbell bicep curl', '', 'Seated-Dumbbell-Biceps-Curls.jpg', 5, 1);

            myDrilSergeantDB.db_insertBadgeDrill(17, 4, 17, false);
            myDrilSergeantDB.db_insertBadgeDrill(18, 4, 18, false);
            myDrilSergeantDB.db_insertBadgeDrill(19, 4, 19, false);
            myDrilSergeantDB.db_insertBadgeDrill(20, 4, 20, false);
            myDrilSergeantDB.db_insertBadgeDrill(21, 4, 21, false);
            myDrilSergeantDB.db_insertBadgeDrill(22, 4, 22, false);

            myDrilSergeantDB.db_insertDrillDetails(1, 17, 'Strengthen the chest, shoulders and triceps for powerful, healthy upper body.', 4); //1=Form, 2=benefits, 3=muscles, 4=Goal, 5= Technique, 6= Tips
            myDrilSergeantDB.db_insertDrillDetails(1, 17, 'With both dumbbels lifted directly above your shoulders, slowly lower the dumbbells.', 5);
            myDrilSergeantDB.db_insertDrillDetails(2, 17, 'Keep your elbows in line with your shoulders and your wrists in line with your elbows.', 5);
            myDrilSergeantDB.db_insertDrillDetails(3, 17, 'Drive the dumbbells back to the finish position.', 5);
            myDrilSergeantDB.db_insertDrillDetails(1, 17, 'Aim to keep your elbows above bench height when bringing the dumbbells down to the lowest point.', 6);
            myDrilSergeantDB.db_insertDrillDetails(2, 17, 'Keep your hips and shoulders on the bench atall times.', 6);

            myDrilSergeantDB.db_insertDrillDetails(1, 18, 'Build strong and sexy arms, back and core muscles.', 4); //1=Form, 2=benefits, 3=muscles, 4=Goal, 5= Technique, 6= Tips
            myDrilSergeantDB.db_insertDrillDetails(1, 18, 'Grip the bar with your hands outside of the shoulders.', 5);
            myDrilSergeantDB.db_insertDrillDetails(2, 18, 'Bending over the bar pull the bar toward your belly button.', 5);
            myDrilSergeantDB.db_insertDrillDetails(3, 18, 'Return to the start position and repeat movement.', 5);
            myDrilSergeantDB.db_insertDrillDetails(1, 18, 'Start the movement from your core instead of just pulling with your arms to engage your core.', 6);
            myDrilSergeantDB.db_insertDrillDetails(2, 18, 'For more muscle action squeeze your shoulder blades together as the bar reaches your belly button.', 6);

            myDrilSergeantDB.db_insertDrillDetails(1, 19, 'Create a strong, firm, functional lower body.', 4); //1=Form, 2=benefits, 3=muscles, 4=Goal, 5= Technique, 6= Tips
            myDrilSergeantDB.db_insertDrillDetails(1, 19, 'Brace your core. Bending at the ankle, knee and hip, slowly squat down.', 5);
            myDrilSergeantDB.db_insertDrillDetails(2, 19, 'Aim to keep your knees moving forward over your toes while your buttocks push back.', 5);
            myDrilSergeantDB.db_insertDrillDetails(3, 19, 'Keep your chest up and eye sight fixed straight ahead.', 5);
            myDrilSergeantDB.db_insertDrillDetails(4, 19, 'Lower your buttocks to just above knee height and drive up through the feet.', 5);
            myDrilSergeantDB.db_insertDrillDetails(1, 19, 'Distributr your weight evenly when squatting.', 6);
            myDrilSergeantDB.db_insertDrillDetails(2, 19, 'Always engage your core to alleviate pressure from your back.', 6);

            myDrilSergeantDB.db_insertDrillDetails(1, 20, 'Create a strong, athletic frame for your physique.', 4); //1=Form, 2=benefits, 3=muscles, 4=Goal, 5= Technique, 6= Tips
            myDrilSergeantDB.db_insertDrillDetails(1, 20, 'Bracing your core, start the movement by pressing the dumbbells up above your head.', 5);
            myDrilSergeantDB.db_insertDrillDetails(2, 20, 'Slowly return to the start position.', 5);
            myDrilSergeantDB.db_insertDrillDetails(1, 20, 'Keep your wrists stiff and in line with your elbows.', 6);
            myDrilSergeantDB.db_insertDrillDetails(2, 20, 'Switch on your core to avoid arching your back.', 6);
            myDrilSergeantDB.db_insertDrillDetails(3, 20, 'Look straight ahead.', 6);

            myDrilSergeantDB.db_insertDrillDetails(1, 21, 'Tighten and shape the back of your arms.', 4); //1=Form, 2=benefits, 3=muscles, 4=Goal, 5= Technique, 6= Tips
            myDrilSergeantDB.db_insertDrillDetails(1, 21, 'Bring the dumbbells up to the shoulders and extend the arms towards the ceiling.', 5);
            myDrilSergeantDB.db_insertDrillDetails(2, 21, 'Ensure yout upper arms remain stationary and the dumbbells don\'t travel to either side of your head.', 5);
            myDrilSergeantDB.db_insertDrillDetails(1, 21, 'Start with light weights to master the feel of the exercise.', 6);
            myDrilSergeantDB.db_insertDrillDetails(2, 21, 'Keep your wrists strong and in line with your elbows.', 6);

            myDrilSergeantDB.db_insertDrillDetails(1, 22, 'Shape and sculpt the arms.', 4); //1=Form, 2=benefits, 3=muscles, 4=Goal, 5= Technique, 6= Tips
            myDrilSergeantDB.db_insertDrillDetails(1, 22, 'With core activated, lift up both weights until they reach the peak of the curl.', 5);
            myDrilSergeantDB.db_insertDrillDetails(2, 22, 'At this point, allow them to return to the starting position and repeat.', 5);
            myDrilSergeantDB.db_insertDrillDetails(1, 22, 'Squeeze your biceps at the peak of the contraction', 6);
            myDrilSergeantDB.db_insertDrillDetails(2, 22, 'Slowly lower the weight to continue to work your muscles as they lengthen.', 6); 

            break;
        case 5:
            break;
        case 6:
            break;
        case 7:
            break;
        case 8:
            break;
        case 9:
            break;
        case 10:
            break;
        case 11:
            break;
        case 12:
            break;
        case 13:
            break;

    }
}


