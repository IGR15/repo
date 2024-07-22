const http = require('http')
const students =[]
const server = http.createServer((req, res) => {
try{   
    console.log(req.url)
    
    if(req.method==='GET'){
   const url = new URL(`http://127.0.0.1${req.url}`)
    const studentNo = parseInt(url.searchParams.get('studentNo'))
   if (studentNo){
       const student = students.find((student) =>  student.studentNo == studentNo)
       if (student){
       res.end(JSON.stringify(student))
       } else {
       res.end(JSON.stringify({msg:'student not found'}))
      }
   }else{
       res.end(JSON.stringify(students))

   }
   }else if (req.method==='POST'){
      let body =''
    req.on('data',(data)=>{body += data})
    req.on('end',()=>{
      try{
        const params = JSON.parse(body)
        switch(params.action){
         case 'delete':
            const studentNoToDelete = params.studentNo
            students.splice(studentNoToDelete,1)
            res.end(JSON.stringify({msg:'student deleted'}))
            break;
         case 'updateName':
            const newName = params.studentName
            const newNameNo = students.find((newNameNo) => newNameNo.studentNo == params.studentNo)
            if(newNameNo){
                newNameNo.studentName= newName
                res.end(JSON.stringify({msg:'student name updated'}))
             }else{
                res.statusCode=404
                res.end(JSON.stringify({msg:'student not found'}))
             }
            break;
         case 'updateNo':
            const newStudentNO= params.newStudentNo
            const studentToUpdate = students.find((studentToUpdate) => studentToUpdate.studentNo == params.studentNo)
            if(studentToUpdate){
                studentToUpdate.studentNo = newStudentNO
                res.end(JSON.stringify({msg:'student number updated'}))
             }else{
                res.statusCode=404
                res.end(JSON.stringify({msg:'student not found'}))
             }
         
            break;
         case 'addStudent':
             students.push({"studentNo":params.studentNo,"studentName":params.studentName})
             res.end(JSON.stringify({msg:'student added'}))
             console.log(students)
             break;
         default:
             res.statusCode=400
             res.end(JSON.stringify({msg:'invalid action'}))
             break;
        }  
       }catch(err){
        
        res.statusCode=400
        res.end(JSON.stringify({msg:'invalid JSON data'}))
      }        
    }
     
     )}else{
      res.statusCode = 400;
            res.end(JSON.stringify({ msg: 'method not allowed' }));
     } 
   }catch(error){  
      res.statusCode = 400;
      res.end(JSON.stringify({ msg: 'Internal Server Error' }));
  }
   
   })
    server.listen(3000)
