var TAB;
var title;
fetch('../php/titleAndTab.php')
.then(response => response.json())
.then(response => {
    title = response['title'];
    document.title = response['title'] + " | Guitar Editor";
    document.getElementById('title').innerText = response['title'];
    TAB = Tab.fromJSON(JSON.parse(response['tab']));
    vizualize(TAB);
});

const _SVG = document.querySelector('svg');

const MAX_TIME = 8;
const FRAME_PADDING = 32;
const FIVELINES_PADDING = 130;
const OFFSET = 10;

function boxClickHandler(event) {
    var activeBox = document.querySelector('svg .notes .active');
    if (activeBox) {
        activeBox.removeAttribute('class')
    }
    event.target.setAttribute('class', 'active');
}

var lastInteraction = Date.now();
function pressKeyHandler(event) {
    function reset(idRect) {
        vizualize(TAB);
        activeBox = document.getElementById(idRect);
        if (activeBox) {
            activeBox.setAttribute('class', 'active');
        }
    }

    function changeNote(g, note) {
        let rect = g.children[1];
        let idRect = rect.getAttribute('id')
        let id = idRect.split('-');
        let frameIndex = parseInt(id[0]);
        let index = parseInt(id[1]);
        let string = parseInt(id[2]);
        let curNote = TAB.getNote(frameIndex, index, string);
        if ((curInteraction - lastInteraction <= 1000) && 1 <= curNote && curNote <= 9) {
            if (curNote + note <= 24) {
                TAB.addNote(frameIndex, index, string, curNote + note);
            } else {
                TAB.addNote(frameIndex, index, string, note);    
            }
        } else {
            TAB.addNote(frameIndex, index, string, note);
        }

        lastInteraction = curInteraction;
        reset(idRect);
        playSingleNotes(TAB.frames[frameIndex].notes[index]);
    }

    function changeTime(g, op) {
        let rect = g.children[1];
        let idRect = rect.getAttribute('id')
        let id = idRect.split('-');
        let frameIndex = parseInt(id[0]);
        let index = parseInt(id[1]);
        TAB.changeTime(frameIndex, index, op);
        reset(idRect);
    }

    function removeNote(g) {
        let rect = g.children[1];
        let idRect = rect.getAttribute('id')
        let id = idRect.split('-');
        let frameIndex = parseInt(id[0]);
        let index = parseInt(id[1]);
        let string = parseInt(id[2]);
        TAB.removeNote(frameIndex, index, string);
        if (frameIndex >= TAB.frames.length) {
            frameIndex = TAB.frames.length - 1;
            index = TAB.frames[frameIndex].notes.length - 1;
        } else if (index == TAB.frames[frameIndex].notes.length) {
            index--;
        }
        reset(`${frameIndex}-${index}-${string}`);
    }

    function move(g, op) {
        function changeActiveBox(frameIndex, index, string) {
            var activeBox = document.querySelector('svg .notes .active');
            if (activeBox) {
                activeBox.removeAttribute('class')
            }
            document.getElementById(`${frameIndex}-${index}-${string}`).setAttribute('class', 'active');
        }

        let rect = g.children[1];
        let idRect = rect.getAttribute('id')
        let id = idRect.split('-');
        let frameIndex = parseInt(id[0]);
        let index = parseInt(id[1]);
        let string = parseInt(id[2]);
        if (op == 'ArrowUp') {
            string = (string-1)>=0 ? (string-1) : 5;
        } else if (op == 'ArrowDown') {
            string = (string+1)<=5 ? (string+1) : 0;
        } else if (op == 'ArrowRight') {
            let frame = TAB.frames[frameIndex];
            // Ако сме в края на фрейма
            if (index == frame.notes.length - 1) {
                // Ако фреймът е пълен или последните ноти са празни
                if (frame.time == MAX_TIME || frame.notes[index].isEmpty) {
                    if (frameIndex == TAB.frames.length - 1) {
                        TAB.addFrame();
                    }
                    frameIndex++;
                    index = 0;
                } else {
                    TAB.frames[frameIndex].addEmptyNotes();
                    index++;
                }
            } else {
                index++;
            }
        } else {
            if (index == 0 && frameIndex != 0) {
                frameIndex--;
                index = TAB.frames[frameIndex].notes.length - 1;
            } else if (index != 0) {
                index--;
            }
            
        }
        reset(`${frameIndex}-${index}-${string}`);
    }

    var curInteraction = Date.now();
    let activeBox = document.querySelector('svg .notes .active');
    if (activeBox) {
        let g = activeBox.parentElement;
        if (parseInt(event.key) >= 0 && parseInt(event.key) <= 9) {
            changeNote(g, event.key);
            saveBtn.style.background = 'rgba(122, 207, 72, 0.5)';
        } else if (event.key == '+' || event.key == '-') {
            changeTime(g, event.key);
            saveBtn.style.background = 'rgba(122, 207, 72, 0.5)';
        } else if (event.key == 'd') {
            removeNote(g);
            saveBtn.style.background = 'rgba(122, 207, 72, 0.5)';
        } else if (event.key == 'ArrowUp' || event.key == 'ArrowDown' || event.key == 'ArrowRight' || event.key == 'ArrowLeft') {
            event.preventDefault();
            move(g, event.key);
        }
        
    }
}

