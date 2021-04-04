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
	// """Creates a list of cropped images (x, y, width, height) of the given sheet"""

	// def __init__(self, sheet, dimensions, transparency=True):
	// 	self.sheet = pg.image.load(sheet).convert_alpha() if transparency else pg.image.load(sheet).convert()

	// 	self.rows, self.columns = dimensions[0], dimensions[1]
	// 	self.total_crops = self.rows*self.columns

	// 	self.rect = self.sheet.get_rect()
	// 	self.crop_w = self.rect.width/self.columns
	// 	self.crop_h = self.rect.height/self.rows

	// 	// # List with the positions and sizes (surface objects) of all the cells of the sprite #
	// 	self.crops = list([(int(cell % self.columns)*self.crop_w, int(cell/self.columns)*self.crop_h,
	// 	                    self.crop_w, self.crop_h) for cell in range(self.total_crops)])