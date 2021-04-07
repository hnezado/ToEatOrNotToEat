const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
let mousePos = [0, 0]
let mouseClickPos = [0, 0]
ctx.textAlign = 'center'

createImages = ()=>{
    Object.keys(imagesUrls).forEach(key=>{
        const img = new Image()
        img.src = imagesUrls[key]
        img.onload = ()=>{
            images[key] = img
            if (Object.keys(images).length === Object.keys(imagesUrls).length){
                initialSetting()
            }
        }
    })
}
createImages()

// Survivor class
class Survivor {
    constructor(){
        this.hydration = 100
        this.maxHydration = 100
        this.hydrationLoss = 0.035
        this.saturation = 100
        this.maxSaturation = 100
        this.saturationLoss = 0.03
        this.wet = 0
        this.maxWet = 50
        this.bodyHeat = 37

        this.drinking = false
        this.eating = false
        this.openingBag = false
        this.alreadySetDebuffs = false
        this.timeBuffers = {
            hydrationBuffer: 0,
            saturationBuffer: 0
        }
        this.canteenCharges = 0
        this.maxCanteenCharges = 15
    }
    
    survivorLoad = ()=>{
        this.loadDebuffs()
        this.cook()
    }

    loadDebuffs = ()=>{
        if (!this.alreadySetDebuffs){
            this.alreadySetDebuffs = true
            setInterval(()=>{
                this.hydrationDebuff(this.hydrationLoss)
                this.saturationDebuff(this.saturationLoss)
            }, 50)
        }
    }

    hydrationDebuff = (loss)=>{
        this.hydration -= loss
        this.checkStatsLimits()
    }

    saturationDebuff = (loss)=>{
        this.saturation -= loss
        this.checkStatsLimits()
    }

    statsPenalty = (qty)=>{
        this.hydration -= qty
        this.saturation -= qty
        this.checkStatsLimits()
    }

    checkStatsLimits = ()=>{
        if (this.hydration < 0) this.hydration = 0
        if (this.saturation < 0) this.saturation = 0
        if (this.hydration > this.maxHydration) this.hydration = this.maxHydration
        if (this.saturation > this.maxSaturation) this.saturation = this.maxSaturation
        if (this.canteenCharges < 0) this.canteenCharges = 0
        if (this.canteenCharges > this.maxCanteenCharges) this.canteenCharges = this.maxCanteenCharges
    }

    checkDeath = ()=>{
        let deathCause = ''
        if (this.hydration === 0) deathCause = 'dehydration'
        if (this.saturation === 0) deathCause = 'starvation'
        if (this.bodyHeat < 28) deathCause = 'hypothermia'
        if (this.bodyHeat > 44) deathCause = 'heatstroke'
        
        if (deathCause){
            return deathCause
        } else {
            return false
        }
    }

    drink = ()=>{
        if (!this.drinking){
            this.drinking = true
            itemsFloorCollection.canteen.active = true
            
            if (this.canteenCharges > 0){
                sounds.sipSound.play()
                this.canteenCharges--
                this.hydration += Math.floor(Math.random()*20)+10
                this.checkStatsLimits()
            } else {
                sounds.emptySound.play()
            }
            
            setTimeout(()=>{
                itemsFloorCollection.canteen.active = false
                this.drinking = false
            }, 3200)
        }
    }
    
    eat = ()=>{
        if (!this.eating){
            this.eating = true
            sounds.chewSound.play()
            this.saturation += game.cursor.calories*0.05
            this.checkStatsLimits()

            setTimeout(()=>{this.eating = false}, 3500)
            if (game.cursor.type === 'meat' && game.cursor.state === 'raw' || game.cursor.state === 'burned'){
                setTimeout(()=>{sounds.yuckSound.play()}, 2000)
            } else if (game.cursor.calories > 500 || game.cursor.state === 'cooked'){
                setTimeout(()=>{sounds.yummySound.play()}, 2000)
            }
            game.cursor = null
        }
    }
    
    search = ()=>{
        game.intro = true
        game.fadeOut()
        this.canteenCharges += Math.floor(Math.random()*3)+this.maxCanteenCharges-3
        const itemsGen = itemsGeneration.genItems()
        this.statsPenalty(itemsGen.length*5)
        game.putItemInBag(itemsGen)
    }

    cook = ()=>{
        if (fire.hoveringFire){
            const cookingHeat = 10
            if (game.cursor) game.cursor.cookItem(cookingHeat)
        }
    }

}

