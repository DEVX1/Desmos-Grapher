$( document ).ready ( function () {

    // Calculator definition
    var elt           = document.getElementById('calculator');
    var calculator    = Desmos.Calculator(elt,{expressions:0,zoomButtons:0,lockViewport:1,solutions:0});
    calculator.setViewport([-7, 7, -7, 7]);
    calculator.setExpressions([
      {id:'p', latex:'(a,b)', color: Desmos.Colors.BLUE},
      {id:'a', latex:'a=1'},
      {id:'b', latex:'b=1'}
    ]);

    // State variables
    var playing       = 0;
    var score         = 0;
    var mousea        = 0;
    var mouseb        = 0;
    var currta        = 0;
    var currtb        = 0;
    var timeleft      = 30;
    var refreshIntervalId;
    var bestScore     = 0;
    var attempts      = 0;
    
    
    $('#submitscore').hide();
    startscreen();
    
    
    
    
    // START SCREEN
    function startscreen() {
        $('#myproblem').html( "Click to start!" );
        clearInterval(refreshIntervalId);
        $('#counter').html('0:30');
        playing = 0;
        $('#submitscore').fadeIn('slow');
    };
    
    
    // CLICK TO BEGIN
    $('#problemspace').click( function() {
        if (playing) {
            startscreen();
        } else {
            attempts +=1;
            $('#submitscore').fadeOut('slow');
            playing = 1;
            score   = 0;
            $('#shoutout').html(0);
            timeleft = 30;
            newProblem();
            timer();
        }
    });
    $( elt ).click( function() {
        if (playing===0) {
            attempts +=1;
            $('#submitscore').fadeOut('slow');
            playing = 1;
            score   = 0;
            $('#shoutout').html(0);
            timeleft = 30;
            newProblem();
            timer();
        }
    });
    
    
    
    // NEW PROBLEM
    function newProblem() {
        currta = Math.floor(Math.random() * 6);
        currtb = Math.floor(Math.random() * 6);
        currta = (Math.random() < 0.5)? -currta : currta;
        currtb = (Math.random() < 0.5)? -currtb : currtb;
        $('#myproblem').html('(' + currta + ',' + currtb + ')');
    };
    
    
    // MOUSE MOVE OVER CALCULATOR
    $( elt ).mousemove( function (e) {
        if(playing){
            mousea =   Math.round((e.pageX- $(this).offset().left - $(this).width()/2)/400*14-1);
            mouseb = - Math.round((e.pageY- $(this).offset().top  - $(this).height()/2)/400*14+1);
            calculator.setExpressions([
                {id:'a', latex:'a=' + mousea },
                {id:'b', latex:'b=' + mouseb }
                ]);
        }
    });
    
    // MOUSE HOVER and CURSOR
    $( elt ).hover( function() { if(playing===0){$(this).css("cursor","pointer"); }else{$(this).css("cursor","none");}});
    
    
    // MOUSE UP ON CALCULATOR
    $( elt ).mouseup( function(e) {
        if(playing){
            checkAnswer();
            newProblem();
        }else{
            $(this).css("cursor","none");
        }
    });
    
    
    // SUBMIT SCORE CLICK
    $('#sendbutton').click( function() {
        var myname = $( '#theirname' ).val();
        $.post('php/lab_coordinates.php', { username: myname,
                                            scorenum: bestScore,
                                            attemptnum: attempts },
                                        function(data) {
                                            $('#thanks').html("Submitted score: " + data);
                                        });
    });
    
    
    // CHECK SOLUTION
    function checkAnswer() {
        if(mousea===currta && mouseb===currtb) {
            score += 1;
            $('#shoutout').html(score);
            flashColor(Desmos.Colors.GREEN,'#fcfcfc');
        }else{
            score -= 1; if(score<0){score=0;};
            $('#shoutout').html(score);
            flashColor(Desmos.Colors.RED,'#fcfcfc');
        };
    };
    
    // TIMER
    function timer() {
        refreshIntervalId = setInterval(function(){
            timeleft -= 1;
            $('#counter').html('0:' + pad(timeleft,2));
            if(timeleft<=0){ clearInterval(refreshIntervalId);
                             $(elt).slideUp(750, function() { startscreen(); $(elt).slideDown(750);});
                             if(score>bestScore){bestScore=score; $('#bestie').html(bestScore);}};
        }, 1000);
    };
    

    // OTHER FUNCTIONS
    
    function flashColor(mycolor1,mycolor2) {
        $('#bubble').animate( { backgroundColor: mycolor1 },
        200,
        function() {$('#bubble').animate( { backgroundColor: mycolor2 },
            200);});
    };
    
    function pad (str, max) {
        str = str.toString();
        return str.length < max ? pad("0" + str, max) : str;
    };
});