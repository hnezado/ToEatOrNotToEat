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

// Inventory Item class
class InventoryItem {
    constructor(){
        this.img
        this.width
        this.height
        this.posDim

        this.calories

        this.description
        this.boxWidth = 30
        this.boxHeight = 80
        this.showBox = false

        this.cookCounter = 0
        this.cookedCount = 0
    }

    getInitialVariables = ()=>{
        this.img instanceof SpriteSheet ? this.width = this.img.cropWidth : this.width = this.img.naturalWidth
        this.img instanceof SpriteSheet ? this.height = this.img.cropHeight : this.height = this.img.naturalHeight
        this.posDim = [0, 0, this.width, this.height]
        this.boxWidth = ctx.measureText(' ').width*this.longestText
    }

    displayInvItem = (mousePos)=>{
        if (mousePos){
            if (this.state === 'burned'){
                ctx.drawImage(this.img.sheet, this.img.crops[3].x, this.img.crops[3].y,
                    this.img.crops[3].w, this.img.crops[3].h,
                    mousePos[0]-this.width*0.5,  mousePos[1]-this.height*0.5, this.width, this.height)
            } else if (this.state === 'cooked') {
                ctx.drawImage(this.img.sheet, this.img.crops[1].x, this.img.crops[1].y,
                    this.img.crops[1].w, this.img.crops[1].h,
                    mousePos[0]-this.width*0.5,  mousePos[1]-this.height*0.5, this.width, this.height)
            } else {
                ctx.drawImage(this.img.sheet, this.img.crops[0].x, this.img.crops[0].y,
                    this.img.crops[0].w, this.img.crops[0].h,
                    mousePos[0]-this.width*0.5,  mousePos[1]-this.height*0.5, this.width, this.height)
            }
        } else {
            if (this.state === 'burned'){
                ctx.drawImage(this.img.sheet, this.img.crops[3].x, this.img.crops[3].y,
                    this.img.crops[3].w, this.img.crops[3].h,
                    this.posDim[0], this.posDim[1], this.width, this.height)
            } else if (this.state === 'cooked') {
                ctx.drawImage(this.img.sheet, this.img.crops[1].x, this.img.crops[1].y,
                    this.img.crops[1].w, this.img.crops[1].h,
                    this.posDim[0], this.posDim[1], this.width, this.height)
            } else {
                ctx.drawImage(this.img.sheet, this.img.crops[0].x, this.img.crops[0].y,
                    this.img.crops[0].w, this.img.crops[0].h,
                    this.posDim[0], this.posDim[1], this.width, this.height)
            }
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
        super()
        this.name = 'acorns'
        this.type = 'fruit'
        this.img = new SpriteSheet(images.acornsImg, [3, 1])
        this.description = 'Couple of acorns'
        this.calories = 120
        this.cookingTime = 2000
        this.state = 'raw'
        this.rarity = 75
        this.getInitialVariables()
    }
}

class Beehive extends InventoryItem{
    constructor(){
        super()
        this.name = 'beehive'
        this.type = 'misc'
        this.img = new SpriteSheet(images.beehiveImg, [2, 1])
        this.description = 'Abandoned beehive'
        this.calories = 1200
        this.cookingTime = 0
        this.state = 'raw'
        this.rarity = 5
        this.getInitialVariables()
    }
}

class Bird extends InventoryItem{
    constructor(){
        super()
        this.name = 'bird'
        this.type = 'meat'
        this.img = new SpriteSheet(images.birdImg, [3, 1])
        this.description = 'Plucked bird'
        this.calories = 200
        this.cookingTime = 6000
        this.state = 'raw'
        this.rarity = 45
        this.getInitialVariables()
    }
}

class Chestnut extends InventoryItem{
    constructor(){
        super()
        this.name = 'chestnut'
        this.type = 'fruit'
        this.img = new SpriteSheet(images.chestnutImg, [3, 1])
        this.description = 'Mature chestnut'
        this.calories = 150
        this.cookingTime = 2000
        this.state = 'raw'
        this.rarity = 70
        this.getInitialVariables()
    }
}

class Cranberries extends InventoryItem{
    constructor(){
        super()
        this.name = 'cranberries'
        this.type = 'fruit'
        this.img = new SpriteSheet(images.cranberriesImg, [2, 1])
        this.description = 'Some cranberries'
        this.calories = 100
        this.cookingTime = 0
        this.state = 'raw'
        this.rarity = 80
        this.getInitialVariables()
    }
}

class Egg extends InventoryItem{
    constructor(){
        super()
        this.name = 'egg'
        this.type = 'meat'
        this.img = new SpriteSheet(images.eggImg, [3, 1])
        this.description = 'Egg from an unknow bird'
        this.calories = 180
        this.cookingTime = 1500
        this.state = 'raw'
        this.rarity = 55
        this.getInitialVariables()
    }
}

class Fish extends InventoryItem{
    constructor(){
        super()
        this.name = 'fish'
        this.type = 'meat'
        this.img = new SpriteSheet(images.fishImg, [3, 1])
        this.description = 'Fish recently catched'
        this.calories = 220
        this.cookingTime = 5000
        this.state = 'raw'
        this.rarity = 60
        this.getInitialVariables()
    }
}

class Flowers extends InventoryItem{
    constructor(){
        super()
        this.name = 'flowers'
        this.type = 'plant'
        this.img = new SpriteSheet(images.flowersImg, [2, 1])
        this.description = 'A bunch of flowers'
        this.calories = 40
        this.cookingTime = 0
        this.state = 'raw'
        this.rarity = 90
        this.getInitialVariables()
    }
}

class Frog extends InventoryItem{
    constructor(){
        super()
        this.name = 'frog'
        this.type = 'meat'
        this.img = new SpriteSheet(images.frogImg, [3, 1])
        this.description = 'Pond frog'
        this.calories = 150
        this.cookingTime = 3500
        this.state = 'raw'
        this.rarity = 40
        this.getInitialVariables()
    }
}

class Maggot extends InventoryItem{
    constructor(){
        super()
        this.name = 'maggot'
        this.type = 'meat'
        this.img = new SpriteSheet(images.maggotImg, [3, 1])
        this.description = 'Moving maggot'
        this.calories = 180
        this.cookingTime = 1500
        this.state = 'raw'
        this.rarity = 85
        this.getInitialVariables()
    }
}

class Meat extends InventoryItem{
    constructor(){
        super()
        this.name = 'meat'
        this.type = 'meat'
        this.img = new SpriteSheet(images.meatImg, [3, 1])
        this.description = 'A piece of meat'
        this.calories = 500
        this.cookingTime = 8000
        this.state = 'raw'
        this.rarity = 15
        this.getInitialVariables()
    }
}

class Mushroom extends InventoryItem{
    constructor(){
        super()
        this.name = 'acorns'
        this.type = 'plant'
        this.img = new SpriteSheet(images.mushroomImg, [3, 1])
        this.description = 'Healthy mushroom'
        this.calories = 150
        this.cookingTime = 1200
        this.state = 'raw'
        this.rarity = 20
        this.getInitialVariables()
    }
}

class Roots extends InventoryItem{
    constructor(){
        super()
        this.name = 'roots'
        this.type = 'plant'
        this.img = new SpriteSheet(images.rootsImg, [3, 1])
        this.description = 'Edible roots'
        this.calories = 120
        this.cookingTime = 4000
        this.state = 'raw'
        this.rarity = 80
        this.getInitialVariables()
    }
}

class Snails extends InventoryItem{
    constructor(){
        super()
        this.name = 'snails'
        this.type = 'meat'
        this.img = new SpriteSheet(images.snailsImg, [3, 1])
        this.description = 'Some small snails'
        this.calories = 160
        this.cookingTime = 3000
        this.state = 'raw'
        this.rarity = 50
        this.getInitialVariables()
    }
}

class Strawberries extends InventoryItem{
    constructor(){
        super()
        this.name = 'strawberries'
        this.type = 'fruit'
        this.img = new SpriteSheet(images.strawberriesImg, [2, 1])
        this.description = 'Couple of strawberries'
        this.calories = 300
        this.cookingTime = 0
        this.state = 'raw'
        this.rarity = 25
        this.getInitialVariables()
    }
}

class WildSpinach extends InventoryItem{
    constructor(){
        super()
        this.name = 'wild-spinach'
        this.type = 'plant'
        this.img = new SpriteSheet(images.wildSpinachImg, [3, 1])
        this.description = 'Bunch of wild spinach leaves'
        this.calories = 80
        this.cookingTime = 1500
        this.state = 'raw'
        this.rarity = 75
        this.getInitialVariables()
    }
}

// Item generation
class ItemGeneration{
    constructor(){
        this.allItems = ['acorns', 'beehive', 'bird', 'chestnut', 'cranberries', 'egg', 'fish', 'flowers', 'frog', 'maggot', 'meat', 'mushroom', 'roots', 'snails', 'strawberries', 'wild-spinach']
        this.itemsByWeightArray = this.getItemsByWeight()
    }

