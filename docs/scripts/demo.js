$(function ($) {
  var $items = $('.sidebar > .menu > .list > .item > a')
  $items.on('click', function () {
    $items.parent().removeClass('active')
    $(this).parent().addClass('active')
    return false
  })

  var $subitems = $('.sidebar > .menu > .list > .item > .list > .item > a')
  $subitems.on('click', function () {
    $subitems.parent().removeClass('active')
    $(this).parent().addClass('active')
    return false
  })

  var $toggle = $('.toggle')
  $toggle.on('click', function () {
    $toggle.parent().parent().toggleClass('collapse')
    return false
  })

  $('.login-form > .btn').on('click', function () {
    $('.alert').fadeIn()
    $('.login-form').removeClass('animated shake').addClass('animated shake').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
      $(this).removeClass('animated shake')
    })
    return false
  })

  // function loadContent (path) {
  //   if (!(path.endsWith('/') || path.endsWith('.html'))) {
  //     path += '.html'
  //   }
  //   // $('.content')
  // }

  // if (!window.location.hash) {
  //   window.location.hash = '#/dashboard'
  // }

  // $(window)
  //   .on('hashchange', function (e) {
  //     loadContent(window.location.hash.substr(1))
  //   })
  //   .trigger('hashchange')
})
