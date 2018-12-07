const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
const filterjs = require('./filter.js');
const dataService = require('./data-service.js');
const bodyParser = require('body-parser');
const clientSessions = require('client-sessions');
const passport = require('passport'); // to use Federation Authentication
const googleAuth = require('./google-auth.js');
const serviceAuth = require('./service-auth.js');
const BearerStrategy = require('passport-http-bearer');
// const fs = require('fs');

googleAuth(passport);
app.use(passport.initialize());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static('./sub'));

app.set('view engine', 'jade');
app.set('views', './sub/jade');

passport.use(new BearerStrategy(
    function(token, done) {
      User.findOne({ token: token }, function (err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false); }
        return done(null, user, { scope: 'read' });
      });
    }
));

// Setup client-sessions
app.use(clientSessions({
    cookieName: "session", // this is the object name that will be added to 'req'
    secret: "search_project_sgme2018", // this should be a long un-guessable string.
    duration: 2 * 60 * 1000, // duration of the session in milliseconds (2 minutes)
    activeDuration: 1000 * 60 // the session will be extended by this many ms each request (1 minute)
}));

app.use((req, res, next) => {
    res.locals.session = req.session;
    next();
});

app.use((req, res, next) => {
    let route = req.baseUrl + req.path;
    app.locals.activeRoute = (route == "/") ? "/" : route.replace(/\/$/, "");
    next();
});

// let ensureLogin = (req, res, next) => {
//     if(!req.session.user){
//         res.redirect("/");
//     } else {
//         next();
//     }
// }



// var information = fs.readFileSync("./information.json");
// var jsonInformation = JSON.parse(information);

// global.arr = jsonInformation.map((element) => {
//     let newarr = {};
//     newarr['code'] = element.code;
//     newarr['name'] = element.name;
//     newarr['semester'] = element.semester;
//     newarr['prerequisite'] = element.prerequisite;
//     newarr['required'] = element.required;
//     newarr['recommendedProfessor'] = element.recommendedProfessor;
//     newarr['isGeneral'] = element.isGeneral;
//     newarr['desc'] = element.desc;
//     return newarr;
// });

// global.dataArray = {
//     code : [],
//     name : [],
//     semester : [],
//     prerequisite : [],
//     required : [],
//     recommendedProfessor : [],
//     isGeneral : [],
//     desc : []
// };

// global.arraySemester = {
//     code : [],
//     name : [],
//     semester : [],
//     prerequisite : [],
//     required : [],
//     recommendedProfessor : [],
//     isGeneral : [],
//     desc : []
// };

app.get('/main', (req, res) => {
    dataService.getAll().then((data) => {
        res.render('filter', {data : data, userName : UN});
    }).catch((err) => {
        console.log(err);
    });
});

//     filterjs.jsonInput(jsonInformation).then((arr) => {
//         console.log(arr);
        // dataArray.code = arr.code;
        // dataArray.name = arr.name;
        // dataArray.semester = arr.semester;
        // dataArray.prerequisite = arr.prerequisite;
        // dataArray.required = arr.required;
        // dataArray.recommendedProfessor = arr.recommendedProfessor;
        // dataArray.isGeneral = arr.isGeneral;
        // dataArray.desc = arr.desc;

        // res.render('filter', {code : dataArray.code, name : dataArray.name, semester : dataArray.semester, 
        //     prerequisite : dataArray.prerequisite, required : dataArray.required, recommendedProfessor : dataArray.recommendedProfessor,
        //     isGeneral : dataArray.isGeneral, desc : dataArray.desc});

    // }).catch((err) => {
    //     console.log(err);
    // });

