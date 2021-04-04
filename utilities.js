// General use utility classes

class SpriteSheet{
    constructor(img, dimensions){
        this.sheet = new Image()
        this.sheet.src = img

        this.rows = dimensions[0]
        this.columns = dimensions[1]
        this.totalCrops = this.rows*this.columns

        this.sheetWidth =  this.sheet.naturalWidth
        this.sheetHeight = this.sheet.naturalHeight

        this.cropWidth = this.sheetWidth/this.columns
        this.cropHeight = this.sheetHeight/this.rows

        this.crops = this.calculateAllCrops()
    }

    calculateAllCrops = ()=>{
        const bufferArray = []
        for(let i=0; i<this.totalCrops; i++){
            bufferArray.push(this.calculateCropData(i))
        }
        return bufferArray
    }

    calculateCropData = (index)=>{
        const bufferCollection = {}
        bufferCollection.x = (index%this.columns)*this.cropWidth
        bufferCollection.y = Math.floor(index/this.columns)*this.cropHeight
        bufferCollection.w = this.cropWidth
        bufferCollection.h = this.cropHeight
        return bufferCollection
    }
}

class Bar{
    constructor(type, img, imgBg, pos, initialValue, maxValue, textColor){
        this.type = type
        this.img = img
        this.imgBg = imgBg
        this.pos = pos
        this.w = img.naturalWidth
        this.h = img.naturalHeight
        this.value = initialValue
        this.maxValue = maxValue
        this.hovering = false
        textColor ? this.textColor = textColor : this.textColor = 'rgb(255, 255, 255, 1)'
        this.typeTextWidth = ctx.measureText(this.type).width
    }

    displayBar = (value)=>{
        this.value = value
        ctx.drawImage(this.imgBg, this.pos[0], this.pos[1], this.w, this.h)
        ctx.drawImage(this.img, 0, 0, this.w*value/this.maxValue, this.h, 
            this.pos[0], this.pos[1], this.w*value/this.maxValue, this.h)
        
        let percentage = `${Math.floor(value/this.maxValue*100*10)/10}%`
        let percentageTextWidth = ctx.measureText(percentage).width
        ctx.font = '15px AlbertTextBold'
        ctx.fillStyle = this.textColor
        if (this.hovering){
            ctx.fillText(this.type, this.pos[0]+this.img.width*0.5-this.typeTextWidth*0.5, this.pos[1]+20)
        } else {
            ctx.fillText(percentage, this.pos[0]+this.img.width*0.5-percentageTextWidth*0.5, this.pos[1]+20)
        }
    }
}