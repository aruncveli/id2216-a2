const canvas = document.querySelector("canvas")
canvas.width = 844
canvas.height = 390

const getMousePos = (e) => {
    const rect = canvas.getBoundingClientRect();
    return {x: e.clientX - rect.left, y: e.clientY - rect.top}
}

const c = canvas.getContext('2d')
c.fillRect(0, 0, canvas.width, canvas.height)

canvas.onclick = (e) => {
    const rgba = c.getImageData(e.x, e.y, 1, 1).data;
    if (rgba[0] === 8 && rgba[1] === 164 && rgba[2] === 122) {
        console.log('place here')
    }
}

const image = new Image();
image.src = 'img/map.png'

const animate = () => {
    c.drawImage(image, 0, 0)
};

image.onload = animate;