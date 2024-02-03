module.exports = {
    whiteList : ["ompatil","mayurhiwale"],
    authKey : process.env.AUTH_KEY,
    subjects : {
        bis: "Business Intelligence System",
        cns: "Cryptography Network Security",
        dt: "Design Thinking",
        nlp: "Natural Language Processing",
        misc: "Miscellaneous"
      },
    
    fileDeleteDelay : 30 * 60, // 30 minutes

    hasAccess: function(authKey,username) {
        console.log(this.authKey);
        if(authKey !== this.authKey) return false;
        if(!this.whiteList.includes(Tools.toId(username))) return false;
        return true;
    },

    parseFilePath: function(subject,number,type) {
        let path = `./documents/${subject}/${subject + number}`;
         type = type.toLowerCase();
        switch(type.charAt(0)) {
            case 'e' : path += "exp" + type.replace("experiment","");
            break;
            case 'q' : path += "qb" + type.replace("questionbank","");
            break;
        }
        return path;
    }
    
}