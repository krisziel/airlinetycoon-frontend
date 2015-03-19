# User
post 'user/autologin' : check if user is logged in already
post 'user/' : create a user

# Game
get 'game' : all games
get 'game/:id' : game details/all airlines in game

# Airline
post 'airline' (airline:{icao:string(3),name:string}) : create an airline
get 'airline' : all airlines in a game

# Aircraft
get 'aircraft' : list of all aircraft
get 'aircraft/seats' : list of all seat types

# User Aircraft
get 'aircraft/user' : list of all user aircraft
post 'aircraft/user' (quantity:int,configuration_id:int) : create a user aircraft
put 'aircraft/user' (id:int,configuration_id:int): update a user aircraft
delete 'aircraft/user' : delete a user aircraft

# User Aircraft Configs
get 'aircraft/configs' : all aircraft configs belonging to a user
get 'aircraft/configs/:type' : all configurations of a type belonging to a user
post 'aircraft/configs' (config:{name:string,aircraft_id:int,seats:{f_count:int,j_count:int,p_count:int,y_count:int,f_seat:int,j_seat:int,p_seat:int,y_seat:int}}) : create a new configuration
delete 'aircraft/configs/:id' : delete a configuration

# Alliances
get 'alliance' : get a list of all alliances in a game
post 'alliance' (alliance:{icao:string(3),name:string}) : create a new alliance
get 'alliance/:id' : show alliance details and all member airlines
delete 'alliance/:id' : delete an alliance
post 'alliance/:id/request' (membership_id:int) : request to join alliance
post 'alliance/:id/approve' (membership_id:int) : approve request to join an alliance
post 'alliance/:id/reject' (membership_id:int) : reject request to join and alliance
post 'alliance/:id/eject' (membership_id:int) : eject a member from an alliance

# Alliance Chat
get 'chat/alliance' (*offset:int,*since:timestamp,*limit:int) : get the most recent 20 alliance chat messages
post 'chat/alliance' (alliance_chat:{message:text}) : send an alliance chat message
# Game Chat
get 'chat/game' (*offset:int,*since:timestamp,*limit:int) : get the most recent 20 game chat messages
post 'chat/game' (game_chat:{message:text}) : send a game chat message
# User-User Chat
get 'chat/conversation' : get a list of all conversations a user has
post 'chat/conversation' (recipient_id:int) : create a new conversation with recipient
get 'chat/conversation/:id' (*offset:int,*since:timestamp,*limit:int) : get most recent 20 messages in the conversation
post 'chat/conversation/:id/message' (message:{body:text}) : send a message

# Airport
get 'airport' (*region:string,*city:string) : all airports (in region/city of selected)
get 'airport/region/:region' : all airports in region
get 'airport/city/:city' : all airport in city
get 'airport/:icao' : details for specific airport

# Route
get 'route/:id' : get data and all flights on a route

# Flight
get 'flight' : all of an airlines' flights
get 'flight/aircraft/:iata' : all flights with a specific aircraft type
get 'flight/:id' : get details for a flight
put 'flight/:id' (flight:{route_id:int,user_aircraft_id:int,frequencies:int,flight:{f:int,j:int,p:int,y:int}}) : update a flight
post 'flight/' (flight:{route_id:int,user_aircraft_id:int,frequencies:int,flight:{f:int,j:int,p:int,y:int}}) : create a new flight
delete 'flight/:id' : delete a flight
