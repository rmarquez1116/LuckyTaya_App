import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";


const WatchParty = ({url}) => {
    const socket = io(url);
    const [peerConnection, setPeerConnection] = useState(null);
    const remoteVideoRef = useRef(null);

    useEffect(() => {
        const pc = new RTCPeerConnection();

        // When a remote stream is received, display it
        pc.ontrack = (event) => {
            console.log(event,'hellosocket')
            if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = event.streams[0];
            }
        };

        setPeerConnection(pc);

        // Listen for offer from the signaling server
        socket.on("offer", async (offer) => {
            console.log(offer,'hellosocket')
            await handleOffer(offer, peerConnection);
        });

        // Listen for answer from the signaling server
        socket.on("answer", async (answer) => {
            
            console.log(answer,'hellosocket')
            if (peerConnection) {
                await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
            }
        });

        // Listen for ICE candidates
        socket.on("ice-candidate", (candidate) => {
            
            console.log(candidate,'hellosocket')
            if (peerConnection) {
                peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
            }
        });

        return () => {
            if (peerConnection) {
                peerConnection.close();
            }
        };
    }, [peerConnection]);

    async function handleOffer(offer) {
        try {
            if (!peerConnection) return;

            await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));

            const answer = await peerConnection.createAnswer();
            await peerConnection.setLocalDescription(answer);

            socket.emit("answer", answer); // Send answer back to the signaling server
        } catch (err) {
            console.error("Error handling offer:", err);
        }
    };

    return (
        <div>
            <h2>WebRTC Watch-Only</h2>
            <video ref={remoteVideoRef} autoPlay style={{ width: "100%", maxWidth: "500px" }} />
        </div>
    );
};

export default WatchParty;