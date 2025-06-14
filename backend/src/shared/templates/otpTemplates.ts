export const otpTemplate = (otp: string) => {
    return `
    <html>
    <head>
        <style>
            body {
                margin: 0;
                padding: 0;
                background-color: #121212;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                color: #f0f0f0;
            }
            .container {
                max-width: 600px;
                margin: auto;
                background-color: #1e1e1e;
                border-radius: 10px;
                padding: 30px;
                box-shadow: 0 0 20px rgba(0, 0, 0, 0.7);
            }
            .header {
                text-align: center;
                padding-bottom: 20px;
                border-bottom: 1px solid #333;
            }
            .header h1 {
                color: #FF6B00;
                margin: 0;
                font-size: 32px;
            }
            .content {
                padding: 20px 0;
                text-align: center;
            }
            .content p {
                font-size: 16px;
                line-height: 1.6;
                color: #ccc;
            }
            .otp-box {
                margin: 30px auto;
                background-color: #FF6B00;
                color: #fff;
                font-size: 28px;
                font-weight: bold;
                padding: 15px 30px;
                border-radius: 10px;
                display: inline-block;
                letter-spacing: 6px;
                box-shadow: 0 4px 12px rgba(255, 107, 0, 0.4);
            }
            .footer {
                text-align: center;
                font-size: 13px;
                color: #777;
                margin-top: 30px;
                border-top: 1px solid #333;
                padding-top: 15px;
            }
            .footer a {
                color: #FF6B00;
                text-decoration: none;
                margin: 0 5px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>RYDIO</h1>
            </div>
            <div class="content">
                <p>Hello Rider,</p>
                <p>Use the OTP below to verify your account and get ready to ride with RYDIO!</p>
                <div class="otp-box">${otp}</div>
                <p>This OTP is valid for <strong>10 minutes</strong>. If you didn’t request this, feel free to ignore the message.</p>
            </div>
            <div class="footer">
                <p>Thank you for choosing <strong>RYDIO</strong> – Where Every Journey Begins.</p>
                <p><a href="#">Support</a> | <a href="#">About</a> | <a href="#">Contact</a></p>
            </div>
        </div>
    </body>
    </html>
    `;
};
