// specifically for CSE TY
let fs = require("fs");
let { spawn } = require("child_process");
const { mdToPdf } = require("md-to-pdf");
const { mkdir } = require("fs").promises;

let subjects = {
  bis: "Business Intelligence System",
  cns: "Cryptography Network Security",
  dt: "Design Thinking",
  nlp: "Natural Language Processing",
  misc: "Miscellaneous",
};

let note =
  "Note : this document was generated by an AI and is not approved by any faculty from our college";

let website = ` \n\n\n\n<br> <hr> <br> <p align="center"> By <a href="http://65.0.14.141/" style="text-decoration:none;"> Assignment Buddy </a> </p>`;

Object.keys(subjects).forEach(async (sub) => {
  try {
    await mkdir("./documents/" + sub);
    console.log(`${sub} directory created successfully`);
  } catch (e) {
    console.log(`${sub} directory already exists`);
  }
});

let toPDF = async (path, cb, authKey, username) => {
  const pdf = await mdToPdf({ path: path }).catch(console.error);

  let temp = false;
  if (pdf) {
    if (!config.hasAccess(authKey, username)) {
      temp = '-' + path.split("-")[1].replace(".md","");
      setTimeout(() => {
        if (path.includes("temp")) fs.unlinkSync(path.replace(".md", ".pdf"));
        if (path.includes("temp")) fs.unlinkSync(path);
      }, config.fileDeleteDelay * 1000);
    }

    fs.writeFileSync(path.replace(".md", ".pdf"), pdf.content);

    cb(path.replace(".md", ".pdf"), temp ? temp.replace(".md", "") : temp);
    console.log("Done...");
  } else {
    cb("-Error could not write PDF");
  }
};

function Datify() {
  return Date().split(" ").slice(0, 3).join(" ").replace(" ", ", ");
}

//console.log(Datify());

let heading = (title, number, type) => {
  if(type.toLowerCase().startsWith("exp")) type = type.slice(0,10);
  let text = `<span style='color:red'><i> (${note}) </i> <br> <span style="color:green;"> </span> </span> \n \n # ${type} ${number}\n **Class** : CSE TY <br>**Subject** : ${title} <br>**Generated On** : ${Datify()}  \n <hr> \n\n`;
  return text;
};

class Generator {
  constructor(subject, number, type, cb) {
    this.subject = subject ? subjects[subject] : "_";
    this.number = number;
    this.subjectPrefix = subject;
    this.year = 3;
    this.type = type ? type : "Assignment";
    // this.extra = extra ? extra : "BTech";
    this.c = 0;
    this.path = `./documents/${this.subjectPrefix}/${
      this.subjectPrefix + this.number
    }.md`;

    this.__init__();

    this.readMeStream = fs.createWriteStream(this.path);
    this.callback = cb;
  
  }

  __init__() {
    switch(this.type.charAt(0).toLowerCase()) {
      case 'e': {
        console.log(this.type);
        let batch = this.type.toLowerCase().replace("experiment","");
       this.path = this.path.replace(`${this.subjectPrefix + this.number}`,`${this.subjectPrefix + this.number + "exp" + batch}`)
      }
      break;

      case 'q': {
        console.log(this.type);
        let qbNumber = this.type.toLowerCase().replace("questionbank","");
        this.path = this.path.replace(`${this.subjectPrefix + this.number}`,`${this.subjectPrefix + this.number + "qb" + qbNumber}`)
      }
      break;

     default : {}
    

  }
}


  askQ(qs, authKey, username,notFirst) {
    if(!notFirst) {
    if (!subjects[this.subjectPrefix])
      throw Error("ERROR :  Invalid subject prefix");
    if (!config.hasAccess(authKey, username)) {
      this.path = this.path.replace(".md", "-temp" + Date.now() + ".md");
      this.readMeStream = fs.createWriteStream(
        this.path
      );
    }
  }

  this.readMeStream.write(heading(this.subject, this.number, this.type));

    console.log("Generating Answer...");
    this.AIStream = spawn("node", ["ai.mjs"]);
    this.AIStream.on("error", (e) => console.log(e));
    this.readMeStream.write(
      ` \n\n #### Q${this.c + 1}. ${qs[this.c]} \n\n #### Ans. <br> \n`
    );
    this.AIStream.stderr.on("data", (err) => console.log(err.toString()));
    this.AIStream.stdin.write("-" + qs[this.c] + ",in " + this.subject);

    this.AIStream.stdout.on("data", (data) => {
      this.readMeStream.write(data);
    });
    this.AIStream.stdout.on("end", () => {
      console.log("Done...");
      this.c += 1;
      if (qs[this.c]) {
        this.AIStream.kill();
        this.AIStream = null;
        this.askQ(qs, authKey, username,true);
      } else {
        this.readMeStream.write(` <i>${website} </i>`);
        this.readMeStream.end();
        console.log("Converting to PDF...");

        toPDF(this.path, this.callback, authKey, username);
      }
    });
  }
}

module.exports = Generator;

/*

let qs = [
  "What is a Cloud and explain Software as a Service (SaaS) in detail.",
  "Define ETL process and explain in detail with architecture. Support your answer with a diagram.",
  "Write a short note on: a. BI tools b. Types of users",
];

BIS.askQ(qs);*/
