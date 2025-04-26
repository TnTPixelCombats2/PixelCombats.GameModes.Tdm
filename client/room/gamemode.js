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
Properties.GetContext().GameModeName = 
