export type Client = {
    id: number;
    owner_id: number;
    name: string;
    email: string;
    contact_name: string;
    phone: string | null;
    status: string | null;
    created_at: string;
};

export type ClientCreate = {
    name: string;
    email: string;
    contact_name: string;
    phone?: string | null;
    status?: string | null;
};

export type ClientUpdate = {
    name?: string | null;
    email?: string | null;
    phone?: string | null;
    status?: string | null;
};