// Game class
class Game {
    constructor(){
        this.gameOver = false
        this.showGameOver = true
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
        itemsFloorCollection['footprints'].active = false
        const opInInterval = setInterval(()=>{
            const opacity = this.opacityInCounter*0.01
            this.displayBg()
            this.displayFloorItems()
            this.displayFg()
            this.displayBars()
            this.checkDays()
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

    checkSound = ()=>{
        this.sound ? soundBtn.innerHTML = soundIcons.soundOn : soundBtn.innerHTML = soundIcons.soundOff
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
            if (!this.gameOver){
                this.displayBg()
                this.displayFloorItems()
                this.displayFg()
                this.displayInventory()
                this.displayBars()
                this.displayMouth()
                survivor.survivorLoad()
                this.checkDays()
                this.checkCursor()
                this.checkGeneralHover()
            }
            this.checkGameOver()
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
            this.displayInfoBoxes(mousePos)
        }
    }  

    displayInvItems = ()=>{
        for (let [index, invCell] of itemsInvGrid.entries()){
            if (invCell instanceof InventoryItem){
                invCell.posDim[0] = this.invPos[0]+this.relativePosGrid[index+1][0]
                invCell.posDim[1] = this.invPos[1]+this.relativePosGrid[index+1][1]
                invCell.displayInvItem()
            }
        }
    }

    displayInfoBoxes = (mousePos)=>{
        for (let invCell of itemsInvGrid){
            if (invCell instanceof InventoryItem){
                if (checkHoverPos(mousePos, invCell.posDim)){
                    invCell.displayInfoBox(mousePos)
                }
            }
        }
    }

    displayBars = ()=>{
        hydrationBar.displayBar(survivor.hydration)
        saturationBar.displayBar(survivor.saturation)
        
        checkHoverPos(mousePos, hydrationBar.posDim) ? hydrationBar.hovering = true : hydrationBar.hovering = false
        checkHoverPos(mousePos, saturationBar.posDim) ? saturationBar.hovering = true : saturationBar.hovering = false
    }
    
    displayMouth(){
        if (this.cursor){
            if (checkHoverPos(mousePos, mouth.posDim) && this.cursor){
                ctx.drawImage(mouth.img.sheet, mouth.img.crops[1].x, mouth.img.crops[1].y, 
                    mouth.img.crops[1].w, mouth.img.crops[1].h,
                    mouth.posDim[0], mouth.posDim[1], mouth.img.crops[1].w, mouth.img.crops[1].h)
            } else {
                ctx.drawImage(mouth.img.sheet, 0, 0, mouth.img.crops[0].w, mouth.img.crops[0].h,
                    mouth.posDim[0], mouth.posDim[1], mouth.img.crops[0].w, mouth.img.crops[0].h)
            }
        }
    }

    checkDays = ()=>{
        const timeDivisor = 24
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
            if (!this.showInventory){
                this.showInventory = true
                itemsFloorCollection.backpack.active = true
            } else {
                this.showInventory = false
                itemsFloorCollection.backpack.active = false
            }
            survivor.openingBag = false
        }, 1000)
    }

    checkCursor = ()=>{
        if (this.cursor) {
            canvas.style.cursor = 'none'
            this.cursor.displayInvItem(mousePos)
        } else {
            canvas.style.cursor = `url('images/cursor.png'), auto`
        }
    }

    checkGeneralHover = ()=>{
        if (!this.showInventory){
            fire.checkFireHover(mousePos)
            if (checkHoverPos(mousePos, itemsFloorCollection['footprints'].posDim)){
                itemsFloorCollection['footprints'].active = true
            } else {itemsFloorCollection['footprints'].active = false}
        }
    }

    putItemInBag = (item)=>{
        if (item instanceof Array){
            for (let itm of item){
                for (let [index, invCell] of Object.entries(itemsInvGrid)){
                    if (!(invCell instanceof InventoryItem)){
                        itemsInvGrid[index] = itm
                        itemsInvGrid[index].posDim[0] = this.relativePosGrid[Number(index)+1][0]
                        itemsInvGrid[index].posDim[1] = this.relativePosGrid[Number(index)+1][1]
                        break
                    }
                }
            }
            
        } else {
            for (let [index, invCell] of Object.entries(itemsInvGrid)){
                if (!(invCell instanceof InventoryItem)){
                    itemsInvGrid[index] = item
                    itemsInvGrid[index].posDim[0] = this.relativePosGrid[Number(index)+1][0]
                    itemsInvGrid[index].posDim[1] = this.relativePosGrid[Number(index)+1][1]
                    break
                }
            }
        }
    }
    
