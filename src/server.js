import express from 'express';

const PORT = process.env.PORT || 5555;

const app = express();
app.use(express.json());
 
app.get('/health', (req, res) => {
    console.log('Calling res.send');
    return res.status(200).send({message: "Health is good"});
});
 
app.listen(PORT, () => {
    console.log('App is listening for requests on port %d', PORT);
});

console.log("Server initialized");