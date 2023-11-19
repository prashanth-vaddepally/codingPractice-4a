const express = require("express"); 
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

const dbpath = path.join(__dirname, "cricketTeam.db");
const app = express();
app.use(express.json());

let db = null;

const intializedbandsaver = async () => {
    try {
        db = await open({ filename: dbpath, driver: sqlite3.Database });
        app.listen(3000, () => {
            console.log("Server Running at http://localhost:3000/");
        });
    } catch (error) {
        console.log(`DB Error: ${error.message}`);
        process.exit(1);
    }
};
intializedbandsaver();

app.get("/players/", async (request, response) => {
    const getPlayerQuery = `
    SELECT * FROM cricket_team;`;
    const playerslist = await db.all(getPlayerQuery);
    const ans = (playerslist) => {
        return {
            playerId: playerslist.player_id,
            playerName: playerslist.player_name,
            jerseyNumber: playerslist.jersey_number,
            Role: playerslist.role,
        };
    };
    response.send(playerlist.map((eachplayer) => ans(eachplayer)));
});

app.get("/players/:playersId/", async (request, response) => {
    const { playerId } = request.params;
    const getPlayerQuery = `
    SELECT * FROM cricket_team
    WHERE player_id = ${playerId};`;
    const player = await db.get(getPlayerQuery);
    const theanswer = (player) => {
        return {
            playerId: player.player_id,
            playerName: player.player_name,
            jerseyNumber: player.jersey_number,
            Role: player.role;
        };
    };
    response.send(theanswer(player));
});

app.post("/players/", async (request, response) => {
    const playersdetails = request.body;
    const { playerName, jerseyNumber, Role } = playersdetails;
    const addPlayerQuery = `
    INSERT INTO 
    cricket_team(player_name, jersey_number, role)
    VALUES('${playerName}',
        ${jerseyNumber},
        '${Role}');`;
    const dbresponse = await db.run(addPlayerQuery);
    response.send("Player Added to Team");
}); 
 
 
app.put("/players/:playerId/", async (request, response) => {
   
    const playerDetails = request.body;
    const { playerName, jerseyNumber, Role } = playerDetails;
     const { playerId } = request.params;
    const updateBookQuery = `
    UPDATE cricket_team
    SET
    player name='${playerName}',
    jersey number=${jerseyNumber},
    role= '${Role}'
    WHERE
    player_id = ${playerId};`;
    await db.run(updateBookQuery);
    response.send("Player Details Updated");
});


app.delete("/players/:playerId/", async (request, response) => {
    const { playerId } = request.params;
    const deletePlayerQuery = `
    DELETE FROM cricket_team
    WHERE player_id = ${playerId};`;
    await db.run(deletePlayerQuery);
    response.send("Player Removed");
});

module.exports = app;