app.post('/filter', (req, res) => {
    var filteredArr = 
    [
        {
            code : [],
            name : [],
            semester : [],
            prerequisite : [],
            required : [],
            recommendedProfessor : [],
            isGeneral : [],
            desc : []
        }
    ];

    filterjs.filterfunction(req.body).then((data) => {
        // var filteredSemester = data.semester.map((element) => { // 요소가 1개 일 경우 map 사용 불가
        //     return element;
        // });
        var filteredSemester = data.semester;
        var filteredIsgeneral = data.isgeneral;
        var count = 0;

        if(filteredSemester[0] == null && filteredIsgeneral[0] == null){
            res.redirect('/main');
        }

        if(filteredSemester[0] != null){
            for(let i=0; i<arr.length; i++){
                for(let j=0; j<filteredSemester.length; j++){
                    if(filteredSemester[j] == arr[i].semester){
                        filteredArr[count] = arr[i]; // fuck. (모든 속성이 같으므로, 하기와 같이 말고 바로 = 대입하면 된다.)
                        count++;
                        // filteredArr[count].code = arr[i].code;
                        // filteredArr[count].semester = arr[i].semester;
                        // filteredArr[count].prerequisite = arr[i].prerequisite;
                        // filteredArr[count].required = arr[i].required;
                        // filteredArr[count].recommendedProfessor = arr[i].recommendedProfessor;
                        // filteredArr[count].isGeneral = arr[i].isGeneral;
                        // filteredArr[count].desc = arr[i].desc;
                    }
                }
            }
            res.render('filter', {data : filteredArr});
        }

        if(filteredSemester[0] == null && filteredIsgeneral[0] != null){
            for(let i=0; i<arr.length; i++){
                if(filteredIsgeneral == String(arr[i].isGeneral)){
                    filteredArr[count] = arr[i];
                    count++;
                }
            }
            res.render('filter', {data : filteredArr});
        }


        // if(data.semester[0]){
        //     for(let i=0; i<dataArray.code.length; i++){
        //         if(data.semester[0] == dataArray.semester[i]){
        //             arraySemester.code.push(dataArray.code[i]);
        //             arraySemester.name.push(dataArray.name[i]);
        //             arraySemester.semester.push(dataArray.semester[i]);
        //             arraySemester.prerequisite.push(dataArray.prerequisite[i]);
        //             arraySemester.required.push(dataArray.required[i]);
        //             arraySemester.recommendedProfessor.push(dataArray.recommendedProfessor[i]);
        //             arraySemester.isGeneral.push(dataArray.isGeneral[i]);
        //             arraySemester.desc.push(dataArray.desc[i]);
        //         }
        //     }
        // }
        
        // if(data.semester[1]){
        //     for(let i=0; i<dataArray.code.length; i++){
        //         if(data.semester[1] == dataArray.semester[i]){
        //             arraySemester.code.push(dataArray.code[i]);
        //             arraySemester.name.push(dataArray.name[i]);
        //             arraySemester.semester.push(dataArray.semester[i]);
        //             arraySemester.prerequisite.push(dataArray.prerequisite[i]);
        //             arraySemester.required.push(dataArray.required[i]);
        //             arraySemester.recommendedProfessor.push(dataArray.recommendedProfessor[i]);
        //             arraySemester.isGeneral.push(dataArray.isGeneral[i]);
        //             arraySemester.desc.push(dataArray.desc[i]);
        //         }
        //     }
        // }

        // if(data.semester[2]){
        //     for(let i=0; i<dataArray.code.length; i++){
        //         if(data.semester[2] == dataArray.semester[i]){
        //             arraySemester.code.push(dataArray.code[i]);
        //             arraySemester.name.push(dataArray.name[i]);
        //             arraySemester.semester.push(dataArray.semester[i]);
        //             arraySemester.prerequisite.push(dataArray.prerequisite[i]);
        //             arraySemester.required.push(dataArray.required[i]);
        //             arraySemester.recommendedProfessor.push(dataArray.recommendedProfessor[i]);
        //             arraySemester.isGeneral.push(dataArray.isGeneral[i]);
        //             arraySemester.desc.push(dataArray.desc[i]);
        //         }
        //     }
        // }

        // if(data.semester[3]){
        //     for(let i=0; i<dataArray.code.length; i++){
        //         if(data.semester[3] == dataArray.semester[i]){
        //             arraySemester.code.push(dataArray.code[i]);
        //             arraySemester.name.push(dataArray.name[i]);
        //             arraySemester.semester.push(dataArray.semester[i]);
        //             arraySemester.prerequisite.push(dataArray.prerequisite[i]);
        //             arraySemester.required.push(dataArray.required[i]);
        //             arraySemester.recommendedProfessor.push(dataArray.recommendedProfessor[i]);
        //             arraySemester.isGeneral.push(dataArray.isGeneral[i]);
        //             arraySemester.desc.push(dataArray.desc[i]);
        //         }
        //     }
        // }

        // if(data.semester[4]){
        //     for(let i=0; i<dataArray.code.length; i++){
        //         if(data.semester[4] == dataArray.semester[i]){
        //             arraySemester.code.push(dataArray.code[i]);
        //             arraySemester.name.push(dataArray.name[i]);
        //             arraySemester.semester.push(dataArray.semester[i]);
        //             arraySemester.prerequisite.push(dataArray.prerequisite[i]);
        //             arraySemester.required.push(dataArray.required[i]);
        //             arraySemester.recommendedProfessor.push(dataArray.recommendedProfessor[i]);
        //             arraySemester.isGeneral.push(dataArray.isGeneral[i]);
        //             arraySemester.desc.push(dataArray.desc[i]);
        //         }
        //     }
        // }

        // if(data.semester[5]){
        //     for(let i=0; i<dataArray.code.length; i++){
        //         if(data.semester[5] == dataArray.semester[i]){
        //             arraySemester.code.push(dataArray.code[i]);
        //             arraySemester.name.push(dataArray.name[i]);
        //             arraySemester.semester.push(dataArray.semester[i]);
        //             arraySemester.prerequisite.push(dataArray.prerequisite[i]);
        //             arraySemester.required.push(dataArray.required[i]);
        //             arraySemester.recommendedProfessor.push(dataArray.recommendedProfessor[i]);
        //             arraySemester.isGeneral.push(dataArray.isGeneral[i]);
        //             arraySemester.desc.push(dataArray.desc[i]);
        //         }
        //     }
        // }

        // if(data.isgeneral[0] == 'true'){
        //     for(let i=0; i<dataArray.code.length; i++){
        //         // if(data.isgeneral[0] == dataArray.isGeneral[i]){
        //         if(dataArray.isGeneral[i] == true){
        //             arraySemester.code.push(dataArray.code[i]);
        //             arraySemester.name.push(dataArray.name[i]);
        //             arraySemester.semester.push(dataArray.semester[i]);
        //             arraySemester.prerequisite.push(dataArray.prerequisite[i]);
        //             arraySemester.required.push(dataArray.required[i]);
        //             arraySemester.recommendedProfessor.push(dataArray.recommendedProfessor[i]);
        //             arraySemester.isGeneral.push(dataArray.isGeneral[i]);
        //             arraySemester.desc.push(dataArray.desc[i]);
        //         }
        //     }
        // }

        // else if(data.isgeneral[0] == 'false'){
        //     for(let i=0; i<dataArray.code.length; i++){
        //         // if(data.isgeneral[0] == dataArray.isGeneral[i]){
        //         if(dataArray.isGeneral[i] == false){
        //             arraySemester.code.push(dataArray.code[i]);
        //             arraySemester.name.push(dataArray.name[i]);
        //             arraySemester.semester.push(dataArray.semester[i]);
        //             arraySemester.prerequisite.push(dataArray.prerequisite[i]);
        //             arraySemester.required.push(dataArray.required[i]);
        //             arraySemester.recommendedProfessor.push(dataArray.recommendedProfessor[i]);
        //             arraySemester.isGeneral.push(dataArray.isGeneral[i]);
        //             arraySemester.desc.push(dataArray.desc[i]);
        //         }
        //     }
        // }

        // res.render('filter', {code : arraySemester.code, name : arraySemester.name, semester : arraySemester.semester, 
        //     prerequisite : arraySemester.prerequisite, required : arraySemester.required, recommendedProfessor : arraySemester.recommendedProfessor,
        //     isGeneral : arraySemester.isGeneral, desc : arraySemester.desc});

    }).catch((err) => {
        console.log(err);
    });
})

