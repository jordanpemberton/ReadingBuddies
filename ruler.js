// (var rulerinput already injected by BG)
console.log("Ruler input: ", rulerinput);

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
    let height = rulerinput.height;
    let hue = rulerinput.hue;
    let opacity = rulerinput.opacity;
    let bw = rulerinput.bw;

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
    // If B/W:
    if (bw != false) {
        ruler.style.setProperty('--hue', bw);
    } else {
        // Hue:
        ruler.style.setProperty('--hue', `hsl(${hue}, 100%, 50%)`);
    }

    // Opacity:
    ruler.style.setProperty('--opacity', `${opacity/100}`);
}
