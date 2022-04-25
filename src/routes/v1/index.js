import fs from 'fs'
import path from 'path'
import express from 'express'

const router = express.Router()
const indexJs = path.basename(__filename) // 현재 파일의 파일명을 얻기

fs.readdirSync(__dirname) // 현재 파일의 경로에 있는 모든 파일 이름을 가져옴
  .filter( // 현재 디렉토리에 있는 index.js 파일 외에 다른 라우팅 파일들만 필터링함
    file => 
      file.indexOf('.') !== 0 &&
      file !== indexJs &&
      file.slice(-9) === '.route.js'
  )
  .forEach( // 각 라우팅 파일들을 받아서 default export한 모듈을 라우터에 로드함
    routeFile =>
      router.use(`/${routeFile.split('.')[0]}`, require(`./${routeFile}`).default)
  )

export default router