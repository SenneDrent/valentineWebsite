window.onload = function() {
    
    let startAnimation = setInterval(beginAnimation, 10);
    let opacity = 0;

    function beginAnimation() {
        opacity += 0.01;
        document.getElementById("mainContainer").style.opacity = opacity;
        if (document.getElementById("mainContainer").style.opacity === "1") {
            clearInterval(startAnimation);
        };
    }    
}

