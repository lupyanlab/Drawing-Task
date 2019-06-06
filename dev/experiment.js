function qNQuestionComparator(a, b) {
  const n1 = Number(a[0].slice(1));
  const n2 = Number(b[0].slice(1));
  return n1 - n2;
}

function disableScrollOnSpacebarPress () {
  window.onkeydown = function(e) {
    if (e.keyCode == 32 && e.target == document.body) {
      e.preventDefault();
    }
  };
}

// Function Call to Run the experiment
// function runExperiment(trials, subjCode, questions, workerId, assignmentId, hitId, ReadingQu) {
function runExperiment(trials, subjCode, questions, workerId, assignmentId, hitId) {
  disableScrollOnSpacebarPress();
  let timeline = [];
  let continue_space =
    "<div class='right small'>(press SPACE to continue)</div>";

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

   // let IRQinstructions = {
     // type: "instructions",
      //key_forward: "space",
     // key_backward: "backspace",
    //  pages: [
   //     `<p class="lead">
  //The first part of the HIT will show you about 40 statements describing different ways of thinking.<br>
  //Please indicate your agreement/disagreement with each.<br>
  //Please think carefully about each item. If you answer carelessly, your payment may be denied.
      //        </p> ${continue_space}`
     // ]
    //};

    //timeline.push(IRQinstructions);

    //const scale = ['Strongly disagree', 'Somewhat disagree', 'Neither agree nor disagree', 'Somewhat agree', 'Strongly agree'];
    //var IRQTrial = {
      //type: 'survey-likert',
      //questions: questions.map(q => ({prompt: q, labels: scale, required: true})),
      //on_start: function() {
        //const top = document.getElementById('jspsych-progressbar-container');
       // top.scrollIntoView(true);
      //},
      //on_finish: function (data) {
        //const responses = Object.entries(JSON.parse(data.responses)).sort(
          //qNQuestionComparator
       // ).map(
          //([ QN, response], i) => ({ question: questions[i], subjCode, response: scale[response] })
        //);
        //console.log(responses);
        //$.ajax({
            //url: 'http://' + document.domain + ':' + PORT + '/IRQ',
            //type: 'POST',
            //contentType: 'application/json',
            //data: JSON.stringify({ subjCode, responses }),
       // })
     // }
    //};
   // timeline.push(IRQTrial);

   // let firstReadingQuestionsBatchinstructions = {
     // type: "instructions",
      //key_forward: "space",
      //key_backward: "backspace",
      //pages: [
        //`<p class="lead">This next part involves some statements about reading habits. Please indicate your level of agreement/disagreement with each.
           //   </p> ${continue_space}`
      //]
   // };

    //timeline.push(firstReadingQuestionsBatchinstructions);

   // var firstReadingQuestionsBatchTrial = {
      //type: 'survey-likert',
      //questions: ReadingQu[0].map(q => ({prompt: q, labels: scale, required: true})),
      //on_start: function() {
        //const top = document.getElementById('jspsych-progressbar-container');
        //top.scrollIntoView(true);
     // },
      //on_finish: function (data) {
        //const responses = Object.entries(JSON.parse(data.responses)).sort(qNQuestionComparator
        //).map(([ QN, response], i) => ({ 
          //question: ReadingQu[0][i], 
          //response: scale[response],
          //subjCode,
        //}));
        //console.log(responses);
        //$.ajax({
           // url: 'http://' + document.domain + ':' + PORT + '/ReadingQu',
            //type: 'POST',
            //contentType: 'application/json',
            //data: JSON.stringify({ subjCode, responses, batch: 1 }),
       // })
     // }
    //};
    //timeline.push(firstReadingQuestionsBatchTrial);

  // let secondReadingQuestionsBatchinstructions = {
  //   type: "instructions",
  //   key_forward: "space",
  //   key_backward: "backspace",
  //   pages: [
  //     `<p class="lead">
  //           </p> ${continue_space}`
  //   ]
  // };


//  var secondReadingQuestionsBatchTrial = {
//    type: 'survey-likert',
 //   preamble: 'Reading in my spare time is something:',
  //  questions: ReadingQu[1].map(q => ({prompt: q, labels: scale, required: true})),
   // on_start: function() {
     // const top = document.getElementById('jspsych-progressbar-container');
      //top.scrollIntoView(true);
    //},
    //on_finish: function (data) {
     // const responses = Object.entries(JSON.parse(data.responses)).sort(qNQuestionComparator
      //).map(([ QN, response], i) => ({ 
       // question: ReadingQu[1][i], 
        //response: scale[response],
        //subjCode,
     // }));
     // console.log(responses);
      //$.ajax({
       //   url: 'http://' + document.domain + ':' + PORT + '/ReadingQu',
        //  type: 'POST',
         // contentType: 'application/json',
         // data: JSON.stringify({ subjCode, responses, batch: 2 }),
     // })
   // }
 // };
//  timeline.push(secondReadingQuestionsBatchTrial); 

  // let welcome_block = {
  //   type: "html-keyboard-response",
  //   choices: [32],
  //   stimulus: `<h1>Drawing</h1>
  //       <p class="lead">For the next part of the task we would like you to draw some pictures. You will be given the name of something to draw, and then you will have a maximum of 60 seconds to complete your drawing from when you make your first mark. </p>`
  // };

  // timeline.push(welcome_block);

  let drawing_instructions = {
    type: "instructions",
    key_forward: "space",
    key_backward: "backspace",
    pages: [
      `<p class="lead">Now for the fun part! You will be asked to draw 10 different pictures. When you are ready to start press the space bar.
            </p> ${continue_space}`
    ]
  };

  timeline.push(drawing_instructions);


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
      timer: 120,
      canvas_size_relative_to_window: 0.3,
      pen_width: 1,
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
                MTurk to get paid. If you have any questions or comments, please email hroebuck@wisc.edu.</p>
                
                <h3>Debriefing </h3>
                <p class="lead">
                The purpose of this study is to see how people who experience their thoughts in different ways (e.g., more or less language-like)
                include different elements in their drawings of common animals and objects. 
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
