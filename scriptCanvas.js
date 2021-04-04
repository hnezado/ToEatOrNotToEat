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
    woodenSignImg: new Image(),
    inventoryImg: new Image(),
    barBgImg: new Image(),
    barBlueImg: new Image(),
    barWhiteImg: new Image(),
    barRedImg: new Image(),
    bonfireImg: new SpriteSheet('images/floor-items/bonefire.png', [1, 8]),
    canteenImg: new Image(),
    canteenOpenedImg: new Image(),
    backpackImg: new Image(),
    backpackOpenedImg: new Image(),
    acornsImg: new Image(),
    beehiveImg: new Image(),
    birdImg: new Image(),
    chestnutImg: new Image(),
    cranberriesImg: new Image(),
    eggImg: new Image(),
    fishImg: new Image(),
    flowersImg: new Image(),
    frogImg: new Image(),
    meatImg: new Image(),
    mushroomImg: new Image(),
    rootsImg: new Image(),
    snailsImg: new Image(),
    strawberriesImg: new Image(),
    wildSpinachImg: new Image(),
}
images.bgImg.src = 'images/forest-bg.jpg'
images.fgImg.src = 'images/forest-fg.png'
images.woodenSignImg.src = 'images/wooden-sign.png'
images.inventoryImg.src = 'images/bag.png'
images.barBgImg.src = 'images/bar-bg.png'
images.barBlueImg.src = 'images/bar-blue.png'
images.barWhiteImg.src = 'images/bar-white.png'
images.barRedImg.src = 'images/bar-red.png'
images.canteenImg.src = 'images/floor-items/canteen.png'
images.canteenOpenedImg.src = 'images/floor-items/canteen-opened.png'
images.backpackImg.src = 'images/floor-items/backpack.png'
images.backpackOpenedImg.src = 'images/floor-items/backpack-opened.png'
images.acornsImg.src = 'images/inv-items/acorns.png'
images.beehiveImg.src = 'images/inv-items/beehive.png'
images.birdImg.src = 'images/inv-items/bird.png'
images.chestnutImg.src = 'images/inv-items/chestnut.png'
images.cranberriesImg.src = 'images/inv-items/cranberries.png'
images.eggImg.src = 'images/inv-items/egg.png'
images.fishImg.src = 'images/inv-items/fish.png'
images.flowersImg.src = 'images/inv-items/flowers.png'
images.frogImg.src = 'images/inv-items/frog.png'
images.meatImg.src = 'images/inv-items/meat.png'
images.mushroomImg.src = 'images/inv-items/mushroom.png'
images.rootsImg.src = 'images/inv-items/roots.png'
//images.snailsImg.src = 'images/inv-items/snails.png'
images.strawberriesImg.src = 'images/inv-items/strawberries.png'
images.wildSpinachImg.src = 'images/inv-items/wild-spinach.png'

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
    constructor(img, cookedImg, description){
        this.img = img
        this.pos = [0, 0]
        cookedImg ? this.cookedImg = cookedImg : this.cookedImg = null

        this.cooked = false
        this.description = description
        this.boxSize = [ctx.measureText(this.description).width, 40]
        this.showBox = false
    }

    displayInvItem = ()=>{
        if (this.cooked) {
            ctx.drawImage(this.cookedImg, this.pos[0], this.pos[1], 29, 29)
        } else {
            ctx.drawImage(this.img, this.pos[0], this.pos[1], 29, 29)
        }
    }

    displayInfoBox = ()=>{
        ctx.fillStyle = 'rgb(0, 0, 0, .7)'
        ctx.fillRect(mousePos[0]+5, mousePos[1]+5, this.boxSize[0]*2, this.boxSize[1])
        ctx.font = '20px AlbertTextBold'
        ctx.fillStyle = 'rgb(255, 255, 255, 1)'
        ctx.fillText(this.description, mousePos[0]+15, mousePos[1]+32)
    }
}

// Survivor class
class Survivor {
    constructor(){
        this.hydratation = 50
        this.maxHydratation = 100
        this.hydratationLoss = 0.005
        this.saturation = 50
        this.maxSaturation = 100
        this.saturationLoss = 0.001
        this.wet = 0
        this.maxWet = 50
        this.bodyHeat = 37

        this.drinking = false
        this.openingBag = false
        this.alreadySet = false
        this.timeBuffers = {
            hydratationBuffer: 0,
            saturationBuffer: 0
        }
    }
    
    survivorLoad = ()=>{
        this.loadDebuffs()
    }

    loadDebuffs = ()=>{
        if (!this.alreadySet){
            this.alreadySet = true
            setInterval(()=>{
                this.hydratationDebuff(this.hydratationLoss)
                this.saturationDebuff(this.saturationLoss)
            }, 50)
        }
    }

    hydratationDebuff = (loss)=>{
        this.hydratation -= loss
        if (this.hydratation < 0) this.hydratation = 0
    }

    saturationDebuff = (loss)=>{
        this.saturation -= loss
        if (this.saturation < 0) this.saturation = 0
    }