    checkGameOver = ()=>{
        if (survivor.checkDeath()){
            clearTimeout(fire.overFireTimeOut)
            clearTimeout(fire.hurtCooldown)
            this.cursor = null
            this.checkCursor()
            this.gameOver = true
            if (this.gameOver && this.showGameOver){
                sounds.cracklingSound.pause()
                sounds.forestSound.pause()
                sounds.bellSound.play()
                this.showGameOver = false
                this.gameOn = false
                ctx.fillStyle = 'rgb(0, 0, 0, .5)'
                ctx.fillRect(0, 0, canvas.width, canvas.height)
                ctx.font = '60px AlbertTextBold'
                ctx.fillStyle = 'red'
                ctx.fillText(`You died of ${survivor.checkDeath()}!`, canvas.width*0.5, canvas.height*0.4)
                ctx.fillStyle = 'red'
                ctx.font = '50px AlbertTextBold'
                if (this.gameTime/24 > 1){
                    ctx.fillText(`You survived ${Math.floor(this.gameTime/24)} days and ${Math.floor(this.gameTime%24)} hours`, canvas.width*0.5, canvas.height*0.6)
                } else if(this.gameTime/24 === 1) {
                    ctx.fillText(`You survived ${Math.floor(this.gameTime/24)} day and ${Math.floor(this.gameTime%24)} hours`, canvas.width*0.5, canvas.height*0.6)
                } else {
                    ctx.fillText(`You survived ${Math.floor(this.gameTime%24)} hours`, canvas.width*0.5, canvas.height*0.6)
                }
                startBtn.innerText = 'New game'
            }
        }
    }
}

// Items Collection
const itemsInvGrid = [
    0, 0, 0, 0,
    0, 0, 0, 0,
    0, 0, 0, 0,
    0, 0, 0, 0,
]
let itemsFloorCollection

// SpriteSheets declarations
let bonfireSpriteSheet, mouthSpriteSheet, footprintsSpriteSheet, canteenSpriteSheet, backpackSpriteSheet

// Instances declarations
let survivor, game, woodenSign, hydrationBar, saturationBar, mouth

const initialSetting = ()=>{
    // SpriteSheet object loadings here
    bonfireSpriteSheet = new SpriteSheet(images.bonfireImg, [1, 8])
    mouthSpriteSheet = new SpriteSheet(images.mouthImg, [2, 1])
    footprintsSpriteSheet = new SpriteSheet(images.footprintsImg, [2, 1])
    canteenSpriteSheet = new SpriteSheet(images.canteenImg, [2, 1])
    backpackSpriteSheet = new SpriteSheet(images.backpackImg, [2, 1])
    
    // Floor Items Collection
    itemsFloorCollection = {
        bonfire: new FloorItem(bonfireSpriteSheet, [100, 300], 100),
        footprints: new FloorItem(footprintsSpriteSheet, [700, 420]),
        canteen: new FloorItem(canteenSpriteSheet, [440, 450]),
        backpack: new FloorItem(backpackSpriteSheet, [500, 450]),
    }

    survivor = new Survivor()
    game = new Game()
    itemsGeneration = new ItemGeneration()

    woodenSign = new WoodenSign(images.woodenSignImg)
    hydrationBar = new Bar('Hydration', images.barBlueImg, images.barBgImg, [20, 15], survivor.hydration, survivor.maxHydration, 'rgb(0, 0, 0, 1)')
    saturationBar = new Bar('Saturation', images.barWhiteImg, images.barBgImg, [20, 50], survivor.saturation, survivor.maxSaturation, 'rgb(0, 0, 0, 1)')
    mouth = new Mouth(mouthSpriteSheet, 'closed')
    fire = new Fire(itemsFloorCollection.bonfire)
    
    game.putItemInBag(itemsGeneration.genItems(3))

    game.checkSound()
    eventHandler()
}

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

// Event handlers
const eventHandler = ()=>{
    // Web events
    startBtn.onclick = function(){
        startBtn.innerText = 'Start game'
        if (!game.gameOn){
            survivor = new Survivor()
            game = new Game()
            game.startGame()
        }
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
        game.checkSound()
    }

    // Game events (clicks)
    canvas.onclick = function(event){
        updateMouseClickPos(event)

        if (game.gameOn && !game.intro){
            // Backpack interaction
            if (checkClickPos(mouseClickPos, itemsFloorCollection.backpack.posDim)){
                if (!survivor.openingBag){
                    game.openCloseInventory()
                }
            }

            if (game.cursor){
                // Mouth interaction
                if (checkClickPos(mouseClickPos, mouth.posDim)){
                    survivor.eat()
                }
            }

            // Inventory interactions
            if (game.showInventory){
                // Inventory Items interactions
                Object.entries(game.relativePosGrid).forEach(invCell=>{
                    if (checkClickPos(mouseClickPos, [invCell[1][0]+game.invPos[0], invCell[1][1]+game.invPos[1], game.invCellDimensions[0], game.invCellDimensions[1]])){
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
                    if (checkClickPos(mouseClickPos, itemsFloorCollection.bonfire.posDim)){
                        sounds.ouchSound.play()
                        survivor.statsPenalty(Math.floor(Math.random()*8)+12)
                    }
                    // Canteen interaction
                    if (checkClickPos(mouseClickPos, itemsFloorCollection.canteen.posDim)){
                        survivor.drink()
                    }
                    // Footprints
                    if (checkClickPos(mouseClickPos, itemsFloorCollection.footprints.posDim)){
                        survivor.search()
                    }
                }
            }
        }
    }
}
