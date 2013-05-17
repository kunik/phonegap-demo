var Stats = (function() {
  return _constructor;

  function _constructor(reporter, reportInterval) {
    var objectsCount = 0;

    var startTime = Date.now();
    var prevTime = startTime;

    var fps, fpsMin, fpsMax;
    var ms, msMin, msMax;
    var framesCount;

    var reportIntervalId;

    var _this = {
      reset: function() {
        fps = 0, fpsMin = Infinity, fpsMax = 0;
        ms  = 0, msMin  = Infinity, msMax  = 0;

        framesCount = 0;
      },
      start: function() {
        return startTime = Date.now();
      },
      end: function() {
        var endTime = Date.now();

        ms = endTime - startTime;
        msMin = Math.min(msMin, ms);
        msMax = Math.max(msMax, ms);

        framesCount++;

        if (endTime > prevTime + 1000 ) {
          fps = Math.round((framesCount * 1000) / (endTime - prevTime));
          fpsMin = Math.min(fpsMin, fps);
          fpsMax = Math.max(fpsMax, fps);

          prevTime = endTime;
          framesCount = 0;
        }

        return endTime;
      },
      update: function() {
        return startTime = _this.end();
      },
      objectAdded: function() {
        return ++objectsCount;
      },
      info: function() {
        return {
          objects: objectsCount,
          fps: {
            now: fps,
            min: fpsMin,
            max: fpsMax
          },
          ms: {
            now: ms,
            min: msMin,
            max: msMax
          }
        };
      },
      bindReporter: function(reporter, reportInterval) {
        if (reportIntervalId) {
          clearInterval(reportIntervalId);
        }

        reportIntervalId = setInterval(function() {
          reporter.call(_this, _this.info());
        }, reportInterval || 1000);
      }
    };

    _this.reset();

    if (reporter) {
      _this.bindReporter(reporter, reportInterval);
    }

    return _this;
  }

})();

(function() {
  var minX = 0, minY = 0;
  var maxX = 0, maxY = 0;
  var initialObjectsAmount = 10;
  var objectsPortion = 10;
  var gravity = 0.75//1.5 ;
  var isAddingObjects = false;

  var textures = {};
  var bunnys = [];
  var stats = Stats();

  var renderer, stage, container;

  bindListeners();

  function bindListeners() {
    window.addEventListener('load', init, false);
    window.onresize = resizeRenderer;
    window.onorientationchange = resizeRenderer;
  }

  function init() {
    loadTextures();
    createRenderer();
    createStage();
    createDebugPanel();

    renderScene();
  }

  function update() {
    stats.start();

    if (isAddingObjects) {
      addSomeBunnys();
    }

    updateBannysPosition();
    renderScene();

    stats.end();
  }

  function updateBannysPosition() {
    var bunny;
    for (var i = bunnys.length; i--;) {
      bunny = bunnys[i];

      bunny.position.x += bunny.speedX;
      bunny.position.y += bunny.speedY;
      bunny.speedY += gravity;

      if (bunny.position.x > maxX) {
        bunny.speedX *= -1;
        bunny.position.x = maxX;
      } else if (bunny.position.x < minX) {
        bunny.speedX *= -1;
        bunny.position.x = minX;
      }

      if (bunny.position.y > maxY) {
        bunny.speedY *= -0.85;
        bunny.position.y = maxY;
        bunny.spin = (Math.random()-0.5) * 0.2
          if (Math.random() > 0.5) {
            bunny.speedY -= Math.random() * 6;
          }
      } else if (bunny.position.y < minY) {
        bunny.speedY = 0;
        bunny.position.y = minY;
      }
    }
  }

  function renderScene() {
    renderer.render(stage);
    requestAnimFrame(update);
  }

  function addSomeBunnys() {
    var bunny;
    for (var i = objectsPortion; i--;) {
      bunny = createBunny();
      container.addChild(bunny);
      stats.objectAdded();
    }
  }

  function createBunny() {
    var bunny = new PIXI.Sprite(textures['bunny'], {x:0, y:0, width:26, height:37});
    bunny.speedX = Math.random() * 10;
    bunny.speedY = (Math.random() * 10) - 5;

    bunny.anchor.x = 0.5;
    bunny.anchor.y = 1;
    //bunny.alpha = 0.3 + Math.random() * 0.7;
    bunny.scale.y = 1;

    //bunny.rotation = Math.random() - 0.5;

    bunnys.push(bunny);
    return bunny;
  }

  function loadTextures() {
    textures = {
      bunny: new PIXI.Texture.fromImage("img/bunny.png"),
      button: new PIXI.Texture.fromImage("img/add.png")
    };
  }

  function createRenderer() {
    recalculateDimensions();

    var canvas = document.createElement('canvas');//CocoonJS.App.createScreenCanvas();
    renderer = new PIXI.CanvasRenderer(maxX, maxY);

    if (!renderer instanceof PIXI.WebGLRenderer) {
      renderer.context.mozImageSmoothingEnabled = false;
      renderer.context.webkitImageSmoothingEnabled = false;
    }

    document.body.appendChild(renderer.view);
  }

  function createStage() {
    stage = new PIXI.Stage(0xFFFFFF, true);
    container = new PIXI.DisplayObjectContainer();

    stage.addChild(container);
    stage.addChild(createButton());

    addSomeBunnys();
  }

  function createButton() {
    var button = new PIXI.Sprite(textures['button']);

    button.position.x = 20;
    button.position.y = 100;

    // make the button interactive
    button.setInteractive(true);

    document.addEventListener('touchstart', function() { isAddingObjects = true; });
    document.addEventListener('touchend', function() { isAddingObjects = false; });
    // set the mousedown and touchstart callback..
    //button.mousedown = button.touchstart = function(data) {
      //isAddingObjects = true;
    //}

    //// set the mouseup and touchend callback..
    //button.mouseup = button.touchend = function(data){
      //isAddingObjects = false;
    //}

    return button;
  }

  function createDebugPanel() {
    //hack for getting font height
    PIXI.Text.heightCache["font: 15px Arial;"] = 17;
    var debugPanel = new PIXI.Text("", {font:"15px Arial", fill:"red", align: "left", stroke: "#CCCCCC", strokeThickness: 7});
    debugPanel.position.x = 20;
    debugPanel.position.y = 20;
    debugPanel.setInteractive(true);
    stage.addChild(debugPanel);

    stats.bindReporter(function(info) {
      var debugInfo = [
        'OBJECTS: ', info.objects, '\n',
        'FPS: ', info.fps.now, ' [', info.fps.min, '/', info.fps.max, ']\n',
        'FRAME_TIME: ', info.ms.now, ' [', info.ms.min, '/' , info.ms.max, ']'].join('');

      debugPanel.setText(debugInfo);
    });
  }

  function recalculateDimensions() {
    maxX = window.innerWidth;
    maxY = window.innerHeight;
  }

  function resizeRenderer() {
    recalculateDimensions();
    renderer.resize(maxX, maxY);
  }

})();