    drink = ()=>{
        survivor.drinking = true
        this.hydratation += 10
    }
    
    eat = ()=>{
        
    }
    
    searchFood = ()=>{
        
    }
}

// Game class
class Game {
    constructor(){
        this.gameTime = 0
        this.daysCount = 0
        this.opacityInCounter = 0
        this.opacityOutCounter = 0
        this.gameOn = false
        this.intro = true
        this.sound = false
        this.showInventory = false
        this.invPos = [canvas.width*0.5-images.inventoryImg.width*0.5, canvas.height*0.5-images.inventoryImg.height*0.5]
        this.relativePosGrid = {
            1: [25, 26], 2: [65, 26], 3: [106, 26], 4: [146, 26],
            5: [25, 66], 6: [65, 66], 7: [106, 66], 8: [146, 66],
            9: [25, 106], 10: [65, 106], 11: [106, 106], 12: [146, 106],
            13: [25, 146], 14: [65, 146], 15: [106, 146], 9: [146, 146],
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
            this.setGameTime()
            this.update()
        }
    }
    
    setGameTime = ()=>{
        // Game Interval Time (updates every tick/50ms) (gameTime units are seconds)
        setInterval(()=>{
            this.gameTime += 0.05
        }, 50)
    }

    update = ()=>{
        updateMousePos()
        if (!this.intro){
            this.displayBg()
            this.displayFloorItems()
            this.displayFg()
            this.displayInventory()
            this.displayBars()
            survivor.survivorLoad()
            this.checkDays()
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
            this.displayInfoBoxes()
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
        for (let invCell of itemsInvGrid){
            if (invCell instanceof InventoryItem){
                if (checkHoverPos(invCell)){
                    invCell.displayInfoBox()
                }
            }
        }
    }

    displayBars = ()=>{
        hydratationBar.displayBar(survivor.hydratation)
        saturationBar.displayBar(survivor.saturation)
        
        checkHoverPos(hydratationBar) ? hydratationBar.hovering = true : hydratationBar.hovering = false
        checkHoverPos(saturationBar) ? saturationBar.hovering = true : saturationBar.hovering = false
    }
        
    checkDays = ()=>{
        if (Math.floor(this.gameTime%120) === 0){
            this.daysCount = Math.floor(this.gameTime/10)
            woodenSign.showNewDay = true
        }
        woodenSign.displayDays(this.daysCount)
    }

    openCloseInventory = ()=>{
        this.showInventory = !this.showInventory
    }

    pickItem = (item)=>{
        for (let [index, invCell] of itemsInvGrid.entries()){
            if (!(invCell instanceof InventoryItem)){
                itemsInvGrid[index] = item
                itemsInvGrid[index].pos[0] = this.relativePosGrid[index+1][0]
                itemsInvGrid[index].pos[1] = this.relativePosGrid[index+1][1]
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

woodenSign = new WoodenSign(images.woodenSignImg)
hydratationBar = new Bar('Hydratation', images.barBlueImg, images.barBgImg, [20, 15], survivor.hydratation, survivor.maxHydratation, 'rgb(0, 0, 0, 1)')
saturationBar = new Bar('Saturation', images.barWhiteImg, images.barBgImg, [20, 50], survivor.saturation, survivor.maxSaturation, 'rgb(0, 0, 0, 1)')

game.pickItem(new InventoryItem(images.acornsImg, null, 'Couple of acorns'))
game.pickItem(new InventoryItem(images.beehiveImg, null, 'Abandoned beehive'))
game.pickItem(new InventoryItem(images.birdImg, null, 'Plucked bird'))
game.pickItem(new InventoryItem(images.meatImg, null, 'Piece of meat'))
game.pickItem(new InventoryItem(images.wildSpinachImg, null, 'Bunch of wild spinach leaves'))

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

const checkHoverPos = (object)=>{
    if (mousePos[0] > object.pos[0] && mousePos[0] < object.pos[0]+object.img.width &&
        mousePos[1] > object.pos[1] && mousePos[1] < object.pos[1]+object.img.height){
            return true
        } else {return false}
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
                if (!survivor.openingBag){
                    survivor.openingBag = true
                    sounds.zipSound.play()
                    setTimeout(()=>{
                        itemsFloorCollection.backpack.opened = !itemsFloorCollection.backpack.opened
                        game.openCloseInventory()
                        survivor.openingBag = false
                    }, 1000)
                }
    
                // Canteen interaction
            } else if (checkClickPos(event, itemsFloorCollection.canteen)){
                if (!survivor.drinking){
                    survivor.drink()
                    sounds.sipSound.play()
                    itemsFloorCollection.canteen.opened = true
                    setTimeout(()=>{
                        itemsFloorCollection.canteen.opened = false
                        survivor.drinking = false
                    }, 3200)
                }
            }
        }
    }
}


checkSound()
eventHandler()

// debugging
game.gameOn = true
game.intro = false
game.setGameTime()
game.update()