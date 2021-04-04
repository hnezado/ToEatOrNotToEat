const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
let mousePos = [0, 0]

// Sound loadings
const sounds = {
    stepsSound: new Audio('sounds/steps.mp3'),
    paperSound: new Audio('sounds/paper.mp3'),
    coffeeSound: new Audio('sounds/coffee.mp3'),
    forestSound: new Audio('sounds/forest-ambient.mp3'),
    cracklingSound: new Audio('sounds/crackling-fire.mp3'),
    ouchSound: new Audio('sounds/ouch.mp3'),
    sipSound: new Audio('sounds/sip.mp3'),
    zipSound: new Audio('sounds/zip.mp3'),
    yummySound: new Audio('sounds/yummy.mp3'),
    yuckSound: new Audio('sounds/yuck.mp3')
}
sounds.forestSound.loop = true
sounds.cracklingSound.loop = true

// Images loadings
const images = {
    bgImg: new Image(),
    fgImg: new Image(),
    inventoryImg: new Image(),
    bonfireImg: new SpriteSheet('images/floor-items/bonefire.png', [1, 8]),
    canteenImg: new Image(),
    canteenOpenedImg: new Image(),
    backpackImg: new Image(),
    backpackOpenedImg: new Image(),
    acornsImg: new Image()
}
images.bgImg.src = 'images/forest-bg.jpg'
images.fgImg.src = 'images/forest-fg.png'
images.inventoryImg.src = 'images/bag.png'
images.canteenImg.src = 'images/floor-items/canteen.png'
images.canteenOpenedImg.src = 'images/floor-items/canteen-opened.png'
images.backpackImg.src = 'images/floor-items/backpack.png'
images.backpackOpenedImg.src = 'images/floor-items/backpack-opened.png'
images.acornsImg.src = 'images/inv-items/acorns.png'

// Classes
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
    constructor(img, cookedImg){
        this.description = 'A couple of acorns'
        this.img = img
        this.pos
        cookedImg ? this.cookedImg = cookedImg : this.cookedImg = null
        this.cooked = false
    }

    displayInvItem = ()=>{
        if (this.cooked) {
            ctx.drawImage(this.cookedImg, this.pos[0], this.pos[1], 29, 29)
        } else {
            ctx.drawImage(this.img, this.pos[0], this.pos[1], 29, 29)
        }
    }
}

// Survivor class
class Survivor {
    constructor(){
        this.hunger = 100
        this.thirst = 100
        this.wet = 0
        this.heat = 37
        
    }
    
    drink = ()=>{
        
    }
    
    eat = ()=>{
        
    }
    
    searchFood = ()=>{
        
    }
}

// Game class
class Game {
    constructor(){
        this.opacityInCounter = 0
        this.opacityOutCounter = 0
        this.gameOn = false
        this.intro = true
        this.sound = false
        this.showInventory = false
        this.invPos = [canvas.width*0.5-images.inventoryImg.width*0.5, canvas.height*0.5-images.inventoryImg.height*0.5]
        this.relativePosGrid = {
            1: [25, 26], 2: [25+29+11, 26], 3: [25+29*2+18, 26], 4: [25+29*3+27, 26],
            5: [25, 26+29+11], 6: [25+29+11, 26+29+11], 7: [25+29*2+18, 26+29+11], 8: [25+29*3+27, 26+29+11],
            9: [25, 26+29*2+18], 10: [25+29+11, 26+29*2+18], 11: [25+29*2+18, 26+29*2+18], 12: [25+29*3+27, 26+29*2+18],
            13: [25, 26+29*3+27], 14: [25+29+11, 26+29*3+27], 15: [25+29*2+18, 26+29*3+27], 9: [25+29*3+27, 26+29*3+27],
        }
    }

    fadeOut = ()=>{
        this.opacityOutCounter = 0
        const opOutInterval = setInterval(()=>{
            const opacity = this.opacityOutCounter*0.01
            ctx.fillStyle = `rgb(0, 0, 0, ${opacity})`
            ctx.fillRect(0, 0, canvas.width, canvas.height)
            this.opacityOutCounter++
            if (opacity === 0.1) {
                sounds.stepsSound.play()
            }
            if (opacity === 0.3) {
                clearInterval(opOutInterval)
                this.fadeIn()
            }
        }, 50)
    }
    
    fadeIn = ()=>{
        this.opacityInCounter = 100
        sounds.forestSound.play()
        sounds.cracklingSound.play()
        const opInInterval = setInterval(()=>{
            const opacity = this.opacityInCounter*0.01
            this.displayBg()
            this.displayFloorItems()
            this.displayFg()
            ctx.fillStyle = `rgb(0, 0, 0, ${opacity})`
            ctx.fillRect(0, 0, canvas.width, canvas.height)
            if (this.opacityInCounter > 70) this.opacityInCounter--
            if (this.opacityInCounter <= 70 && this.opacityInCounter > 40) this.opacityInCounter -= 1.30
            if (this.opacityInCounter <= 40) this.opacityInCounter -= 1.70
            if (this.opacityInCounter <= 0){
                clearInterval(opInInterval)
                this.intro = false
            }
        }, 50)
    }
    
    startGame = ()=>{
        if (!this.gameOn){
            this.gameOn = true
            this.fadeOut()
            this.update()
        }
    }
    
