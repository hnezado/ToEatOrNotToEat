class Fire{
    constructor(bonfireObject){
        this.bonfireAreas = {
            1: [itemsFloorCollection.bonfire.posDim[0]+24, itemsFloorCollection.bonfire.posDim[1]+23, 100, 150],
            2: [itemsFloorCollection.bonfire.posDim[0]+41, itemsFloorCollection.bonfire.posDim[1]+73, 66, 100],
            3: [itemsFloorCollection.bonfire.posDim[0]+58, itemsFloorCollection.bonfire.posDim[1]+123, 33, 50]
        }
        this.onFireSet = false
        this.fireTimeOut = null
        this.timeOnFireCounter = 0
    }

    checkFireHover = (mousePos)=>{
        if (checkHoverPos(mousePos, itemsFloorCollection.bonfire.posDim)){
            if (checkHoverPos(mousePos, this.bonfireAreas['3'])){
                if (!this.onFireSet){
                    const timeOnFireAdder = 300
                    this.fireTimeOut = setTimeout(()=>{
                        this.onFireSet = true
                        this.timeOnFireCounter += timeOnFireAdder
                    }, 1000)
                    if (this.timeOnFireCounter >= 1000){
                        sounds.ouchSound.play()
                        //survivor.statsPenalty(10)
                        this.onFireSet = false
                    }
                }
            } else {
                clearTimeout(this.fireTimeOut)
                this.onFireSet = false
            }

            if (checkHoverPos(mousePos, this.bonfireAreas['2']) && !checkHoverPos(mousePos, this.bonfireAreas['3'])){
                if (!this.onFireSet){
                    const timeOnFireAdder = 200
                    this.fireTimeOut = setTimeout(()=>{
                        this.onFireSet = true
                        this.timeOnFireCounter += timeOnFireAdder
                    }, 1000)
                    if (this.timeOnFireCounter >= 1000){
                        sounds.ouchSound.play()
                        //survivor.statsPenalty(10)
                        this.onFireSet = false
                    }
                }
            } else {
                clearTimeout(this.fireTimeOut)
                this.onFireSet = false
            }
            
            if (checkHoverPos(mousePos, this.bonfireAreas['1']) && !checkHoverPos(mousePos, this.bonfireAreas['3']) && !checkHoverPos(mousePos, this.bonfireAreas['2'])){
                if (!this.onFireSet){
                    const timeOnFireAdder = 100
                    this.fireTimeOut = setTimeout(()=>{
                        this.onFireSet = true
                        this.timeOnFireCounter += timeOnFireAdder
                    }, 1000)
                    if (this.timeOnFireCounter >= 1000){
                        sounds.ouchSound.play()
                        //survivor.statsPenalty(10)
                        this.onFireSet = false
                    }
                }
            } else {
                clearTimeout(this.fireTimeOut)
                this.onFireSet = false
            }
            console.log(this.timeOnFireCounter)
            if (this.timeOnFireCounter >= 1000){
                sounds.ouchSound.play()
                //survivor.statsPenalty(10)
                this.onFireSet = false
            }
        } else {
            this.onFireSet = false
            clearTimeout(this.fireTimeOut)
            this.timeOnFireCounter = 0
        }
    }
}