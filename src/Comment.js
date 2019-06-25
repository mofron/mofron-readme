/**
 * @file ./src/Comp.js
 * @author simparts
 */
module.exports = class {
    
    constructor (prm) {
        try {
            this.m_func = [];
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
     
    addInfo (prm) {
        try {
            if (undefined !== prm.file) {
                this.fileInfo(prm);
            } else {
                this.addFunc(prm);
            }
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    fileInfo (prm) {
        try {
            if (undefined === prm) {
                return (undefined === this.m_fileinf) ? null : this.m_fileinf;
            }
            this.m_fileinf = {};
            this.m_fileinf.file      = prm.file[0];
            this.m_fileinf.brief     = (undefined === prm.brief) ? [] : prm.brief;
            this.m_fileinf.feature   = (undefined === prm.feature) ? [] : prm.feature;
            this.m_fileinf.attention = (undefined === prm.attention) ? [] : prm.attention;
            this.m_fileinf.author    = (undefined === prm.author) ? [] : prm.author[0];
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    addFunc (prm) {
        try {
            let set = {};
            let mch = prm.code_note.match(/[\w]+ *[(].*[)] *{/);
            if (null === mch) {
                return;
            }
            let add_func = {};
            add_func.name = mch[0].split(' ')[0];
            
            delete prm.code_note;

            for (let pidx in prm) {
                
                if ( ("param" === pidx) || ("return" === pidx) ) {
                    let dat = [];
                    for (let pidx2 in prm[pidx]) {
                        let datinf = this.getDatInf(prm[pidx][pidx2]);
                        if (undefined !== datinf.type) {
                            dat.push({ type: datinf.type, desc: [datinf.desc] });
                        } else {
                            dat[dat.length-1].desc.push(datinf.desc);
                        }
                    }
                    add_func[pidx] = dat;
                } else if ("type" === pidx) {
                    add_func[pidx] = prm[pidx][0];
                } else {
                    add_func[pidx] = prm[pidx];
                }
            }
            this.m_func.push(add_func);
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    getDatInf (prm) {
        try {
            let ret = {};
            let mch = prm.match(/[(].+[)]/);
            if (null !== mch) {
                ret.type = mch[0].substring(1, mch[0].length-1);
                ret.desc = prm.split(mch[0] + ' ')[1];
            } else {
                ret.desc = prm;
            }
            return ret;
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    funcList () {
        try { return this.m_func; } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
}
/* end of file */
