class Sprite {
    constructor({position = {x: 0, y: 0}, imageSrc, offset = {x: 0, y: 0}}) {
        this.position = position
        this.image = new Image()
        this.image.src = imageSrc
        this.offset = offset
    }

    draw() {
        c.drawImage(this.image, this.position.x + this.offset.x, this.position.y + this.offset.y,)
    }
}
