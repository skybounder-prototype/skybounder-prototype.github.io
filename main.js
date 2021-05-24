(function(storyContent) {
        // Create ink story from the content using inkjs
    var story = new inkjs.Story(storyContent);

    var firstMessage = true;
    var password = "sakhfg3467dalk43sbfekb;das";
    var clientIDs = [];
    var playerNum = 0;
    var totalPlayers = 0;
    var isHost = false;
    var delay = 0.0;
    var pDelay = 0.0;
    var cDelay = 0.0;
    var iDelay = 0.0;
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

            if(event.message.type == "requestParagraph" && isHost && event.message.password == password) {
                if(story.canContinue) {
                    var nextStorySegment = story.Continue();
                    for(var i = 1; i <= totalPlayers; i++) {
                        submitUpdate("receiveParagraph", nextStorySegment, i, password);
                    }
                }
            }

            else if(event.message.type == "receiveParagraph" && playerNum == event.message.index && event.message.password == password) {
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

                if(isHost) {
                    submitUpdate("requestTag", "", playerNum, password);
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

                if(isHost) {
                    submitUpdate("continueIfCan", "", playerNum, password);
                }

            }

            // HOST FUNC
            else if(event.message.type == "continueIfCan" && isHost &&
                    event.message.password == password) {

                if(story.canContinue) {
                    var nextStorySegment = story.Continue();
                    for(var i = 1; i <= totalPlayers; i++) {
                        submitUpdate("receiveParagraph", nextStorySegment, i, password);
                    }
                } else {
                    if(playerNum == totalPlayers) {
                        story.currentChoices.forEach(function(choice) {
                            submitUpdate("receiveChoice", choice.text + ":" + choice.index, totalPlayers, password);
                        });
                    } else {
                        for(var i = 1; i < totalPlayers; i++) {
                            submitUpdate("scrollToBottom", "", i, password);
                        }
                    }
                }

            }

            else if(event.message.type == "scrollToBottom" && playerNum == event.message.index && event.message.password == password) {
                scrollDown(contentBottomEdgeY());
            }

            else if(event.message.type == "requestTag" && isHost && event.message.password == password) {
                var tags = story.currentTags;
                for(var i=0; i<tags.length; i++) {
                    var tag = tags[i];
                    // Detect tags of the form "X: Y". Currently used for IMAGE and CLASS but could be
                    // customised to be used for other things too.
                    var splitTag = splitPropertyTag(tag);

                    if(splitTag.property == "IMAGE") {
                        for(var i = 1; i <= totalPlayers; i++) {
                            submitUpdate("displayImage", splitTag.val, i, password);
                        }
                    }
                }
            }

            else if(event.message.type == "displayImage" && playerNum == event.message.index &&
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

            else if(event.message.type == "receiveChoice" && playerNum == event.message.index &&
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
                    submitUpdate("selectChoice", choiceIndex, playerNum, password);
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

                    for(var i = 1; i <= totalPlayers; i++) {
                        submitUpdate("madeChoice", "", i, password);
                    }

                    submitUpdate("requestParagraph", "", event.message.index, password);
                 }

            }

            else if(event.message.type == "madeChoice" && playerNum == event.message.index &&
                    event.message.password == password) {

                firstMessage = true;
                removeAll("p.choice");
            }

            else if(event.message.type == "removeAllContent" && event.message.password == password) {

                removeAll("p");
                removeAll("p.choice");
                removeAll("img");
                removeMessageArea();

            }

            // HOST FUNC
            else if(event.message.type == "joinRequest") {

                if(clientUUID != event.message.index && // the sender is not the same as the receiver
                   !clientIDs.includes(event.message.index) && // the sender has not joined the receiver
                   password == event.message.password &&
                   isHost) { // the password is correct
                    clientIDs.push(event.message.index);
                    totalPlayers++;

                    submitUpdate("welcome", "Welcome, " + event.message.text + ".", clientUUID, password);
                    submitUpdate("joinResponse-setID", totalPlayers, event.message.index, event.message.password);
                }

            }

            // GUEST FUNC
            else if(event.message.type == "joinResponse-setID") {
                if(clientUUID == event.message.index &&
                    password == event.message.password &&
                    !isHost) { // for guest
                    totalPlayers = playerNum;
                    playerNum = event.message.text;
                    removeConnectivityInputFields();
                    displayMessage("Waiting...", "Waiting for host to begin game.");

                    removeAll('p');
                    removeAll('p.choice');

                    displayNextParagraph("Welcome, Skybounder " + playerNum + ".", false);
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
                    removeMessageArea();

                    displayNextParagraph("Welcome, Skybounder.", false);

                    totalPlayers++;
                    playerNum = totalPlayers;
                    submitUpdate("requestParagraph", "host", playerNum, password);

                    submitUpdate("removeAllContent", "", i, password);
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
