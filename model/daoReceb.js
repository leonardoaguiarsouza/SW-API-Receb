var recebedores = [];

// recebedores.push( { 
//     nome: 'Teste',
//     cpf: 000000000,
//     enderece: 'Rua Teste',
//     turno: 'Tarde'
// } );

var size = function ()
{
    return recebedores.length + 1;
}

var add = function ( recebedor ){
    if( recebedor.nome !== null && recebedor.cpf !== null && recebedor.endereco !== null && recebedor.turno !== null)
        recebedores.push( recebedor );
};

var get = function ( id )
{
    if( recebedores.length -1 < id )
        return null;
    else
        return recebedores[id];
};

var getAll = function(){
    return recebedores;
};

var update = function(id, recebedor){
    // recebedores[id] = recebedor;
    recebedores[id].id = id;
    recebedores[id].nome = recebedor.nome;
    recebedores[id].cpf = recebedor.cpf;
    recebedores[id].endereco = recebedor.endereco;
    recebedores[id].turno = recebedor.turno;
};

var remove = function(id){
    recebedores.splice(id -1, 1);
};

module.exports = {remove, update, add, get, getAll, size};
