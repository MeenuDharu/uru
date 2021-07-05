  export const environment = {    
    production: false,
     //ws_url: 'https://dinamic.io/mobileapi',
     ws_url: 'http://192.168.1.4:4000', 
     socket_url: 'https://dinamic.io',
     img_url: 'https://dinamic.io/api/', 
     baseUrl:'https://dinamic.io/api', 
    server_public_key: 'null',   
    userBaseURL:"http://localhost:4200/",
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
      paymentLink : "http://192.168.1.4:4000/",
     // razorpay_payment_url: "",
      razorpay_payment_url: "https://api.razorpay.com/v1/checkout/embedded",
      cancel_url:"http://localhost:4200/#/bill/confirm",
      redirect_url:"http://192.168.1.4/",      
      smsType :'production',
      smsUrl:'@www.mob.dinamic.io',
      password:false
      
      //razorpay_redirect_url: "http://localhost:4200/#/bill/confirm",
    //ws_url: 'https://www.dinamic.io:4000',
    //ws_url: 'https://mob.dinamic.io/api',
   // ws_url: 'http://192.168.1.102:4001',   
   // socket_url: 'https://web.dinamic.io',
    // img_url: 'https://web.dinamic.io/api/',  
  };

  // commands to build
  // For production build (care.dinamic.io)
  // npm run build-production

   // For test build (mob.dinamic.io)
  // npm run build-test

//close_take_away