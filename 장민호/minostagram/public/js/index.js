function resizeGridItem(item){
    grid = document.getElementsByClassName("row")[0];
    rowHeight = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-auto-rows'));
    rowGap = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-row-gap'));
    rowSpan = Math.ceil((item.querySelector('.d-block.mb-4.h-100').getBoundingClientRect().height+rowGap)/(rowHeight+rowGap));
    item.style.gridRowEnd = "span "+ rowSpan;
 }
 function resizeAllGridItems(){
    allItems = document.getElementsByClassName("col-lg-3 col-md-4 col-6");
    for(x = 0; x < allItems.length ; x++){
       resizeGridItem(allItems[x]);
    }
 }
 
 window.addEventListener("resize", resizeAllGridItems);
 
 