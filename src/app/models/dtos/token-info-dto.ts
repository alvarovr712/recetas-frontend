import { Role } from "../enum/role";

export interface TokenInfoDTO {

    userId : number;
    username: string;
    role: Role;
    image: string;
    expires: string; 
}