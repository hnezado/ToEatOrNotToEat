class Smoke{
    constructor(img){
        this.img = img
        this.pos = [Math.floor(Math.random()*80)+30, 300]
        this.randomCropIndex = Math.floor(Math.random()*4)
        this.selectedCrop = this.img.crops[this.randomCropIndex]
        this.movingInterval = null
        this.opacityTimeout = null
        this.opacity = 0
        this.opacityMode = 'up'
        this.done = false

        this.animateSmoke()
    }

    displaySmoke = ()=>{
        ctx.save()
        ctx.globalAlpha = this.opacity
        
        ctx.drawImage(this.img.sheet, this.selectedCrop.x, this.selectedCrop.y,
        this.selectedCrop.w, this.selectedCrop.h,
        this.pos[0], this.pos[1], this.selectedCrop.w, this.selectedCrop.h)
        ctx.restore()
    }

    animateSmoke = ()=>{
        this.animateInterval = setInterval(()=>{
            this.pos[1] -= 8

            this.changeOpacitySmoke()

            if (this.opacity === 0.8 && !this.opacityTimeout){
                this.opacityTimeout = setTimeout(()=>{
                    this.opacityMode = 'down'
                }, 500)
            }
            if (smokesArray[0].done){
                smokesArray.shift()
            }
        }, 50)
    }

    changeOpacitySmoke = ()=>{
        if (this.opacityMode === 'up'){
            this.opacity += 0.05
        } else if (this.opacityMode === 'down'){
            this.opacity -= 0.05
            if (this.opacity < 0) this.opacity = 0
            if (this.opacity === 0) this.done = true
        }
        if (this.opacity > 0.8) this.opacity = 0.8
    }
}
let randomSmokeGenTimeout, smokeGenTimeout
let newSmokeGenerated = false
const genSmokes = ()=>{
    if (!smokeGenTimeout){
        randomSmokeGenTimeout = Math.floor(Math.random()*50)+200
        smokeGenTimeout = setTimeout(()=>{
            smokesArray.push(new Smoke(smokeSpriteSheet))
            newSmokeGenerated = true
        }, randomSmokeGenTimeout)
    }    
    if (newSmokeGenerated){
        newSmokeGenerated = false
        clearTimeout(smokeGenTimeout)
        smokeGenTimeout = null
    }
}