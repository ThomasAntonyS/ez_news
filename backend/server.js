
import cors from 'cors'
import bodyParser from "body-parser"
import express from 'express'
import mysql from 'mysql2'


const app = express()

app.use(cors())
app.use(bodyParser())
app.use(bodyParser.urlencoded({extended:true}))

mysql.createConnection(
    
)
