const express    = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

require("./routes/pessoa.routes.js")(app);
require("./routes/imovel.routes.js")(app);
require("./routes/locacao.routes.js")(app);
require("./routes/caixa.routes.js")(app);
require("./routes/banco.routes.js")(app);
require("./routes/boleto.routes.js")(app);

app.listen(3131);