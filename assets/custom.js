$(document).ready(function () {
  $('.swiper-slider__items').slick({
    dots: false,
    arrows:true,
    centerMode: false,
    slidesToShow: 3.5,
    slidesToScroll: 1,
    infinite:false,
    pauseOnHover:false,
    PauseOnFocus: false,
    autoplay: false,
    centerMode: false,
    centerPadding: '172px',
    prevArrow: '<button class="slide-arrow prev-arrow"><img src="https://cdn.shopify.com/s/files/1/0884/6435/9721/files/Back_1.png?v=1722875645"></button>',
    nextArrow: '<button class="slide-arrow next-arrow"><img src="https://cdn.shopify.com/s/files/1/0884/6435/9721/files/Back.png?v=1722875645"></button>',
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          centerPadding: '100px',
          slidesToShow: 3.2
        }
      },
      {
        breakpoint: 800,
        settings: {
          centerPadding: '70px',
          slidesToShow: 2.2
        }
      },
      {
        breakpoint: 767,
        settings: {
          centerPadding: '40px',
          slidesToShow: 1.7
        }
      }
    ]
  });

  $('.review__wrapper').slick({
    dots: false,
    arrows:true,
    centerMode: false,
    slidesToShow: 3,
    slidesToScroll: 1,
    infinite:true,
    pauseOnHover:false,
    PauseOnFocus: false,
    autoplay: true,
    prevArrow: '<button class="slide-arrow prev-arrow"><img src="https://cdn.shopify.com/s/files/1/0884/6435/9721/files/Back_2.png?v=1722933571"></button>',
    nextArrow: '<button class="slide-arrow next-arrow"><img src="https://cdn.shopify.com/s/files/1/0884/6435/9721/files/Back_3.png?v=1722933570"></button>',
    responsive: [
      {
        breakpoint: 779,
        settings: {
          centerPadding: '100px',
          slidesToShow: 2
        }
      },
      {
        breakpoint: 700,
        settings: {
          centerPadding: '70px',
          slidesToShow: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          centerPadding: '40px',
          slidesToShow: 1
        }
      }
    ]
  });
});



$(".footer-block.grid__item").click(function(){
  if($(window).width() < 769){
    $(this).find('ul.footer-block__details-content').slideToggle();
    $(this).toggleClass("active");
  }
});
function getFile(){
  document.getElementById("upfile").click();
}
// $(document).on("scroll", function () {
//   const $backButton = $(".product_back-btn");

//   if ($(window).scrollTop() > 100) {
//     $backButton.css("top", "20px");
//   } else {
//     // if ($(window).scrollTop() < 300) {
//     $backButton.css("top", "124px");
//     // }
//   }
// });


$(".size_guide-select-block").click(function(){
  var id = $(this).data('id');

  $('.size_guide-select-block').removeClass('active')
  $('.size_guide-one-size-wrapper-col').find('[data-id]').removeClass('active');

  $(this).addClass('active')
  $('.size_guide-one-size-wrapper-col').find('[data-id="'+id+'"]').addClass('active')
});
