require('dotenv').config();
const express = require("express");
const app = express();
const path = require("path");
const port = 80;
const bcrypt = require("bcryptjs");
const ejs = require("ejs");
const jwt = require("jsonwebtoken");  
const cookieParser = require("cookie-parser");
const auth = require("./middleware/auth");
const authh = require("./middleware/authh");

// console.log(process.env.SECRET_KEY);

const static_path = path.join(__dirname, "../templates/views");
const template_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials;")

app.use(cookieParser());
app.use(express.static(static_path));
app.set('view engine', 'ejs');
app.set("views", static_path);
// ejs.registerPartials(partials_path); 

const SignUpUser = require('../src/models/signupd');
const HSignUpUser = require('../src/models/signuph');
// const home2 = require("./models/home2");
const home2 = require("../src/models/home2");
const drhistory = require("../src/models/drhistory");

app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.get("/",(req,res)=>{
    res.render("index");
});
app.get("/profile", auth ,(req,res)=>{
    res.render("profile",{
        userData:res.user
    });
});
app.get("/profileh", authh ,(req,res)=>{
    res.render("profileh",{
        userData:res.user
    });
});
app.get("/home",(req,res)=>{
    res.render('home');
});
app.get("/about",(_,resp)=>{
    resp.render("about");
});
app.get("/logout", auth ,async (req,res)=>{
    try {
        res.clearCookie("jwt");
        console.log("logged out successfully");
        res.render("index");
    } catch (error) {
        res.status(500).send(error);
    }
})
app.get("/about2", auth ,(req,res)=>{
    res.render("about2",{
        userData:res.user
    })
});
app.get("/update", authh, (req,res)=>{
    res.render("update",{
        userData : res.user
    });
})
app.post("/update",authh , async (req,res)=>{
    try{const id = res.user._id;
    console.log(req.body.Ap);
    const _id=String(id)
    console.log(_id);
    // let check = await HSignUpUser.find({_id:res.user._id});
    console.log(req.body.An);
    let check = await HSignUpUser.update({_id},{
        $set:
        {
            Ap  : req.body.Ap,
            An  : req.body.An,
            Bp  : req.body.Bp,
            Bn  : req.body.Bn,
            Op  : req.body.Op,
            On  : req.body.On,
            ABp : req.body. ABp,
            ABn : req.body.ABn
        }               
        
    },{upsert:true});
    console.log(check);
    res.render("hospital_home",{
        userData:res.user
    });}
    catch(error){
        res.status(500).send(error);
        console.log(error);
    }
});
app.get("/recieve", (req,res)=>{
    res.render("signup");
});
app.get("/aftersign",(_,resp)=>{
    resp.render("aftersign")
});
app.get("/aftersignh",(_,resp)=>{
    resp.render("aftersignh");
});
app.get("/next", auth, (req,res)=>{
    res.render("next",{
        userData:res.user
    })
})
app.get("/availabled", auth , async(req,res)=>{
    const bg = res.user.bloodgroup;
    console.log(bg);
    let check = await HSignUpUser.find({bg});

    // let match = await HSignUpUser.find({bg:bg});
    // console.log(match.bg);
    
    res.render("availabled",{
        check:check,
        checkd:res.user
    });
});
app.get("/donate", auth ,async (req,res)=>{
    console.log(res.user)
     const state = res.user.state;
        let check = await HSignUpUser.find({state:state});
        console.log(check);
        // const donated = await dont.save();
           res.status(201).render("availableh",{
             check:check,
             userData:res.user
            });
    // res.render("availableh");
});
app.get("/contact",(_,resp)=>{
    resp.render('contact');
});
app.get("/contact2", auth ,(req,res)=>{
    res.render("contact2",{
        userData:res.user
    });
});

