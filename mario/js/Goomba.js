/*
(function($){
  // Initial speed and position of background
  var position = 0;   
  var speed = 6;      
  
  // Use jQuery to get the background element
  var $background = $("#MarioBackground_back");  
  
  // A.1. Define a function to request an animation frame
  var requestAnimFrame = ( function() {
    if (window.requestAnimationFrame) return window.requestAnimationFrame;
    if (window.webkitRequestAnimationFrame) return window.webkitRequestAnimationFrame;
    if (window.mozRequestAnimationFrame) return window.mozRequestAnimationFrame;
    if (window.oRequestAnimationFrame) return window.oRequestAnimationFrame;
    if (window.msRequestAnimationFrame) return window.msRequestAnimationFrame;
    else return  function( callback, element ){
        window.setTimeout(callback, element);
    };
  })();

  // A.2. Define draw() to update position redraw frame
  function draw() {

    // request another animation frame
    requestAnimFrame(draw,25);

    // reset position to 0 once the image has scrolled far enough
    if ( position < -$background.width() ) {
        position = 0;
    }

    //To move animation
    $(document).keydown(function(e)) {
      switch (e.which) {
        case 37:
          $('div#Goomba').css(
            'margin',$(div#Goomba).offset().left - 10
          );
          break; //left
        case 39:
        $('div#Goomba').css(
          'margin',$(div#Goomba).offset().left + 10
        );
        break; //right

      }
    }) 

    // Set actual background position 
    //$('#MarioBackground_back').css('background-position',position );
    $('#MarioBackground_mid').css('background-position',position );
    $('#MarioBackground_front').css('background-position',position );
    // Update the background position by the speed
    position = position - speed;
  }

  // A.3. Call the draw( ) function to get things rolling
  draw();
})(jQuery); 
*/
//Look at page 276 and increment x value by 1 use alphabet values.
var Mario = {
  state : 'right',
  maxy: 240,
  y: 0,
  vy_start: 18,
  vy: 0,
  vymax:52,
  a: -1,
  x: 0,
  //vx: -12,
  vx : -8,
  images: {right: "img/new_mario.gif",jump_right : "img/new_mario.gif",move_right: "img/new_mario.gif"},
  $sprites:null,
  width:null,
  init : function(width) {
    //Put mario on screen
    this.width = width;
    this.$sprites = $.preload(this.images);
    $('div#Mario').empty().append(this.$sprites['right']);
  },
  change_image : function(img) {
    var last;
    if (img != last) {
      $('div#Mario').empty().append(this.$sprites[img]);
    }
    last = img;
  }, 
  jump_right : function() {this.state = 'jump_right'},
  go_right : function() {this.state = 'right'},
  //adding a function to change state to forward.
  move_right : function() {this.state = 'move_right'},
  //adding function to move forward.
  move_forward : function() {
	  if (this.state === 'right') {
		  this.move_right();
	  }
  },
  jump: function() {
    if (this.vy <= this.vymax) {
      this.vy += this.vy_start;
        if (this.state === 'right') {
          this.jump_right();
        }
    }
  },
  run : function() {
    if (this.state === 'jump_right') {
      this.y = this.a + this.vy + this.y;
      this.vy = this.a + this.vy;
      //limit y value for jump
      if (this.y > this.maxy) this.y = this.maxy;
      // Check to see if the jump is finished
      if (this.y <0 && this.state === 'jump_right') {
        this.vy = 0;
        this.go_right();
      }
	  // adding to if the state is move_right 
    } else if (this.state === 'move_right') {
		//getting mario object and this is working.
		      var el = $('#Mario');
		      var position = el.position();
		      var mleft = position.left;
		      mleft += 20;
		      $('#Mario').css('left',mleft);
		      this.go_right(); 
	}
    // Check to see if all the background images have wrapped around
    if(this.x * (1.0/12.0) <= -this.width || this.x * (1.0/12.0) >= this.width) {
      this.x = 0;
    }

    // update the x position of mario
    this.x = this.x + this.vx;

    // Switch to apporpriate image base on the state of mario
    this.change_image(this.state);

    //move current mario image into position
    $('#Mario').css('top',(this.maxy - this.y));
  }
}

// Function that will setup an animation frame
requestAnimFrame = (function(){
    if (window.requestAnimationFrame) return window.requestAnimationFrame;
    if (window.webkitRequestAnimationFrame) return window.webkitRequestAnimationFrame;
    if (window.mozRequestAnimationFrame) return window.mozRequestAnimationFrame;
    if (window.oRequestAnimationFrame) return window.oRequestAnimationFrame;
    if (window.msRequestAnimationFrame) return window.msRequestAnimationFrame;
    else return  function( callback, element ){
        window.setTimeout(callback, element);
    };
})();

// jQuery plugin function to preload images
$.preload = function( arr ) {
    return $.map(arr, function( val ){
        var $img = $('<img/>');
        $img[0].src = val;
        return $img[0];
    });
}

if ( typeof Object.create !== 'function' ) {
    Object.create = function(o) {
        var F = function() {};
        F.prototype = o;
        return new F();
    }
}

var MarioController = {
    // Variables
    $background : null,
    $mario : null,
    init : function() {
    this.$background = $("#MarioBackground_back");
    this.$mario = Object.create(Mario);
    this.$mario.init(this.$background.width());
    $("body").click( this.$mario.jump.bind(this.$mario) );
		//adding the keypress to move mario forward.
		$("body").keydown(this.$mario.move_forward.bind(this.$mario));


  },
    draw : function() {
        requestAnimFrame( MarioController.draw.bind(this), 25);
    if ( typeof this.$mario != "undefined" ) {
      this.$mario.run();
      var xpos = this.$mario.x;
      var ypos = this.$mario.y;
      $('#MarioBackground_mid').css('background-position', (xpos * (1.0/6.0)));
      $('#MarioBackground_front').css('background-position',xpos);
      $('#MarioBackground_brick').css('background-position',xpos * 1.0/12.0);
    }
    }
};

$(document).ready(function () {
    MarioController.init();
    MarioController.draw();
});



