var awsServices = [
  { name: "EC2", img: "img/aws-ec2.png" },
  { name: "S3", img: "img/aws-s3.png" },
  { name: "Lambda", img: "img/aws-lambda.png" },
  { name: "DynamoDB", img: "img/aws-dynamodb.png" },
  { name: "RDS", img: "img/aws-rds.png" },
  { name: "CloudFront", img: "img/aws-cloudfront.png" },
  { name: "CloudWatch", img: "img/aws-cloudwatch.png" },
  { name: "SNS", img: "img/aws-sns.png" },
  
];

var symbols = [];
awsServices.forEach(function(service) {
  symbols.push(service);
  symbols.push(service);
});

var opened = [],
  match = 0,
  moves = 0,
  $deck = $(".deck"),
  $scorePanel = $("#score-panel"),
  $movesNum = $scorePanel.find(".moves"),
  delay = 800,
  gameCardsQTY = awsServices.length;


function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;
  while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
  }
  return array;
}

function updateHearts() {
  var $hearts = $("#score-panel .heart li i");
  $hearts.each(function(index) {
      if (index >= lives) {
          $(this).css("color", "black");
      } else {
          $(this).css("color", "#EE0E51"); // Color rojo para las vidas restantes
      }
  });
}

function initGame() {
    var cards = shuffle(symbols.slice());
    $deck.empty();
    match = 0;
    moves = 0;
    $movesNum.html(moves);
  
    for (var i = 0; i < cards.length; i++) {
      $deck.append(
        $('<li class="card" data-service="' +
          cards[i].name +
          '"><img class="aws-icon" src="' +
          cards[i].img +
          '" alt="' +
          cards[i].name +
          '"></li>')
      );
    }
  }
  

function endGame(win) {
  swal({
      title: win ? "¡Felicitaciones! Ganaste!" : "¡Game Over!",
      text: win ? "¡Has encontrado todos los pares!" : "Perdiste todas tus vidas.",
      icon: win ? "success" : "error",
      button: "Jugar de nuevo!"
  }).then(function() {
      initGame();
  });
}

$deck.on("click", ".card:not('.match, .open')", function () {
    if ($(".show").length > 1) {
      return;
    }
  
    var $this = $(this),
      service = $this.data("service");
  
    $this.addClass("open show");
    opened.push(service);
  
    if (opened.length > 1) {
      moves++;
      $movesNum.html(moves);
  
      if (service === opened[0]) {
        $deck.find(".open").addClass("match animated infinite rubberBand");
        setTimeout(function () {
          $deck.find(".match").removeClass("open show animated infinite rubberBand");
        }, delay);
        match++;
      } else {
        $deck.find(".open").addClass("notmatch animated infinite wobble");
        setTimeout(function () {
          $deck.find(".open").removeClass("animated infinite wobble");
        }, delay / 1.5);
        setTimeout(function () {
          $deck.find(".open").removeClass("open show notmatch animated infinite wobble");
        }, delay);
      }
  
      opened = [];
    }
  
    if (gameCardsQTY === match) {
      setTimeout(function () {
        endGame(true);
      }, 500);
    }
  });
  


initGame();
