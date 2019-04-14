function qNQuestionComparator(a, b) {
  const n1 = Number(a.slice(1));
  const n2 = Number(b.slice(1));
  return n1 - n2;
}

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

  const scale = ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'];
  var IRQTrial = {
    type: 'survey-likert',
    questions: questions.map(q => ({prompt: q, labels: scale, required: true})),
    on_start: function() {
      const top = document.getElementById('jspsych-progressbar-container');
      top.scrollIntoView(true);
    },
    on_finish: function (data) {
      const responses = Object.entries(JSON.parse(data.responses)).sort(
        qNQuestionComparator
      ).map(
        ([ QN, response], i) => ({ question: questions[i], subjCode, response: scale[response] })
      );
      console.log(responses);
      $.ajax({
          url: 'http://' + document.domain + ':' + PORT + '/IRQ',
          type: 'POST',
          contentType: 'application/json',
          data: JSON.stringify({ subjCode, responses }),
      })
    }
  };
  timeline.push(IRQTrial);

  var otherQuestionsTrial = {
    type: 'survey-likert',
    questions: ReadingQu[0].map(q => ({prompt: q, labels: scale, required: true})),
    on_start: function() {
      const top = document.getElementById('jspsych-progressbar-container');
      top.scrollIntoView(true);
    },
    on_finish: function (data) {
      const responses = Object.entries(JSON.parse(data.responses)).sort(qNQuestionComparator
      ).map(([ QN, response], i) => ({ 
        question: ReadingQu[0][i], 
        response: scale[response],
        subjCode,
      }));
      console.log(responses);
      $.ajax({
          url: 'http://' + document.domain + ':' + PORT + '/ReadingQu',
          type: 'POST',
          contentType: 'application/json',
          data: JSON.stringify({ subjCode, responses, batch: 1 }),
      })
    }
  };
  timeline.push(otherQuestionsTrial);

  var readingQuestionsTrial = {
    type: 'survey-likert',
    preamble: 'Reading in my spare time is something:',
    questions: ReadingQu[1].map(q => ({prompt: q, labels: scale, required: true})),
    on_start: function() {
      const top = document.getElementById('jspsych-progressbar-container');
      top.scrollIntoView(true);
    },
    on_finish: function (data) {
      const responses = Object.entries(JSON.parse(data.responses)).sort(qNQuestionComparator
      ).map(([ QN, response], i) => ({ 
        question: ReadingQu[1][i], 
        response: scale[response],
        subjCode,
      }));
      console.log(responses);
      $.ajax({
          url: 'http://' + document.domain + ':' + PORT + '/ReadingQu',
          type: 'POST',
          contentType: 'application/json',
          data: JSON.stringify({ subjCode, responses, batch: 2 }),
      })
    }
  };
  timeline.push(readingQuestionsTrial);

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

  let demographicsTrial = {
    type: "surveyjs",
    questions: demographicsQuestions,
    on_finish: function(data) {
      const demographicsResponses = Object.entries(data.response).map(([question, response]) => ({
        subjCode, response, question,
      }));
      
      console.log(demographicsResponses);
      // POST demographics data to server
      $.ajax({
        url: "http://" + document.domain + ":" + PORT + "/demographics",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({ subjCode, responses: demographicsResponses }),
        success: function() {}
      });

      let endmessage = `
                <p class="lead">Thank you for participating! Your completion code is ${participantID}. Copy and paste this in 
                MTurk to get paid. If you have any questions or comments, please email lupyan@wisc.edu.</p>
                
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
