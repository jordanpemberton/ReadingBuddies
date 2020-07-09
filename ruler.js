var ruler = document.querySelector("#readingRuler");

// If ruler doesn't exist:
if (!ruler) {
    // Make ruler:
    ruler = document.createElement("div");
    ruler.id = "readingRuler";
    let body = document.querySelector("body")
    body.appendChild(ruler);
}

// Set ruler properties:
if (rulerinput) {
    let active = rulerinput.active;
    let height = rulerinput.input.height;
    let hue = rulerinput.input.hue;
    let opacity = rulerinput.input.opacity;
    let black = rulerinput.input.black;
    let white = rulerinput.input.white;

    // Active/Inactive:
    if (parseInt(active) === 0) {
        ruler.classList.add("inactive");
    } else {
        ruler.classList.remove("inactive");
    }

    // Height:
    ruler.style.setProperty('--height', `${height}px`);

    // MouseMove:
    document.addEventListener('mousemove', e => {
        ruler.style.setProperty('--mouse-y', `${e.clientY-(height*0.66)}px`);
    });

    // Color:
    if (black == 1) {
        ruler.style.setProperty('--hue', '#000000');
    } else if (white == 1) {
        ruler.style.setProperty('--hue', '#FFFFFF');    
    } else {
        ruler.style.setProperty('--hue', `hsl(${hue}, 100%, 50%)`);
    }
    
    // Opacity:
    ruler.style.setProperty('--opacity', `${opacity/100}`);
}
