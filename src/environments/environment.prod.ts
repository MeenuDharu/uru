export const environment = {
  production: true,
  ws_url: 'https://dinamic.io/mobileapi',
  socket_url: 'https://dinamic.io',
  img_url: 'https://dinamic.io/api/', 
  baseUrl:'https://dinamic.io/api',
  userBaseURL:"https://care.dinamic.io/",
  server_public_key: 'BKZWqaULCsRXobDkQUgDbyAEdqgS6MxjCcC_-xH0RhSACNwIxEVUQqnt8FVT4u11oMJSkpNY-MGoydbErarOUwg',
  socket_options: {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: Infinity,
    transports:["websocket"],
    path: '/api/socket.io',
    secure: false,
    rejectUnauthorized: false,
    forceNew: true,
    timeout: 60000
},   
    payment:true,
    paymentLink : "https://dinamic.io/mobileapi/",
    cancel_url:"https://care.dinamic.io/#/bill/confirm",
    redirect_url:"https://care.dinamic.io/",
    razorpay_payment_url: "https://api.razorpay.com/v1/checkout/embedded",
    smsType :'production',
    smsUrl:'@care.dinamic.io',
    password:false
};