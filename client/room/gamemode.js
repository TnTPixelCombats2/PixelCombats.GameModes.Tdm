// import { Color, DisplayValueHeader } from 'pixel_combats/basic';
// import { Players, Inventory, GameMode, Damage, Game, Properties, Ui, Spawns, Timers, LeaderBoard, BuildBlocksSet, BreackGraph, Teams, TeamsBalancer } from 'pixel_combats/room';

// Константы времени //
var WaitingPlayersSeconds = 16;
var PreparationAttackSeconds = 19;
var GameModeSeconds = 411;
var End0fMatchSeconds = 11;
var VoteSeconds = 16;

// Имена, констант - для режимов //
var WaitingStateValue = 'Waiting';
var PreparationAttackStateValue = 'PreparationAttack';
var GameModeStateValue = 'Game';
var End0fMatchStateValue = 'End0fMatch';
var EndStateValue = 'End';

// Постоянные, переменные - констант //
var MainTimer = Timers.GetContext().Get('Main');
var StateProp = Properties.GetContext().Get('State');

// Получаем объекты параметров, с которыми работает - режим //
Map.Rotation = GameMode.Parameters.GetBool('MapRotation');
Damage.GetContext().FriendlyFire.Value = GameMode.Parameters.GetBool('FriendlyFire');
BreackGraph.WeakBlocks = GameMode.Parameters.GetBool('LoosenBlocks');
// Опции, данных - обьектов:
Properties.GetContext().GameModeName.Value = 'GameModes/Team Dead Match';
TeamsBalancer.IsAutoBalance = true;
BreackGraph.OnlyPlayerBlocksDmg = true;
Ui.GetContext().MainTimerId.Value = MainTimer.Id;

// Создание команд //
Teams.Add('Blue', 'ВЫЖИВШИЕ', new Color(0, 0, 1, 0));
Teams.Add('Red', 'ПСИХОПАТЫ', new Color(1, 0, 0, 0));
var BlueTeam = Teams.Get('Blue');
var RedTeam = Teams.Get('Red');
BlueTeam.Spawns.SpawnPointsGroups.Add(1);
RedTeam.Spawns.SpawnPointsGroups.Add(2);
BlueTeam.Build.BlocksSet.Value = BuildBlocksSet.Blue;
RedTeam.Build.BlocksSet.Value = BuildBlocksSet.Red;

// Создаём, лидерборд - команд //
LeaderBoard.PlayerLeaderBoardValues = [
	{
		Value: 'Kills',
		DisplayName: 'Убийства',
		ShortDisplayName: 'Убийства'
	},
	{
		Value: 'Deaths',
		DisplayName: 'Смерти',
		ShortDisplayName: 'Смерти'
	},
	{
		Value: 'Spawns',
		DisplayName: 'Спавны',
		ShortDisplayName: 'Спавны'
	},
	{
		Value: 'Scores',
		DisplayName: 'Очки',
		ShortDisplayName: 'Очки'
	}
];
// Вес команды, в лидерборде - для смертей //
LeaderBoard.TeamWeightGetter.Set(function(Team) {
        return Team.Properties.Get('Deaths').Value;
});
// Вес игрока, в лидерБорде - для убийств:
LeaderBoard.PlayerWeightGetter.Set(function(Player) {
        return Player.Properties.Get('Kills').Value;
});

// Дополнительные компоненты, для - интерфейс команд //
var ProtectPsychos = 'Защищайтесь, от - психопатов!';
var FindAllSurvivors = 'Найдите, всех - выживших!';
Ui.GetContext().TeamProp1.Value = { Team: 'Blue', Prop: 'Deaths' };
Ui.GetContext().TeamProp2.Value = { Team: 'Red', Prop: 'Deaths' };
Teams.Get('Blue').Properties.Get('Deaths').Value = BlueTeam.Count;
Teams.Get('Red').Properties.Get('Deaths').Value = RedTeam.Count;

// Вход в команду, по - запросу //
Teams.OnRequestJoinTeam.Add(function(Player, Team) { Team.Add(Player); });
// Спавним, по входу - в команду //
Teams.OnPlayerChangeTeam.Add(function(Player) { Player.Spawns.Spawn(); });

// Создаём обработчик щита, после респавна //
var ImmortalityTimerName = 'Immortality';
Spawns.GetContext().OnSpawn.Add(function(Player) {
 Player.Properties.Immortality.Value = true;
Timer = Player.Timers.Get(ImmortalityTimerName).Restart(5);
});
Timers.OnPlayerTimer.Add(function(Timer) {
 if (Timer.Id != ImmortalityTimerName) return;
Timer.Player.Properties.Immortality.Value = false;
});

// Если все - выжившие мертвы, то побеждают психопаты //
Timer.OnTimer.Add(function(Time) {
var Player = BlueTeam.Players[BlueTeam.Players.length - 1];
if (RedTeam.Count === 0 && BlueTeam.Count < 1) { RedTeam.Add(Player);
   if (BlueTeam.Count < 1 && RedTeam.Count >= 1) EndWinRedTeam();	     
 Time.RestartLoop(1);

// Обработчик спавнов //
Spawns.OnSpawn.Add(function(Player) {
 ++Player.Properties.Spawns.Value;
});

// Обработчик смертей //						
Damage.OnDeath.Add(function(Player) {
if (Player.Team === null) return;
 ++Player.Properties.Deaths.Value;
 if (Player.Team === BlueTeam) RedTeam.Add(Player);
  BlueTeam.Properties.Get('Deaths').Value = BlueTeam.Count;
  RedTeam.Properties.Get('Deaths').Value = RedTeam.Count;
});

// Обработчик убийств //						
Damage.OnKill.Add(function(Player, Killed) {
 if (Killed.Team === null && Killed.Team != Player.Team) {
++Player.Properties.Kills.Value;
    Player.Properties.Scores.Value += 100;
     }
});

// Обработчик, голосования - карт //
NewGameVote.OnResult.Add(function(Value) {
 if (Value.Result === null) return;
 NewGame.RestartGame(Value.Result);
});

// Переключение режимов, под новый старт //
MainTimer.OnTimer.Add(function() {
 switch (StateProp.Value) {
case WaitingStateValue:
 SetPreparationAttack();
		 break;
case PreparationAttackStateValue:
 SetGameMode();
	         break;
case GameModeStateValue:
 SetEnd0fMatch(); break;
case End0fMatchStateValue:
 SetEnd();   break;		 
case EndStateValue:
 StartVote();
		 break;
         }
});

// 						




		






