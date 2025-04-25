// Импорты:
import * as room from 'pixel_combats/room';
import * as basic from 'pixel_combats/basic';
import * as team from './default_team.js';
import * as timer_match from './default_timer.js';

// Константы таймеров - для каждого, режима:
 const waiting_players_time = 11;
 const build_base_time = 41;
 const game_mode_time = timer_match.game_mode_seconds();
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
 const timer_scores = 50;
 const scores_timer_interval = 10;

// Разрешение констант, для сокращённых имён - свойств параметров:
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


                                        
                                        
                                      