    update = ()=>{
        updateMousePos()
        if (!this.intro){
            this.displayBg()
            this.displayFloorItems()
            this.displayFg()
            this.displayInventory()

            this.displayInfoBoxes()
        }
        window.requestAnimationFrame(()=>this.update())
    }
    
    displayBg = ()=>{
        ctx.drawImage(images.bgImg, 0, 0, images.bgImg.width, images.bgImg.height)
    }
    
    displayFloorItems = ()=>{
        Object.keys(itemsFloorCollection).forEach((item)=>{
            itemsFloorCollection[item].displayFloorItem()
        })
    }
    
    displayFg = ()=>{
        ctx.drawImage(images.fgImg, 0, 450, images.fgImg.width, images.fgImg.height)
    }
    
    displayInventory = ()=>{
        if (this.showInventory){
            ctx.fillStyle = 'rgb(0, 0, 0, .5)'
            ctx.fillRect(0, 0, canvas.width, canvas.height)
            ctx.drawImage(images.inventoryImg, this.invPos[0], this.invPos[1], 
                images.inventoryImg.naturalWidth, images.inventoryImg.naturalHeight)
            this.displayInvItems()
        }
    }
        
    displayInvItems = ()=>{
        for (let [index, invCell] of itemsInvGrid.entries()){
            if (invCell instanceof InventoryItem){
                invCell.pos = [this.invPos[0]+this.relativePosGrid[index+1][0], 
                    this.invPos[1]+this.relativePosGrid[index+1][1]]
                invCell.displayInvItem()
            }
        }
    }
    
    displayInfoBoxes = ()=>{
        console.log('hi')
        const text = 'A bunch of acorns'
        ctx.fillStyle = 'rgb(0, 0, 0, .5)'
        ctx.fillRect(375, 275, 50, 50)
        ctx.font = '30px AlbertTextBold'
        ctx.fillStyle = 'rgb(255, 255, 255, 1)'
        ctx.fillText(text, mousePos[0]+5, mousePos[1]-5)
    }

    openCloseInventory = ()=>{
        this.showInventory = !this.showInventory
    }

    pickItem = (item)=>{
        for (let [index, invCell] of itemsInvGrid.entries()){
            if (!(invCell instanceof InventoryItem)){
                itemsInvGrid[index] = item
                break
            }
        }
    }
}

// Floor Items Collection
const itemsFloorCollection = {
    bonfire: new FloorItem(images.bonfireImg, [100, 300], 1, 100),
    backpack: new FloorItem(images.backpackImg, [500, 450], 0.2, 0, images.backpackOpenedImg),
    canteen: new FloorItem(images.canteenImg, [440, 450], 0.08, 0, images.canteenOpenedImg),
}

// Items Collection
const itemsInvGrid = [
    0, 0, 0, 0,
    0, 0, 0, 0,
    0, 0, 0, 0,
    0, 0, 0, 0,
]

survivor = new Survivor()
game = new Game()
game.pickItem(new InventoryItem(images.acornsImg))


// General functions
// Update mouse position
updateMousePos = ()=>{
    canvas.onmousemove = (event)=>{
        mousePos = [event.offsetX, event.offsetY]
    }
}

// Sound Checker
const checkSound = ()=>{
    game.sound ? soundBtn.innerHTML = soundIcons.soundOn : soundBtn.innerHTML = soundIcons.soundOff
    if (game.sound){
        Object.keys(sounds).forEach(sound=>{
            sounds[sound].muted = false
        })
    } else {
        Object.keys(sounds).forEach(sound=>{
            sounds[sound].muted = true
        })
    }
}

// Position Click Checker
const checkClickPos = (event, object)=>{
    if (event.offsetX > object.pos[0] && event.offsetX < object.pos[0]+object.width &&
        event.offsetY > object.pos[1] && event.offsetY < object.pos[1]+object.height){
            return true
    } else {return false}
}

const checkHoverPos = ()=>{
    // if (mousePos[0] > )
}

// Event handlers
const eventHandler = ()=>{
    // Web events
    startBtn.onclick = function(){
        game.startGame()
    }
    instructionsBtn.onclick = function(){
        sounds.paperSound.play()
    }
    creditsBtn.onclick = function(){
        blink('up')
    }
    donateBtn.onclick = function(){
        toast = new bootstrap.Toast(donateToast)
        toast.show()
        coffeeCount++
        coffees.innerText = coffeeCount
        sounds.coffeeSound.play()
    } 
    soundBtn.onclick = function(){
        game.sound = !game.sound
        checkSound()
    }

    // Game events
    canvas.onclick = function(event){
        if (game.gameOn && !game.intro){
            // Bonfire interaction
            if (checkClickPos(event, itemsFloorCollection.bonfire)){
                sounds.ouchSound.play()

                // Backpack interaction
            } else if (checkClickPos(event, itemsFloorCollection.backpack)){
                sounds.zipSound.play()
                itemsFloorCollection.backpack.opened = !itemsFloorCollection.backpack.opened
                game.openCloseInventory()

                // Canteen interaction
            } else if (checkClickPos(event, itemsFloorCollection.canteen)){
                sounds.sipSound.play()
                itemsFloorCollection.canteen.opened = !itemsFloorCollection.canteen.opened
            }
        }
    }
}


checkSound()
eventHandler()

// debugging
game.gameOn = true
game.intro = false
game.update()