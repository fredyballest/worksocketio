function buildHTML2(msg){
    const convertedDate = new Date(msg.time).toLocaleDateString()
    const newHTML = `
    <li>
                    <div class="user-image">
                        <img src="${msg.avatar}" />
                    </div>
                    <div class="user-message">
                        <div class="user-name-time">${msg.username} <span>${convertedDate}</span></div>
                        <div class="message-text">${msg.text}</div>
                    </div>
                </li>

    `
    return newHTML
}

function joinRoom(roomName){
    nsSocket.emit('joinRoom', roomName,(newNumberOfMemebers) => {
        document.querySelector('.curr-room-num-users').innerHTML = `${newNumberOfMemebers}<span class="glyphicon glyphicon-user"></span>`
    })
    nsSocket.on('historyCatchUp',(history) => {
        console.log(history)
        const messageUl = document.querySelector('#messages')
        messageUl.innerHTML = ""
        history.forEach((msg) => {
            const newMsg = buildHTML(msg)
            const currentMessage = messageUl.innerHTML
            messageUl.innerHTML = currentMessage + newMsg
        })
        messageUl.scrollTo(0,messageUl.scrollHeight);
    })

    nsSocket.on('updateMembers',(numMembers)=>{
        document.querySelector('.curr-room-num-users').innerHTML = `${numMembers}<span class="glyphicon glyphicon-user"></span>`
        document.querySelector('.curr-room-text').innerText = `${roomName}`
    })

}