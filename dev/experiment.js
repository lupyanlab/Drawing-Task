// Function Call to Run the experiment
function runExperiment(trials, subjCode, questions, workerId, assignmentId, hitId, ReadingQu) {
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
    stimulus: `<h1>Drawing</h1>
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


  window.questions = questions;    // allow surveyjs to access questions
  const IRQTrial = {
    type: 'external-html',
    url: './IRQ/IRQ.html',
    cont_btn: "IRQ-cmplt",
    execute_script: true,
    check_fn: function() {
        if(IRQIsCompleted()) {
            console.log(getIRQResponses());
            const IRQ = Object.assign({subjCode}, getIRQResponses().answers);
            // POST demographics data to server
            $.ajax({
                url: 'http://' + document.domain + ':' + PORT + '/IRQ',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(IRQ),
                success: function (data) {
                    // console.log(data);
                    // $('#surveyElement').remove();
                    // $('#surveyResult').remove();
                }
            })
            return true;
        }
        else {
            return false;
        }
    }
  };
  timeline.push(IRQTrial);

  window.questions = ReadingQu;    // allow surveyjs to access questions
  const ReadingQuTrial = {
    type: 'external-html',
    url: './ReadingQu/ReadingQu.html',
    cont_btn: "ReadingQu-cmplt",
    execute_script: true,
    check_fn: function() {
        if(ReadingQuIsCompleted()) {
            console.log(getReadingQuResponses());
            const ReadingQu = Object.assign({subjCode}, getReadingQuResponses().answers);
            // POST demographics data to server
            $.ajax({
                url: 'http://' + document.domain + ':' + PORT + '/ReadingQu',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(ReadingQu),
                success: function (data) {
                    // console.log(data);
                    // $('#surveyElement').remove();
                    // $('#surveyResult').remove();
                }
            })
            return true;
        }
        else {
            return false;
        }
    }
  };
  timeline.push(ReadingQuTrial);

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
      `<p class="lead">This is a filler for instructions for the questions.
            </p> ${continue_space}`
    ]
  };
  timeline.push(questionsInstructions);

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
