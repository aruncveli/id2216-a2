const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 844
canvas.height = 390

c.fillStyle = 'white'
c.fillRect(0, 0, canvas.width, canvas.height)

const placementPositions = [{x: 70, y: 69}, {x: 130, y: 69}, {x: 169, y: 167}, {
    x: 249, y: 231
}, {
    x: 289, y: 110
}, {
    x: 307, y: 9
}, {
    x: 450, y: 69
}, {
    x: 547, y: 127
}, {
    x: 490, y: 8
}, {
    x: 590, y: 48
}, {
    x: 348, y: 131
}, {
    x: 350, y: 190
}, {
    x: 390, y: 250
}, {
    x: 450, y: 250
}, {
    x: 570, y: 342
}]

const placementTiles = placementPositions.map((position) => new PlacementTile({position}))

const image = new Image()

image.onload = () => {
    animate()
}
image.src = 'img/map.png'

const enemies = []

function spawnEnemies(spawnCount) {
    for (let i = 1; i < spawnCount + 1; i++) {
        const xOffset = i * 150
        enemies.push(new Enemy({
            position: {x: waypoints[0].x - xOffset, y: waypoints[0].y}
        }))
    }
}

const trees = []
let activeTile;
let enemyCount = 3
let hearts = 10
let coins = 100
spawnEnemies(enemyCount)

function animate() {
    const animationId = requestAnimationFrame(animate)

    c.drawImage(image, 0, 0)

    for (let i = enemies.length - 1; i >= 0; i--) {
        const enemy = enemies[i]
        enemy.update()

        if (enemy.position.y > canvas.height) {
            hearts -= 1
            enemies.splice(i, 1)
            document.querySelector('#hearts').innerHTML = hearts

            if (hearts === 0) {
                cancelAnimationFrame(animationId)
                document.querySelector('#gameOver').style.display = 'flex'
            }
        }
    }

    // tracking total amount of enemies
    if (enemies.length === 0) {
        enemyCount += 2
        spawnEnemies(enemyCount)
    }

    placementTiles.forEach((tile) => {
        tile.update(mouse)
    })

    trees.forEach((tree) => {
        tree.update()
        tree.target = null
        const validEnemies = enemies.filter((enemy) => {
            const xDifference = enemy.center.x - tree.center.x
            const yDifference = enemy.center.y - tree.center.y
            const distance = Math.hypot(xDifference, yDifference)
            return distance < enemy.radius + tree.radius
        })
        tree.target = validEnemies[0]

        for (let i = tree.projectiles.length - 1; i >= 0; i--) {
            const projectile = tree.projectiles[i]

            projectile.update()

            const xDifference = projectile.enemy.center.x - projectile.position.x
            const yDifference = projectile.enemy.center.y - projectile.position.y
            const distance = Math.hypot(xDifference, yDifference)

            // this is when a projectile hits an enemy
            if (distance < projectile.enemy.radius + projectile.radius) {
                // enemy health and enemy removal
                projectile.enemy.health -= 20
                if (projectile.enemy.health <= 0) {
                    const enemyIndex = enemies.findIndex((enemy) => {
                        return projectile.enemy === enemy
                    })

                    if (enemyIndex > -1) {
                        enemies.splice(enemyIndex, 1)
                        coins += 25
                        document.querySelector('#coins').innerHTML = coins
                    }
                }

                tree.projectiles.splice(i, 1)
            }
        }
    })
}

const mouse = {
    x: undefined, y: undefined
}

canvas.addEventListener('click', (event) => {
    if (activeTile && !activeTile.isOccupied && coins - 50 >= 0) {
        coins -= 50
        document.querySelector('#coins').innerHTML = coins
        trees.push(new Tree({
            position: {
                x: activeTile.position.x, y: activeTile.position.y
            }
        }))
        activeTile.isOccupied = true
        trees.sort((a, b) => {
            return a.position.y - b.position.y
        })
    }
})

window.addEventListener('mousemove', (event) => {
    mouse.x = event.clientX
    mouse.y = event.clientY

    activeTile = null
    for (const element of placementTiles) {
        const tile = element
        if (mouse.x > tile.position.x && mouse.x < tile.position.x + tile.size && mouse.y > tile.position.y && mouse.y < tile.position.y + tile.size) {
            activeTile = tile
            break
        }
    }
})
