const MESSAGE = {
    confirmMsg : function(action, str) {
        return 'Are you you want to '+action+' this '+str+'?';
    },
    loggerSuccess : function (str, method) {
        var m_str = (method=='POST') ? 'added' : 
                    (method=='PUT') ? 'updated' : 
                    (method=='DELETE') ? 'deleted' : '';
        return str+' successfully '+m_str+'.';
    },
    loggerFailed : function (str, method) {
        var m_str = (method=='POST') ? 'add' : 
                    (method=='PUT') ? 'update' : 
                    (method=='DELETE') ? 'delete' : 
                    (method=='GET') ? 'retrieve' : '';
        return 'Failed to '+m_str+' '+str;
    }
};

export default MESSAGE;