app.get("/donate",(_,resp)=>{
    resp.render("signup");
});
app.get("/hospital_history" , authh, async (req,res)=>{
    try{
    const name = res.user.hname;
    console.log(name)
    let histor = await home2.find({hospital:name});
    console.log(histor);
    let rhisto = await drhistory.find({hospital:name});
    console.log(rhisto);
    res.status(201).render("hospital_history",{
            histor:histor,
            userData:res.user,
            rhisto:rhisto
        });

    
    }
    catch(error){
        res.status(400).send(error);
        console.log(error);
    }
})

app.get("/home3" , auth, async (req,res)=>{
    try{
    const name = res.user.dname;
    console.log(name)
    let histor = await home2.find({name:name});
    console.log(histor);
    const nname = res.user.dname;
    let rhisto = await drhistory.find({name:nname});
    console.log(rhisto);



    res.status(201).render("home3",{
            histor:histor,
            userData:res.user,
            rhisto:rhisto
        });

    
    }
    catch(error){
        res.status(400).send(error);
    }
})
app.get("/home4", auth , async(req,res)=>{
    try {
        const {id}=req.query;
        const blist = await HSignUpUser.findOne({_id:id});
        console.log(blist);
        const rhist = new drhistory({
            name : res.user.dname,
            hospital : blist.hname,
            phone: blist.hphone
        });
        console.log(rhist);
        await rhist.save();
        const name = res.user.dname;
        let rhisto = await drhistory.find({name:name});
        console.log(rhisto);
        
        res.render("home3",{
            userData:res.user,
            rhisto:rhisto});
    } catch (error) {
        console.log(error);
    }
    
    
})

app.get("/home2" , auth, async (req,res)=>{
    const {idd}=req.query;
    const {id}=req.query;
    console.log({id});
    console.log({idd});
    if(id !== undefined){
    try{
        const donarList= await HSignUpUser.findOne({_id:id});
        // console.log(donarList)
            const historyd = new home2({
                name : res.user.dname,
                bg : res.user.bloodgroup,
                hospital: donarList.hname,
                phone: donarList.hphone
    });
    console.log(historyd);
    await historyd.save();
    const name = res.user.dname;
    console.log(name)
    let histor = await home2.find({name:name});
    console.log(histor);
    res.status(201).render("home2",{
            histor:histor,
            userData:res.user
        });
    }    
    catch(error){
    res.status(400).send(error);  
    console.log(error);  }}
    else if (idd !== undefined){
    try{
        const blist = await HSignUpUser.findOne({_id:idd});
        console.log(blist);
        const rhist = new drhistory({
            name : res.user.dname,
            bg : res.user.bloodgroup,
            hospital : blist.hname,
            phone: blist.hphone
        });
        console.log(rhist);
        await rhist.save();
        const nname = res.user.dname;
        let rhisto = await drhistory.find({name:nname});
        console.log(rhisto);
        
        res.render("home2",{
            userData:res.user,
            rhisto:rhisto});

    }
    catch(error){
        res.status(400).send(error);
    }}
    else {
        res.render("home2",{
            userData:res.user
        });
    }
//     try{
//     })
//     const history = await historyd.save();
})

app.post("/request", async(req,res) =>{
    try{
    const rec = new requestt({
        quantity : req.body.quantity,
        pname : req.body.pname,
        age : req.body.age,
        bloodgroup : req.body.bloodgroup,
        phone : req.body.phone,
        hname : req.body.hname,
        state : req.body.state,
        pincode : req.body.pincode,
        address : req.body.address,
    })
    // console.log(contact);
    const rex =  await rec.save();
    // console.log(contactt);
    res.status(201).redirect("availabled");
}catch(error) {
    res.status(400).send(error);
}
})

