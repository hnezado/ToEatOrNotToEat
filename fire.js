class Fire{
    constructor(bonfireObject){
        this.bonfireObj = bonfireObject
        this.bonfireAreas = {
            1: [itemsFloorCollection.bonfire.posDim[0]+24, itemsFloorCollection.bonfire.posDim[1]+23, 100, 150],
            2: [itemsFloorCollection.bonfire.posDim[0]+41, itemsFloorCollection.bonfire.posDim[1]+73, 66, 100],
            3: [itemsFloorCollection.bonfire.posDim[0]+58, itemsFloorCollection.bonfire.posDim[1]+123, 33, 50]
        }
        this.overFireIntervalSet = false
        this.overFireTimeOut = null
        this.hurtCooldownSet = false
        this.hurtCooldown = null
        this.timeOnFireCounter = 0

        this.hoveringFire = false
    }

    checkFireHover = (mousePos)=>{
        if (checkHoverPos(mousePos, this.bonfireObj.posDim)){
            if (!this.overFireIntervalSet){
                this.overFireTimeOut = setTimeout(()=>{
                    this.timeOnFireCounter += 1000
                }, 500)
                this.overFireIntervalSet = true
            }
            if (this.timeOnFireCounter >= 1000 && !this.hurtCooldownSet){
                this.hurtCooldown = setInterval(()=>{
                    sounds.ouchSound.play()
                    survivor.statsPenalty(Math.floor(Math.random()*10)+20)
                }, 1000)
                this.hurtCooldownSet = true
                this.hoveringFire = true
            }
        } else {
            clearTimeout(this.overFireTimeOut)
            clearTimeout(this.hurtCooldown)
            this.overFireIntervalSet = false
            this.hurtCooldownSet = false
            this.timeOnFireCounter = 0
            this.hoveringFire = false
        }
        
        // if (checkHoverPos(mousePos, this.bonfireAreas['3'])){
        //     if (!this.overFireIntervalSet){
        //         this.overFireTimeOut = setTimeout(()=>{
        //             this.timeOnFireCounter += 1000
        //         }, 500)
        //         this.overFireIntervalSet = true
        //     }
        //     if (this.timeOnFireCounter >= 1000 && !this.hurtCooldownSet){
        //         this.hurtCooldown = setInterval(()=>{
        //             sounds.ouchSound.play()
        //             survivor.statsPenalty(10)
        //         }, 1000)
        //         this.hurtCooldownSet = true
        //     }
        // } else {
        //     clearTimeout(this.overFireTimeOut)
        //     clearTimeout(this.hurtCooldown)
        //     this.overFireIntervalSet = false
        //     this.hurtCooldownSet = false
        // }

        // if (!checkHoverPos(mousePos, this.bonfireAreas['3']) && checkHoverPos(mousePos, this.bonfireAreas['2'])){
        //     if (!this.overFireIntervalSet){
        //         this.overFireTimeOut = setTimeout(()=>{
        //             this.timeOnFireCounter += 1000
        //         }, 750)
        //         this.overFireIntervalSet = true
        //     }
        //     if (this.timeOnFireCounter >= 1000 && !this.hurtCooldownSet){
        //         this.hurtCooldown = setInterval(()=>{
        //             sounds.ouchSound.play()
        //             survivor.statsPenalty(10)
        //         }, 1000)
        //         this.hurtCooldownSet = true
        //     }
        // } else {
        //     clearTimeout(this.overFireTimeOut)
        //     clearTimeout(this.hurtCooldown)
        //     this.overFireIntervalSet = false
        //     this.hurtCooldownSet = false
        // }
        
        // if (!checkHoverPos(mousePos, this.bonfireAreas['3']) && !checkHoverPos(mousePos, this.bonfireAreas['2']) && checkHoverPos(mousePos, this.bonfireAreas['1'])){
        //     if (!this.overFireIntervalSet){
        //         this.overFireTimeOut = setTimeout(()=>{
        //             this.timeOnFireCounter += 1000
        //         }, 1000)
        //         this.overFireIntervalSet = true
        //     }
        //     if (this.timeOnFireCounter >= 1000 && !this.hurtCooldownSet){
        //         this.hurtCooldown = setInterval(()=>{
        //             sounds.ouchSound.play()
        //             survivor.statsPenalty(10)
        //         }, 1000)
        //         this.hurtCooldownSet = true
        //     }
        // } else {
        //     clearTimeout(this.overFireTimeOut)
        //     clearTimeout(this.hurtCooldown)
        //     this.overFireIntervalSet = false
        //     this.hurtCooldownSet = false
        // }

        // if (!checkHoverPos(mousePos, this.bonfireAreas['1']) && !checkHoverPos(mousePos, this.bonfireAreas['3']) && !checkHoverPos(mousePos, this.bonfireAreas['2'])){
        //     this.timeOnFireCounter = 0
        // }
    }
}