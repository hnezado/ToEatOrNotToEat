// Floor Item class
class FloorItem {
    constructor(img, pos, animInterval){
        this.img = img

        this.img instanceof SpriteSheet ? this.width = this.img.cropWidth : this.width = this.img.naturalWidth
        this.img instanceof SpriteSheet ? this.height = this.img.cropHeight : this.height = this.img.naturalHeight
        this.posDim = [pos[0], pos[1], this.width, this.height]

        animInterval ? this.animInterval = animInterval : this.animInterval = null
        this.itemCropIndex = 0
        if (this.animInterval && this.img instanceof SpriteSheet){
            this.itemAnimInterval = setInterval(()=>{
                this.itemCropIndex++
                if (this.itemCropIndex > img.totalCrops-1){
                    this.itemCropIndex = 0
                }
            }, this.animInterval)
        }
        
        this.active = false
    }
    
    displayFloorItem = ()=>{
        if (this.animInterval){
            ctx.drawImage(this.img.sheet, 
                this.img.crops[this.itemCropIndex].x, this.img.crops[this.itemCropIndex].y, 
                this.img.crops[this.itemCropIndex].w, this.img.crops[this.itemCropIndex].h,
                this.posDim[0], this.posDim[1], 
                this.img.crops[this.itemCropIndex].w, this.img.crops[this.itemCropIndex].h)
        } else {
            if (this.active){
                ctx.drawImage(this.img.sheet, 
                    this.img.crops[1].x, this.img.crops[1].y, 
                    this.img.crops[1].w, this.img.crops[1].h, 
                    this.posDim[0], this.posDim[1], 
                    this.width, this.height)
            } else {
                ctx.drawImage(this.img.sheet, 
                    this.img.crops[0].x, this.img.crops[0].y,
                    this.img.crops[0].w, this.img.crops[0].h,
                    this.posDim[0], this.posDim[1], 
                    this.width, this.height)
            }
        }
    }
}  


//Inventory Item class
class InventoryItem {
    constructor(){
        this.img
        this.width = this.img.naturalWidth
        this.height = this.img.naturalHeight
        this.posDim = [0, 0, this.width, this.height]

        ctx.font = '20px AlbertTextBold'
        this.description = description
        this.longestText = Math.max(this.description.length, `(${this.foodState}) ${this.calories} calories`.length)
        this.boxWidth = ctx.measureText(' ').width*this.longestText

        calories ? this.boxHeight = 80 : this.boxHeight = 40
        this.showBox = false

        calories ? this.calories = calories : this.calories = 0
        
        this.cookCounter = 0
        state ? this.foodState = state : this.foodState = 'raw'
        this.cookedCount = 0
    }

    displayInvItem = ()=>{
        if (this.cooked) {
            ctx.drawImage(this.cookedImg, this.posDim[0], this.posDim[1], this.width, this.height)
        } else {
            ctx.drawImage(this.img, this.posDim[0], this.posDim[1], this.width, this.height)
        }
    }

    displayInfoBox = (mousePos)=>{
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

    // Not sure about this one
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

class Acorns extends InventoryItem{
    constructor(){
        this.name = 'acorns'
        this.img = images.acornsImg
        this.description = 'Couple of acorns'

    }
}

const generateItem = (item)=>{
    // numOfItems = Math.floor(Math.random()*maxItems)+1
    // for (let i=0; i<numOfItems;i++){
    //     chanceToGen = Math.floor(Math.random()*100)+1
    if (item === 'acorns') return Acorns()
    if (item === 'beehive') return Beehive()
    if (item === 'bird') return Bird()
    if (item === 'chestnut') return Chestnut()
    if (item === 'cranberries') return Cranberries()
    if (item === 'egg') return Egg()
    if (item === 'fish') return Fish()
    if (item === 'flowers') return Flowers()
    if (item === 'frog') return Frog()
    if (item === 'maggot') return Maggot()
    if (item === 'meat') return Meat()
    if (item === 'mushroom') return Mushroom()
    if (item === 'roots') return Roots()
    if (item === 'snails') return Snails()
    if (item === 'strawberries') return Strawberries()
    if (item === 'wild-spinach') return WildSpinach()
}