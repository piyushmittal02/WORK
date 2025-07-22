var express = require("express");
var app = express();
var mysql2 = require("mysql2");
var cloudinary = require("cloudinary").v2;

var fileuploader = require("express-fileupload");

app.use(express.static("public"));
app.use(fileuploader());
app.use(express.urlencoded(true));

// const { GoogleGenerativeAI } = require("@google/generative-ai");

// const genAI = new GoogleGenerativeAI("AIzaSyC2YR7mceY7P6aBGojyxdgEKbMl_0KVsyQ");
// const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

//----------------------gimini-----------------------------------
var fs = require("fs");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI("AIzaSyBkOTsS9cALDReSUvGAoQOdPDLtiGcsGvQ");
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
// app.use(express.urlencoded(true)); //convert POST data to JSON object



app.listen(2004, function () {
    console.log("Server Started 2004");
})
app.get("/", function (req, resp) {
    console.log(__dirname);
    let path = __dirname + "/public/index.html";
    resp.sendFile(path);

})

app.get("/org-details", function (req, resp) {
    // console.log(__dirname);
    let path = __dirname + "/public/org-details.html";
    resp.sendFile(path);

})


//--------aiven-----------
let aiven = "mysql://avnadmin:AVNS_oLQlHuqn4241nOAtiul@mysql-36ecd483-piyushmittal02062007-08bc.c.aivencloud.com:14135/defaultdb"
server = mysql2.createConnection(aiven);
server.connect(function (err) {
    if (err == null) {
        console.log("chal pada");
    }
    else {
        console.log(err.message);
    }
})
//--------Cloudinary----------------
// app.use(express.urlencoded(true)); //convert POST data to JSON object

cloudinary.config({
    cloud_name: 'dfyxjh3ff',
    api_key: '261964541512685',
    api_secret: 'PfRVIo1IagO5z_ZnNFI1TQ7DOLc' // Click 'View API Keys' above to copy your API secret
});
//-----------------------------index--------------------------------------



//----------------signup----------------------------------------------------------

app.get("/get-one", async function (req, resp) {


    let email = req.query.txtemail1;
    let pwd = req.query.txtpwd1;
    let user = req.query.combo;
    // let mobile = req.query.txtno;
    server.query("insert into user09 values(?,?,current_date(),1,?)", [email, pwd, user], function (err) {
        if (err == null) {
            resp.send("record saved");
        }
        else
            resp.send(err.message);
    })

})
app.get("/chk-email", function (req, resp) {
    // console.log(req.query.txtemail2);
    let email = req.query.txtemail2;
    let pwd = req.query.txtpwd2;
    server.query("select * from user09 where email=? and pwd=?", [email, pwd], function (err, allRecords) {
        if (allRecords.lenght == 0) {
            resp.send("Invalid");
            return;
        }
        else if (allRecords[0].status == 0) {

            resp.send("Blocked");
        }
        else
            resp.send(allRecords[0]['utype']);

    })

    //---------------------organiser--------------------------------------------------



})
app.post("/form-comp", async function (req, resp) {
    let picurl = "";
    if (req.files != null) {

        picurl = req.files.profilepic.name;
        let fullpath = __dirname + "/public/uploads/" + picurl;
        req.files.profilepic.mv(fullpath);
        await cloudinary.uploader.upload(fullpath).then(function (picurlresult) {
            picurl = picurlresult.url;
            // console.log(picurl);

        });
    }
    else
        picurl = "nopic.jpg";

    let emailid = req.body.txtemail3;
    let orgname = req.body.orgname;
    let regnumber = req.body.regnumber;
    let address = req.body.address;
    let city = req.body.city;
    let sports = req.body.sports;
    let website = req.body.website;
    let insta = req.body.insta;
    let head = req.body.head;
    let contact = req.body.contact;
    let info = req.body.info;


    // let picurl12 = req.body.picurl;
    //  console.log(picurl12);

    server.query("insert into organiser values(?,?,?,?,?,?,?,?,?,?,?,?)", [emailid, orgname, regnumber, address, city, sports, website, insta, head, contact, picurl, info], function (err) {

        if (err == null)
            resp.send("form filled succesfully");
        else
            resp.send(err);
    })
})

//--------------------login--------------------------------------------------------


app.get("/get-second", function (req, resp) {

    let emailid = req.query.txtemail3;
    //    console.log(emailid);
    server.query("select * from organiser where emailid=?", [emailid], function (err, allrecords) {
        if (allrecords.lenght == 0)
            resp.send(" no record found");
        else
            resp.send(allrecords);
    })
})

//---------------update of organiser----------------------------------------


