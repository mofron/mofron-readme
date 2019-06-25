/**
 * @file index.js
 * @brief mofron-readme command
 * @author simparts
 */
const fs      = require("fs");
const Comment = require("./src/Comment.js");
const gen     = require("./src/generate.js");

let write = (prm) => {
    try {
        fs.writeFile(
            "./README.md", prm,
            (err) => {
                if (null !== err)  {
                    console.log(err);
                }
            }
        );
    } catch (e) {
        console.error(e.stack);
        throw e;
    }
};

let getComment = (code) => {
    try {
        code = code.split('\n');
        let ret  = [];
        let bgn  = true;
        let elem = null;
        for (let cidx in code) {
            
            if (true === bgn) {
                if ( (-1 !== code[cidx].indexOf("/**")) && (-1 === code[cidx].indexOf("*/"))) {
                    bgn = false;
                    elem = { desc: code[parseInt(cidx)+1], conts: [], note: null };
                }
            } else {
                if (-1 === code[cidx].indexOf("*/")) {
                    if (-1 !== code[cidx].indexOf("//")) {
                        code[cidx] = code[cidx].substring(0, code[cidx].indexOf("//"));
                    }
                    elem.conts.push(code[cidx]);
                } else {
                    bgn = true;
                    elem.note = code[parseInt(cidx)+1];
                    ret.push(elem);
                }
            }
        }
        return getElem(ret);
    } catch (e) {
        console.error(e.stack);
        throw e;
    }
}

let getElem = (cmt) => {
    try {
        let ret = [];
        let key = null;
        for (let cidx in cmt) {
            key = null;
            let elem = {};

            for (let cnt_idx in cmt[cidx].conts) {
                
                if (-1 !== cmt[cidx].conts[cnt_idx].indexOf('@')) {
                    let mch = cmt[cidx].conts[cnt_idx].match(/@[a-zA-Z]+/);

                    if (null !== mch) {
                        key = mch[0].substring(1);

                        let set_elem = cmt[cidx].conts[cnt_idx].substring(mch.index + key.length + 1);
                        if (' ' === set_elem[0]) {
                            set_elem = set_elem.substring(1);
                        }
                        if (undefined === elem[key]) {
                            elem[key] = [set_elem];
                        } else {
                            elem[key].push(set_elem);
                        }
                    }
                    
                } else if (null !== key) {
                    let add_cnt = cmt[cidx].conts[cnt_idx].match(/ [*] */);
                    add_cnt = cmt[cidx].conts[cnt_idx].substring(add_cnt[0].length + add_cnt.index);
                    if (false === Array.isArray(elem[key])) {
                        elem[key] = [elem[key], add_cnt];
                    } else {
                        elem[key].push(add_cnt);
                    }
                }
            }
            if (undefined === elem.file) {
                if (-1 !== cmt[cidx].desc.indexOf('*')) {
                    elem.func_desc = cmt[cidx].desc.substring(cmt[cidx].desc.indexOf('*') + 2);
                } else {
                    elem.func_desc = cmt[cidx].desc;
                }
            }
            elem.code_note = cmt[cidx].note;
            ret.push(elem);
        }
        return ret;
    } catch (e) {
        console.error(e.stack);
        throw e;
    }
}

let ret_text = "";

fs.readFile(
    (3 > process.argv.length) ?  './index.js' : process.argv[2], "utf8",
    (err, txt) => {
        try {
            /* load comment */
            let cmt     = getComment(txt);
            let comment = new Comment();
            for (let cidx in cmt) {
                comment.addInfo(cmt[cidx]);
            }
            /* write overview */
            ret_text += gen.overview(comment);
            ret_text += gen.install(comment);

            /* load sample */
            fs.readFile(
                (3 > process.argv.length) ?  './sample/index.mof' : process.argv[3], "utf8",
                (er, stxt) => {
                    try {
                        ret_text += gen.sample(stxt);
                        
                        ret_text += gen.parameter(comment);
                        write(ret_text);
                        //console.log(ret_text);
                        
                    } catch (e) {
                        console.error(e.stack);
                        throw e;
                    }
                }
            );
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
);
/* end of file */