app.get('/filter/code/:code', (req, res) => {
    var code = req.params.code;

    for(let i=0; i<arr.length; i++){
        if(code == arr[i].code){
            res.render('result', {code : arr[i].code, name : arr[i].name, semester : arr[i].semester, prerequisite : arr[i].prerequisite,
            required : arr[i].required, recommendedProfessor : arr[i].recommendedProfessor, isGeneral : arr[i].isGeneral, desc : arr[i].desc});
        }
    }
})

// app.get('/filter/:id', (req, res) => {
//     var arraySemester = {
//         code : [],
//         name : [],
//         semester : [],
//         prerequisite : [],
//         required : [],
//         recommendedProfessor : [],
//         isGeneral : [],
//         desc : []
//     };

//     var information = fs.readFileSync("./information.json"); // json 파일 변수 안써짐....전역으로도....
//     var jsonInformation = JSON.parse(information);

//     var dataArray = {
//         code : [],
//         name : [],
//         semester : [],
//         prerequisite : [],
//         required : [],
//         recommendedProfessor : [],
//         isGeneral : [],
//         desc : []
//     };

//     filterjs.jsonInput(jsonInformation).then((arr) => {

//         dataArray.code = arr.code;
//         dataArray.name = arr.name;
//         dataArray.semester = arr.semester;
//         dataArray.prerequisite = arr.prerequisite;
//         dataArray.required = arr.required;
//         dataArray.recommendedProfessor = arr.recommendedProfessor;
//         dataArray.isGeneral = arr.isGeneral;
//         dataArray.desc = arr.desc;

