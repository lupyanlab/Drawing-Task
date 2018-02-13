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

		<canvas id="cursor" width="${window.innerWidth * percentage}" height="${window.innerWidth * percentage}"></canvas>
			<div class="" style="display: inline-block; margin-left: 10px">

				<div id="drawing-mode-options" style="">
					<button id="clear-canvas" class="btn btn-danger">Clear</button><br>

					<label for="drawing-line-width">Line width:</label>
					<span class="info">${defaultWidth}</span><input type="range" value="${defaultWidth}" min="0" max="30" id="drawing-line-width"><br>

					<select name="colorpicker" id="drawing-color">
						<option value="#000000">Black</option>
						<option value="#ffffff" class="white">White</option>
						<option value="#800080">Purple</option>
						<option value="#0000FF">Blue</option>
						<option value="#008000">Green</option>
						<option value="#fbd75b">Yellow</option>
						<option value="#ffb878">Orange</option>
						<option value="#FF0000">Red</option>
						<option value="#e1e1e1">Gray</option>
					</select>
					<br />
					<br />
					<br />
					<br />
				  
					<button id="submit-drawing" class="btn btn-primary">Submit Drawing</button><br>
				</div>
			</div>
			</div>`;



		$('select[name="colorpicker"]').simplecolorpicker({
			theme: 'regularfont'
		});
		
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
						timer -= 0.01;
						$('timer').innerHTML = Math.floor(timer);
						let countdown = setInterval(() => {
							timer -= 0.01;
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

			// drawingColorEl.onchange = function () {
			// 	canvas.freeDrawingBrush.color = this.value;
			// };
			// drawingLineWidthEl.oninput = function () {
			// 	canvas.freeDrawingBrush.width = parseInt(this.value, 10) || 1;
			// 	this.previousSibling.innerHTML = this.value;
			// };

			if (canvas.freeDrawingBrush) {
				canvas.freeDrawingBrush.color = drawingColorEl.value;
				canvas.freeDrawingBrush.width = parseInt(drawingLineWidthEl.value, 10) || 1;
			}

			


















			var cursor = new fabric.StaticCanvas("cursor");

			// canvas.freeDrawingBrush.width = 20;
			// canvas.freeDrawingBrush.color = '#ff0000';

			var cursorOpacity = 1;
			var mousecursor = new fabric.Circle({
				left: -100,
				top: -100,
				radius: canvas.freeDrawingBrush.width / 2,
				fill: "rgba(0,0,0," + cursorOpacity + ")",
				stroke: "black",
				originX: 'center',
				originY: 'center'
			});

			cursor.add(mousecursor);

			canvas.on('mouse:move', function (evt) {
				var mouse = this.getPointer(evt.e);
				mousecursor
					.set({
						top: mouse.y,
						left: mouse.x
					})
					.setCoords()
					.canvas.renderAll();
			});

			canvas.on('mouse:out', function () {
				// put circle off screen
				mousecursor
					.set({
						top: -1000,
						left: -1000
					})
					.setCoords()
					.canvas.renderAll();
			});

			//while brush size is changed
			document.getElementById("drawing-line-width").oninput = function () {
				this.previousSibling.innerHTML = this.value;
				var size = this.value;
				mousecursor
					.center()
					.set({
						radius: size / 2
					})
					.setCoords()
					.canvas.renderAll();
			};

			//after brush size has been changed
			document.getElementById("drawing-line-width").onchange = function () {
				canvas.freeDrawingBrush.width = parseInt(this.value, 10) || 1;
				var size = parseInt(this.value, 10);
				canvas.freeDrawingBrush.width = size;
				console.log(mousecursor)
				mousecursor
					.set({
						left: -1000,
						top: -1000,
						radius: size / 2
					})
					.setCoords()
					.canvas.renderAll();
			};

			//change drawing color
			document.getElementById("drawing-color").onchange = function () {
				canvas.freeDrawingBrush.color = this.value;
				var bigint = parseInt(this.value.replace("#", ""), 16);
				var r = (bigint >> 16) & 255;
				var g = (bigint >> 8) & 255;
				var b = bigint & 255;
				mousecursor.set({
					fill:"rgba(" + [r, g, b, cursorOpacity].join(",") + ")"
				});
			};

		})();

		// end trial
	};

	return plugin;
})();
