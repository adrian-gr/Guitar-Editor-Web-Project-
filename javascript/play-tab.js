var bpm = 250;

function playSingleNotes(notes) {
    for (let i = notes.singleNotes.length - 1; i >= 0; i--) {
        if (notes.singleNotes[i] != null) {
            new Audio(`../notes/${i+1}-${notes.singleNotes[i]}-${f(notes.time)}.mp3`).play();
        }
    }
}

function playFrame(frameIndex, frame, startTime) {
    let marker = document.getElementById('marker');
    for (let i = 0; i < frame.notes.length; i++) {
        setTimeout(function() {
            playSingleNotes(frame.notes[i]);
            markerUpdateTabCoordinates(frameIndex, i);
        }, startTime);
        startTime += frame.notes[i].time * bpm;
    }
}

function playTab(tab) {
    let marker = document.getElementById('marker');
    marker.style.visibility = 'visible';
    time = 0;
    for (let i = 0; i < tab.frames.length; i++) {
        playFrame(i, tab.frames[i], time);
        time += tab.frames[i].time * bpm;
    }
    setTimeout(function(){
        markerX = FRAME_PADDING;
        markerY = 0;
        updateMarker();
        document.getElementById('marker').style.visibility = 'hidden';
    }, tab.time * bpm);
}

function updateMarker() {
    let markerSVG = document.getElementById('marker');
    markerSVG.setAttribute('id', 'marker');
    markerSVG.setAttribute('x', `${markerX}`);
    markerSVG.setAttribute('y', `${markerY}`);
    markerSVG.setAttribute('width', `${15}`);
    markerSVG.setAttribute('height', `${6*15 + 5}`);
}

function markerUpdateTabCoordinates(frameIndex, index) {
    y = Math.floor(frameIndex / 4);
    markerY = y*FIVELINES_PADDING;
    markerX = 0;
    for (let i = y*4; i < frameIndex; i++) {
        markerX += FRAME_PADDING;
        markerX += TAB.frames[i].time * FRAME_PADDING;
    }
    markerX += FRAME_PADDING;
    for (let i = 0; i < index; i++) {
        markerX += TAB.frames[frameIndex].notes[i].time * FRAME_PADDING;
    }
    console.log(markerX);
    updateMarker();
}