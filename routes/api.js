// Por Leonardo Souza

var express = require('express');
var router = express.Router();
var daoReceb = require('../model/daoReceb');

/*requires do JWT*/
var jwt = require('jsonwebtoken'); //para usar a API
const SECRET = 'senha';
/*ATENÇAO!!! A senha usada aqui como uma var é somente para simplificar! NUNCA DEVE SER UTILIZADA ASSIM!!!! Salve como uma variável de ambiente e use o pacote dotenv-safe para recuperá-la, ou carregue-a de um arquivo do servidor com as permissões adequadas!!! */

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'API'});
});

//localhost:3000/api/recebedores

router.get('/recebedores', function( req, res, next){
    var recebedores = daoReceb.getAll();
    
    res.contentType = 'Application/json';
    res.statusCode = 200;
    res.send(recebedores);
});

router.get( '/recebedores/:id', function(req, res, next){
   recebedor = daoReceb.get(req.params.id);
   if(recebedor !== null)
   {   
        res.statusCode = 200;
        res.contentType('Application/json');
        res.send(recebedor);
   }else{
       res.status(404);
       res.send( " NOT FOUND ");
   }
} );

router.post( '/recebedores',  function(req, res){
   var body = req.body;
   var aux = daoReceb.size();
   aux -= 1;
   if(body.nome != null && body.cpf != null && body.endereco != null && body.turno != null){
    let recebedor = { 
      nome: body.nome,
      cpf: body.cpf,
      endereco: body.endereco,
      turno: body.turno
    } ;
    
    daoReceb.add( recebedor );
    res.statusCode  = 201;

    recebedor.id = aux;
    res.send( recebedor );
  }else{
    res.statusCode = 300;
    res.send("Invalid Message.");
  }
} );

router.put('/recebedores/:id', function (req, res) {
  var recebedores = daoReceb.getAll();
  var dados = req.body;
  let id = parseInt(req.params.id);
  if (dados != null && id != null) {
      daoReceb.update(id, dados);
      res.json(dados);
  } else {
      res.statusCode = 300;
      res.send('Mensagem inválida!');
  }
  console.log(JSON.stringify(dados));
  recebedores.push(dados);
  // res.send(dados);
});

router.delete('/recebedores/:id', function (req, res) {
  let id = parseInt(req.params.id);
  const temp = daoReceb.get(id);
  if( temp != null ){
      daoReceb.remove(id);
      res.json(temp);
  }else{
      res.statusCode = 404;
      res.send('Not Found');
  }  
});

/*criação do endpoint(rota) para login*/
router.post('/login', function (req, res) {
  console.log('login...');
  //verifica se o login está válido
  if (req.body.user === 'aluno' && req.body.pass === 'ifsul') {
    /* o primeiro argumento é o payload. O payload é um objeto que deve conter
    tudo o que se quer manter armazenado dentro do token. A ideia é que tenha tudo
    que for necessário para identificar o usuário*/
    var payload = {
      user: req.body.user,
      role: 'admin', // estes dados viriam do banco
      id: 1
    };
    /* Segundo argumento é a senha, que deve ser secreta no server.
    terceiro argumento são as opções do token. Aqui definimos a duração
    de validade do token em 3m*/

    //assinatura do token
    var token = jwt.sign(payload, SECRET, { expiresIn: '3m' });

    res.status(200).send({ token: token });
  }else
    res.status(401).send({ user: 'user', pass: 'pass' });//envia erro NONAUTHORIZED
});

function verificaToken(req, res, next) {
  var token = req.headers.authorization;
  if (!token)
    return res.status(401).send({ message: 'No token provided.' });

  jwt.verify(token, SECRET, function (err, decoded) {
    if (err)
      return res.status(403).send({ auth: false, message: 'Failed to authenticate token.' });

    req.userData = decoded;
    next();
  });
}

/*endpoint para testar um jwt qualquer*/
router.get('/session', verificaToken, function (req, res) {
  var data = req.userData;
    
  res.statusCode = 200;
  res.send('Token OK');
});


module.exports = router;