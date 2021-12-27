const log = (text) => 
{
    const parent = document.querySelector('#events')
    const el = document.createElement('li')
    el.innerHTML = text

    parent.appendChild(el)
    parent.scrollTop = parent.scrollHeight
}

const onChatSubmitted = (sock) => (e) =>
{
    e.preventDefault()
    const input = document.querySelector('#chat')
    const text = input.value
    input.value = ''

    sock.emit('message', text)
}

//Closure
const getBoard = (canvas, cellNum = 20) =>
{
    const ctx = canvas.getContext('2d')
    const cellSize = Math.floor(canvas.width / cellNum)

    const fillCell = (x, y, color) =>
    {
        ctx.fillStyle = color
        ctx.fillRect(x*cellSize, y*cellSize, cellSize, cellSize)
    }

    const drawGrid = () =>
    {
        ctx.strokeStyle = '#333'
        ctx.beginPath()

        for(let i = 0; i <= cellSize; i++)
        {
            ctx.moveTo(i*cellSize, 0)
            ctx.lineTo(i*cellSize, cellSize*cellNum)

            ctx.moveTo(0, i*cellSize)
            ctx.lineTo(cellSize*cellNum, i*cellSize)
        }

        ctx.stroke()
    }

    const clear = () =>
    {
        ctx.clearRect(0,0,canvas.width, canvas.height)
    }

    const renderBoard = (board = []) =>
    {
        
        board.forEach((row, y)=>
        {
            row.forEach((color, x)=>
            {
                color && fillCell(x, y, color)
            })
        })
    }

    const reset = (board) =>
    {
        clear()
        drawGrid()
        renderBoard(board)
    }

    const getCellCoordinate = (x, y) =>
    {
        return{
            x:Math.floor(x/cellSize),
            y:Math.floor(y/cellSize)
        }
    }

    return {fillCell, reset, getCellCoordinate}
}

const getClickCoordinates = (element, e) => 
{
    const {top, left} = element.getBoundingClientRect()
    const {clientX, clientY} = e

    return {
        x: clientX - left,
        y: clientY - top
    }
}



(() =>
{
    const canvas = document.querySelector('canvas')
    const {fillCell, reset, getCellCoordinate} = getBoard(canvas)
    const sock = io()

    const onClick = (e) =>
    {
        const {x, y} = getClickCoordinates(canvas, e)
        sock.emit('turn', getCellCoordinate(x,y))
    }

    sock.on('board', reset)
    sock.on('message',log)
    //TODO: Make unique color
    sock.on('turn', ({x,y, color}) => fillCell(x,y, color))

    document.querySelector('#chat-form')
    .addEventListener('submit', onChatSubmitted(sock))

    canvas.addEventListener('click', onClick)

})()

//OLD FUNCTIONS

/**
 *
 * const fillRect = (x, y, color) =>
    {
        ctx.fillStyle = color
        ctx.fillRect(x-10, y-10, 20, 20)
    }
 *
 **/