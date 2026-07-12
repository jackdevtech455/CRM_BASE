export type Client = {
    id: number;
    name: string;
    contact_name: string;
    email: string | null;
    phone: string | null;
    owner_id: number;
    created_at: string;
};

export type ClientCreate = {
    name: string;
    contact_name: string;
    email?: string | null;
    phone?: string | null;
};

export type ClientUpdate = Partial<ClientCreate>;