//         for(let i=0; i<dataArray.code.length; i++){
//             if(req.params.id == dataArray.semester[i]){
//                 arraySemester.code.push(dataArray.code[i]);
//                 arraySemester.name.push(dataArray.name[i]);
//                 arraySemester.semester.push(dataArray.semester[i]);
//                 arraySemester.prerequisite.push(dataArray.prerequisite[i]);
//                 arraySemester.required.push(dataArray.required[i]);
//                 arraySemester.recommendedProfessor.push(dataArray.recommendedProfessor[i]);
//                 arraySemester.isGeneral.push(dataArray.isGeneral[i]);
//                 arraySemester.desc.push(dataArray.desc[i]);
//             }
//         }

//         res.render('filter', {code : arraySemester.code, name : arraySemester.name, semester : arraySemester.semester, 
//             prerequisite : arraySemester.prerequisite, required : arraySemester.required, recommendedProfessor : arraySemester.recommendedProfessor,
//             isGeneral : arraySemester.isGeneral, desc : arraySemester.desc});

//     }).catch((err) => {
//         console.log(err);
//     });



// app.listen(port, () => {
//     console.log(`Connected ${port}`);
// })







// Route
app.get('/', (req, res) => {
    res.render('login');
});

app.get('/auth/google', 
    passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login']}));

app.get('/auth/google/callback', 
passport.authenticate('google', { failureRedirect: '/login'}), (req,res) =>{
    console.log(req.user.token);
    req.session.token = req.user.token;
    res.redirect('/main');
});

app.post('/login', (req, res) => {
    req.body.userAgent = req.get('User-Agent');
    
    serviceAuth.checkUser(req.body)
    .then((user) => {
        req.session.user = {
            userName: user.userName,
            email: user.email,
            loginHistory: user.loginHistory
        }

        global.UN = req.session.user.userName;
        
        res.redirect('/main');
    }).catch((err) => {
        res.render('login', {errorMessage: err, userName: req.body.userName});
    });

});
app.get('/api/me',
  passport.authenticate('bearer', { session: false }),
  function(req, res) {
    res.json(req.user);
  });

app.get('/logout', (req, res) => {
    req.logout();
    req.session.reset();
    res.redirect('/');
})

app.get('/signup', (req, res) => {
    res.render('signup');
})

app.post('/signup', (req, res) => {
    serviceAuth.registerUser(req.body)
    .then((value) => {
        res.render('signup', {successMessage: "User created"});
    }).catch((err) => {
        res.render('signup', {errorMessage: err, userName: req.body.userName});
    })
});


app.get('*', (req, res) => {
    res.status(404).send("Page Not Found");
})

serviceAuth.initialize()
.then(serviceAuth.initialize)
.then(()=>{
    app.listen(port, function(){
        console.log("app listening on: " + port)
    });
}).catch((err)=>{
    console.log("unable to start server: " + err);
})

