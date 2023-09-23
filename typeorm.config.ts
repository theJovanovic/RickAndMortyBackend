import { Character } from "src/db_models/Character";
import { Episode } from "src/db_models/Episode";
import { Location } from "src/db_models/Location";
import { Suggestion } from "src/db_models/Suggestion";
import { User } from "src/db_models/User";
import { ConnectionOptions } from "typeorm";

export const typeormConfig: ConnectionOptions = {
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "admin",
    entities: [User, Character, Episode, Location, Suggestion],
    synchronize: true
}