app.post("/modify", async function (req, resp) {
    let picurl = "";
    if (req.files != null) {
        picurl = req.files.profilepic.name;
        let fullpath = __dirname + "/public.js/uploads/" + picurl;
        req.files.profilepic.mv(fullpath);
        await cloudinary.uploader.upload(fullpath).then(function (picurlresult) {
            picurl = picurlresult.url;
            console.log(picurl);

        });
    }
    else
        picurl = req.body.hdn;


    let emailid = req.body.txtemail3;
    let orgname = req.body.orgname;
    let regnumber = req.body.regnumber;
    let address = req.body.address;
    let city = req.body.city;
    let sports = req.body.sports;
    let website = req.body.website;
    let insta = req.body.insta;
    let head = req.body.head;
    let contact = req.body.contact;
    let info = req.body.info;

    server.query("update organiser set orgname=?,regnumber=?,address=?,city=?,sports=?,website=?,insta=?,head=?,contact=?,info=? where emailid=?", [orgname, regnumber, address, city, sports, website, insta, head, contact, info, emailid], function (err, result) {

        if (err == null) {
            if (result.affectedRows == 1) {
                resp.send("record changed");
            }
            else
                resp.send("invalid id");
        }
        else
            resp.send(err.message);
        //  console.log(err.message);
    })
})
//------------------post tournament----------------------------------
app.get("/org-template", function (req, resp) {
    var path = __dirname + "/public/org-template.html";
    resp.sendFile(path);
})

app.get("/post-tounament.html", function (req, resp) {
    // console.log(__dirname);
    let path = __dirname + "/public/post-tournament.html";
    resp.sendFile(path);

})
app.get("/get-third", async function (req, resp) {
    let emailid = req.query.txtemail4;
    let evente = req.query.event;
    let doe = req.query.doe;
    let toe = req.query.toe;
    let address = req.query.address;
    let city = req.query.city;
    let sports = req.query.sports;
    let minage = req.query.minage;
    let maxage = req.query.maxage;
    let lastdate = req.query.lastdate;
    let fee = req.query.fee;
    let prize = req.query.prize;
    let contact = req.query.contact;

    server.query("insert into tornaments values(?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [null, emailid, evente, doe, toe, address, city, sports, minage, maxage, lastdate, fee, prize, contact], function (err) {
        if (err == null) {
            resp.send("record svaed");
        }
        else {

            console.log(err.message);
        }
    })
    //---------------------------template-opening-of-buttons---------------------------------
    0
})
app.get("/player", function (req, resp) {
    // console.log(__dirname);
    let path = __dirname + "/public/player-dash.html";
    resp.sendFile(path);
})
app.get("/profile", function (req, resp) {
    let path = __dirname + "/public/profile-player.html";
    resp.sendFile(path);
})
app.get("/fetch", async function (req, resp) {
    let path = __dirname + "/public/turnament-manager.html";
    resp.sendFile(path);
})

app.get("/fetch-all", function (req, resp) {
    let email = req.query.email;
    console.log(email);
    server.query("select * from  tornaments where emailid = ?", [email], function (err, allRecords) {

        if (err == null) {
            resp.send(allRecords);
        }
        else {
            resp.send(err.message);
            console.log(err.message);
        }
    })
})

app.get("/delete-one", function (req, resp) {
    rid = req.query.rid_kuchh;
    server.query("delete from  tornaments  where rid=?", [rid], function (err, allRecords) {

        if (err == null) {
            resp.send("Delete");
        }
        else {
            resp.send(err.message);
            console.log(err.message);
        }
    })
})



// --------------player-profile--------------------------------

async function RajeshBansalKaChirag(imgurl) {
    const myprompt = "Read the text on picture and tell all the information in adhaar card and give output STRICTLY in JSON format {adhaar_number:'', name:'', gender:'', dob: ''}. Dont give output as string."
    const imageResp = await fetch(imgurl)
        .then((response) => response.arrayBuffer());

    const result = await model.generateContent([
        {
            inlineData: {
                data: Buffer.from(imageResp).toString("base64"),
                mimeType: "image/jpeg",
            },
        },
        myprompt,
    ]);
    console.log(result.response.text())

    const cleaned = result.response.text().replace(/```json|```/g, '').trim();
    const jsonData = JSON.parse(cleaned);
    console.log(jsonData);

    return jsonData;

}

