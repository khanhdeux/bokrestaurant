$(document).ready(function () {
    // Check if a new cache is available on page load.
    window.addEventListener('load', function (e) {

        window.applicationCache.addEventListener('updateready', function (e) {
            if (window.applicationCache.status == window.applicationCache.UPDATEREADY) {
                // Browser downloaded a new app cache.
                // Swap it in and reload the page to get the new hotness.
                window.applicationCache.swapCache();
                if (confirm('Eine neue Version dieser Homepage ist verfügbar. Soll Sie geladen werden?')) {
                    window.location.reload();
                }
            } else {
              // Manifest didn't changed. Nothing new to server.
            }
        }, false);

    }, false);
    

    //Navigation Menu Slider
    $('#nav-expander').on('click',function (e) {
        e.preventDefault();
        $('body').toggleClass('nav-expanded');
    });
    $('#nav-close').on('click',function (e) {
        e.preventDefault();
        $('body').removeClass('nav-expanded');
    });

    // Initialize navgoco with default options
    $(".main-menu").navgoco({
        caret: '<span class="caret"></span>',
        accordion: false,
        openClass: 'open',
        save: true,
        cookie: {
            name: 'navgoco',
            expires: false,
            path: '/'
        },
        slide: {
            duration: 300,
            easing: 'swing'
        }
    });
    

    /* sets the carousel fade time to 4 seconds
    ===========================================*/
    $('.carousel').carousel({
        interval: 1000 * 4
    });


    /* avoid links open mobile safari for iOS devices
    =================================================*/
    $('a.link').on('click',function (e) {
        href = $(this).attr( "href" );
        if(href.indexOf("html") && href!="#"){
            // Stop the default behavior of the browser, which
            // is to change the URL of the page.
            e.preventDefault();
     
            // Manually change the location of the page to stay in
            // "Standalone" mode and change the URL at the same time.
            location.href = href;
        }
        else if(href=="#"){
            e.preventDefault();
        }
    });

    /* execute Photoswipe plugin
    ============================*/
    initPhotoSwipeFromDOM('.bok-gallery');


    /* kontakt form
    ===============*/
    $('#kontaktsubmit').click(function(){
        var name = $("#name").val();
        var email1 = $("#email1").val();
        var betreff = $("#betreff").val();
        var text = $("#text").val();
        $.ajax({
            dataType: "text",
            url: 'php/kontaktformular.php',
            type: 'POST',
            data: {
                name: name,
                email1: email1,
                betreff: betreff,
                text: text
            },
            success: function(msg){
                var bodymsg=$(msg).text().replace(/\s+/gm, ' ');
                if(bodymsg==' gesendet '){
                    $("#fehler1").empty();
                    $('#kontaktForm').get(0).reset();
                    $("div.Names").empty().append('<p id="eins">Name:</p><p id="zwei">E-Mail:</p><p id="drei">Betreff:</p><p id="vier">Nachricht:</p>');
                    alert("Nachricht gesendet!");
                }
                else{
                    $("#fehler1").empty().append(bodymsg);
                    var text = $("div.Names p").text();
                    if(text.indexOf("*") < 0){
                        $("div.Names p").append("*");
                    }
                }
            }
        });
        return false;
    });

    $('#ratesubmit').click(function(){
        var name = $("#name").val();
        var email1 = $("#email1").val();
        var betreff = $("#betreff").val();
        var bewertung;
        if(document.getElementsByName("bewertung")[0].checked == true) {
            bewertung = "Das war nix";
        }
        else if(document.getElementsByName("bewertung")[1].checked == true) {
            bewertung = "Da ist noch Luft nach oben";
        }
        else if(document.getElementsByName("bewertung")[2].checked == true) {
            bewertung = "Nichts zu beanstanden";
        }
        else if(document.getElementsByName("bewertung")[3].checked == true) {
            bewertung = "Am liebsten jeden Tag zu bok";
        }
        else{
            bewertung = "";
        }
        $.ajax({
            dataType: "text",
            url: 'php/bewertung.php',
            type: 'POST',
            data: {
                name: name,
                email1: email1,
                betreff: betreff,
                bewertung: bewertung
            },
            success: function(msg){
                var bodymsg=$(msg).text().replace(/\s+/gm, ' ');
                if(bodymsg==' gesendet '){
                    $("#fehler1").empty();
                    $('#kontaktForm').get(0).reset();
                    $("div.Names").empty().append('<p id="eins">Name:</p><p id="zwei">E-Mail:</p><p id="drei">Betreff:</p><p id="vier">Bewertung</p>');
                    alert("Nachricht gesendet!");
                }
                else{
                    $("#fehler1").empty().append(bodymsg);
                    var text = $("div.Names p").text();
                    if(text.indexOf("*") < 0){
                        $("div.Names p").append('<span class="redStar">*</span>');
                    }
                }
            }
        });
        return false;
    });

});

