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

//   let freeDrawing = {
//     type: "free-drawing",
//     prompt: "hello",
//     timer: 60,
//     on_finish: function(data) {
//       let response = {
//         image: data.drawing,
//         workerId: subjCode,
//         trial_number: 10,
//         prompt: "hello"
//       };
//       // POST response data to server
//       $.ajax({
//         url: "http://" + document.domain + ":" + PORT + "/image",
//         type: "POST",
//         contentType: "application/json",
//         data: JSON.stringify(response),
//         success: function() {
//           console.log(response);
//         }
//       });
//     }
//   };

//   timeline.push(freeDrawing);

  // declare the block.
  var consent = {
    type: "html",
    url: "./consent.html",
    cont_btn: "start",
    check_fn: check_consent
  };

  // timeline.push(consent);

  let welcome_block = {
    type: "html-keyboard-response",
    choices: [32],
    stimulus: `<h1>Easy To Adapt Task</h1>
        <p class="lead">Welcome to the experiment. Thank you for participating! Press SPACE to begin.</p>`
  };

  timeline.push(welcome_block);

  let continue_space =
    "<div class='right small'>(press SPACE to continue)</div>";

  let instructions = {
    type: "instructions",
    key_forward: "space",
    key_backward: "backspace",
    pages: [
      `<p class="lead">Insert Instructions
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
      trialNum: trial_number,
      word_to_draw: trial.word_to_draw,
      expTimer: -1,
      rt: -1,
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
          
        console.log(data.responses);
        response.image = data.drawing;
        response.rt = data.rt;
        response.expTimer = data.time_elapsed / 1000;
        trial_number++;
        jsPsych.setProgressBar((trial_number - 1) / num_trials);

        // POST response data to server
        $.ajax({
          url: "http://" + document.domain + ":" + PORT + "/data",
          type: "POST",
          contentType: "application/json",
          data: JSON.stringify(response),
          success: function() {
            console.log(response);
          }
        });

        // POST response data to server
        $.ajax({
          url: "http://" + document.domain + ":" + PORT + "/image",
          type: "POST",
          contentType: "application/json",
          data: JSON.stringify(response),
          success: function() {
            console.log(response);
          }
        })
      }
    };
    timeline.push(freeDrawing);
    }

  let questionsInstructions = {
    type: "instructions",
    key_forward: "space",
    key_backward: "backspace",
    pages: [
      `<p class="lead">This is a filler for instructions for the questions.
            </p> ${continue_space}`
    ]
  };
  timeline.push(questionsInstructions);

  let demographicsQuestions = [
    {
      type: "radiogroup",
      name: "gender",
      isRequired: true,
      title: "What is your gender?",
      choices: ["Male", "Female", "Other", "Perfer not to say"]
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
      title: "What is the highest degree or level of shcool you have completed/ If currently enrolled, highest degree received.",
      choices: [
        "Less than high school",
        "High school diploma",
        "Some college, no degree",
        "associates|Associate's degree",
        "bachelors|Bachelor's degree",
        "masters|Master's degree",
        "PhD, law, or medical degree",
        "Prefer not to say"
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
      visibleIf: "{degree}='associates' or {degree}='bachelors' or {degree}='masters' or {degree}='PhD, law, or medical degree'",
      title: "What did you study in college?"
    },
    {
      type: "text",
      name: "grad",
      visibleIf: "{degree}='masters' or {degree}='PhD, law, or medical degree'",
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
                MTurk to get paid. If you have any questions or comments, please email jsulik@wisc.edu.</p>
                
                <h3>Debriefing </h3>
                <p class="lead">
                Thank you for your participation. The study is designed to collect information about the different ways 
                in which people typically represent thoughts in their mind. The responses will be used in the 
                development of a shorter questionnaire to assess differences in these representations. 
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
