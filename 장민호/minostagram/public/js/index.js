// 벽돌식 레이아웃을 구현하기 위해 높히를 계산하여 재정렬함.
function resizeGridItem(item){
  grid = document.getElementsByClassName("row")[0];
  rowHeight = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-auto-rows'));
  rowGap = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-row-gap'));
  rowSpan = Math.ceil((item.querySelector('.post_img').getBoundingClientRect().height+rowGap)/(rowHeight+rowGap));
  item.style.gridRowEnd = "span "+ rowSpan;
}

function resizeAllGridItems(){
  allItems = document.getElementsByClassName("image_card");
  for(x = 0; x < allItems.length ; x++){
    resizeGridItem(allItems[x]);
  }
}

// window 사이즈가 바뀔 때, document가 로드될 때 post들을 재정렬
window.addEventListener("resize", resizeAllGridItems);
window.addEventListener("load", resizeAllGridItems);

// JQuery 실행 부분
$(document).ready(function(){
  
  $('#morePost').on('click', requestMorePost);
});

// 추가적인 post를 받아와서 document에 붙히는 역할
function requestMorePost() {
  $.ajax({
    type: "GET",
    url: "/index/morePost",
    success: function(data, status) {
      data.forEach(function(item) {
        var imgs = '<div class="image_card col-lg-3 col-md-4 col-6">' +
        '<a href="/post/' + item.idx + '" class="post_img d-block mb-4 h-100">' +
        '<img class="img-fluid img-thumbnail" src="/' + item.img_path + '" alt="">' +
        '</a></div>';

        // img가 로드되면 grid 재정렬
        $('img').imagesLoaded(resizeAllGridItems);

        $('#images').append(imgs);
      });
    },
  });
}

// html string을 element로 변환
function createElementFromHTML(htmlString) {
  var div = document.createElement('div');
  div.innerHTML = htmlString.trim();

  // Change this to div.childNodes to support multiple top-level nodes
  return div.firstChild; 
}