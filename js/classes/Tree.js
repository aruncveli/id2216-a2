class Tree extends Sprite {
    constructor({position = {x: 0, y: 0}}) {
        super({
            position,
            imageSrc: './img/tree.png',
            offset: {
                x: 4,
                y: 5
            }
        })

        this.width = 32
        this.height = 32
        this.center = {
            x: this.position.x + this.width / 2,
            y: this.position.y + this.height / 2
        }
        this.projectiles = []
        this.radius = 100
        this.target = undefined
        this.updateCount = 0

    }

    update() {
        this.updateCount++;
        this.draw()

        if (this.target && this.updateCount % 25 === 0)
            this.shoot()
    }

    shoot() {
        this.projectiles.push(
            new Projectile({
                position: {
                    x: this.center.x,
                    y: this.center.y
                },
                enemy: this.target
            })
        )
    }
}
