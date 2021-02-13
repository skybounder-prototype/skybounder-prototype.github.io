let ADVENTURER = 0;
let GUARDIAN = 1;
let SCHOLAR = 2;
let HEALER = 3;
let SLAYER = 4;
let THIEF = 5;

class PlayerTypeCount {
    constructor(advPoints, guaPoints, schPoints, heaPoints, slaPoints, thiPoints) {
        this.points = [[ADVENTURER, advPoints], 
                       [GUARDIAN, guaPoints], 
                       [SCHOLAR, schPoints], 
                       [HEALER, heaPoints], 
                       [SLAYER, slaPoints], 
                       [THIEF, thiPoints]];
    }

    sortPoints() {
        this.points.sort(function(a, b) {
            return a[1] > b[1];
        });
    }

    determineRole(rolesTaken) {
        var role = -1;

        for(var i = 0; i < this.points.length; i++) {
            var entry = this.points[i];
            if(!role.includes(entry[0])) {
                role = entry[0];
                break;
            }
        }

        return role;
    }
}

(function(storyContent) {
        // Create ink story from the content using inkjs
    var story = new inkjs.Story(storyContent);
    let playerTypeCounts = [];

    story.ObserveVariable("current_player_num", (varName, newValue) => {
        setNextReader(newValue);
    });
    story.ObserveVariable("total_players", (varName, newValue) => {
        setTotalPlayers(newValue);
    });
    story.ObserveVariable("finished_setting_player_type_vals", (varName, newValue) => {
        setPlayerTypeCounts();

        for(var i = 0; i < playerTypeCounts.length; i++){
            playerTypeCounts[i].sortPoints();
        }

        var rolesTaken = [];
        for(var i = 0; i < playerTypeCounts.length; i++) {
            rolesTaken.push(playerTypeCounts.determineRole(rolesTaken));
        }

        story.variablesState["player_1_role_index"] = rolesTaken[0] + 1;
        story.variablesState["player_2_role_index"] = rolesTaken[1] + 1;
        story.variablesState["player_3_role_index"] = rolesTaken[2] + 1;
        story.variablesState["player_4_role_index"] = rolesTaken[3] + 1;
        if(totalPlayers > 4) story.variablesState["player_5_role_index"] = rolesTaken[4] + 1;
        if(totalPlayers > 5) story.variablesState["player_6_role_index"] = rolesTaken[5] + 1;

        var healerPoints = [];
        for(var i = 0; i < playerTypeCounts.length; i++) {
            healerPoints.push([i + 1, playerTypeCounts[i].points[HEALER][1]]);
        }
        healerPoints.sort(function(a, b) {
            return a[1] > b[1];
        });
        for(var i = 0; i < healerPoints.length; i++) {
            story.variablesState["spirit_rank_" + (i + 1)] = healerPoints[i][0];
        }

        var slayerPoints = [];
        for(var i = 0; i < playerTypeCounts.length; i++) {
            slayerPoints.push([i + 1, playerTypeCounts[i].points[SLAYER][1]]);
        }
        slayerPoints.sort(function(a, b) {
            return a[1] > b[1];
        });
        for(var i = 0; i < slayerPoints.length; i++) {
            story.variablesState["bloodlust_rank_" + (i + 1)] = slayerPoints[i][0];
        }

        var thiefPoints = [];
        for(var i = 0; i < playerTypeCounts.length; i++) {
            thiefPoints.push([i + 1, playerTypeCounts[i].points[THIEF][1]]);
        }
        thiefPoints.sort(function(a, b) {
            return a[1] > b[1];
        });
        for(var i = 0; i < thiefPoints.length; i++) {
            story.variablesState["agility_rank_" + (i + 1)] = thiefPoints[i][0];
        }
    });

    setPlayerTypeCounts = function() {
        playerTypeCounts.push(new PlayerTypeCount(story.variablesState["player_1_adventurer_points"],
                                                  story.variablesState["player_1_guardian_points"],
                                                  story.variablesState["player_1_scholar_points"],
                                                  story.variablesState["player_1_healer_points"],
                                                  story.variablesState["player_1_slayer_points"],
                                                  story.variablesState["player_1_thief_points"]));

        playerTypeCounts.push(new PlayerTypeCount(story.variablesState["player_2_adventurer_points"],
                                                  story.variablesState["player_2_guardian_points"],
                                                  story.variablesState["player_2_scholar_points"],
                                                  story.variablesState["player_2_healer_points"],
                                                  story.variablesState["player_2_slayer_points"],
                                                  story.variablesState["player_2_thief_points"]));

        playerTypeCounts.push(new PlayerTypeCount(story.variablesState["player_3_adventurer_points"],
                                                  story.variablesState["player_3_guardian_points"],
                                                  story.variablesState["player_3_scholar_points"],
                                                  story.variablesState["player_3_healer_points"],
                                                  story.variablesState["player_3_slayer_points"],
                                                  story.variablesState["player_3_thief_points"]));

        playerTypeCounts.push(new PlayerTypeCount(story.variablesState["player_4_adventurer_points"],
                                                  story.variablesState["player_4_guardian_points"],
                                                  story.variablesState["player_4_scholar_points"],
                                                  story.variablesState["player_4_healer_points"],
                                                  story.variablesState["player_4_slayer_points"],
                                                  story.variablesState["player_4_thief_points"]));

        if(totalPlayers > 4) {
            playerTypeCounts.push(new PlayerTypeCount(story.variablesState["player_5_adventurer_points"],
                                                  story.variablesState["player_5_guardian_points"],
                                                  story.variablesState["player_5_scholar_points"],
                                                  story.variablesState["player_5_healer_points"],
                                                  story.variablesState["player_5_slayer_points"],
                                                  story.variablesState["player_5_thief_points"]));
        }

        if(totalPlayers > 5) {
            playerTypeCounts.push(new PlayerTypeCount(story.variablesState["player_6_adventurer_points"],
                                                  story.variablesState["player_6_guardian_points"],
                                                  story.variablesState["player_6_scholar_points"],
                                                  story.variablesState["player_6_healer_points"],
                                                  story.variablesState["player_6_slayer_points"],
                                                  story.variablesState["player_6_thief_points"]));
        }
    };

    var firstMessage = true;
    var password = "sakhfg3467dalk43sbfekb;das";
    var clientIDs = [];
    var playerNum = 0;
    var characterRole = "";
    var totalPlayers = 0;
    var isHost = false;
    var delay = 0.0;
    var pDelay = 0.0;
    var cDelay = 0.0;
    var iDelay = 0.0;
    var nextReader = 1;
    var lastStoryElement;

    var outerScrollContainer = document.querySelector('.outerContainer');
    var storyContainer = document.querySelector('#story');
    var previousBottomEdge = 0;

    // start pubnub

    const messagesTop = document.getElementById('messages-top');
    const hostButton = document.getElementById('host-button');
    const joinButton = document.getElementById('join-button');
    hostButton.addEventListener('click', () => {
        isHost = true;
        setPassword(document.getElementById('password').value);
        submitUpdate("newGame", document.getElementById('name').value, clientUUID, "");
        removeConnectivityInputFields();
    });
    joinButton.addEventListener('click', () => {
        setPassword(document.getElementById('password').value);
        submitUpdate("joinRequest", document.getElementById('name').value, clientUUID, document.getElementById('password').value);
    });

    removeConnectivityInputFields = function() {
        document.getElementById('name').remove();
        document.getElementById('password').remove();
        document.getElementById('host-button').remove();
        document.getElementById('join-button').remove();
    };

    const clientUUID = PubNub.generateUUID();
    const theChannel = 'Skybounder';
    clientIDs.push(clientUUID);

    const pubnub = new PubNub({
        // replace the following with your own publish and subscribe keys
        publishKey: 'pub-c-611de3c4-f5f7-4be6-8d8d-ba0b4a2475d5',
        subscribeKey: 'sub-c-1ffd009c-3a56-11eb-ab29-9acd6868450b',
        uuid: clientUUID
    });

    pubnub.addListener({
        message: function(event) {
            
            // ANY PLAYER FUNC
            if(event.message.type == "passGameToPlayer" && 
               event.message.index == playerNum && 
               event.message.password == password) {

                submitUpdate("requestParagraph", "", playerNum, password);

            } 

            // HOST FUNC
            else if(event.message.type == "requestParagraph" && isHost &&
                    event.message.password == password) {

                lastStoryElement = story.Continue();

                submitUpdate("receiveParagraph", lastStoryElement, event.message.index, password);
            } 

            // HOST FUNC
            else if(event.message.type == "continueIfCan" && isHost &&
                    event.message.password == password) {

                if(story.canContinue)
                {
                    submitUpdate("receiveParagraph", story.Continue(), event.message.index, password);
                } else {
                    var choices = [];
                    story.currentChoices.forEach(function(choice) {
                        choices.push(choice);
                    });
                    choices.sort(function(a, b){return a.index > b.index})
                    choices.forEach(function(choice) {
                        submitUpdate("receiveChoice", choice.text + ":" + choice.index, event.message.index, password);
                    });
                }

            } 

            // ANY PLAYER FUNC
            else if(event.message.type == "receiveParagraph" && event.message.index == playerNum &&
                    event.message.password == password) {

                var paragraphIndex = 0;
                
                // Don't over-scroll past new content
                if(firstMessage)
                {
                    previousBottomEdge = contentBottomEdgeY();
                    firstMessage = false;
                }


                // Get ink to generate the next paragraph
                var paragraphText = event.message.text;

                // Any special tags included with this line
                var customClasses = [];

                submitUpdate("requestTag", "", playerNum, password);

                // Create paragraph element (initially hidden)
                var paragraphElement = document.createElement('p');
                paragraphElement.innerHTML = paragraphText;
                storyContainer.appendChild(paragraphElement);
                
                // Add any custom classes derived from ink tags
                for(var i=0; i<customClasses.length; i++)
                    paragraphElement.classList.add(customClasses[i]);

                // Fade in paragraph after a short delay
                showAfter(delay, paragraphElement);
                delay += 200.0;

                submitUpdate("continueIfCan", "", playerNum, password);

            }

            else if(event.message.type == "requestTag" && isHost && event.message.password == password) {
                var tags = story.currentTags;
                for(var i=0; i<tags.length; i++) {
                    var tag = tags[i];
                    // Detect tags of the form "X: Y". Currently used for IMAGE and CLASS but could be
                    // customised to be used for other things too.
                    var splitTag = splitPropertyTag(tag);

                    if(splitTag.property == "IMAGE") {
                        submitUpdate("displayImage", splitTag.val, playerNum, password);
                    } else if(splitTag.property == "STATS") {
                        submitUpdate("receiveParagraph", lastStoryElement, splitTag.val, password);
                    }
                }
            }

            else if(event.message.type == "displayImage" &&
                    event.message.password == password) {

                previousBottomEdge = contentBottomEdgeY();

                iDelay = 0.0;
                var img = document.createElement("img");
                img.src = event.message.text;
                storyContainer.appendChild(img);
                showAfter(delay, img);
                iDelay += 200.0;

                storyContainer.style.height = contentBottomEdgeY() + "px";

                scrollDown(contentBottomEdgeY());

            } 

            else if(event.message.type == "requestChoices" && isHost &&
                    event.message.password == password) {

                story.currentChoices.forEach(function(choice) {
                    submitUpdate("receiveChoice", choice.text + ":" + choice.index, event.message.index, password);
                });

            } 

            else if(event.message.type == "receiveChoice" && event.message.index == playerNum &&
                    event.message.password == password) {

                delay = 0.0
                // Create paragraph with anchor element
                var choiceSplit = event.message.text.split(":");
                var choiceText = choiceSplit[0];
                var choiceIndex = choiceSplit[1];
                var choiceParagraphElement = document.createElement('p');
                choiceParagraphElement.classList.add("choice");
                choiceParagraphElement.innerHTML = `<a href='#'>${choiceText}</a>`
                storyContainer.appendChild(choiceParagraphElement);

                // Fade choice in after a short delay
                showAfter(delay, choiceParagraphElement);
                delay += 200.0;

                // Click on choice
                var choiceAnchorEl = choiceParagraphElement.querySelectorAll("a")[0];

                choiceAnchorEl.addEventListener("click", function(event) {

                    event.preventDefault();

                    if(choiceText.includes("Begin")) {
                        submitUpdate("selectChoiceAndAdvance", choiceIndex, playerNum, password);
                    } else {
                        submitUpdate("selectChoice", choiceIndex, playerNum, password);
                    }
                    
                });

                storyContainer.style.height = contentBottomEdgeY()+"px";

                scrollDown(previousBottomEdge);

            }

            else if(event.message.type == "selectChoice" && isHost &&
                    event.message.password == password) {

                var choiceIndex = event.message.text;
                if(choiceIndex >= 0) {
                    // Tell the story where to go next
                    story.ChooseChoiceIndex(choiceIndex);

                    submitUpdate("madeChoice", "", event.message.index, password);
                 }

            }

            else if(event.message.type == "selectChoiceAndAdvance" && isHost &&
                    event.message.password == password) {

                var choiceIndex = event.message.text;
                if(choiceIndex >= 0) {
                    // Tell the story where to go next
                    story.ChooseChoiceIndex(choiceIndex);

                    submitUpdate("removeAllContent", "", event.message.index, password);

                    // var nextPlayer = event.message.index + 1;
                    // if(nextPlayer > totalPlayers) {
                    //     nextPlayer = 1;
                    // }

                    submitUpdate("madeChoice", "", nextReader, password);
                 }

            } 

            else if(event.message.type == "madeChoice" && event.message.index == playerNum &&
                    event.message.password == password) {

                firstMessage = true;
                removeAll("p.choice");
                submitUpdate("requestParagraph", "", event.message.index, password);

            }

            else if(event.message.type == "removeAllContent" && event.message.index == playerNum && event.message.password == password) {

                removeAll("p");
                removeAll("p.choice");
                removeAll("img");
                removeMessageArea();

            }

            else if(event.message.type == "addRefreshStoryButton" && event.message.password == password && !isHost) {
                addRefreshStoryButton();
            }

            // HOST FUNC
            else if(event.message.type == "requestStoryRefresh" && isHost && event.message.password == password && nextReader == event.message.index) {
                submitUpdate("receiveParagraph", lastStoryElement, event.message.index, password);
            }

            // HOST FUNC
            else if(event.message.type == "joinRequest") {

                if(clientUUID != event.message.index && // the sender is not the same as the receiver
                   !clientIDs.includes(event.message.index) && // the sender has not joined the receiver
                   password == event.message.password &&
                   isHost) { // the password is correct
                    totalPlayers++;
                    clientIDs.push(event.message.index);
                    submitUpdate("welcome", "Welcome " + event.message.text + ".", clientUUID, password);
                    submitUpdate("joinResponse-setID", totalPlayers, event.message.index, event.message.password);
                }

            } 

            // GUEST FUNC
            else if(event.message.type == "joinResponse-setID") {
                
                if(clientUUID == event.message.index && 
                    password == event.message.password &&
                    !isHost) { // for guest
                    playerNum = event.message.text;
                    totalPlayers = playerNum;
                    removeConnectivityInputFields();
                    displayMessage("Waiting...", "Waiting for host to begin game.");

                    setSkybounderPlayerNum();

                    removeAll('p');
                    removeAll('p.choice');

                    displayNextParagraph("You are Skybounder " + playerNum + ".", false);
                } else if(clientUUID == event.message.index && password != event.message.password && !isHost) {
                    displayMessage("Error", "Failure to join. Check password and try again.")
                }

            } 

            // GUEST AND HOST FUNC
            else if(event.message.type == "welcome" &&
                    password == event.message.password) {

                    displayMessage("", event.message.text);

            }

            // GUEST AND HOST FUNC
            else if(event.message.type == "newGame") {

                displayMessage("Game Created", "Host " + event.message.text + " started a new game.");

            }
        },
        presence: function(event) {
            // displayMessage('[PRESENCE: ' + event.action + ']', 'uuid: ' + event.uuid + ', channel: ' + event.channel);
        },
        status: function(event) {
            // displayMessage('[STATUS: ' + event.category + ']', 'connected to channels: ' + event.affectedChannels);

            // if (event.category == 'PNConnectedCategory') {
            //     submitUpdate(theEntry, clientUUID);
            // }
        }
    });

    pubnub.subscribe({
        channels: ['Skybounder'],
        withPresence: true
    });

    setPassword = function(text) {
        password = text;
    }

    submitUpdate = function(type, text, index) {
        pubnub.publish({
            channel : theChannel,
            message : {'type' : type, 'text' : text, 'index' : index, 'password' : password}
        },
        function(status, response) {
            if (status.error) {
                console.log(status)
            }
            else {
            }
        });
    };

    displayMessage = function(messageType, aMessage) {
        let pmessage = document.createElement('p');
        pmessage.setAttribute("class", "message");
        let br = document.createElement('br');

        messagesTop.after(pmessage);
        pmessage.appendChild(document.createTextNode(messageType));
        pmessage.appendChild(br);
        pmessage.appendChild(document.createTextNode(aMessage));
    };

    removeMessageArea = function() {
        [].forEach.call(document.querySelectorAll('.message'), function (el) {
            el.style.visibility = 'hidden';
        });
    };

    setNextReader = function(currentPlayerNum) {
        nextReader = currentPlayerNum - 1;

        if(nextReader == 0) {
            nextReader = totalPlayers;
        }
    };

    setTotalPlayers = function(newValue) {
        totalPlayers = newValue;
    };

    setSkybounderPlayerNum = function() {
        let header2 = document.createElement('h2');
        header2.setAttribute("class", "subtitle");
        document.getElementById('title').after(header2);
        header2.appendChild(document.createTextNode("Skybounder " + playerNum));
    }

    addRefreshStoryButton = function() {
        let newButton = document.createElement('input');
        newButton.setAttribute("id", "refresh");
        newButton.setAttribute("type", "submit");
        newButton.setAttribute("value", "Refresh Story");
        document.getElementById('button-area').after(newButton);
        newButton.addEventListener("click", () => {
            submitUpdate("requestStoryRefresh", "", playerNum, password);
        });
    }

    displayNextParagraph = function(text, shouldUpdate) {
        var paragraphIndex = 0;
                
        // Don't over-scroll past new content
        if(firstMessage)
        {
            previousBottomEdge = contentBottomEdgeY();
            firstMessage = false;
        }


        // Get ink to generate the next paragraph
        var paragraphText = text;
        var tags = story.currentTags;

        // Any special tags included with this line
        var customClasses = [];
        for(var i=0; i<tags.length; i++) {
            var tag = tags[i];
            
            // Detect tags of the form "X: Y". Currently used for IMAGE and CLASS but could be
            // customised to be used for other things too.
            var splitTag = splitPropertyTag(tag);

            if(splitTag.property == "IMAGE") {
                iDelay = 0.0;
                var img = document.createElement("img");
                img.src = splitTag.val;
                storyContainer.appendChild(img);
                showAfter(iDelay, img);
                iDelay += 200.0;
                submitUpdate("displayImage", splitTag.val, playerNum, password);
            }

            // if( splitTag.property == "ADVANCE" ) {
            //     removeAll("p");
            //     var nextPlayer = playerNum + 1;
            //     displayMessage("PLAYER", nextPlayer + "'s turn.");
            //     if(nextPlayer > totalPlayers) {
            //         nextPlayer = 1;
            //     }

            //     submitUpdate("receiveParagraphAfterAdvancing", paragraphText, nextPlayer, password);
                
            //     return;
            // }
        }

        // Create paragraph element (initially hidden)
        var paragraphElement = document.createElement('p');
        paragraphElement.innerHTML = paragraphText;
        storyContainer.appendChild(paragraphElement);
        
        // Add any custom classes derived from ink tags
        for(var i=0; i<customClasses.length; i++)
            paragraphElement.classList.add(customClasses[i]);

        // Fade in paragraph after a short delay
        showAfter(delay, paragraphElement);
        delay += 200.0;

        if(shouldUpdate) {
            submitUpdate("continueIfCan", "", playerNum, password);
        }
    }

    // end pubnub

    // Global tags - those at the top of the ink file
    // We support:
    //  # theme: dark
    //  # author: Your Name
    var globalTags = story.globalTags;
    if( globalTags ) {
        for(var i=0; i<story.globalTags.length; i++) {
            var globalTag = story.globalTags[i];
            var splitTag = splitPropertyTag(globalTag);
            
            // THEME: dark
            if( splitTag && splitTag.property == "theme" ) {
                document.body.classList.add(splitTag.val);
            }
            
            // author: Your Name
            else if( splitTag && splitTag.property == "author" ) {
                var byline = document.querySelector('.byline');
                byline.innerHTML = "by "+splitTag.val;
            }
        }
    }

    // Kick off the start of the story!
    continueStory(true);

    // Main story processing function. Each time this is called it generates
    // all the next content up as far as the next set of choices.
    function continueStory(firstTime) {
        // if(playerNum != 1) return;

        var paragraphIndex = 0;
        var delay = 0.0;
        
        // Don't over-scroll past new content
        var previousBottomEdge = firstTime ? 0 : contentBottomEdgeY();

        // Generate story text - loop through available content
        while(story.canContinue) {

            // Get ink to generate the next paragraph
            var paragraphText = story.Continue();
            var tags = story.currentTags;
            
            // Any special tags included with this line
            var customClasses = [];
            for(var i=0; i<tags.length; i++) {
                var tag = tags[i];

                // Detect tags of the form "X: Y". Currently used for IMAGE and CLASS but could be
                // customised to be used for other things too.
                var splitTag = splitPropertyTag(tag);

                // IMAGE: src
                if( splitTag && splitTag.property == "IMAGE" ) {
                    var imageElement = document.createElement('img');
                    imageElement.src = splitTag.val;
                    storyContainer.appendChild(imageElement);

                    showAfter(delay, imageElement);
                    delay += 200.0;
                }

                // CLASS: className
                else if( splitTag && splitTag.property == "CLASS" ) {
                    customClasses.push(splitTag.val);
                }

                // CLEAR - removes all existing content.
                // RESTART - clears everything and restarts the story from the beginning
                else if( tag == "CLEAR" || tag == "RESTART" ) {
                    removeAll("p");
                    removeAll("img");
                    
                    // Comment out this line if you want to leave the header visible when clearing
                    setVisible(".header", false);

                    if( tag == "RESTART" ) {
                        restart();
                        return;
                    }
                }
            }

            // Create paragraph element (initially hidden)
            var paragraphElement = document.createElement('p');
            paragraphElement.innerHTML = paragraphText;
            storyContainer.appendChild(paragraphElement);
            
            // Add any custom classes derived from ink tags
            for(var i=0; i<customClasses.length; i++)
                paragraphElement.classList.add(customClasses[i]);

            // Fade in paragraph after a short delay
            showAfter(delay, paragraphElement);
            delay += 200.0;
        }

        // Create HTML choices from ink choices
        story.currentChoices.forEach(function(choice) {


            // Create paragraph with anchor element
            var choiceParagraphElement = document.createElement('p');
            choiceParagraphElement.classList.add("choice");
            choiceParagraphElement.innerHTML = `<a href='#'>${choice.text}</a>`
            storyContainer.appendChild(choiceParagraphElement);

            // Fade choice in after a short delay
            showAfter(delay, choiceParagraphElement);
            delay += 200.0;

            // Click on choice
            var choiceAnchorEl = choiceParagraphElement.querySelectorAll("a")[0];

            choiceAnchorEl.addEventListener("click", function(event) {
                // Don't follow <a> link
                event.preventDefault();

                // Remove all existing choices
                removeAll("p.choice");

                story.ChooseChoiceIndex(choice.index); // MOVE BELOW???

                if(choice.text == "Begin Game") {
                    // Tell the story where to go next
                    totalPlayers++;
                    playerNum = totalPlayers;
                    nextReader = playerNum;
                    setSkybounderPlayerNum();
                    removeMessageArea();

                    displayNextParagraph("You are Skybounder " + playerNum + ".", false);

                    submitUpdate("requestParagraph", "host", playerNum, password);
                    submitUpdate("addRefreshStoryButton", "", "", password);
                    addRefreshStoryButton();
                    for(let i = 1; i <= totalPlayers; i++) {
                        if(i != playerNum) {
                            submitUpdate("removeAllContent", "", i, password);
                        }
                    }
                } else if(choice.text == "Host") {
                    hostButton.hidden = false;
                    document.getElementById('password').hidden = false;
                    document.getElementById('name').hidden = false;
                    continueStory(false);
                } else if(choice.text == "Join") {
                    joinButton.hidden = false;
                    document.getElementById('password').hidden = false;
                    document.getElementById('name').hidden = false;
                    continueStory(false);
                }


            });
        });

        // Extend height to fit
        // We do this manually so that removing elements and creating new ones doesn't
        // cause the height (and therefore scroll) to jump backwards temporarily.
        storyContainer.style.height = contentBottomEdgeY()+"px";

        if( !firstTime )
            scrollDown(previousBottomEdge);
    }

    function restart() {
        story.ResetState();

        setVisible(".header", true);

        continueStory(true);

        outerScrollContainer.scrollTo(0, 0);
    }

    // -----------------------------------
    // Various Helper functions
    // -----------------------------------

    // Fades in an element after a specified delay
    function showAfter(delay, el) {
        el.classList.add("hide");
        setTimeout(function() { el.classList.remove("hide") }, delay);
    }

    // Scrolls the page down, but no further than the bottom edge of what you could
    // see previously, so it doesn't go too far.
    function scrollDown(previousBottomEdge) {

        // Line up top of screen with the bottom of where the previous content ended
        var target = previousBottomEdge;
        
        // Can't go further than the very bottom of the page
        var limit = outerScrollContainer.scrollHeight - outerScrollContainer.clientHeight;
        if( target > limit ) target = limit;

        var start = outerScrollContainer.scrollTop;

        var dist = target - start;
        var duration = 300 + 300*dist/100;
        var startTime = null;
        function step(time) {
            if( startTime == null ) startTime = time;
            var t = (time-startTime) / duration;
            var lerp = 3*t*t - 2*t*t*t; // ease in/out
            outerScrollContainer.scrollTo(0, (1.0-lerp)*start + lerp*target);
            if( t < 1 ) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    }

    // The Y coordinate of the bottom end of all the story content, used
    // for growing the container, and deciding how far to scroll.
    function contentBottomEdgeY() {
        var bottomElement = storyContainer.lastElementChild;
        return bottomElement ? bottomElement.offsetTop + bottomElement.offsetHeight : 0;
    }

    // Remove all elements that match the given selector. Used for removing choices after
    // you've picked one, as well as for the CLEAR and RESTART tags.
    function removeAll(selector)
    {
        var allElements = storyContainer.querySelectorAll(selector);
        for(var i=0; i<allElements.length; i++) {
            var el = allElements[i];
            el.parentNode.removeChild(el);
        }
    }

    // Used for hiding and showing the header when you CLEAR or RESTART the story respectively.
    function setVisible(selector, visible)
    {
        var allElements = storyContainer.querySelectorAll(selector);
        for(var i=0; i<allElements.length; i++) {
            var el = allElements[i];
            if( !visible )
                el.classList.add("invisible");
            else
                el.classList.remove("invisible");
        }
    }

    // Helper for parsing out tags of the form:
    //  # PROPERTY: value
    // e.g. IMAGE: source path
    function splitPropertyTag(tag) {
        var propertySplitIdx = tag.indexOf(":");
        if( propertySplitIdx != null ) {
            var property = tag.substr(0, propertySplitIdx).trim();
            var val = tag.substr(propertySplitIdx+1).trim(); 
            return {
                property: property,
                val: val
            };
        }

        return null;
    }

})(storyContent);