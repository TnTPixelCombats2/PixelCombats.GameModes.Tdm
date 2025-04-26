//import { Color, DisplayValueHeader } from 'pixel_combats/basic';
//import { Players, Inventory, GameMode, Damage, Game, Properties, Ui, Spawns, Timers, LeaderBoard, BuildBlocksSet, BreackGraph, Teams, TeamsBalancer } from 'pixel_combats/room';

// êîíñòàíòû
var WaitingPlayersTime = 10;
var BuildBaseTime = 30;
var GameModeTime = 600;
var End0fMatchTime = 10;

// êîíñòàíòû èìåí
var WaitingStateValue = "Waiting";
var BuildModeStateValue = "BuildMode";
var GameStateValue = "Game";
var End0fMatchStateValue = "End0fMatch";

// ïîñòîÿííûå ïåðåìåííûå
var mainTimer = Timers.GetContext().Get("Main");
var stateProp = Properties.GetContext().Get("State");

// ïðèìåíÿåì ïàðàìåòðû ñîçäàíèÿ êîìíàòû
Damage.FriendlyFire = GameMode.Parameters.GetBool("FriendlyFire");
Map.Rotation = GameMode.Parameters.GetBool("MapRotation");
BreackGraph.OnlyPlayerBlocksDmg = GameMode.Parameters.GetBool("PartialDesruction");
BreackGraph.WeakBlocks = GameMode.Parameters.GetBool("LoosenBlocks");

// áëîê èãðîêà âñåãäà óñèëåí
BreackGraph.PlayerBlockBoost = true;

// ïàðàìåòðû èãðû
Properties.GetContext().GameModeName = "GameModes/Team Dead Match";
TeamsBalancer.IsAutoBalance = true;
Ui.GetContext().MainTimerId.Value = mainTimer.Id;
// ñîçäàåì êîìàíäû
Teams.Add("Blue", "Teams/Blue", new Color(0, 0, 1, 0));
Teams.Add("Red", "Teams/Red", new Color(1, 0, 0, 0));
var blueTeam = Teams.Get("Blue");
var redTeam = Teams.Get("Red");
blueTeam.Spawns.SpawnPointsGroups.Add(1);
redTeam.Spawns.SpawnPointsGroups.Add(2);
blueTeam.Build.BlocksSet.Value = BuildBlocksSet.Blue;
redTeam.Build.BlocksSet.Value = BuildBlocksSet.Red;

// çàäàåì ìàêñ ñìåðòåé êîìàíä
var maxDeaths = Players.MaxCount * 5;
Teams.Get("Blue").Properties.Get("Deaths").Value = maxDeaths;
Teams.Get("Red").Properties.Get("Deaths").Value = maxDeaths;
// çàäàåì ÷òî âûâîäèòü â ëèäåðáîðäàõ
LeaderBoard.PlayerLeaderBoardValues = [
        { 
                Value: "Kills",
                DisplayName: "Statistics/Kills",
                ShortDisplayName: "Statistics/KillsShort"
        },
        {
                Value: "Deaths",
                DisplayName: "Statistics/Deaths",
                ShortDisplayName: "Statistics/DeathsShort"
        },
        {
                Value: "Spawns",
                DisplayName: "Statistics/Spawns",
                ShortDisplayName: "Statistics/SpawnsShort"
        },
        {
                Value: "Scores",
                DisplayName: "Statistics/Scores",
                ShortDisplayName: "Statistics/ScoresShort"
        }
];
LeaderBoard.TeamLeaderBoardValue = {
        Value: "Deaths",
        DisplayName: "Statistics/Deaths",
        ShortDisplayName: "Statistics/DeathsShort"
}; 
// âåñ êîìàíäû â ëèäåðáîðäå
LeaderBoard.TeamWeightGetter.Set(function(team) {
        return team.Properties.Get("Deaths").Value;
});
// âåñ èãðîêà â ëèäåðáîðäå
LeaderBoard.PlayerWeightGetter.Set(function(player) {
        return  player.Properties.Get("Kills").Value;
});

// çàäàåì ÷òî âûâîäèòü ââåðõó
Ui.GetContext().TeamProp1.Value = { Team: "Blue", Prop: "Deaths" };
Ui.GetContext().TeamProp2.Value = { Team: "Red", Prop: "Deaths" };

// ðàçðåøàåì âõîä â êîìàíäû ïî çàïðîñó
Teams.OnRequestJoinTeam.Add(function(player,team){team.Add(player);});
// ñïàâí ïî âõîäó â êîìàíäó
Teams.OnPlayerChangeTeam.Add(function(player){ player.Spawns.Spawn()});

	Ui.GetContext().Hint.Value = "Hint/AttackEnemies";

	var inventory = Inventory.GetContext();
	if (GameMode.Parameters.GetBool("OnlyKnives")) {
		inventory.Main.Value = false;
		inventory.Secondary.Value = false;
		inventory.Melee.Value = true;
		inventory.Explosive.Value = false;
		inventory.Build.Value = true;
	} else {
		inventory.Main.Value = true;
		inventory.Secondary.Value = true;
		inventory.Melee.Value = true;
		inventory.Explosive.Value = true;
		inventory.Build.Value = true;
	}

	mainTimer.Restart(GameModeTime);
	Spawns.GetContext().Despawn();
	SpawnTeams();
}
function SetEndOfMatchMode() {
	stateProp.Value = EndOfMatchStateValue;
	Ui.GetContext().Hint.Value = "Hint/EndOfMatch";

	var spawns = Spawns.GetContext();
	spawns.enable = false;
	spawns.Despawn();
	Game.GameOver(LeaderBoard.GetTeams());
	mainTimer.Restart(EndOfMatchTime);
}
function RestartGame() {
	Game.RestartGame();
}

function SpawnTeams() {
Teams.All.forEach(e => {
  Spawns.GetContext(e).Spawn();
	}
}


