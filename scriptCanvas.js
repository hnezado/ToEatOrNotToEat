const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
let mousePos = [0, 0]
let mouseClickPos = [0, 0]
ctx.textAlign = 'center'

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
const imagesUrls = {
    bgImg: 'images/forest-bg.jpg',
    fgImg: 'images/forest-fg.png',
    woodenSignImg: 'images/wooden-sign.png',
    inventoryImg: 'images/bag.png',
    barBgImg: 'images/bar-bg.png',
    barBlueImg: 'images/bar-blue.png',
    barWhiteImg: 'images/bar-white.png',
    barRedImg: 'images/bar-red.png',
    canteenImg: 'images/floor-items/canteen.png',
    canteenOpenedImg: 'images/floor-items/canteen-opened.png',
    backpackImg: 'images/floor-items/backpack.png',
    backpackOpenedImg: 'images/floor-items/backpack-opened.png',
    acornsImg: 'images/inv-items/acorns.png',
    beehiveImg: 'images/inv-items/beehive.png',
    birdImg: 'images/inv-items/bird.png',
    chestnutImg: 'images/inv-items/chestnut.png',
    cranberriesImg: 'images/inv-items/cranberries.png',
    eggImg: 'images/inv-items/egg.png',
    fishImg: 'images/inv-items/fish.png',
    flowersImg: 'images/inv-items/flowers.png',
    frogImg: 'images/inv-items/frog.png',
    meatImg: 'images/inv-items/meat.png',
    mushroomImg: 'images/inv-items/mushroom.png',
    rootsImg: 'images/inv-items/roots.png',
    snailsImg: 'images/inv-items/snails.png',
    strawberriesImg: 'images/inv-items/strawberries.png',
    wildSpinachImg: 'images/inv-items/wild-spinach.png',
}

const images = {}

createImages = ()=>{
    Object.keys(imagesUrls).forEach(key=>{
        const img = new Image()
        img.src = imagesUrls[key]
        images[key] = img
    })
    images['bonfireImg'] = new SpriteSheet('images/floor-items/bonefire.png', [1, 8])
    images['mouthImg'] = new SpriteSheet('images/mouth.png', [2, 1])
}
createImages()

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
        this.alreadySetDebuffs = false
        this.timeBuffers = {
            hydratationBuffer: 0,
            saturationBuffer: 0
        }

        this.bonfireAreas = {
            1: [itemsFloorCollection.bonfire.pos[0]+24, itemsFloorCollection.bonfire.pos[1]+23, 100, 150],
            2: [itemsFloorCollection.bonfire.pos[0]+41, itemsFloorCollection.bonfire.pos[1]+73, 66, 100],
            3: [itemsFloorCollection.bonfire.pos[0]+58, itemsFloorCollection.bonfire.pos[1]+123, 33, 50]
        }
        this.printed = false
    }
    
    survivorLoad = ()=>{
        this.loadDebuffs()
        this.cook()
    }

    loadDebuffs = ()=>{
        if (!this.alreadySetDebuffs){
            this.alreadySetDebuffs = true
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
        this.drinking = true
        this.hydratation += 10
        if (this.hydratation > this.maxHydratation) this.hydratation = this.maxHydratation
    }
    
    eat = ()=>{
        // EATING COOLDOWN HERE
        this.eating = true
        sounds.yummySound.play()
        this.saturation += game.cursor.calories
        if (this.saturation > this.maxSaturation) this.saturation = this.maxSaturation
        game.cursor = null
    }
    
    searchFood = ()=>{
        
    }

    cook = ()=>{
        if (game.cursor && !game.showInventory){
            if (checkHoverPos(null, this.bonfireAreas['1'])){
                if (this.printed !== '1'){
                    console.log('1')
                    this.printed = '1'
                    // No entra
                }
            } else if (checkHoverPos(null, this.bonfireAreas['2'])){
                if (this.printed !== '2'){
                    console.log('2')
                    this.printed = '2'
                }
            } else if (checkHoverPos(null, this.bonfireAreas['3'])){
                if (this.printed !== '3'){
                    console.log('3')
                    this.printed = '3'
                }
            }
        }
    }
}

