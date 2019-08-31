const express = require('express')
const app = express()
const socketio = require('socket.io')

let namespaces = require('./data/namespaces')
//console.log(namespaces)


app.use(express.static(__dirname + '/public'))
const expressServer = app.listen(3000)
const io = socketio(expressServer)





io.on('connection', (socket) => {
    
    let nsData = namespaces.map((ns) => {
        return {
            img: ns.img,
            endpoint: ns.endpoint 
        }
    }) 
    //console.log(nsData)
    socket.emit('nsList',nsData)
     
})

namespaces.forEach((namespace)=>{
    io.of(namespace.endpoint).on('connection', (nsSocket) => {
        console.log(`${nsSocket.id} has joined to ${namespace.endpoint}`)
        nsSocket.emit('nsRoomLoad',namespaces[0].rooms)
        nsSocket.on('joinRoom', (roomToJoin,newNumberOfMemebers)=>{
           nsSocket.join(roomToJoin)
          // io.of('/wiki').in(roomToJoin).clients((error, clients) => {
          //     console.log(clients.length)
          //     newNumberOfMemebers(clients.length)
          // })
           const nsRoom = namespaces[0].rooms.find((room)=>{
            return room.roomTitle === roomToJoin
        })
        nsSocket.emit('historyCatchUp',nsRoom.history)
        io.of('/wiki').in(roomToJoin).clients((error, clients) => {
                 console.log(`There are ${clients.length} in this room`)
                 io.of('/wiki').in(roomToJoin).emit('updateMembers',clients.length)
             })
             
                   
        })

        nsSocket.on('nuevomensajeparaelserver',(msg) => {
            const fullMsg = {
                text: msg.text,
                time: Date.now(),
                username: "rbunch",
                avatar: 'https://via.placeholder.com/30'
            }
           // console.log(fullMsg)
           // console.log(nsSocket.rooms)
            const roomTitle = Object.keys(nsSocket.rooms)[1]
            const nsRoom = namespaces[0].rooms.find((room)=>{
                return room.roomTitle === roomTitle
            })
            nsRoom.addMessage(fullMsg)
            console.log(nsRoom)
            
            io.of('/wiki').to(roomTitle).emit('messageToClients',fullMsg)
        })
    })
})
