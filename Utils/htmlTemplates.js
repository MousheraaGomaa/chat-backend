
const verifyEmailTemplate =(link)=>{
   return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <style>
            body {
                overflow: hidden;
            }

            p {
                margin-block: 30px 100px;
                font-size: 20px;
            }

            a {
                color: white;
                text-decoration: none;
                background-color: #7526ff;
                padding-block: 7px;
                border-radius: 50vh;
                text-align: center;
                display: inline-block;
                width: 200px;
                font-size: 20px;
                border: 2px solid #7526ff;
            }
            a:hover{
                color: #7526ff;
                background-color: transparent;
            }

            div {
                margin-bottom: 40px;
            }

            img {
                max-width: 300px;
            }
        </style>
    </head>

    <body>
        <div>
            <h3>📩 Confirm your email</h3>
            <p>
                Please click the button below to confirm your email address and finish setting up your account. This link is
                valid for 48 hours.
            </p>
            <a href=${link}>Confirm</a>
        </div>
        <img src='../assets/verify-email.svg' />
    </body>

    </html>
`
}


export {
    verifyEmailTemplate
}