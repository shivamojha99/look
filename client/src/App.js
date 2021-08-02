import React from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import CreateRoom from "./routes/CreateRoom";
import Room from "./routes/Room";
import './App.css';

import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));

function App() {
  const classes = useStyles();

  return (

    <div className={classes.root}>

    <Grid container spacing={3}>
    <Grid item xs={12}>
        <Paper className={classes.paper}>
        <Typography gutterBottom variant="h3" component="h2">
                  Advance Review System </Typography>
          
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <Paper className={classes.paper}>
          <BrowserRouter>
          <Switch>
            <Route path="/" exact component={CreateRoom} />
            <Route path="/room/:roomID" component={Room} />
          </Switch>
          </BrowserRouter>
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <Paper className={classes.paper}>
        <Typography gutterBottom variant="h5" component="h2">
                    recent captured moment! </Typography>
          <div id="pictures">
            <img id = "photo"/>
            <canvas id="canvas" width="320" height="240" ></canvas>
            <canvas id="partnerCanvas" width="320" height="240" ></canvas>
          </div>
        </Paper>
      </Grid>
    </Grid>
  </div>

  );
}

export default App;
