class SingleNotes {
    __time;
    __singleNotes;

    constructor(time=1, singleNotes=[null, null, null, null, null, null]) {
        this.time = time;
        this.singleNotes = singleNotes;
    }

    get isEmpty() {
        for (let i = 0; i < this.singleNotes.length; i++) {
            if (this.singleNotes[i] != null) {
                return false;
            }
        }
        return true;
    }

    get time() {
        return this.__time;
    }

    set time(time) {
        this.__time = time;
    }

    get singleNotes() {
        return this.__singleNotes;
    }

    set singleNotes(singleNotes) {
        this.__singleNotes = [];
        for (let i = 0; i < singleNotes.length; i++) {
            this.__singleNotes[i] = singleNotes[i];
        }
    }

    // Действа като changeNote
    addNote(string, note) {
        this.singleNotes[string] = note;
    }

    removeNote(string) {
        this.singleNotes[string] = null; 
    }

    timePlus() {
        if (this.time < 8) {
            this.time *= 2;
        }
    }

    timeMinus() {
        if (this.time > 1) {
            this.time /= 2;
        }
    }

    json() {
        return JSON.stringify([{__time: this.time, __singleNotes: this.singleNotes}]);
    }

    static fromJSON(json) {
        return new SingleNotes(json['__time'], json['__singleNotes']);
    }
}

class Frame {
    __notes;

    constructor(notes = [new SingleNotes()]) {
        this.notes = notes;
    }

    get notes() {
        return this.__notes;
    }

    set notes(notes) {
        this.__notes = [];
        for (let i = 0; i < notes.length; i++) {
            this.notes[i] = notes[i]; 
        }
    }

    get time() {
        var sumTime = 0;
        for (let i = 0; i < this.notes.length; i++) {
            sumTime += this.notes[i].time;
        }
        return sumTime;
    }

    get isEmpty() {
        return (this.notes.length == 0) || (this.notes.length == 1 && this.notes[0].isEmpty);
    }

    // Действа като changeNote
    addNote(index, string, note, time = 1) {
        if (index < this.notes.length) {
            this.notes[index].addNote(string, note);
        } else if (this.time + time <= MAX_TIME) {
            index = this.notes.length;
            this.notes[index] = new SingleNotes(time);
            this.notes[index].addNote(string, note);
        }
    }

    addEmptyNotes() {
        if (this.time != MAX_TIME) {
            this.notes[this.notes.length] = new SingleNotes(1);
        }
    }

    changeTime(index, op) {
        if (index < this.notes.length) {
            if (op == '+' && (this.time + this.notes[index].time) <= MAX_TIME ) {
                this.notes[index].timePlus();
            } else if (op == '-') {
                this.notes[index].timeMinus();
            }
        }
    }

    removeNote(index, string) {
        if (index < this.notes.length) {
            if (this.notes[index].isEmpty && this.notes.length > 1) {
                this.notes = this.notes.slice(0, index).concat(this.notes.slice(index+1, this.notes.length));
            } else {
                this.notes[index].removeNote(string); 
            }
        }
    }

    json() {
        return JSON.stringify({__notes: this.notes});
    }

    static fromJSON(json) {
        var __notes = json['__notes'];
        var notes = [];
        for (let i = 0; i < __notes.length; i++) {
            notes[i] = SingleNotes.fromJSON(__notes[i]);
        }
        return new Frame(notes);
    }
}

class Tab {
    __frames;

    constructor(frames = []) {
        this.frames = frames;
    }

    get frames() {
        return this.__frames;
    }

    set frames(frames) {
        this.__frames = [];
        for (let i = 0; i < frames.length; i++) {
            this.__frames[i] = frames[i];
        }
    }

    get time() {
        var sumTime = 0;
        for (let i = 0; i < this.frames.length; i++) {
            sumTime += this.frames[i].time;
        }
        return sumTime;
    }

    addFrame() {
        var index = this.frames.length;
        this.frames[index] = new Frame();
    }

    addNote(frameIndex, index, string, note, time=1) {
        if (frameIndex < this.frames.length) {
            this.frames[frameIndex].addNote(index, string, note, time);
        }
    }

    getNote(frameIndex, index, string) {
        return this.frames[frameIndex].notes[index].singleNotes[string];
    }

    removeNote(frameIndex, index, string) {
        if (frameIndex < this.frames.length) {
            let frame = this.frames[frameIndex];
            if (frame.isEmpty && this.frames.length > 1) {
                this.frames = this.frames.slice(0, frameIndex).concat(this.frames.slice(frameIndex+1, this.frames.length));
            } else {
                this.frames[frameIndex].removeNote(index, string);
            }
        }
    }

    changeTime(frameIndex, index, op) {
        if (frameIndex < this.frames.length) {
            this.frames[frameIndex].changeTime(index, op);
        }
    }

    json() {
        return JSON.stringify({__frames: this.frames});
    }

    static fromJSON(json) {
        var __frames = json['__frames'];
        var frames = [];
        for (let i = 0; i < __frames.length; i++) {
            frames[i] = Frame.fromJSON(__frames[i]);
        }
        return new Tab(frames);
    }
}

function f(time) {
    switch(time) {
        case 8:
            return 1;
        case 4:
            return 2;
        case 2:
            return 4;
        case 1:
            return 8;
    }
}

// 0.25;
