let signAnimationReady = true
let signInterval;
const creditsBtn = document.getElementById('credits')
const sign = document.getElementById('sign')
let r = 90, g = 90, b = 90
let blinkCounter = 0
const donateBtn = document.getElementById('donate')
const donateToast = document.getElementById('donate-toast')
const coffees = document.querySelector('#coffee-counter span')
let coffeeCount = 0

const blink = (mode)=>{
    const intervalChange = 20
    if (mode === 'up'){
        clearInterval(signInterval)
        signInterval = setInterval(()=>{
            r < 255 ? r += intervalChange : r = 255
            g < 255 ? g += intervalChange : g = 255
            b < 255 ? b += intervalChange : b = 255
            sign.style.color = `rgb(${r}, ${g}, ${b})`
            if (r === 255) blink('down')
        }, 10)
    } else if (mode === 'down'){
        clearInterval(signInterval)
        signInterval = setInterval(()=>{
            r > 90 ? r -= intervalChange : r = 90
            g > 90 ? g -= intervalChange : g = 90
            b > 90 ? b -= intervalChange : b = 90
            sign.style.color = `rgb(${r}, ${g}, ${b})`
            if (r === 90){
                blinkCounter++
                if (blinkCounter < 3){
                    blink('up')
                } else {
                    clearInterval(signInterval)
                    blinkCounter = 0
                }
            }
        }, 10)
        signAnimationReady = true
    }
}

creditsBtn.onclick = function(){
    blink('up')
}

donateBtn.addEventListener('click', ()=>{
    toast = new bootstrap.Toast(donateToast)
    toast.show()
    coffeeCount++
    coffees.innerText = coffeeCount
})
