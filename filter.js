// module.exports.jsonInput = (jsonInformation) => {
//     return new Promise ((resolve, reject) => {
//         let arr = {
//             code : [],
//             name : [],
//             semester : [],
//             prerequisite : [],
//             required : [],
//             recommendedProfessor : [],
//             isGeneral : [],
//             desc : []
//         };

//         var arr = jsonInformation.map((element) => {
//             let newarr = {};
//             newarr['code'] = element.code;
//             newarr['name'] = element.name;
//             newarr['semester'] = element.semester;
//             newarr['prerequisite'] = element.prerequisite;
//             newarr['required'] = element.required;
//             newarr['recommendedProfessor'] = element.recommendedProfessor;
//             newarr['isGeneral'] = element.isGeneral;
//             newarr['desc'] = element.desc;
//             return newarr;
//         });

//         // 상기와 동일
//         // for(let i=0; i<jsonInformation.length; i++){
//         //     arr.code.push(jsonInformation[i].code);
//         //     arr.name.push(jsonInformation[i].name);
//         //     arr.semester.push(jsonInformation[i].semester);
//         //     arr.prerequisite.push(jsonInformation[i].prerequisite);
//         //     arr.required.push(jsonInformation[i].required);
//         //     arr.recommendedProfessor.push(jsonInformation[i].recommendedProfessor);
//         //     arr.isGeneral.push(jsonInformation[i].isGeneral);
//         //     arr.desc.push(jsonInformation[i].desc);
//         //     // arr[i] = code[i].concat(' / ' + professor[i]).concat(' / ' + rate[i]).concat(' / ' + description[i]);
//         // }

//         if(arr[0].code == jsonInformation[0].code){
//             resolve(arr);
//         }
//         else{
//             reject("Error Occured in jsonInput()");
//         }
//     })
// }

module.exports.filterfunction = (data) => {
    return new Promise((resolve, reject) => {
        let checkData = {
            semester : [],
            isgeneral : []
        }

        let semesterNumber;
        if(data.semester == null){
            semesterNumber = 0;
        }
        else{
            semesterNumber = data.semester.length;
        }
        for(let i=0; i<semesterNumber; i++){
            checkData.semester = data.semester;
        }

        let isgeneralNumber;
        if(data.isgeneral == null){
            isgeneralNumber = 0;
        }
        else{
            isgeneralNumber = data.isgeneral.length;
        }
        for(let i=0; i<isgeneralNumber; i++){
            checkData.isgeneral = data.isgeneral;
        }

        if(checkData.semester.length == semesterNumber){
            resolve(checkData);
        }
        else{
            reject("Error Occured in filterfunction()")
        }
    })
}