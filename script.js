// Lista de servicios AWS (cada objeto contiene el nombre y la ruta de la imagen)
var awsServices = [
    { name: "EC2", img: "img/aws-ec2.png" },
    { name: "S3", img: "img/aws-s3.png" },
    { name: "Lambda", img: "img/aws-lambda.png" },
    { name: "DynamoDB", img: "img/aws-dynamodb.png" },
    { name: "RDS", img: "img/aws-rds.png" },
    { name: "CloudFront", img: "img/aws-cloudfront.png" },
    { name: "CloudWatch", img: "img/aws-cloudwatch.png" },
    { name: "SNS", img: "img/aws-sns.png" }
  ];
  
  var symbols = [];
  // Duplicamos cada servicio para formar los pares.
  awsServices.forEach(function(service) {
    symbols.push(service);
    symbols.push(service);
  });
  
  var opened = [],
    match = 0,
    moves = 0,
    $deck = $(".deck"),
    $scorePanel = $("#score-panel"),
    $moveNum = $scorePanel.find(".moves"),
    $ratingStars = $scorePanel.find("i"),
    $restart = $scorePanel.find(".restart"),
    delay = 800,
    gameCardsQTY = awsServices.length, // cantidad de pares (8)
    rank3stars = gameCardsQTY + 2,
    rank2stars = gameCardsQTY + 6,
    rank1stars = gameCardsQTY + 10;
  
  // Función para mezclar (shuffle)
  function shuffle(array) {
    var currentIndex = array.length,
      temporaryValue,
      randomIndex;
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  }
  
  // Inicializar el juego
  function initGame() {
    var cards = shuffle(symbols.slice());
    $deck.empty();
    match = 0;
    moves = 0;
    $moveNum.html(moves);
    $ratingStars.removeClass("fa-star-o").addClass("fa-star");
  
    for (var i = 0; i < cards.length; i++) {
      $deck.append(
        $(
          '<li class="card" data-service="' +
            cards[i].name +
            '"><img class="aws-icon" src="' +
            cards[i].img +
            '" alt="' +
            cards[i].name +
            '"></li>'
        )
      );
    }
  }
  
  // Ajusta la calificación según la cantidad de movimientos
  function setRating(moves) {
    var rating = 3;
    if (moves > rank3stars && moves < rank2stars) {
      $ratingStars.eq(2).removeClass("fa-star").addClass("fa-star-o");
      rating = 2;
    } else if (moves > rank2stars && moves < rank1stars) {
      $ratingStars.eq(1).removeClass("fa-star").addClass("fa-star-o");
      rating = 1;
    } else if (moves > rank1stars) {
      $ratingStars.eq(0).removeClass("fa-star").addClass("fa-star-o");
      rating = 0;
    }
    return { score: rating };
  }
  
  // Mensaje de fin de juego
  function endGame(moves, score) {
    swal({
      title: "¡Felicitaciones! Ganaste!",
      text:
        "Con " +
        moves +
        " movimientos y " +
        score +
        " estrellas.\n¡Boom Shaka Lak!",
      icon: "success",
      button: "Jugar de nuevo!"
    }).then(function() {
      initGame();
    });
  }
  
  // Reiniciar juego (mensaje de confirmación)
  $restart.on("click", function() {
    swal({
      title: "¿Estás seguro?",
      text: "¡Se perderá tu progreso!",
      icon: "warning",
      buttons: {
        cancel: {
          text: "Cancelar",
          visible: true,
          closeModal: true
        },
        confirm: {
          text: "Sí, reiniciar el juego",
          className: "btn-confirm"
        }
      }
    }).then(function(confirm) {
      if (confirm) {
        initGame();
      }
    });
  });
  
  // Lógica de voltear carta
  $deck.on("click", ".card:not('.match, .open')", function() {
    // Si ya hay dos cartas abiertas, no hace nada
    if ($(".show").length > 1) {
      return;
    }
  
    var $this = $(this),
      service = $this.data("service");
  
    $this.addClass("open show");
    opened.push(service);
  
    // Comparar si ya hay dos cartas
    if (opened.length > 1) {
      if (service === opened[0]) {
        // Son iguales → Acierto
        $deck.find(".open").addClass("match animated infinite rubberBand");
        setTimeout(function() {
          $deck.find(".match").removeClass("open show animated infinite rubberBand");
        }, delay);
        match++;
      } else {
        // No coinciden → Error
        $deck.find(".open").addClass("notmatch animated infinite wobble");
        setTimeout(function() {
          $deck.find(".open").removeClass("animated infinite wobble");
        }, delay / 1.5);
        setTimeout(function() {
          $deck.find(".open").removeClass("open show notmatch animated infinite wobble");
        }, delay);
      }
      opened = [];
      moves++;
      setRating(moves);
      $moveNum.html(moves);
    }
  
    // Finalizar el juego si se encontraron todos los pares
    if (gameCardsQTY === match) {
      var score = setRating(moves).score;
      setTimeout(function() {
        endGame(moves, score);
      }, 500);
    }
  });
  
  initGame();
  