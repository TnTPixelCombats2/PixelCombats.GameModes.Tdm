// Импорты:
import * as room from 'pixel_combats/room';
import * as basic from 'pixel_combats/basic';
import * as team from './default_team.js';
import * as timer_match from './default_timer.js';

// Константы таймеров - для каждого, режима:
 const waiting_players_time = 11;
 const build_base_time = 41;
 const game_mode_time = timer_match.game_mode_match_seconds();
 const end_0f_match_time = 11;
 const vote_time = 16;
 const mock_mode_time = 73;

// Имена констант, для каждого перечисленного - режима:
 const waitiang_state_value = 'waiting';
 const build_mode_state_value = 'build_mode';
 const game_mode_state_value = 'game';
 const end_0f_match_state_value = 'end_0f_match';
 const mock_mode_state_value = 'mock_mode';

// Отображаем, новые имена - для лидерборда с уязвимостью:
 const immortality_timer_name = 'immortality';
 const kills_prop_name = 'Kills';
 const scores_prop_name = 'Scores';

// Имена констант, как для таймера - очков, за время:
 const kill_scores = 20;
 const winner_scores = 5000;
 const loosers_scores = 3000;
 const timer_scores = 50;
 const scores_timer_interval = 10;
 
// Разрешение констант, для сокращённых имён - свойств параметров:
 const inventory = room.Inventory.GetContext();
 const spawns = room.Spawns.GetContext();
 const damage = room.Damage.GetContext();
 const properties = room.Properties.GetContext();
 const game_mode_parameters_get_bool = room.GameMode.Parameters.GetBool;
 const new_dis_play_value_header = new DisplayValueHeader;

// Получаем сокращённые имена констант, при которых - работают режимы:
 const main_timer = room.Timers.getContext().get('main');
 const state_prop = room.Properties.getContext().get('state');
 const scores_timer = room.Timers.getContext().get(scores_prop_name);

// Применяем свойства параметров, как для создания - комнаты:
const map_rotation = game_mode_parameters_get_bool('map_rotation');
 damage.FriendlyFire.Value = game_mode_parameters_get_bool('friendly_fire');
 room.BreackGraph.OnlyPlayerBlocksDmg = game_mode_parameters_get_bool('partial_desruction')
 room.BreackGraph.WeakBlocks = game_mode_parameters_get_bool('loosen_blocks');
//room.Map.Rotation = map_rotation;

// Опции, истинные - при создании сервера: 
room.BreackGraph.PlayerBlockBoost = true;
room.TeamsBalancer.IsAutoBalance = true;
properties.GameModeName.Value = 'GameModes/Team Dead Match';
room.Ui.GetContext().MainTimerId.Value = main_timer.id;
// Создаем команды, на основе параметров, заданные - импорту:
 const blue_team = team.create_blue_team();
 const red_team = team.create_red_team();
  blue_team.Build.BlocksSet.Value = room.BuildBlocksSet.Blue;
  red_team.Build.BlocksSet.Value = room.BuildBlocksSet.Red;

// Быстро настраевоемой, лидерборд - в командах:
 room.LeaderBoard.PlayerLeaderBoardValues = [
new_dis_play_value_header(kills_prop_name, 'K', 'K'),
new_dis_play_value_header('Deaths', 'D', 'D'),
new_dis_play_value_header('Spawns', 'S', 'S'),
new_dis_play_value_header(scores_prop_name, 'S', 'S')
  ];
