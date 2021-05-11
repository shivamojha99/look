import React, { useRef, useEffect } from "react";
import io from "socket.io-client";
import PhotoCapture from "./PhotoCapture";
import axios from 'axios';

import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 140,
  },
});


const Room = (props) => {

    const classes = useStyles();

    const userVideo = useRef();
    const partnerVideo = useRef();
    const peerRef = useRef();
    const socketRef = useRef();
    const otherUser = useRef();
    const userStream = useRef();
    var cards = [];
    var photos = [];

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ audio: true, video: true }).then(stream => {
            userVideo.current.srcObject = stream;
            userStream.current = stream;
            
            localStorage.setItem( 'cam' , true );

            socketRef.current = io.connect("/");
            socketRef.current.emit("join room", props.match.params.roomID);

            socketRef.current.on('other user', userID => {
                callUser(userID);
                otherUser.current = userID;
            });

            socketRef.current.on("user joined", userID => {
                otherUser.current = userID;
            });

            socketRef.current.on("offer", handleRecieveCall);

            socketRef.current.on("answer", handleAnswer);

            socketRef.current.on("ice-candidate", handleNewICECandidateMsg);

        });

    }, [ ]);

    function callUser(userID) {
        peerRef.current = createPeer(userID);
        userStream.current.getTracks().forEach(track => peerRef.current.addTrack(track, userStream.current));
    }

    function createPeer(userID) {
        const peer = new RTCPeerConnection({
            iceServers: [
                {
                    urls: "stun:stun.stunprotocol.org"
                },
                {
                    urls: 'turn:numb.viagenie.ca',
                    credential: 'muazkh',
                    username: 'webrtc@live.com'
                },
            ]
        });

        peer.onicecandidate = handleICECandidateEvent;
        peer.ontrack = handleTrackEvent;
        peer.onnegotiationneeded = () => handleNegotiationNeededEvent(userID);

        return peer;
    }

    function handleNegotiationNeededEvent(userID) {
        peerRef.current.createOffer().then(offer => {
            return peerRef.current.setLocalDescription(offer);
        }).then(() => {
            const payload = {
                target: userID,
                caller: socketRef.current.id,
                sdp: peerRef.current.localDescription
            };
            socketRef.current.emit("offer", payload);
        }).catch(e => console.log(e));
    }

    function handleRecieveCall(incoming) {
        peerRef.current = createPeer();
        const desc = new RTCSessionDescription(incoming.sdp);
        peerRef.current.setRemoteDescription(desc).then(() => {
            userStream.current.getTracks().forEach(track => peerRef.current.addTrack(track, userStream.current));
        }).then(() => {
            return peerRef.current.createAnswer();
        }).then(answer => {
            return peerRef.current.setLocalDescription(answer);
        }).then(() => {
            const payload = {
                target: incoming.caller,
                caller: socketRef.current.id,
                sdp: peerRef.current.localDescription
            }
            socketRef.current.emit("answer", payload);
        })
    }

    function handleAnswer(message) {
        const desc = new RTCSessionDescription(message.sdp);
        peerRef.current.setRemoteDescription(desc).catch(e => console.log(e));
    }

    function handleICECandidateEvent(e) {
        if (e.candidate) {
            const payload = {
                target: otherUser.current,
                candidate: e.candidate,
            }
            socketRef.current.emit("ice-candidate", payload);
        }
    }

    function handleNewICECandidateMsg(incoming) {
        const candidate = new RTCIceCandidate(incoming);

        peerRef.current.addIceCandidate(candidate)
            .catch(e => console.log(e));
    }

    function handleTrackEvent(e) {
        // if ( ! partnerVideo.current === null )
        partnerVideo.current.srcObject = e.streams[0];
    };

    function handleHang()
    {
        
        localStorage.setItem( 'cam' , false );
        const tracks = document.getElementById('video').srcObject.getTracks();
        tracks.forEach(track => {
            track.stop();
        });

        if ( ! partnerVideo.current === null ) {
            partnerVideo.current.srcObject.getTracks().forEach(track => track.stop());
        }
        
        if ( ! peerRef.current === null ) peerRef.current.close();
        console.log("cam closed!!");
        console.log(photos);
        localStorage.setItem('photos' , JSON.stringify(photos) );
        setTimeout(props.history.push('/') , 60000);
        
    }
     
    function handleCapture(){
        if( !(userVideo.current === "undefined") && ! ( partnerVideo === "indefined" ) )
            {
                // console.log( userVideo.current );
                var cnt = 0;
                alert("moment capturing started!");
                function mytimer(){

                    var photo =  PhotoCapture( );
                    // photos.push(photo);
                    console.log(photo);
                    // // photo => [ baseurl , baseurl ]
                    // api call data.photo[0] & data.photo[1] =>  state +"#" + emoji 
                    let axiosConfig = {
                        headers: {
                            'Content-Type': 'application/json;charset=UTF-8',
                            "Access-Control-Allow-Origin": "*",
                        }
                      };
                    var data1 = "";
                    var data2 = "";
                    var payload = [ { 'state':'neutral'  , 'emoji':'😐' , 'baseurl': "photo[0]" } , { 'state': 'neutral' , 'emoji':'😐' , 'baseurl':"photo[1]" } ];
                    
                    axios.post("http://139.59.45.17:1234/" ,  { "baseurl": photo[0] } , axiosConfig )
                    .then(r => { 
                        console.log(r);
                        data1 = r.data; 
                        payload[0]['state'] = data1.slice(0 , data1.length-2 );
                        payload[0]['emoji'] = data1[data1.lenght-1];
                    } )
                    .catch(e => console.log(e) );

                    axios.post("http://139.59.45.17:1234/" ,  { "baseurl": photo[1] } , axiosConfig )
                    .then(r => { 
                        console.log(r); data2 = r.data; 
                        payload[1]['state'] = data2.slice(0 , data2.length-2 );
                        payload[1]['emoji'] = data2[data2.lenght-1];
                    } )
                    .catch(e => console.log(e) );

                    console.log(payload[0]);
                    photos.push(payload);
                    // photos.push([data1 , data2]);
                    cnt++;
                    const status = localStorage.getItem('cam');
                    if( cnt === 7 && status ) clearInterval(myvar);
                }
                var myvar = setInterval( mytimer , 60000);
                
            }
    }

    return (
        <Grid container spacing={1}>
            <Grid item xs={6}>
                <Card className={classes.root}>
            <CardActionArea>
                <video id = "video" autoPlay ref={userVideo} width="100%" height ="100%"></video>
                <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                    User
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                    room Id : { props.match.params.roomID } 
                </Typography>
                </CardContent>
            </CardActionArea>
            <CardActions>
                <Button size="small" variant="contained" color="primary" id="startbutton" onClick={handleCapture} >
                Start Capture Moments!
                </Button>
                <Button size="small" variant="contained" color="secondary" id="hangbtn" onClick={handleHang} >
                Hang Up
                </Button>
            </CardActions>
        </Card>
            </Grid>
            <Grid item xs={6}>
                <Card className={classes.root}>
            <CardActionArea>
                <video id="partnerVideo" autoPlay ref={partnerVideo} width="100%" height ="100%"></video>
                <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                        Partner
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
            </Grid>
            <Grid item xs={12} >
                {cards}
            </Grid>
      </Grid>
    );
};

export default Room;