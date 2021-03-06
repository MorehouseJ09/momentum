// Generated by CoffeeScript 1.4.0
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  define(['paper', 'ball', 'frame'], function(paper, ball, frame) {
    var BaseModule;
    return BaseModule = (function() {

      function BaseModule(container, options) {
        this.container = container;
        this.options = options;
        this.play = __bind(this.play, this);

        this.paper = new paper.PaperScope();
        this.canvas = this.container.children("canvas")[0];
        this.paper = new paper.PaperScope();
        this.tool = new this.paper.Tool();
        this.paper.setup(this.canvas);
        this.view = new this.paper.View(this.canvas);
        this.view.draw = function() {};
        this.elements = {
          a: new ball(this.paper, this.container.find(".red_velocity"), this.options.a),
          b: new ball(this.paper, this.container.find(".blue_velocity"), this.options.b),
          frame: new frame(this.paper, this.container.find(".frame_velocity"), this.options.frame)
        };
        this.playing = false;
        this.paper.view.draw();
      }

      BaseModule.prototype.play = function() {
        var collision, left, leftRunning, right, rightRunning, run,
          _this = this;
        left = this.elements.a;
        right = this.elements.b;
        frame = this.elements.frame;
        collision = false;
        rightRunning = true;
        leftRunning = true;
        run = function() {
          var collisionResponse, collisionStatus, fv, leftStatus, lm, lv, maxLeft, maxRight, rightStatus, rm, rv;
          lv = left.getVelocity();
          lm = left.getMass();
          rv = right.getVelocity();
          rm = right.getMass();
          fv = frame.getVelocity();
          maxLeft = _this.paper.view.size.width * 0.05;
          maxRight = _this.paper.view.size.width * 0.95;
          (leftStatus = function() {
            var move, reset;
            reset = function() {
              leftRunning = false;
              return left.velocityReset();
            };
            move = function() {
              var collisionBound, current, delta;
              delta = lv + fv;
              current = left.element.position.x;
              collisionBound = right.element.position.x - right.radius;
              if (!collision && current + delta + left.radius > collisionBound) {
                return left.element.position.x = collisionBound - left.radius;
              } else {
                return left.element.position.x += delta;
              }
            };
            if (leftRunning) {
              if (lv === 0 || lm === 0 || (lv + fv) === 0) {
                reset();
              } else if (parseInt(left.element.position.x) > maxRight || parseInt(left.element.position.x) < maxLeft) {
                reset();
              } else {
                move();
              }
              return _this.paper.view.draw();
            }
          })();
          (rightStatus = function() {
            var move, reset;
            reset = function() {
              rightRunning = false;
              return right.velocityReset();
            };
            move = function() {
              var collisionBound, current, maxDelta;
              maxDelta = right.getVelocity() + frame.getVelocity();
              current = right.element.position.x - right.radius;
              collisionBound = left.element.position.x + left.radius;
              if (!collision && current + maxDelta < collisionBound) {
                return right.element.position.x = collisionBound + right.radius;
              } else {
                return right.element.position.x += maxDelta;
              }
            };
            if (rightRunning) {
              if (rv === 0 || rm === 0 || rv + fv === 0) {
                reset();
              } else if (right.element.position.x < maxLeft || right.element.position.x > maxRight) {
                reset();
              } else {
                move();
              }
              return _this.paper.view.draw();
            }
          })();
          collisionResponse = function() {
            var lfv, rfv;
            lm = left.getMass();
            rm = right.getMass();
            lfv = ((lv * (lm - rm)) + (2 * rm * rv)) / (lm + rm);
            rfv = ((rv * (rm - lm)) + (2 * lm * lv)) / (lm + rm);
            left.setTempVelocity(lfv);
            return right.setTempVelocity(rfv);
          };
          (collisionStatus = function() {
            var leftRight, rightLeft;
            if (collision) {
              return;
            }
            leftRight = left.element.position.x + left.radius;
            rightLeft = right.element.position.x - right.radius;
            if (rightLeft <= leftRight) {
              _this.paper.view.draw();
              collisionResponse();
              return collision = true;
            }
          })();
          if (leftRunning || rightRunning) {
            return setTimeout(run, 10);
          } else {
            right.positionReset();
            left.positionReset();
            _this.paper.view.draw();
            return _this.playing = false;
          }
        };
        if (!this.playing) {
          this.playing = true;
          return run();
        }
      };

      return BaseModule;

    })();
  });

}).call(this);
