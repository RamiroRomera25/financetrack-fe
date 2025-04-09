export interface UserDTOPost {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export interface UserDTO {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    isActive: boolean;
}

export interface LoginRequest {
    email: string | null;
    password: string | null;
}
