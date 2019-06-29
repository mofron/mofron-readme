/**
 * @file generate.js
 * @brief readme contents generator
 * @author @simpart
 */

let thisobj = null;

if (null !== thisobj) {
    module.exports = thisobj;
}

thisobj = {
    overview : (cmt) => {
        try {
            let ttl = cmt.fileInfo().file.split('/')[0];
            let ret = "# " + ttl + '\n';
            ret += "[mofron](https://mofron.github.io/mofron/) is module based frontend framework.\n\n";

            let finf = cmt.fileInfo();
            /* brief */
            for (let bidx in finf.brief) {
                ret += finf.brief[bidx] + "\n\n";
            }
            /* feature */
            for (let fidx in finf.feature) {
                ret += (0 == fidx) ? "## Feature\n" : "";
                ret += " - " + finf.feature[fidx] + '\n';
            }
            /* attention */
            for (let aidx in finf.attention) {
                ret += (0 == aidx) ? "## Attention\n" : "";
                ret += " - " + finf.attention[aidx] + '\n';
            }
            
            return ret + "\n";
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    },
    
    install : (cmt) => {
        try {
            let ttl = cmt.fileInfo().file.split('/')[0];
            let ret = "# Install" + '\n';
            ret += "```" + '\n';
            ret += "npm install mofron " + ttl + '\n';
            ret += "```" + '\n';
            
            return ret + '\n';
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    },
    
    sample : (prm) => {
        try {
            let ret = "# Sample" + '\n';
            ret += "```html" + '\n';
            ret += prm;
            ret += "```" + '\n'
            
            return ret;
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    },
    
    parameter : (cmt) => {
        try {
            let ret = "# Parameter" + "\n\n";
            ret += "|Simple<br>Param | Parameter Name | Type | Description |" + '\n';
            ret += "|:--------------:|:---------------|:-----|:------------|" + '\n';
            
            let simple = [];
            let flst = cmt.funcList();
            for (let fidx in flst) {
                
                if (-1 === flst[fidx].type.indexOf("parameter")) {
                    if (undefined !== flst[fidx].pmap) {
                        simple = flst[fidx].pmap;
                    }
                    continue;
                }
                /* simple param */
                let smp_flg = false;
                for (let smp_idx in simple) {
                    if (flst[fidx].name === simple[smp_idx]) {
                        smp_flg = true;
                        break;
                        //ret += "| ◯  | ";
                    }
                }
                ret += (true === smp_flg) ? "| ◯  | " : "| | ";
                
                /* name */
                ret += flst[fidx].name + " | ";
                
                /* type */
                for (let pidx in flst[fidx].param) {
                    if (0 != pidx) {
                        ret += "| | | ";
                    }
                    ret += flst[fidx].param[pidx].type + " | ";
                    
                    /* description */
                    ret += flst[fidx].param[pidx].desc[0] + " |" + '\n';
                    for (let dsc_idx=1; dsc_idx < flst[fidx].param[pidx].desc.length; dsc_idx++) {
                        ret += "| | | | " + flst[fidx].param[pidx].desc[dsc_idx] + " |" + '\n';
                    }
                }
                
            }
            return ret + '\n';
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
};
module.exports = thisobj;
/* end of file */
