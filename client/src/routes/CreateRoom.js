import React , { useState , useEffect } from "react";
import { v1 as uuid } from "uuid";

import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  root2: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
  root3: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },

}));

const CreateRoom = (props) => {

    const classes = useStyles();

    var [ inputVal , setInput ] = useState(null);
    var [cards , setcard ] = useState([]);

    useEffect( () => {
        var photos = localStorage.getItem('photos'); //console.log(photos);
        if( localStorage.getItem('photos') )
        {
            photos = JSON.parse(localStorage.getItem('photos')); console.log(photos);
            var card = [];
            photos.forEach( photo => {
                // photo => [{state , emoji , baseurl } *2  ]
                var ph1 = photo[0];
                var ph2 = photo[1];
                card.push(
                  <div className={classes.root3}>
                  <Grid container spacing={3}>
                    <Grid item xs={6}> 
                      <Paper className={classes.paper}> 
                      {/* <img src={ph1.baseurl} alt="img" width="300" height="300" ></img>  */}
                       {ph1.emoji}
                      <Typography gutterBottom variant="h5" component="h2">{ph1.state} </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={6}> 
                      <Paper className={classes.paper}>
                      {/* <img src={ph2.baseurl} alt="img" width="300" height="300" ></img>  */}
                      {ph2.emoji}
                      <Typography gutterBottom variant="h5" component="h2">{ph2.state} </Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                  </div>
                );
            });
            setcard(card);
        }
      else cards.push(<div> </div>);

    } , [ localStorage.getItem('photos')] );
    
    
    function createRoom() {
        const id = uuid();
        props.history.push(`/room/${id}`);
    }
    function joinRoom( ) {
        console.log(inputVal);
        props.history.push(`/room/${inputVal}`);
    }

    return <div>
            <div className={classes.root3}>
                <Grid container spacing={4}>
                    
                    <Grid item xs={3}>
                      <Button id="createbtn" onClick={createRoom} variant="contained" color="primary" >Create Room</Button> 
                    </Grid>
                     
                    {/* <input type="text" id="roomId" onChange= { ( Event) => setInput( Event.target.value ) }></input> */}
                    <Grid item xs={3}>
                      <TextField required id="roomId" label="Enter RoomId" defaultValue="" onChange= { ( Event) => setInput( Event.target.value ) } />
                      <Button id="joinbtn" onClick ={joinRoom} variant="contained" color="secondary" > Join ROOM</Button>
                    </Grid>
                    <Grid item xs={3}>
                      <Button id="hangbtn" variant="contained" disabled > Hang Up </Button> 
                    </Grid>
                </Grid>
            </div>
            <div>{cards}</div>
          </div>;
}

export default CreateRoom;