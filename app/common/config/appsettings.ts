import dotenv from 'dotenv';
dotenv.config();

const appsettings = {
    appName: process.env.APP_NAME || 'OnaxERP',
    port: !process.env.PORT || Number.isNaN(Number(process.env.PORT)) || Number(process.env.PORT) === 0 ?  3000 : Number(process.env.PORT),
    ENV:{
        env: !process.env.NODE_ENV || process.env.NODE_ENV.trim() ==="" ? 'development': process.env.NODE_ENV.trim(),
    },
    jwtSecret: process.env.JWT_SECRET || 'supersecretkey',
    DB: {
        username: process.env.DB_user,
        host: process.env.DB_Server,
        database: process.env.DB_database,
        password: process.env.DB_Password,
        port: process.env.DB_Port || 5432,
        synchronize: true,
        logging: false,

        dbConString: process.env.DATABASE_URL || 'postgresql://username:pwd@localhost:5432/onaxappnode',
    },
    Auth:{
        JwtSecret: process.env.JwtSecret || '',
        JwtExpiry: '24h',
        tokenName: 'token',
        defaultSlidingExpirationOn: true,
        Session:{
            tokenName: '_onaxerp_appuser_session',
            httpOnly: true,
            secured: true,
            sameSite: 'none',
            maxAge: 1 * 60 * 60 * 1000, //12hrs
            expires: new Date(Date.now() + (1 * 60 * 60 * 1000)),
        }
    },
};
export default appsettings;