var initPhotoSwipeFromDOM = function(gallerySelector) {

    // parse slide data (url, title, size ...) from DOM elements 
    // (children of gallerySelector)
    var parseThumbnailElements = function(el) {
        var thumbElements = $(".bok-gallery figure"),
            numNodes = thumbElements.length,
            items = [],
            figureEl,
            childElements,
            linkEl,
            size,
            item;

          var test = $(".bok-gallery figure"),
                testL = test.length;
        
        
        
        //for(var i = 0; i < testL; i++) {
          for(var i = 0; i < numNodes; i++) {

            figureEl = thumbElements[i]; // <figure> element
                //figureEl = test[i]; // <figure> element
                /*/ include only element nodes 
            if(figureEl.nodeType !== 1) {
                continue;
            }*/

            linkEl = figureEl.children[0]; // <a> element
            size = linkEl.getAttribute('data-size').split('x');

            // create slide object
            item = {
                src: linkEl.getAttribute('href'),
                w: parseInt(size[0], 10),
                h: parseInt(size[1], 10)
            };

            

            if(figureEl.children.length > 1) {
                // <figcaption> content
                item.title = figureEl.children[1].innerHTML; 
            }
 
            if(linkEl.children.length > 0) {
                // <img> thumbnail element, retrieving thumbnail url
                item.msrc = linkEl.children[0].getAttribute('src');
            } 
           
            item.el = figureEl; // save link to element for getThumbBoundsFn
            items.push(item);
        }

        return items;
    };

    // find nearest parent element
    var closest = function closest(el, fn) {
        return el && ( fn(el) ? el : closest(el.parentNode, fn) );
    };

    // triggers when user clicks on thumbnail
    var onThumbnailsClick = function(e) {
        e = e || window.event;
        e.preventDefault ? e.preventDefault() : e.returnValue = false;

        var eTarget = e.target || e.srcElement;

        var clickedListItem = closest(eTarget, function(el) {
            return (el.tagName && el.tagName.toUpperCase() === 'FIGURE');
        });

        if(!clickedListItem) {
            return;
        }


        // find index of clicked item
        var clickedGallery = $(".bok-gallery"),
            childNodes = $(".bok-gallery figure"),
            numChildNodes = childNodes.length,
            nodeIndex = 0,
            index;

        for (var i = 0; i < numChildNodes; i++) {
            if(childNodes[i].nodeType !== 1) { 
                continue; 
            }

            if(childNodes[i] === clickedListItem) {
                index = nodeIndex;
                break;
            }
            nodeIndex++;
        }



        if(index >= 0) {
            openPhotoSwipe( index, clickedGallery );
        }
        return false;
    };

    // parse picture index and gallery index from URL (#&pid=1&gid=2)
    var photoswipeParseHash = function() {
        var hash = window.location.hash.substring(1),
        params = {};

        if(hash.length < 5) {
            return params;
        }

        var vars = hash.split('&');
        for (var i = 0; i < vars.length; i++) {
            if(!vars[i]) {
                continue;
            }
            var pair = vars[i].split('=');  
            if(pair.length < 2) {
                continue;
            }           
            params[pair[0]] = pair[1];
        }

        if(params.gid) {
            params.gid = parseInt(params.gid, 10);
        }

        if(!params.hasOwnProperty('pid')) {
            return params;
        }
        params.pid = parseInt(params.pid, 10);
        return params;
    };

    var openPhotoSwipe = function(index, galleryElement, disableAnimation) {
        var pswpElement = document.querySelectorAll('.pswp')[0],
            gallery,
            options,
            items;

        items = parseThumbnailElements(galleryElement);

        // define options (if needed)
        options = {
            index: index,

            // define gallery index (for URL)
            galleryUID: $(".bok-gallery").attr('data-pswp-uid'),

            getThumbBoundsFn: function(index) {
                // See Options -> getThumbBoundsFn section of docs for more info
                var thumbnail = items[index].el.getElementsByTagName('img')[0], // find thumbnail
                    pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
                    rect = thumbnail.getBoundingClientRect(); 

                return {x:rect.left, y:rect.top + pageYScroll, w:rect.width};
            },

            // history & focus options are disabled on CodePen
            // remove these lines in real life: 
           history: false,
           focus: false 
        
        //,
      //  showHideOpacity:true

        };

        if(disableAnimation) {
            options.showAnimationDuration = 0;
        }

        // Pass data to PhotoSwipe and initialize it
        gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);
        gallery.init();
    };

    // loop through all gallery elements and bind events
    var galleryElements = document.querySelectorAll( gallerySelector );

    for(var i = 0, l = galleryElements.length; i < l; i++) {
        galleryElements[i].setAttribute('data-pswp-uid', i+1);
        galleryElements[i].onclick = onThumbnailsClick;
    }

    // Parse URL and open gallery if it contains #&pid=3&gid=1
    var hashData = photoswipeParseHash();
    if(hashData.pid > 0 && hashData.gid > 0) {
        openPhotoSwipe( hashData.pid - 1 ,  galleryElements[ hashData.gid - 1 ], true );
    }
};
