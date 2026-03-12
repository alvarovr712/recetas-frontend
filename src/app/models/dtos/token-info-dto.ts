import { Role } from "../enum/role";

export interface TokenInfoDTO {

    userId : string;
    username: string;
    role: Role;
    image: string;
    expires: string; 
}