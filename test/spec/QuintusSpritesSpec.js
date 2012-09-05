describe("Quintus Sprites", function() {
  var Q, canvas;

  beforeEach(function () {
    this.addMatchers(imagediff.jasmine);
  });

  beforeEach(function() {
    canvas = document.createElement("canvas");
    canvas.width = 200;
    canvas.height = 200;

    Q = Quintus().include("Sprites").setup(canvas);
    Q.clearColor = "#CCC";
    Q.clear();

  });

  beforeEach(function() {
    SpriteFixtures.loadBlocks(Q);
    waitsFor(SpriteFixtures.doneLoaded,400);
  });

  // Don't forget the loop needs to be killed if it exists
  afterEach(function() {
    cancelAnimationFrame(Q.loop);
  });

  describe("SpriteSheet",function() {

    it("should be able to create a new SpriteSheet given a name and an asset",function() {

      runs(function() {
        Q.compileSheets("blockbreak.png","blockbreak.json");
        expect(Q.sheet("ball") instanceof Q.SpriteSheet).toBeTruthy();
        expect(Q.sheet("block") instanceof Q.SpriteSheet).toBeTruthy();
        expect(Q.sheet("paddle") instanceof Q.SpriteSheet).toBeTruthy();
      });
    });

    it("should be able to get the frames of a SpriteSheet",function() {
      runs(function() {
        Q.compileSheets("blockbreak.png","blockbreak.json");

        expect(Q.sheet('paddle').fx(1)).toBe(60);
        expect(Q.sheet('paddle').fy(1)).toBe(40);
      });
    });

    it("should be able to draw sprites",function() {
      var img = SpriteFixtures.sample('QuintusSprites/should-be-able-to-draw-sprites.png');

      runs(function() {
        Q.compileSheets("blockbreak.png","blockbreak.json");

        Q.sheet('paddle').draw(Q.ctx,10,10,0)
        Q.sheet('paddle').draw(Q.ctx,10,100,1)

        expect(canvas).toImageDiffEqual(img);
      });
    });

  });

  describe("Sprite",function() {


    beforeEach(function() {
      Q.Sprite.extend("TestSprite");
    });

    it("should create the TestSprite class",function() {
      expect(Q.TestSprite).toBeDefined();
    });

    it("should have base properties defined",function() {
      var test = new Q.TestSprite();

      expect(test.p.x).toBe(0);
      expect(test.p.y).toBe(0);
      expect(test.p.z).toBe(0);
      expect(test.p.angle).toBe(0);
      expect(test.p.frame).toBe(0);
      expect(test.p.type).toBe(Q.SPRITE_DEFAULT | Q.SPRITE_ACTIVE);
    });

    it("should allow overridding of base properties",function() {
      var test = new Q.TestSprite({ x: 50, y: 100, frame: 5 });

      expect(test.p.x).toBe(50);
      expect(test.p.y).toBe(100);
      expect(test.p.z).toBe(0);
      expect(test.p.frame).toBe(5);
   });

   describe("Assets",function() {
     var test;

     beforeEach(function() {
       test = new Q.TestSprite({ asset: 'blockbreak.png', x: 50, y: 50 });
     });
 
      it("should auto-assign width and height properties with an asset",function() {
        runs(function() {
          expect(test.p.w).toBe(120);
          expect(test.p.h).toBe(60);
          expect(test.p.cx).toBe(60);
          expect(test.p.cy).toBe(30);
        });
      });

      it("should be able to draw itself at the right location",function() {
        var img = SpriteFixtures.sample('QuintusSprites/sprite-asset-should-be-able-to-draw-itself.png');

        runs(function() {
          test.draw(Q.ctx);
          expect(canvas).toImageDiffEqual(img);
        });
      });

      it("shouldn't draw anything if hidden",function() {
        var img = SpriteFixtures.sample('QuintusSprites/blank.png');

        runs(function() {
          test.hide();
          test.draw(Q.ctx);
          expect(canvas).toImageDiffEqual(img);
        });
      });

      it("should be able to draw its bounding box if Debug is on",function() {
        var img = SpriteFixtures.sample('QuintusSprites/sprite-asset-should-be-able-to-draw-its-bounding-box.png');
        runs(function() {
          Q.debug = true;
          test.draw(Q.ctx);
          expect(canvas).toImageDiffEqual(img);
        });
      });

      it("should be able to draw itself at an angle",function() {
        var img = SpriteFixtures.sample('QuintusSprites/sprite-asset-should-be-able-to-draw-itself-at-an-angle.png');
        runs(function() {
          test.p.angle = 45;
          test.draw(Q.ctx);
          expect(canvas).toImageDiffEqual(img);
        });
      });

      it("should be able to scale itself",function() {
        var img = SpriteFixtures.sample('QuintusSprites/sprite-asset-should-be-able-to-scale-itself.png');
        runs(function() {
          test.p.scale = 2;
          test.draw(Q.ctx);
          expect(canvas).toImageDiffEqual(img);
        });

      });


    });


   describe("Sheets",function() {
     var test;

     beforeEach(function() {
       runs(function() {
         Q.compileSheets("blockbreak.png","blockbreak.json");
         test = new Q.TestSprite({ sheet: 'paddle', x: 50, y: 50 });
        });
     });

      it("should auto-assign width and height properties with a sheet",function() {
        runs(function() {

          expect(test.p.w).toBe(60);
          expect(test.p.h).toBe(20);
          expect(test.p.cx).toBe(30);
          expect(test.p.cy).toBe(10);
        });
      });


      it("should be able to draw itself at the right location",function() {
        var img = SpriteFixtures.sample('QuintusSprites/sprite-sheet-should-be-able-to-draw-itself.png');

        runs(function() {
          test.draw(Q.ctx);
          expect(canvas).toImageDiffEqual(img);
        });
      });

      it("shouldn't draw anything if hidden",function() {
        var img = SpriteFixtures.sample('QuintusSprites/blank.png');

        runs(function() {
          test.hide();
          test.draw(Q.ctx);
          expect(canvas).toImageDiffEqual(img);
        });
      });

      it("should be able to draw its bounding box if Debug is on",function() {
        var img = SpriteFixtures.sample('QuintusSprites/sprite-sheet-should-be-able-to-draw-its-bounding-box.png');
        runs(function() {
          Q.debug = true;
          test.draw(Q.ctx);
          expect(canvas).toImageDiffEqual(img);
        });
      });

      it("should be able to draw itself at an angle",function() {
        var img = SpriteFixtures.sample('QuintusSprites/sprite-sheet-should-be-able-to-draw-itself-at-an-angle.png');
        runs(function() {
          test.p.angle = 45;
          test.draw(Q.ctx);
          expect(canvas).toImageDiffEqual(img);
        });
      });

      it("should be able to scale itself",function() {
        var img = SpriteFixtures.sample('QuintusSprites/sprite-sheet-should-be-able-to-scale-itself.png');
        runs(function() {
          test.p.scale = 2;
          test.draw(Q.ctx);
          expect(canvas).toImageDiffEqual(img);
        });

      });
    });

  });


});

