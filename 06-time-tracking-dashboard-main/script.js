// Time labels namespace
const Labels = {
    /*
    title: {
        current: element,
        previous: element
    }
    */
    Work: {
        current: document.querySelector('div.timecard.work h1'),
        previous: document.querySelector('div.timecard.work p')
    },
    Play: {
        current: document.querySelector('div.timecard.play h1'),
        previous: document.querySelector('div.timecard.play p')
    },
    Study: {
        current: document.querySelector('div.timecard.study h1'),
        previous: document.querySelector('div.timecard.study p')
    },
    Exercise: {
        current: document.querySelector('div.timecard.exercise h1'),
        previous: document.querySelector('div.timecard.exercise p')
    },
    Social: {
        current: document.querySelector('div.timecard.social h1'),
        previous: document.querySelector('div.timecard.social p')
    },
    "Self Care": {
        current: document.querySelector('div.timecard.self-care h1'),
        previous: document.querySelector('div.timecard.self-care p')
    }
}

// Profile information namespace
const Profile = {
    info: {
        pic: document.querySelector('div.person-info img'),
        name: document.querySelector('div.info-for h1')
    },
    timeframes: {
        daily: document.querySelector('div.frequency button.daily'),
        weekly: document.querySelector('div.frequency button.weekly'),
        monthly: document.querySelector('div.frequency button.monthly')
    }
}

let currentlyTyping = false;

// Immediately update the timeframe
function selectTimeframe(timeframe) {
    for(const time in Profile.timeframes) {
        const button = Profile.timeframes[time];
        button.classList.remove('selected');
        button.classList.add('unselected');
    }

    Profile.timeframes[timeframe].classList.remove('unselected');
    Profile.timeframes[timeframe].classList.add('selected');
    updateTimecards(timeframe);
}

// Update timecards instantly
function updateTimecards(timeframe) {
    for(const data of currentData) {
        const timeLabels = Labels[data.title];
        const current = data.timeframes[timeframe].current;
        const previous = data.timeframes[timeframe].previous;

        // Update the Text Node (NOT the innerText / innerHTML since that would impact
        // the span inside the h1 element)
        timeLabels.current.childNodes[0].nodeValue = current + 'hr' + (current == 1 ? '' : 's');
        timeLabels.previous.childNodes[0].nodeValue = 'Previous - ' + previous + 'hr' + (previous == 1 ? '' : 's');
    }
}

// Update the timeframe with typing animation
async function selectTimeframeWithTyping(timeframe) {
    if(currentlyTyping) return;
    currentlyTyping = true;

    for(const time in Profile.timeframes) {
        const button = Profile.timeframes[time];
        button.classList.remove('selected');
        button.classList.add('unselected');
    }

    Profile.timeframes[timeframe].classList.remove('unselected');
    Profile.timeframes[timeframe].classList.add('selected');
    return updateTimecardsWithTyping(timeframe);
}

// Update timecards but with the typing animation
async function updateTimecardsWithTyping(timeframe) {
    // Turn on the text cursors
    const textCursors = document.querySelectorAll('div.time span');
    textCursors.forEach(textCursor => {
        textCursor.classList.add('typing');
    });
    await delay(1000);

    // Create an array of { element, desiredText }
    let toType = [];
    for(const data of currentData) {
        const timeLabels = Labels[data.title];
        const current = data.timeframes[timeframe].current;
        const previous = data.timeframes[timeframe].previous;

        toType.push(
            { 
                element: timeLabels.current.childNodes[0], 
                desiredText: current + 'hr' + (current == 1 ? '' : 's') 
            },
            { 
                element: timeLabels.previous.childNodes[0], 
                desiredText: 'Previous - ' + previous + 'hr' + (previous == 1 ? '' : 's')
            },
        );
    }

    // Constantly increment the text of all elements until all match their desired text
    let elementsMatchDesired = false;
    while(!elementsMatchDesired) {
        elementsMatchDesired = true;
        for(const entry of toType) {
            elementsMatchDesired = incrementText(entry.element, entry.desiredText) 
                && elementsMatchDesired;
        }
        await delay(100);
    }

    // Turn off the text cursors
    await delay(1000);
    textCursors.forEach(textCursor => {
        textCursor.classList.remove('typing');
    });
    currentlyTyping = false;
}

// removes/adds one character to the element's inner text to get closer to the
// desired text
// returns true if the element's current text matches the desired text, false otherwise
function incrementText(textNode, desiredText) {
    const length = textNode.nodeValue.length;
    const desiredLength = desiredText.length;

    if(desiredLength < length) {
        // remove one character from the inner text
        textNode.nodeValue = textNode.nodeValue.substring(0, length - 1);
        return textNode.nodeValue == desiredText;
    } 

    if(desiredLength >= length && desiredLength > 0) {
        // Remove one character from the inner text if any character before the
        // length of the current string is different
        for(let i = 0; i < length; i++) {
            if(desiredText[i] != textNode.nodeValue[i]) {
                textNode.nodeValue = textNode.nodeValue.substring(0, length - 1);
                return false;
            }
        }
    } 

    if(desiredLength > length) {
        const nextChar = desiredText[length];
        textNode.nodeValue += nextChar;
    }

    return textNode.nodeValue == desiredText;
}

// Delay utility function that can be awaited for
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

for(const timeframe in Profile.timeframes) {
    const button = Profile.timeframes[timeframe];
    button.addEventListener('click', async () => {
        // selectTimeframe(timeframe);
        console.log('typing');
        await selectTimeframeWithTyping(timeframe);
    });
}

(async() => {
    // Retrieve the local JSON file
    const data = await fetch('data.json');
    currentData = await data.json();
    console.log(currentData);

    selectTimeframe('daily');
})();