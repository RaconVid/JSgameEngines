"use strict";

let Sounds=(function() {
    // The sound argument to each function should be an HTMLAudioElement
    // object (e.g. returned by Audio).

    function play(sound) {
	if (sound.ended) {
	    // The sound has already been played, which means that we
	    // can definitely play it.
	    sound.play();
	} else {
	    myAudioElement.addEventListener("canplaythrough", event => {
		myAudioElement.play();
	    });
	}
    }

    function pause(sound) {
	sound.pause();
    }

    function rewind(sound) {
	// Rewind to the beginning.
	sound.load();
    }
    
    function start(sound) {
	rewind(sound);
	play(sound);
    }

    function stop(sound) {
	pause(sound);
	rewind(sound);
    }
    
    return { play, pause, rewind, start };
})();