document.addEventListener("keydown", pressKeyHandler, true);

document.addEventListener('click', event => {
    var activeBox = document.querySelector('.active');
    if (event.target != activeBox) {
        if (activeBox) {
            activeBox.removeAttribute('class');
        }
    }
});

var play = true;
playPauseBtn = document.getElementById('play-pause');
playPauseBtn.addEventListener('click', event => {
    if (play) {
        playTab(TAB);
        play = false;
        setTimeout(function() {
            play = true;
        }, TAB.time * bpm);
    }
});

saveBtn = document.getElementById('save');
saveBtn.addEventListener('click', event => {
    fetch('../php/saveTab.php', {
        method: 'POST',
        body: JSON.stringify({tab: TAB.json()}),
    })
    .then(response => response.json())
    .then(response => console.log(response))
    event.target.style.background = 'rgba(255,0,0,0)';
})


exportBtn = document.getElementById('export');
exportBtn.addEventListener('click', event => {
    // https://ourcodeworld.com/articles/read/189/how-to-create-a-file-and-generate-a-download-with-javascript-in-the-browser-without-a-server
    function download(filename, text) {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }

    var txtFile = `${title}.json`;
    var str = TAB.json();
    download(txtFile, str);
});

importBtn = document.getElementById('import');
importBtn.addEventListener('click', event => {
    var input = document.createElement('input');
    input.type = 'file';

    input.onchange = e => {
        var file = e.target.files[0]; 
        var reader = new FileReader();
        reader.readAsText(file,'UTF-8');
        reader.onload = readerEvent => {
            var json = readerEvent.target.result;
            TAB = Tab.fromJSON(JSON.parse(json));
            vizualize(TAB);
            saveBtn.style.background = 'rgba(122, 207, 72, 0.5)';
        }
    }

    input.click();
});

function fiveLinesSVG(tab) {
    var y = -1;
    var lines = ['', '', '', '', '', ''];
    var frameLines = '';

    for (let i = 0; i < tab.frames.length; i++) {
        if (i % 4 == 0) {
            y++;
            var start = [0, 0, 0, 0, 0, 0];
            var end = [0, 0, 0, 0, 0, 0];
            frameLines += ` M${start[0]} ${y*FIVELINES_PADDING + OFFSET} L${start[0]} ${y*FIVELINES_PADDING + 75 + OFFSET}`;
            _SVG.setAttribute('height', parseInt(_SVG.getAttribute('height')) + FIVELINES_PADDING);
        }
        for (let s = 0; s < lines.length; s++) {
            end[s] += FRAME_PADDING;
            lines[s] += ` M${start[s]} ${s*15 + y*FIVELINES_PADDING + OFFSET} L${end[s]} ${s*15 + y*FIVELINES_PADDING + OFFSET}`;
            start[s] = end[s];
        }
        let frameNotes = tab.frames[i].notes;
        for (let j = 0; j < frameNotes.length; j++) {
            let time = frameNotes[j].time;
            let singleNotes = frameNotes[j].singleNotes;
            for (let s = 0; s < singleNotes.length; s++) {
                if (singleNotes[s] != null) {
                    if (parseInt(singleNotes[s]) >= 10) {
                        lines[s] += ` M${start[s]} ${s*15 + y*FIVELINES_PADDING + OFFSET} L${end[s]} ${s*15 + y*FIVELINES_PADDING + OFFSET}`;
                        start[s] = end[s] + 15;
                    } else {
                        lines[s] += ` M${start[s]} ${s*15 + y*FIVELINES_PADDING + OFFSET} L${end[s]+3} ${s*15 + y*FIVELINES_PADDING + OFFSET}`;
                        start[s] = end[s] + 12;
                    }
                    end[s] += time * FRAME_PADDING;
                } else {
                    end[s] += time * FRAME_PADDING;
                }
            }
        }

        for (let s = 0; s < lines.length; s++) {
            lines[s] += ` M${start[s]} ${s*15 + y*FIVELINES_PADDING + OFFSET} L${end[s]} ${s*15 + y*FIVELINES_PADDING    + OFFSET}`;
            start[s] = end[s];
        }
        
        frameLines += ` M${start[0]} ${y*FIVELINES_PADDING + OFFSET} L${start[0]} ${y*FIVELINES_PADDING + 75 + OFFSET}`;
    }

    var d = '';
    for (let s = 0; s < lines.length; s++) {
        d += ` ${lines[s]}`;
    }
    d += ` ${frameLines}`;

    var fiveLinesPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    fiveLinesPath.setAttribute('class', 'lines');
    fiveLinesPath.setAttribute('stroke', 'gray');
    fiveLinesPath.setAttribute('d', `${d}`);
    return fiveLinesPath;
}

