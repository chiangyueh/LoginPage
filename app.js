require('dotenv').config()
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const User = require('./models/users')
const bcrypt = require('bcrypt')
const saltRounds = 12;


mongoose.connect(process.env.MONGODB_URI).then(() => {
    console.log('MongoDB連接成功')
}).catch((e) => {
    console.log(e)
})

app.use(cookieParser(process.env.SECRETKEY))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.engine('hbs', exphbs.engine({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

app.get('/', (req, res) => {
    return res.status(302).redirect('/login')
})

app.post('/registrate', async (req, res) => {
    try {
        let { firstName, email, password } = req.body
        const date = new Date()
        let hashpassword = await bcrypt.hash(password, saltRounds)
        let newUser = new User({ firstName, email, password, token: hashpassword, lastLogin: date.valueOf()})
        await newUser.save()
        return res.redirect('/')
    } catch (e) {
        console.log(e)
    }
})

app.get('/login', (req, res) => {
    const date = new Date()
    const { token } = req.cookies
    User.findOne({token})
    .then((e)=>{
        if(e.lastLogin){
            const anotherDay = (date.valueOf()-e.lastLogin)/1000
            if(anotherDay > 86400){
                return res.render('login')
            }else{
                return res.render('index')
            }
        }else{
            return res.render('login')
        }
    })
})

app.post('/login/submit', async (req, res) => {
    try {
        let { email, password } = req.body
        User.findOne({ email })
            .then(async(e) => {
                if (e) {
                    if (e.password != password) {
                        return res.render('login', { err: '密碼錯誤' })
                    } else {
                        let hashpassword = await bcrypt.hash(password, saltRounds)
                        e.token = hashpassword;
                        e.lastLogin = new Date().valueOf()
                        e.save();
                        res.cookie('token', e.token)
                        return res.render('index')
                    }
                } else {
                    return res.render('login', { err: '信箱錯誤' })
                }
            })
    } catch (e) {
        return console.log(e)
    }
})

app.listen(3000, () => {

})