const verifyEmailTemplate = (link) => {
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <style>
            body {
                overflow: hidden;
            }

            p {
                margin-block: 30px 100px;
            }

            a {
                color: white !important;
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
                color: #7526ff !important;
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
                Please click the button below to confirm your email 
                address and finish setting up your account. This link is
                valid for 5 minutes.
            </p>
            <a href=${link}>Confirm</a> 

        </div>
        <img src='https://res.cloudinary.com/dgy9ba7ov/image/upload/v1742244596/users/auth/xswgeuaurphzek8dttax.png' />
    </body>

    </html>
`
}
const resetPasswordTemplate = (link,userName) => {
    return `
    <!DOCTYPE html>
    <html lang="en">

    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
        <style>
            .logo {
                width: 50px;
            }

            a {
                color: white !important;
                background-color: #1b74e4;
                width: 50%;
                padding-block: 10px;
                text-decoration: none;
                display: inline-block;
                text-align: center;
                border-radius: 7px;
            }

            hr {
                border: none;
                border-top: 0.008px solid gainsboro;
            }
        </style>
    </head>

    <body>
        <img class="logo" src="../public/assets/logo.png" alt="">
        <hr>
        <p>Hi ${userName},</p>
        <p>
            We received a request to reset your Chat password.
            <br />
            You can directly change your password.
        </p>
        <a href=${link}>Change Password</a>
        <p>
            If you didn't request a new password, Ignore this message
        </p>

    </body>

    </html>
    `
}

export {
    verifyEmailTemplate,
    resetPasswordTemplate
}