function notesSVG(tab) {
    let notesSVG = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    notesSVG.setAttribute('class', 'notes');
    let y = -1;
    for (let i = 0; i < tab.frames.length; i++) {
        if (i % 4 == 0) {
            var x = FRAME_PADDING;
            y++;
        }
        let frameNotes = tab.frames[i].notes;
        for (let j = 0; j < frameNotes.length; j++) {
            let time = frameNotes[j].time;
            let singleNotes = frameNotes[j].singleNotes;
            for (let s = 0; s < singleNotes.length; s++) {
                let note = singleNotes[s];
                let g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
                let noteSVG = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                if (note == null || parseInt(note) >= 10) {
                    noteSVG.setAttribute('x', `${x}`);
                } else {
                    noteSVG.setAttribute('x', `${x+4}`);
                }

                noteSVG.setAttribute('y', `${s*15 + y*FIVELINES_PADDING + 5 + OFFSET}`);
                noteSVG.innerHTML = note;

                let boxSVG = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                boxSVG.setAttribute('x', `${x}`);
                boxSVG.setAttribute('y', `${s*15 + y*FIVELINES_PADDING + OFFSET - 7}`);
                boxSVG.setAttribute('height', '15');
                boxSVG.setAttribute('width', '15');
                boxSVG.setAttribute('id', `${i}-${j}-${s}`);
                boxSVG.onclick = boxClickHandler;

                g.appendChild(noteSVG);
                g.appendChild(boxSVG);

                notesSVG.appendChild(g);
            }
            x += time * FRAME_PADDING;
        }
        x += FRAME_PADDING;
    }

    return notesSVG;
}

function periodsSVG(tab) {
    path = '';
    let y = -1;
    for (let i = 0; i < tab.frames.length; i++) {
        if (i % 4 == 0) {
            var x = FRAME_PADDING;
            y++;
        }
        let frameNotes = tab.frames[i].notes;
        for (let j = 0; j < frameNotes.length; j++) {
            let time = frameNotes[j].time;
            let y1 = 90 + y*FIVELINES_PADDING + OFFSET/2
            path += ` M${x+7} ${y1+5} L${x+7} ${y1+5+time*3}`
            x += time * FRAME_PADDING; 
        }
        x += FRAME_PADDING;
    }
    let periodsSVG = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    periodsSVG.setAttribute('d', `${path}`);
    periodsSVG.setAttribute('stroke', 'lightgray');
    periodsSVG.setAttribute('stroke-width', '3');
    return periodsSVG;
}

var markerX = FRAME_PADDING;
var markerY = 0;

function markerSVG() {
    var markerSVG = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    markerSVG.setAttribute('id', 'marker');
    markerSVG.setAttribute('x', `${markerX}`);
    markerSVG.setAttribute('y', `${markerY}`);
    markerSVG.setAttribute('width', `${markerX+15}`);
    markerSVG.setAttribute('height', `${markerY + 6*15 + 5}`);
    markerSVG.style.visibility = 'hidden';
    return markerSVG;
}


function vizualize(tab) {
    _SVG.innerHTML = '';
    _SVG.setAttribute('height', '0');
    _markerSVG = markerSVG();
    _SVG.appendChild(_markerSVG);
    var _fiveLinesSVG = fiveLinesSVG(tab);
    _SVG.appendChild(_fiveLinesSVG);
    var _notesSVG = notesSVG(tab);
    _SVG.appendChild(_notesSVG);
    var _periodsSVG = periodsSVG(tab);
    _SVG.appendChild(_periodsSVG);
}



