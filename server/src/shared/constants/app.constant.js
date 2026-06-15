export default {
  PORT: 3000,
  NODE_ENV: "development",
  MONGO_URI: "mongodb://localhost:27017/cricbuzz",
  RATELIMIT_WINDOWMS: 15 * 60 * 1000,
  RATELIMIT: 100
}


export  const app_config={
cookies:{
  ACESSS_COKKIE:{
        httpOnly:true,
        secure:false,
        sameSite:"lax",
        maxAge:60*60*1000
     },
     REFRESH_COOKIE:{
        httpOnly:true,
        secure:false,
        sameSite:"lax",
        maxAge:24*60*60*1000
     }
}
}

