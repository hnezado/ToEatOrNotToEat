// Floor Item class
class FloorItem {
    constructor(img, pos, sizeMult, animInterval, activeImg){
        this.img = img
        this.pos = pos
        sizeMult ? this.sizeMultiplier = sizeMult : this.sizeMultiplier = 1
        animInterval ? this.animInterval = animInterval : this.animInterval = 0
        this.itemCropIndex = 0
        if (this.animInterval && this.img instanceof SpriteSheet){
            this.itemAnimInterval = setInterval(()=>{
                this.itemCropIndex++
                if (this.itemCropIndex > img.totalCrops-1){
                    this.itemCropIndex = 0
                }
            }, this.animInterval)
        }
        this.img instanceof SpriteSheet ? this.width = this.img.cropWidth*this.sizeMultiplier : 
        this.width = this.img.naturalWidth*this.sizeMultiplier
        this.img instanceof SpriteSheet ? this.height = this.img.cropHeight*this.sizeMultiplier : 
        this.height = this.img.naturalHeight*this.sizeMultiplier
        activeImg ? this.activeImg = activeImg : this.activeImg = null
        this.opened = false
    }
    
    displayFloorItem = ()=>{
        if (this.img instanceof SpriteSheet){
            ctx.drawImage(this.img.sheet, 
                this.img.crops[this.itemCropIndex].x, this.img.crops[this.itemCropIndex].y, this.img.crops[this.itemCropIndex].w, this.img.crops[this.itemCropIndex].h,
                this.pos[0], this.pos[1], this.img.crops[this.itemCropIndex].w*this.sizeMultiplier, this.img.crops[this.itemCropIndex].h*this.sizeMultiplier)
        } else {
            if (this.opened){
                ctx.drawImage(this.activeImg, this.pos[0], this.pos[1], this.img.width*this.sizeMultiplier, this.img.height*this.sizeMultiplier)
            } else {
                ctx.drawImage(this.img, this.pos[0], this.pos[1], this.img.width*this.sizeMultiplier, this.img.height*this.sizeMultiplier)
            }
        }
    }
}  


//Inventory Item class
class InventoryItem {
    constructor(img, cookedImg, description, calories, state){
        this.img = img
        this.pos = [0, 0]
        cookedImg ? this.cookedImg = cookedImg : this.cookedImg = null
        this.width = this.img.naturalWidth
        this.height = this.img.naturalHeight

        ctx.font = '20px AlbertTextBold'
        this.description = description
        this.longestText = Math.max(this.description.length, `(${this.foodState}) ${this.calories} calories`.length)
        this.boxWidth = ctx.measureText(' ').width*this.longestText

        calories ? this.boxHeight = 80 : this.boxHeight = 40
        this.showBox = false

        calories ? this.calories = calories : this.calories = null
        
        state ? this.foodState = state : this.foodState = 'raw'
        this.cookedCount = 0
    }

    displayInvItem = ()=>{
        if (this.cooked) {
            ctx.drawImage(this.cookedImg, this.pos[0], this.pos[1], this.width, this.height)
        } else {
            ctx.drawImage(this.img, this.pos[0], this.pos[1], this.width, this.height)
        }
    }

    displayInfoBox = ()=>{
        ctx.fillStyle = 'rgb(0, 0, 0, .7)'
        ctx.fillRect(mousePos[0]+5, mousePos[1]+5, this.boxWidth*2, this.boxHeight)
        ctx.font = '20px AlbertTextBold'
        ctx.fillStyle = 'rgb(255, 255, 255, 1)'
        ctx.fillText(this.description, mousePos[0]+this.boxWidth, mousePos[1]+32)
        if (this.calories){
            ctx.font = '15px AlbertTextBold'
            ctx.fillStyle = 'grey'
            ctx.fillText(`(${this.foodState.charAt(0).toUpperCase() + this.foodState.slice(1)}) ${this.calories} calories`, mousePos[0]+this.boxWidth, mousePos[1]+64)
        }
    }

    pickUpItem = (index)=>{
        game.cursor = this
        itemsInvGrid[index] = 0
    }

    swapItem = (index)=>{
        const itemBuffer = game.cursor
        game.cursor = this
        itemsInvGrid[index] = itemBuffer
    }

    cookFood = (cookingSpeed)=>{
        switch (this.foodState) {
            case 'raw':
                this.cookedCount += cookingSpeed
                if (this.cookedCount >= 100) this.foodState = 'cooked'
                break
            case 'cooked':
                this.cookedCount += cookingSpeed
                if (this.cookedCount > 110) this.foodState = 'burned'
                break
            case 'burned':
                return `It's already burned`
            default:
                return 'Not cookable'
        }
    }
}