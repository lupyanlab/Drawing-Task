// Function Call to Run the experiment
function runExperiment(trials, subjCode, questions, workerId, assignmentId, hitId) {
  let timeline = [];

  // Data that is collected for jsPsych
  let turkInfo = jsPsych.turk.turkInfo();
  let participantID = makeid() + "iTi" + makeid();

  jsPsych.data.addProperties({
    subject: participantID,
    activeID: participantID,
    condition: "explicit",
    group: "shuffled",
    workerId: workerId,
    assginementId: assignmentId,
    hitId: hitId
  });

  // sample function that might be used to check if a subject has given
  // consent to participate.
  var check_consent = function(elem) {
    if ($("#consent_checkbox").is(":checked")) {
      return true;
    } 
    else {
      alert(
        "If you wish to participate, you must check the box next to the statement 'I agree to participate in this study.'"
      );
      return false;
    }
    return false;
  };

  // declare the block.
  var consent = {
    type: "external-html",
    url: "./consent.html",
    cont_btn: "start",
    check_fn: check_consent
  };

  timeline.push(consent);

  let welcome_block = {
    type: "html-keyboard-response",
    choices: [32],
    stimulus: `<h1>Thank you for accepting the HIT!</h1>
        <p class="lead">The next screen will show you the instructions. Press SPACE to begin.</p>`
  };

  timeline.push(welcome_block);

  let continue_space =
    "<div class='right small'>(press SPACE to continue)</div>";

  let instructions = {
    type: "instructions",
    key_forward: "space",
    key_backward: "backspace",
    pages: [
      `<p class="lead">In this HIT you will be asked to draw some creatures. 
      Some of them correspond to real animals (like a rabbit). Most, however, are imaginary. 
      For example, you might be asked to draw a "sask". Sound out the word and use your imagination 
      about what a creature with this name would look like. You will have 60 seconds from the time you begin drawing
      to complete each drawing. 
            </p> ${continue_space}`
    ]
  };

  timeline.push(instructions);

  let trial_number = 1;
  let num_trials = trials.length;
  document.trials = trials;

  // Pushes each audio trial to timeline
  for (let trial of trials) {
    // Empty Response Data to be sent to be collected
    let response = {
      workerId: subjCode,
      trial_number: trial_number,
      word_to_draw: trial.word_to_draw,
      expTimer: -1,
      total_time_elapsed: -1,
      drawing_time: -1,
      file: trial.file,
      prefix: trial.prefix,
      sufix: trial.suffix
    };

    let freeDrawing = {
      type: "free-drawing",
      prompt: trial.word_to_draw,
      prefix: trial.prefix,
      suffix: trial.suffix,
      timer: 60,
      on_finish: function(data) {
          
        console.log(data);
        response.total_time_elapsed = data.time_elapsed/1000;
        response.drawing_time = data.drawing_time;
        response.expTimer = data.time_elapsed / 1000;
        console.log(response);

        // POST response data to server
        $.ajax({
          url: "http://" + document.domain + ":" + PORT + "/data",
          type: "POST",
          contentType: "application/json",
          data: JSON.stringify(response),
          success: function(data) {
            console.log(data);
          }
        });

        // POST response data to server
        $.ajax({
          url: "http://" + document.domain + ":" + PORT + "/image",
          type: "POST",
          contentType: "application/json",
          data: JSON.stringify({drawing: data.drawing, workerId: subjCode, word_to_draw: trial.word_to_draw, trial_number}),
          success: function(data) {
            console.log(data);
          }
        })
        trial_number++;
        jsPsych.setProgressBar((trial_number - 1) / num_trials);
      }
    };
    timeline.push(freeDrawing);
    }

  let questionsInstructions = {
    type: "instructions",
    key_forward: "space",
    key_backward: "backspace",
    pages: [
      `<p class="lead">Thanks! We'll now ask you some demographic questions and we'll be all done!
            </p> ${continue_space}`
    ]
  };
  timeline.push(questionsInstructions);

  let demographicsQuestions = [

    {
      type: "radiogroup",
      name: "drawing_implement",
      isRequired: true,
      title: "What did you use to draw?",
      choices: ["Mouse", "Laptop trackpad", "Stylus", "Finger"]
    },


    {
      type: "radiogroup",
      name: "artclass",
      isRequired: true,
      title: "Have you taken any drawing classes?",
      choices: ["Yes", "No"]
    },

    {
      type: "radiogroup",
      name: "artskill",
      isRequired: true,
      title: "Would you consider yourself skilled at drawing?",
      choices: ["1-Not at all", "2-Slightly", "3-Moderately skilled", "4-Highly skilled"]
    },


    {
      type: "radiogroup",
      name: "gender",
      isRequired: true,
      title: "What is your gender?",
      choices: ["Male", "Female", "Other", "Prefer not to say"]
    },

    {
      type: "radiogroup",
      name: "native",
      isRequired: true,
      title: "Are you a native English speaker",
      choices: ["Yes", "No"]
    },
    {
      type: "text",
      name: "native language",
      visibleIf: "{native}='No'",
      title: "Please indicate your native language or languages:"
    },

    {
      type: "text",
      name: "languages",
      title: "What other languages do you speak?"
    },

    { type: "text", name: "age", title: "What is your age?", width: "auto" },

    {
      type: "radiogroup",
      name: "degree",
      isRequired: true,
      title: "What is the highest degree or level of school you have completed/ If currently enrolled, please indicate highest degree received.",
      choices: [
        "lt_highschool|Less than high school",
        "highSchool|High school diploma",
        "somecollege|Some college, no degree",
        "associates|Associate's degree",
        "bachelors|Bachelor's degree",
        "masters|Master's degree",
        "terminal|PhD, law, or medical degree",
        "noResp|Prefer not to say"
      ]
    },
    {
      type: "text",
      name: "favorite hs subject",
      visibleIf: "{degree}='Less than high school' or {degree}='High school diploma' or {degree}='Some college, no degree'",
      title: "What was your favorite subject in high school?"
    },
    {
      type: "text",
      name: "college",
      visibleIf: "{degree}='associates' or {degree}='bachelors' or {degree}='masters' or {degree}='terminal'",
      title: "What did you study in college?"
    },
    {
      type: "text",
      name: "grad",
      visibleIf: "{degree}='masters' or {degree}='terminal'",
      title: "What did you study in graduate school?"
    }
  ];

  let demographicsTrial = {
    type: "surveyjs",
    questions: demographicsQuestions,
    on_finish: function(data) {
      let demographicsResponses = data.response;
      console.log(demographicsResponses);
      let demographics = Object.assign({ subjCode }, demographicsResponses);
      // POST demographics data to server
      $.ajax({
        url: "http://" + document.domain + ":" + PORT + "/demographics",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(demographics),
        success: function() {}
      });

      let endmessage = `
                <p class="lead">Thank you for participating! Your completion code is ${participantID}. Copy and paste this in 
                MTurk to get paid. If you have any questions or comments, please email lupyan@wisc.edu.</p>
                
                <h3>Debriefing </h3>
                <p class="lead">
                This nonsense words that you were asked to draw contain combinations of sounds that are predicted to elicit drawings that contain certain properties such as smoothness and sharpness. By subjecting the drawings to machine-vision analysis and by having them rated by other people, we gain a better idea of how the sounds we hear as part of our language influence perceptual processing. Thanks again for participating!
		</p>
                `;
      jsPsych.endExperiment(endmessage);
    }
  };
  timeline.push(demographicsTrial);

  let images = [];
  // add scale pic paths to images that need to be loaded
  images.push("img/scale.png");
  for (let i = 1; i <= 7; i++) images.push("img/scale" + i + ".jpg");

  jsPsych.pluginAPI.preloadImages(images, function() {
    startExperiment();
  });
  document.timeline = timeline;
  function startExperiment() {
    jsPsych.init({
      default_iti: 0,
      timeline: timeline,
      fullscreen: FULLSCREEN,
      show_progress_bar: true,
      auto_update_progress_bar: false
    });
  }
}
