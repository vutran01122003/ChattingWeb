async function getStream({ audio, video }) {
    return await navigator.mediaDevices.getUserMedia({
        audio,
        video
    });
}

export default getStream;