app.get("/login",(_,resp)=>{
    resp.render('login');
});
app.get("/signuph",(_,resp)=>{
    resp.render('Signuph');
});
// app.get("/signup", (_,resp) =>{
//     resp.render("Signup");
// });
app.get("/hospital_home", authh , (req,res)=>{
    res.render("hospital_home",{
        userData:res.user
    });
});
app.get("/hospital_about", authh ,(req,res)=>{
    res.render("hospital_about",{
        userData:res.user
    });
});
app.get("/hospital_contact", authh ,(req,res)=>{
    res.render("hospital_contact",{
        userData:res.user
    });
});
app.get("/record", authh , (req,res)=>{
    res.render("record",{
        userData:res.user
    });
});
app.get("/statuss",authh, async(req,res)=>{
    const {id} = req.query;
    const {idd} = req.query;
    const {iddd} = req.query;   
    if(id !== undefined){
    let chem = await home2.updateOne({_id:id},{
        $set:
        {
            status  : "Donated"
        }               
        
    },{upsert:true});}
    else if(idd !== undefined){
    let chemd = await drhistory.updateOne({_id:idd},{
        $set:
        {
            status  : "Request Accepted"
        }               
        
    },{upsert:true});}
    else {
        let chem = await drhistory.updateOne({_id:iddd},{
            $set:
            {
                status  : "Request Declined"
            }               
            
        },{upsert:true});
    }
    res.render("hospital_home",{
        userData:res.user
    });
})

app.get("/requests", authh , async(req,res)=>{
    const name = res.user.hname;
    console.log(name);
    let check = await home2.find({hospital:name , status:"pending"});
    let checkd = await drhistory.find({hospital:name , status:"pending"});
    console.log(check);
    res.render("requests",{
        userData:res.user,
        check:check,
        checkd:checkd
    });
});
app.get("/signup", (_,resp) =>{
    console.log("path hit");
    resp.render("signup");
});
app.get("/loginh", (_,resp) =>{
    resp.render("loginh");
});
app.get("/loginop", (_,resp)=>{
    resp.render("loginop");
})
app.get("/logind", (_,resp) =>{
    resp.render("logind");
});

app.get("/contact", (_,resp) =>{
    resp.render("contact");
});

app.get("/contact2", auth ,(req,res)=>{
    res.render("contact2",{
        userData:res.user
    });
});

app.get("/signupd", (_,resp)=>{
    resp.render("Signupd");
});

app.get("/donate1", auth ,async (req,res)=>{
    
    res.render('donate1'); 
});
// // Connect to MongoDB
require("./db/conn");

const signupd = require("./models/signupd");
const signuph = require("./models/signuph");
const contact_us = require("./models/contact");
const requestt = require("./models/request"); 
const { request } = require('http');
// const authh = require('./middleware/authh');

// // const static_path = path.join(__dirname, "../public/views");

// // app.use(express.static(static_path));

app.post("/signupd", async(req,res) =>{
    try { 
        const password = req.body.password;
        const confirm_password = req.body.confirm_password;
        
        if(password === confirm_password){
            console.log("ff");
            const registerDonor = new signupd({
                dname: req.body.dname,
                demail : req.body.demail,
                dphone : req.body.dphone,
                bloodgroup : req.body.bloodgroup,
                DOB : req.body.DOB,
                address : req.body.address,
                state : req.body.state,
                pincode : req.body.pincode,
                allergy : req.body.allergy,
                password : req.body.password, 
                confirm_password : req.body.confirm_password
            })
            
            const token = await registerDonor.generateAuthToken();
            res.cookie("jwt", token);
 const registerd = await registerDonor.save();
    res.status(201).redirect("logind");
}else{
    res.send("passwords donot matching");
}
}catch (error) {
    res.status(400).send(error);
    }
})