// Game class
class Game {
    constructor(){
        this.cursor = null
        this.gameTime = 0
        this.daysCount = 0
        this.opacityInCounter = 0
        this.opacityOutCounter = 0
        this.gameOn = false
        this.intro = true
        this.sound = true
        this.showInventory = false
        this.invPos = [canvas.width*0.5-images.inventoryImg.width*0.5, canvas.height*0.5-images.inventoryImg.height*0.5]
        this.relativePosGrid = {
            1: [25, 26], 2: [65, 26], 3: [106, 26], 4: [146, 26],
            5: [25, 66], 6: [65, 66], 7: [106, 66], 8: [146, 66],
            9: [25, 106], 10: [65, 106], 11: [106, 106], 12: [146, 106],
            13: [25, 146], 14: [65, 146], 15: [106, 146], 16: [146, 146],
        }
        this.invCellDimensions = [29, 29]
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
            this.displayMouth()
            survivor.survivorLoad()
            this.checkDays()
            this.checkCursor()
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

    displayMouth(){
        if (checkHoverPos(null, mouth.posDim)){
            ctx.drawImage(mouth.img.sheet, mouth.img.crops[1].x, mouth.img.crops[1].y, 
                mouth.img.crops[1].w, mouth.img.crops[1].h,
                mouth.posDim[0], mouth.posDim[1], mouth.img.crops[1].w, mouth.img.crops[1].h)
        } else {
            ctx.drawImage(mouth.img.sheet, 0, 0, mouth.img.crops[0].w, mouth.img.crops[0].h,
                mouth.posDim[0], mouth.posDim[1], mouth.img.crops[0].w, mouth.img.crops[0].h)
        }
    }

    checkDays = ()=>{
        const timeDivisor = 120
        if (Math.floor(this.gameTime%timeDivisor) === 0){
            this.daysCount = Math.floor(this.gameTime/timeDivisor)
            woodenSign.showNewDay = true
        }
        woodenSign.displayDays(this.daysCount)
    }

    openCloseInventory = ()=>{
        survivor.openingBag = true
        sounds.zipSound.play()
        setTimeout(()=>{
            this.showInventory = !this.showInventory
            itemsFloorCollection.backpack.opened = !itemsFloorCollection.backpack.opened
            survivor.openingBag = false
        }, 1000)
    }

    checkCursor = ()=>{
        if (this.cursor) {
            canvas.style.cursor = 'none'
            ctx.drawImage(this.cursor.img, mousePos[0]-this.cursor.width*0.5, 
                mousePos[1]-this.cursor.height*0.5, this.cursor.width, this.cursor.height)
        } else {
            canvas.style.cursor = 'auto'
        }
    }

    putItemInBag = (item)=>{
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
mouth = new Mouth(images.mouthImg, 'closed')

game.putItemInBag(new InventoryItem(images.acornsImg, null, 'Couple of acorns', 120))
game.putItemInBag(new InventoryItem(images.beehiveImg, null, 'Abandoned beehive', 1500, 'broken'))
game.putItemInBag(new InventoryItem(images.birdImg, null, 'Plucked bird', 200))
game.putItemInBag(new InventoryItem(images.meatImg, null, 'Piece of meat', 300))
game.putItemInBag(new InventoryItem(images.wildSpinachImg, null, 'Bunch of wild spinach leaves', 'fresh'))

// General functions
// Update mouse position
updateMousePos = ()=>{
    canvas.onmousemove = (event)=>{
        mousePos = [event.offsetX, event.offsetY]
    }
}

//Update mouse click position
updateMouseClickPos = (event)=>{
    mouseClickPos = [event.offsetX, event.offsetY]
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

// Position Click/Hover Checker
const checkClickPos = (object, pos, dim)=>{
    if (object){
        if (mouseClickPos[0] > object.pos[0] && mouseClickPos[0] < object.pos[0]+object.width &&
            mouseClickPos[1] > object.pos[1] && mouseClickPos[1] < object.pos[1]+object.height){
                return true
        } else {return false}
    } else {
        if (mouseClickPos[0] > pos[0] && mouseClickPos[0] < pos[0]+dim[0] &&
            mouseClickPos[1] > pos[1] && mouseClickPos[1] < pos[1]+dim[1]){
                return true
        } else {return false}
    }
}

const checkHoverPos = (object, posDim)=>{
    if (object){
        if (mousePos[0] > object.pos[0] && mousePos[0] < object.pos[0]+object.img.width &&
            mousePos[1] > object.pos[1] && mousePos[1] < object.pos[1]+object.img.height){
                return true
            } else {return false}
    } else {
        if (mousePos[0] > posDim[0] && mousePos[0] < posDim[0]+posDim[2] &&
            mousePos[1] > posDim[1] && mousePos[1] < posDim[1]+posDim[3]){
                return true
        } else {return false}
    }
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

    // Game events (clicks)
    canvas.onclick = function(event){
        updateMouseClickPos(event)

        if (game.gameOn && !game.intro){
            // Backpack interaction
            if (checkClickPos(itemsFloorCollection.backpack)){
                if (!survivor.openingBag){
                    game.openCloseInventory()
                }
            }

            if (game.cursor){
                // Mouth interaction
                console.log(mouseClickPos)
                console.log([mouth.posDim[0], mouth.posDim[1]], [mouth.posDim[2], mouth.posDim[3]])
                if (checkClickPos(null, [mouth.posDim[0], mouth.posDim[1]], [mouth.posDim[2], mouth.posDim[3]])){
                    survivor.eat()
                }
            }

            // Inventory interactions
            if (game.showInventory){
                // Inventory Items interactions
                Object.entries(game.relativePosGrid).forEach(invCell=>{
                    if (checkClickPos(null, [invCell[1][0]+game.invPos[0], invCell[1][1]+game.invPos[1]], game.invCellDimensions)){
                        if (itemsInvGrid[invCell[0]-1] instanceof InventoryItem){
                            if (!game.cursor){
                                itemsInvGrid[invCell[0]-1].pickUpItem(invCell[0]-1)
                            } else {
                                itemsInvGrid[invCell[0]-1].swapItem(invCell[0]-1)
                            }
                        } else {
                            if (game.cursor){
                                itemsInvGrid[invCell[0]-1] = game.cursor
                                game.cursor = null
                            }
                        }
                    }
                })
            } else {
                    if (!game.cursor){
                        // Environment interactions
                        // Bonfire interaction
                        if (checkClickPos(itemsFloorCollection.bonfire)){
                            sounds.ouchSound.play()
                
                            // Canteen interaction
                        } else if (checkClickPos(itemsFloorCollection.canteen)){
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
    }
}


checkSound()
eventHandler()

// debugging
// game.gameOn = true
// game.intro = false
// game.setGameTime()
// game.openCloseInventory()
// game.update()