    genSingleItem = (itemName)=>{
        if (itemName === 'acorns') return new Acorns()
        if (itemName === 'beehive') return new Beehive()
        if (itemName === 'bird') return new Bird()
        if (itemName === 'chestnut') return new Chestnut()
        if (itemName === 'cranberries') return new Cranberries()
        if (itemName === 'egg') return new Egg()
        if (itemName === 'fish') return new Fish()
        if (itemName === 'flowers') return new Flowers()
        if (itemName === 'frog') return new Frog()
        if (itemName === 'maggot') return new Maggot()
        if (itemName === 'meat') return new Meat()
        if (itemName === 'mushroom') return new Mushroom()
        if (itemName === 'roots') return new Roots()
        if (itemName === 'snails') return new Snails()
        if (itemName === 'strawberries') return new Strawberries()
        if (itemName === 'wild-spinach') return new WildSpinach()
    }
    
    getItemsByWeight = ()=>{
        const itemsWeightArray = []
        const itemsArray = []
        for (let itemName of this.allItems){
            const instance = this.genSingleItem(itemName)
            itemsWeightArray.push([itemName, instance.rarity])
        }
        for (let i = 0; i < itemsWeightArray.length; i++){
            for (let j = 0; j < itemsWeightArray[i][1]; j++){
                itemsArray.push(this.genSingleItem(itemsWeightArray[i][0]))
            }
        }
        return itemsArray
    }

    genItems = (maxItems)=>{
        // Every item is generated a given number of times (if not given is random until 16 -> max sockets)
        // If a generation is a success the next generation will have lower chance to generate

        let numOfItems
        if (maxItems) {
            numOfItems = Math.floor(Math.random()*maxItems)+1
        } else {
            const randomMaxItems = Math.floor(Math.random()*16)
            numOfItems = Math.floor(Math.random()*randomMaxItems)+1
        }

        const generatedItems = []
        let chance = 80
        for (let i=0; i<numOfItems;i++){
            const chanceRandom = Math.floor(Math.random()*100)
            const randomIndex = Math.floor(Math.random()*this.itemsByWeightArray.length)
            if (chanceRandom < chance) {
                generatedItems.push(this.itemsByWeightArray.splice(randomIndex, 1)[0])
                chance -= 5
            } 
        }
        return generatedItems
    }
}