app.post("/signuph" , async(req,res) =>{
    try {
        const password = req.body.password;
        const confirm_password = req.body.confirm_password;

        if(password === confirm_password){
            console.log('ff')
            const registerHospital = new signuph({
                hname : req.body.hname,
                aname : req.body.aname,
                hemail : req.body.hemail,
                hphone : req.body.hphone,
                aphone : req.body.aphone,
                haddress : req.body.haddress,
                state : req.body.state,
                pincode : req.body.pincode,
                location : req.body.location,
                password : req.body.password,
                confirm_password : req.body.confirm_password,
                Ap  : req.body.Ap,
                An  : req.body.An,
                Bp  : req.body.Bp,
                Bn  : req.body.Bn,
                Op  : req.body.Op,
                On  : req.body.On,
                ABp : req.body. ABp,
                ABn : req.body.ABn
            })


            const token = await registerHospital.generateAuthToken(); 
            res.cookie("jwt", token);
 const hregistered = await registerHospital.save();
    res.status(201).redirect("loginh");
    
}else{
    res.send("passwords donot matching");
}
}catch (error) {
    res.status(400).send(error);
    }
})

app.post("/contact", async(req,res) =>{
    try{
        console.log(req.body);
    const contact = new contact_us({
        name : req.body.name,
        email : req.body.email,
        phone : req.body.phone,
        problem : req.body.problem,
        state : req.body.state,
    })
    // console.log(contact);
    const contactt =  await contact.save();
    // console.log(contactt);
    res.status(201).redirect("home");
}catch(error) {
    res.status(400).send(error);
}
})


app.post("/contact2", async(req,res) =>{
    try{
        const contact = new contact_us({
            name : req.body.name,
            email : req.body.email,
            phone : req.body.phone,
            problem : req.body.problem,
            state : req.body.state,
        })
        // console.log(contact);
        const contactt =  await contact.save();
        // console.log(contactt);
        res.status(201).redirect("home2");
    }catch(error) {
        res.status(400).send(error);
    }
    })

    app.post("/hospital_contact", async(req,res) =>{
        try{
            const contact = new contact_us({
                name : req.body.name,
                email : req.body.email,
                phone : req.body.phone,
                problem : req.body.problem,
                state : req.body.state,
            })
            // console.log(contact);
            const contactt =  await contact.save();
            // console.log(contactt);
            res.status(201).redirect("hospital_home");
        }catch(error) {
            res.status(400).send(error);
        }
        })


app.post("/recieve", async(req,res)=>{
    try {
        const rec = new recieve({
            quantity :req.body.quantity,
            pname :req.body.pname,
            age :req.body.age,
            bloodgroup :req.body.bloodgroup,
            phone :req.body.phone,
            hname :req.body.hname,
            state :req.body.state,
            pincode :req.body.pincode,
            address :req.body.address,
        })
        const recieved = await rec.save();
           res.status(201).redirect("availableh");
    } catch (error) {
        res.status(400).send(error);
    }
})


//  // donr login validation
app.post("/logind", async(req, res) =>{
    try{
        const email = req.body.email;
        const password = req.body.password;
        
        let uemail = await SignUpUser.findOne({demail:email});
         
        const ismatch = await bcrypt.compare(password, uemail.password); 
        
        const token = await uemail.generateAuthToken();       
        
        res.cookie("jwt", token); 

        if(ismatch){
        res.render("aftersign");
        }else{
            res.send("invalid password details");
        }
    }catch (error){
        res.status(400).send("invalid email")
    }
})
// // hospitl login validation
app.post("/loginh", async(req, res) =>{
    try{
        const email = req.body.email;
        const password = req.body.password;

        let uemail = await HSignUpUser.findOne({hemail:email});

        const ismatch = await bcrypt.compare(password, uemail.password); 
        
        const token = await uemail.generateAuthToken();
        
        res.cookie("jwt", token); 

        if(ismatch){
            res.status(201).redirect("aftersignh");
        }else{
            res.send("passwords are not matching");
        }
    }catch (error){
        res.status(400).send("invalid email")
    }
})

app.get("/this", (req, res)=>{
    res.status(404).send("This page is not found on my website cwh");
});

app.listen(port, ()=>{
    console.log(`The application started successfully on port ${port}`);
});