const verifyEmailTemplate = (link, userName,code) => {
    return ` 
        <!DOCTYPE html>
        <html lang="en">

        <head>
            <style>
                body {
                    font-family: math;
                    overflow:hidden;
                }

                .logo {
                    width: 50px;
                }

                a {
                    color: white !important;
                    background-color: #1b74e4;
                    width: 50%;
                    text-decoration: none;
                    display: inline-block;
                    text-align: center;
                    border-radius: 7px;
                    font-family: sans-serif;
                    font-weight: 500;
                }

                .code {
                    border: 1px solid #1877f2;
                    background: #e7f3ff;
                    padding: 10px 50px;
                    text-align: center;
                    width: fit-content;
                    border-radius: 7px;
                    margin-bottom: 20px;
                }

                .code span {
                    font-family: Helvetica Neue, Helvetica, Lucida Grande, tahoma, verdana, arial, sans-serif;
                    font-size: 16px;
                    line-height: 21px;
                    color: #141823;
                    letter-spacing: 5px;
                    font-weight: 600;
                }

                hr {
                    border: none;
                    border-top: 0.008px solid gainsboro;
                }

                img {
                    width: 300px;
                }

                .header {
                    display: flex;
                    gap: 10px;
                }

                .header img {
                    width: 70px;
                }
            </style>
        </head>

        <body>
            <div class="header">
                <img class="logo" src="https://res.cloudinary.com/dgy9ba7ov/image/upload/v1742348987/users/auth/xifjxdhywxwliaabduh3.png" alt="">
                <h3>Confirm your email</h3>
            </div>
            <hr>
            <p>Hi ${userName},</p>
            <p>
                Please use the code below to confirm your email address
                and finish setting up your account.
                <br />
                Enter the following confirm email code:
            </p>
            <div class="code">
                <span>
                    ${code}
                </span>
            </div>
            <p>
                lternatively, you can directly confirm your email.
            </p>
            
            <a href=${link}>
                <span style="display: inline-block; padding: 10px 20px">
                    Confirm Email
                </span>
            </a>
            
            <p>
                <b>Please ignore this message</b> if you <b>have not registered in our chat app</b>
            </p>
            <img src='https://res.cloudinary.com/dgy9ba7ov/image/upload/v1742244596/users/auth/xswgeuaurphzek8dttax.png' />
        </body>
        </html>
`
}
const resetPasswordTemplate = (link,userName,code) => {
    return `
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
        body {
            font-family: math;
            overflow:hidden;
        }

        .logo {
            width: 50px;
        }

        a {
            color: white !important;
            background-color: #1b74e4;
            width: 50%;
            height:100%;
            text-decoration: none;
            display: inline-block;
            text-align: center;
            border-radius: 7px;
            font-family: sans-serif;
            font-weight: 500;
        }

        .code {
            border: 1px solid #1877f2;
            background: #e7f3ff;
            padding: 10px 50px;
            text-align: center;
            width: fit-content;
            border-radius: 7px;
            margin-bottom: 20px;
        }

        .code span {
            font-family: Helvetica Neue, Helvetica, Lucida Grande, tahoma, verdana, arial, sans-serif;
            font-size: 16px;
            line-height: 21px;
            color: #141823;
            letter-spacing: 5px;
            font-weight: 600;
        }

        hr {
            border: none;
            border-top: 0.008px solid gainsboro;
        }
        img {
            width: 300px;
        }
    </style>
</head>

<body>
    <img class="logo" src="https://res.cloudinary.com/dgy9ba7ov/image/upload/v1742348987/users/auth/xifjxdhywxwliaabduh3.png" alt="">
    <hr>
    <p>Hi ${userName},</p>
    <p>
        We received a request to reset your Chat APP password.
        <br />
        Enter the following password reset code:

    </p>
    <div class="code">
        <span>
            ${code}
        </span>
    </div>
    <p>
        lternatively, you can directly change your password.
    </p>
    <a href=${link}>
        <span style="display: inline-block; padding: 10px 20px">
            Change Password
        </span>
    </a>
    <p>
        <b>If you didn't request a new password</b>, Ignore this message
    </p>
    <img src='https://res.cloudinary.com/dgy9ba7ov/image/upload/v1742348086/users/auth/dcvfwcgbzqikcdwe10d9.png'/>
</body>

</html>
  `
}

export {
    verifyEmailTemplate,
    resetPasswordTemplate
}