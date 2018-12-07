//host: ec2-54-225-92-1.compute-1.amazonaws.com
//db: des8c6i3m6i1tj
//user: ujdipllsymkgzb
//port: 5432
//pw: 20367870764faadc4bcbf2cba658785858dbe68636fb4ff98592e96495b37152
//URI: postgres://ujdipllsymkgzb:20367870764faadc4bcbf2cba658785858dbe68636fb4ff98592e96495b37152@ec2-54-225-92-1.compute-1.amazonaws.com:5432/des8c6i3m6i1tj


const Sequelize = require('sequelize');

// set up sequelize to point to our postgres database
var sequelize = new Sequelize('des8c6i3m6i1tj','ujdipllsymkgzb','20367870764faadc4bcbf2cba658785858dbe68636fb4ff98592e96495b37152', {
    host: 'ec2-54-225-92-1.compute-1.amazonaws.com',     
    dialect: 'postgres',     
    port: 5432,     
    dialectOptions: {         
        ssl: true   
    },  
    operatorsAliases:false
});


//Define Course Model/Table
var Courses = sequelize.define('Courses', {
    code: {//courseCode
        type: Sequelize.TEXT,
        primaryKey: true
    },
    name: Sequelize.TEXT, //subjectTitle
    semester: Sequelize.INTEGER,//semester
    prerequisite: Sequelize.ARRAY(Sequelize.TEXT),//prerequisite 
    required: Sequelize.ARRAY(Sequelize.TEXT),//requiredCourse  
    recommendedProfessor: Sequelize.ARRAY(Sequelize.TEXT),//recommendedProf  
    isGeneral: Sequelize.BOOLEAN,//isGeneral
    desc: Sequelize.TEXT},
    {
        createdAt: false, // disable createdAt
        updatedAt: false // disable updatedAt
});


// module.exports.initialize = () => {
//     return new Promise(function (resolve, reject) {// create a promise object/instance     
//         sequelize.sync().then((Courses) => {
//             resolve();
//         })
//         .catch((err) => {
//             reject("unable to sync the database");
//         });
//     });
// };

module.exports.getAll = () => {
    return new Promise((resolve,reject) => {
        Courses.findAll().then((data) => {
            global.arr = data.map((element) => {
                let newarr = {};
                newarr['code'] = element.code;
                newarr['name'] = element.name;
                newarr['semester'] = element.semester;
                newarr['prerequisite'] = element.prerequisite;
                newarr['required'] = element.required;
                newarr['recommendedProfessor'] = element.recommendedProfessor;
                newarr['isGeneral'] = element.isGeneral;
                newarr['desc'] = element.desc;
                return newarr;
            });
            resolve(arr);
        })
        // sequelize.sync()
        // .then(()=>{
        //     console.log(Courses.findAll());
        //     resolve(Courses.findAll());
        // })
        .catch((err)=>{
            reject("unable to sync the database");
        });
    });
};

// module.exports.sort = ()=>{
//     return new Promise((resolve,reject) =>{
//         sequelize.sync()
//         .then(()=>{
//             resolve(Courses.findAll({
//                 order: [
//                     ['semester']
//                 ]
//             }));
//         })
//         .catch( (err)=>{
//             reject("unable to sync to database");
//         }); 
//     });
// };