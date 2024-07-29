declare namespace NodeJS {
    interface ProcessEnv {
      PORT?: string;
      MONGO_URL: string;
      GMAIL_USER: string;
      GMAIL_PASS: string;
    }
  }
  