module.exports = {
    HTML: function(title, body){
        return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <title>Document</title>
        </head>
        <body>
        
          ${body}
        
        
        </body>
        </html>`
    }
}