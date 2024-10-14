//=======[ Settings, Imports & Data ]==========================================

var PORT    = 3000;

var express = require('express');
var app     = express();
var utils   = require('./mysql-connector');

// to parse application/json
app.use(express.json()); 
// to serve static files
app.use(express.static('/home/node/app/static/'));

//=======[ Main module code ]==================================================

app.get('/device/:id',function(req,res){
    utils.query("SELECT id,description FROM Devices where id="+req.params.id,(error,respuesta,fields)=>{
        if(error){
            res.status(409).send(error.sqlMessage);    
        }else{
            res.status(200).send(respuesta);
        }
        
    })
    
})
app.get('/usuario',function(req,res){

    res.send("[{id:1,name:'mramos'},{id:2,name:'fperez'}]")
});
//Insert
app.post('/usuario',function(req,res){
    console.log(req.body.id);
    if(req.body.id!=undefined && req.body.name!=undefined){
        //inset en la tabla
        res.send();
    }else{
        let mensaje = {mensaje:'El id o el name no estaban cargados'}
        res.status(400).send(JSON.stringify(mensaje));
    }
    
});

app.post('/device/',function(req,res){
    
    utils.query("update Devices set state="+req.body.status +" where id="+req.body.id,
        (err,resp,meta)=>{
            if(err){
                console.log(err.sqlMessage)
                res.status(409).send(err.sqlMessage);
            }else{
                res.send("ok "+resp);
            }
    })
    
})

app.get('/devices/', async (req, res, next) => {
    // Dispositivos reales de la base de datos
    utils.query("SELECT * FROM Devices", async (error, respuesta, fields) => {
        if (error) {
          handleSQLError(res, error);
        } else {
          res.status(200).json(await respuesta);
        }
      });
});

// Agregar Dispositivo
app.post('/device/new', (req, res) => {
    const { name, description, state, type } = req.body;

    if (name && description && state !== undefined && type !== undefined) {
        // No incluir el campo 'id' en la consulta ya que es autoincremental
        const query = "INSERT INTO Devices (name, description, state, type) VALUES (?, ?, ?, ?)";
        utils.query(query, [name, description, state, type], (error, respuesta, fields) => {
            if (error) {
                res.status(409).json({ error: error.sqlMessage });
            } else {
                res.status(201).json({ mensaje: "Dispositivo creado exitosamente!" });
            }
        });
    } else {
        res.status(400).json({ error: "Datos incompletos para crear el dispositivo" });
    }
});

//Eliminar dispositivo
app.delete('/device/:id', (req, res) => {
    const deviceId = req.params.id;

    const query = "DELETE FROM Devices WHERE id = ?";
    utils.query(query, [deviceId], (error, respuesta, fields) => {
        if (error) {
            res.status(409).json({ error: error.sqlMessage });
        } else {
            res.status(200).json({ mensaje: "Dispositivo eliminado exitosamente!" });
        }
    });
});

app.listen(PORT, function(req, res) {
    console.log("NodeJS API running correctly");
});


//=======[ End of file ]=======================================================
