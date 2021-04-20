module.exports = {
    commands: ['game'],

    async execute(message, args){
        // const random = Math.floor(Math.random() * 11)

        // let guess = []

        // let guessCount = 0

        // let hintCount = 0

        // let tries = 3

        // message.channel.send("Guess the random number between 1 to 10. You have 3 tries and 1 hint left. Type 'h' to use the hint.")

        // for(i = 0; i < 3; i++){
        //     let filter = msg => msg.author.id === message.author.id

        //     const msg = await message.channel.awaitMessages(filter, { max: 1, time: 30000, errors: ['time'] })
        //     .catch(err =>{
        //         return message.channel.send("You have to respond to me bruh.")
        //     })
        //     if(msg.first().content === 'hint' || msg.first().content === 'h'){
        //         if(guessCount === 0)
        //         message.channel.send("Atleast try guessing once before using a hint.")

        //         if(hintCount === 0){
        //             if(guess[i-1] - 3 > random)
        //             message.channel.send("Your previous guess was too high")

        //             else if(guess[i-1] + 3 < random)
        //             message.channel.send("Your previous guess was too low.")

        //             else if(guess[i-1] > random)
        //             message.channel.send("Your previous guess was a little high.")

        //             else if(guess[i-1] < random)
        //             message.channel.send("Your previous guess was a little low.")

        //             hintCount++
        //             i--
        //         }
        //     }

        //     guess[i] = msg.first().content
        //     console.log(guess[i])

        //     if(guess[i] < 1 || guess[i] > 10)
        //     return message.channel.send(`Well, go back to 1st grade, cause you think '${guess[i]}' is a NUMBER between 1 and 10.`)

        //     if(guess === random)
        //     return message.channel.send("You got it right smarty pants.")
            
        //     else{
        //         tries--

        //         if(tries === 1)
        //         message.channel.send(`Nope. You have got ${tries} more try left.`)
            
        //         else
        //         message.channel.send(`Nope. You have got ${tries} more tries left.`)
        //     }
        // }
    }
}