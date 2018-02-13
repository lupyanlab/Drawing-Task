/*
 * Example plugin template
 */

jsPsych.plugins["free-drawing"] = (function () {

	var plugin = {};

	plugin.info = {
		name: "free-drawing",
		parameters: {
			prompt: {
				type: jsPsych.plugins.parameterType.STRING, // INT, IMAGE, KEYCODE, STRING, FUNCTION, FLOAT
				default_value: undefined
			},
			timer: {
				type: jsPsych.plugins.parameterType.INT, // INT, IMAGE, KEYCODE, STRING, FUNCTION, FLOAT
				default_value: 60
			}
		}
	}

	plugin.trial = function (display_element, trial) {

		// data saving
		var trial_data = {
			parameter_name: 'parameter value'
		};
		let percentage = 0.4;
		let defaultWidth = 10;

		display_element.innerHTML = `
		<h1 id="timer">${Math.floor(trial.timer)}</h1>
		<h1>${trial.prompt}</h1>
		<div class="free-drawing">
		<canvas id="c" class="" width="${window.innerWidth * percentage}" height="${window.innerWidth * percentage}" style="border: 1px solid rgb(170, 170, 170); position: absolute; touch-action: none; user-select: none;" class="lower-canvas"></canvas>

			<div class="" style="display: inline-block; margin-left: 10px">

				<div id="drawing-mode-options" style="">
					<button id="clear-canvas" class="btn btn-danger">Clear</button><br>

					<label for="drawing-line-width">Line width:</label>
					<span class="info">${defaultWidth}</span><input type="range" value="${defaultWidth}" min="0" max="30" id="drawing-line-width"><br>

					<label for="drawing-color">Line color:</label>
					<input type="color" value="#005E7A" id="drawing-color"><br>
					<button id="submit-drawing" class="btn btn-primary">Submit Drawing</button><br>
				</div>
			</div>
			</div>`;




		(function () {
			var $ = function (id) { return document.getElementById(id) };
			let countdownStarted = false;
			let timer = trial.timer;

			var canvas = this.__canvas = new fabric.Canvas('c', {
				isDrawingMode: true,
				backgroundColor: "#ffffff"
			});
			fabric.Object.prototype.transparentCorners = false;

			var drawingModeEl = $('drawing-mode'),
				drawingOptionsEl = $('drawing-mode-options'),
				drawingColorEl = $('drawing-color'),
				drawingLineWidthEl = $('drawing-line-width'),
				clearEl = $('clear-canvas');

			clearEl.onclick = function () { canvas.clear() };


			$('submit-drawing').onclick = () => {
				jsPsych.finishTrial({
					drawing: document.getElementById('c').toDataURL(),
					prompt: trial.prompt
				});
			};

			canvas.on({
				'mouse:down': () => {
					if (!countdownStarted) {
						timer-=0.01;
						$('timer').innerHTML = Math.floor(timer);
						let countdown = setInterval(() => {
							timer-=0.01;
							if (timer < 0) {
								clearInterval(countdown);
								jsPsych.finishTrial({
									drawing: document.getElementById('c').toDataURL(),
									prompt: trial.prompt
								});
							}
							else {
								$('timer').innerHTML = Math.floor(timer);
							}
						}, 10)
						countdownStarted = true;
					}
				}
			})

			drawingColorEl.onchange = function () {
				canvas.freeDrawingBrush.color = this.value;
			};
			drawingLineWidthEl.oninput = function () {
				canvas.freeDrawingBrush.width = parseInt(this.value, 10) || 1;
				this.previousSibling.innerHTML = this.value;
			};

			if (canvas.freeDrawingBrush) {
				canvas.freeDrawingBrush.color = drawingColorEl.value;
				canvas.freeDrawingBrush.width = parseInt(drawingLineWidthEl.value, 10) || 1;
			}
		})();

		// end trial
	};

	return plugin;
})();