app.post("/submission", async function (req, resp) {


    let picurl = "";
    if (req.files != null) {
        picurl = req.files.profilepic.name;
        let fullpath = __dirname + "/public/uploads/" + picurl;
        req.files.profilepic.mv(fullpath);

        await cloudinary.uploader.upload(fullpath).then(function (picurlresult) {
            picurl = picurlresult.url;
            console.log(picurl);
        });
    }
    else
        picurl = req.body.hdn;
    let acardpicurl = "";
    if (req.files != null) {
        picurl = req.files.adhaar.name;
        let fullpath = __dirname + "/public/uploads/" + acardpicurl;
        req.files.adhaar.mv(fullpath);
        await cloudinary.uploader.upload(fullpath).then(async function (picurlresult) {
            acardpicurl = picurlresult.url;
            console.log(acardpicurl);
            // let jsonData = await RajeshBansalKaChirag(acardpicurl);
            resp.send(jsonData);
        });
    }
    else
        picurl = req.body.hdn;


    let email = req.body.txtemail;
    let name = jsonData.name;
    let address = req.body.address;
    let dob = jsonData.dob;
    let gender = jsonData.gender;
    let game = req.body.sports;
    let contact = req.body.contact;
    let info = req.body.info;

    server.query("insert into players values(?,?,?,?,?,?,?,?,?,?)", [email, acardpicurl, picurl, name, dob, gender, address, contact, game, info], function (err, allrecords) {
        if (err == null) {
            resp.send(allrecords);
        }
        else {
            resp.send(err.message);
        }
    })


})

// app.post("/change", async function (req, resp) {

// })

app.get("/get-fourth", function (req, resp) {

    let emailid = req.query.txtemail;
    //    console.log(emailid);
    server.query("select * from players where emailid=?", [emailid], function (err, allrecords) {
        if (allrecords.lenght == 0)
            resp.send(" no record found");
        else
            resp.send(allrecords);
    })
})



//----------------new-template--------------------------

app.get("/dash-admin", function (req, resp) {
    let path = __dirname + "/public/dash-admin.html";
    resp.sendFile(path);
})
app.get("/administration", function (req, resp) {
    let path = __dirname + "/public/admin-users-console.html";
    resp.sendFile(path);
})

//--------------user data show---------------------------------


app.get("/do-fetch-all-users2", function (req, resp) {
    server.query("select * from user09", function (err, allRecords) {
        resp.send(allRecords);
    })
})


app.get("/delete-one2", function (req, resp) {
    console.log(req.query);
    let emailid = req.query.emailidKuch;
    console.log(emailid);

    server.query("update  user09 set status = 0  where email=?", [emailid], function (errKuch, result) {
        if (errKuch == null) {
            if (result.affectedRows == 1)
                resp.send(" blocked Successfully");
            else
                resp.send("Invalid emamilid");
        }
        else
            resp.send(errKuch);

    })
})
app.get("/resume-one", function (req, resp) {
    console.log(req.query);
    let mail = req.query.txtmail;
    console.log(mail);

    server.query("update  user09 set status = 1  where email=?", [mail], function (errKuch, result) {
        if (errKuch == null) {
            if (result.affectedRows == 1)
                resp.send(" Resume Successfully");
            else
                resp.send("Invalid emamilid");
        }
        else
            resp.send(errKuch);
    })
})

//---------------------admin-console------------------------------------------------

app.get("/admin", function (req, resp) {
    let path = __dirname + "/public/admin-console.html";
    resp.sendFile(path);
})
app.get("/do-fetch-organiser", async function (req, resp) {

    server.query("select * from organiser", function (err, allRecords) {
        resp.send(allRecords);
    })

})
//---------------------player-console-----------------------------------------

app.get("/player-console", async function (req, resp) {

    let path = __dirname + "/public/player-console.html";
    resp.sendFile(path);

})
app.get("/do-fetch-players", async function (req, resp) {

    // console.log("piyush");
    server.query("select * from  players", function (err, allRecords) {

        resp.send(allRecords);

        if (err != null) {
            resp.send(err.message);

        }
    })
})
//--------------------tournament-template--------------------------

app.get("/dash-tour", function (req, resp) {

    let path = __dirname + "/public/tounament-finder.html";
    resp.sendFile(path);

})
app.get("/do-fetch-all-tournaments", function (req, resp) {
    console.log(req.query.kuchcity);
    console.log(req.query.kuchgame);
    server.query("select * from tornaments where city=? and sports=?", [req.query.kuchcity, req.query.kuchgame], function (err, allRecords) {
        console.log(allRecords);
        resp.send(allRecords);
        if (err != null) {
            resp.send(err.message);
            console.log(err.message);

        }
    })
})
app.get("/do-fetch-all-cities", function (req, resp) {
    server.query("select distinct city from tornaments", function (err, allRecords) {
        resp.send(allRecords);
    })
})
app.get("/do-fetch-all-sports", function (req, resp) {
    server.query("select distinct sports from tornaments", function (err, allRecords) {
        resp.send(allRecords);
    })
})

app.get("/do-update-pass", function (req, resp) {

    server.query("update  user09 set pwd=? where pwd=? and email=?", [req.query.kuchnew, req.query.kuchold, req.query.kuchemail], function (err) {

        if (err == null) {
            resp.send("congats");
        }
        else {
            resp.send(err.message);
        }

    })

})