room.LeaderBoard.TeamLeaderBoardValue = new_dis_play_value_header(scores_prop_name, 'S', 'S');
// Сортировка команды, для списка лидирующих:
room.LeaderBoard.TeamWeightGetter.Set(function(t){
 return t.Properties.get(scores_prop_name).Value;
}
// Сортировка игрока, для списков лидирующих:
room.LeaderBoard.PlayerWeightGetter.Set(function(p){    
 return p.Properties.Get(scores_prop_name).Value;
}

// Отображаем, весь счёт команды - в табе на экране, с верху:
 room.Ui.GetContext().TeamProp1.Value = { Team: blue_team_name, Prop: scores_prop_name };
 room.Ui.GetContext().TeamProp2.Value = { Team: red_team_name, Prop: scores_prop_name };

// Вход, в команду - по запросу игроку:
 room.Teams.OnRequestJoinTeam.Add(function(p,t){t.Add(p);});
// Спавним, по входу - в команду:
 room.Teams.OnPlayerChangeTeam.Add(function(p){p.Spawns.Spawn();});

// Бессмертный - щит, после респавна:
spawns.OnSpawn.Add(function(p){
 if (state_prop.Value === mock_mode_state_value){p.Properties.Immortality.Value = false; return;} 
p.Properties.Immortality.Value = true;
p.Timers.Get(immortality_timer_name).Restart(5);});
room.Timers.OnPlayerTimer.Add(function(t){
 if (t.Id != immortality_timer_name) return;
  t.Player.Properties.Immortality.Value = false;});

// Обработчик спавна:
 spawns.OnSpawn.Add(function(p){
if(state_prop.Value === mock_mode_state_value){return;}
++p.Properties.Spawns.Value;});

// Обработчик смертей:
 damage.OnDeath.Add(function(p){
if(state_prop.Value === mock_mode_state_value){Spawns.GetContext(p).Spawn();return;}
++p.Properties.Deaths.Value;});    

// Обработчик убийств:
 damage.OnKill.Add(function(p,k,t){
if(state_prop.Value === mock_mode_state_value)return;
 if(k.t != null && k.t != p.t){++p.Properties.Kills.Value;
p.Properties.Scores.Value += kill_scores; 
p.Properties.Scores.Value += 100;                             
  if(state_prop.Value !== mock_mode_state_value && p.t != null)p.t.Properties.Get(scores_prop_name).Value += kill_scores;}});

// Обработчик, таймера очков - за проведенное время в команте:
scores_timer.OnTimer.Add(function(p,t){if(p.t === null)continue;
 for(const p of room.Players.All){p.Properties.Scores.Value += timer_scores;}});

// Таймер, переключения состояний - режимов:
 main_timer.OnTimer.Add(function(){
switch(state_prop.Value){ 
 case waiting_state_value:
  state_prop.Value = waiting_state_value;
set_build_mode();break;
 case build_mode_state_value:
  state_prop.Value = build_mode_state_value;
set_game_mode();break;
  state_prop.Value = game_mode_state_value;
 case game_state_value:
set_end_0r_match();break;
 case mock_mode_state_value:
  state_prop.Value = mock_mode_state_value;
set_end_0f_match();break;
 case end_0f_match_state_value:
start_vote();break;}});

set_waiting_mode(); // Задаём, первое игровое - состояние игре.
// Состояние игры: 
 function set_waiting_mode(){spawns.enable = false;
room.Ui.GetContext().Hint.Value = 'Ожидание, всех - игроков...';
main_timer.Restart(waititng_players_time);}
 function set_build_mode(){spawns.enable = true;
room.Ui.GetContext().Hint.Value = 'Застраивайте базу, и разрушайте базу - врагов!';     
main_timer.Restart(build_base_time);    
spawn_teams();                           
inventory_context.Main.Value = false;
inventory_context.Secondary.Value = false;
inventory_context.Melee.Value = true;
inventory_context.Explosive.Value = false;
inventory_context.Build.Value = true;}  
 function set_game_mode(){spawns.Despawn();
room.Ui.GetContext().Hint.Value = 'Атакуйте, всех - врагов!';
main_timer.Restart(game_mode_time);
spawn_teams();    
 if(game_mode_parameters_get_bool('only_knives')){
room.Ui.GetContext().Hint.Value = 'Поножовщина - зарежь всех - врагов!))';
inventory_context.Main.Value = false;
inventory_context.Secondary.Value = false;
inventory_context.Melee.Value = true;
inventory_context.Explosive.Value = false;
inventory_context.Build.Value = true;}
inventory_context.Main.Value = true;
inventory_context.Secondary.Value = true;
inventory_context.Melee.Value = true;
inventory_context.Explosive.Value = true;
inventory_context.Build.Value = true;}                      
 function set_end_0r_match(){scores_timer.Stop();
const lb = room.LeaderBoard.GetTeams();                            
 if(ld[0].Weight !== ld[1].Weight){set_mock_mode(ld[0].t, ld[1].t);
for(const wp of ld[0].t.Players){wp.Properties.Scores.Value += winner_scores;
for(const lp of ld[1].t.Players){lp.Properties.Scores.Value -= loosers_scores;}}} 
 else{set_end_0r_match();}}   
 function set_mock_mode(w,l){scores_timer.Stop();
  room.Ui.GetContext(w).Hint.Value = 'Победа, караем - проигравших!))';
  room.Ui.GetContext(l).Hint.Value = 'Поражение, нас будут - карать!(';    
 spawns.RespawnTime.Value = 0; 
 main_timer.Restart(mock_mode_time);    
 const inventory_winners = room.Inventory.GetContext(w);                    
  inventory_winners.Main.Value = true;
  inventory_winners.MainInfinity.Value = true; 
  inventory_winners.Secondary.Value = true;                          
  inventory_winners.SecondaryInfinity.Value = true;   
  inventory_winners.Melee.Value = true;
  inventory_winners.Explosive.Value = true;
  inventory_winners.ExplosiveInfinity.Value = true;
  inventory_winners.Build.Value = true;
  inventory_winners.BuildInfinity.Value = true;
 const inventory_loosers = room.Inventory.GetContext(l); 
  inventory_loosers.Main.Value = false;
  inventory_loosers.Secondary.Value = false;
  inventory_loosers.Melee.Value = false;
  inventory_loosers.Explosive.Value = false;
  inventory_loosers.Build.Value = false;
  inventory_loosers.BuildInfinity.Value = false;}                         
   function set_end_0f_match_state_value(){

                                        
                                      


