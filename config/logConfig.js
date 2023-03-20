// config/logConfig.js
"use strict"
const { createLogger, format, transports } = require("winston")
require("winston-daily-rotate-file")
const fs = require("fs")

const env = process.env.NODE_ENV || "development"
const logDir = "log"

// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
	fs.mkdirSync(logDir)
}

// 콘솔창에 로그를 남긴다.
// 콘솔창의 로그는 컬러로 찍힌다.
// 로그 파일을 남긴다.
// 콘솔창은 info 레벨부터 로그를 남기고, 로그 파일에는 debug 레벨부터 로그를 남긴다.
// 로그 파일은 매일 하나씩 남긴다.
// log 폴더에 로그 파일을 쌓는다.
// 개발 환경에서는 debug 레벨부터 로그를 찍고, 운영 환경에서는 info 레벨부터 로그를 찍는다.

const dailyRotateFileTransport = new transports.DailyRotateFile({
  level: "debug",                               // 기록할 최소 로그 수준을 지정
  filename: `${logDir}/%DATE%-smart-push.log`,  // 로그 파일의 이름을 지정합니다
  datePattern: "YYYY-MM-DD",                    // 로그 파일 이름에 사용할 날짜 형식을 지정
  zippedArchive: true,                          // 로그 파일은 압축한다.
  maxSize: "20m",                               // 로그 파일은 최대 20Mbyte다.
  maxFiles: "14d"                               // 로그 파일은 14일간 보관한다.
})

const logger = createLogger({                       //   로그 메시지의 형식을 지정  로그 메시지를 JSON 형식으로 출력하도록 설정됩니다.
  level: env === "development" ? "debug" : "info",
  format: format.combine(
    format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss"
    }),
    format.json()
  ),
  transports: [                                     //로거가 로그 메시지를 기록하는 데 사용해야 하는 전송 배열입니다.
    new transports.Console({
      level: "info",
      format: format.combine(                       //로그 메시지의 형식을 지정
        format.colorize(),
        format.printf(
          info => `${info.timestamp} ${info.level}: ${info.message}`
        )
      )
    }),
    dailyRotateFileTransport                         //메시지를 파일에 기록하는 전송입니다
  ]
})

module.exports = {
  logger: logger
}