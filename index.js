const { io } = require("socket.io-client");

const iamclient = {
    defaultArgs: {
        url: "",
        onConnect: () => { },
        registerData: { puuid: "", cuuid: "" },
        onRegisterResult: (data) => { },
        eventActionMap: {
            "message": (data) => {
                console.log(data);
            }
        }
    },
    setup: (args) => {
        const socket = io(args.url);
        socket.on("connect", () => {
            args.onConnect()
            socket.emit("register", args.registerData);
        });
        socket.on("register-result", args.onRegisterResult);
        socket.on("from-project-server", (d) => {
            args.eventActionMap[d.event](d.data);
        });
        return socket
    }
}

function testClient (){
    let a = {
        "cuuid": "910963a9-56ab-4610-903d-e3086379796b",
        "puuid": "452e1708-1f8a-48ea-a5de-c397b1d19953"
    }

    iamclient.defaultArgs.url = "http://127.0.0.1:52100";
    iamclient.defaultArgs.registerData = a;
    iamclient.defaultArgs.onRegisterResult = (r) => {
        if (r.result) {
            console.log("register pass");
        } else {
            console.log("register not pass", r.reason);
        }
    }

    iamclient.setup(iamclient.defaultArgs)
}

if (module.path != __dirname) {
    module.exports = {
        iamclient
    }
} else {
    testClient()
}