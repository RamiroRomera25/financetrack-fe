export interface UserDTOPost {
    firstName?: string | null;
    lastName?: string | null;
    email?: string | null;
    password?: string | null;
}

export interface UserDTO {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    isActive: boolean;
    premium: boolean;
}

export interface LoginRequest {
    email: string | null;
    password: string | null;
}
